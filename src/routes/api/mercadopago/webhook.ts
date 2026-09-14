import { createFileRoute } from "@tanstack/react-router";

const PREMIUM_PRICE = 39990;
const PAYMENT_PROVIDER = "mercadopago";

type MercadoPagoNotification = {
  action?: string;
  id?: string | number;
  live_mode?: boolean;
  type?: string;
  data?: { id?: string | number };
};

type MercadoPagoPayment = {
  id?: string | number;
  status?: string;
  status_detail?: string;
  currency_id?: string;
  transaction_amount?: number;
  external_reference?: string;
  date_approved?: string;
  live_mode?: boolean;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
};

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function validateSignature(request: Request, dataId: string, secret: string) {
  const signature = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signature || !requestId) return false;

  const signatureParts = new Map(
    signature.split(",").map((part) => {
      const [key, ...value] = part.split("=");
      return [key?.trim(), value.join("=").trim()];
    }),
  );
  const timestamp = signatureParts.get("ts");
  const receivedHash = signatureParts.get("v1");
  if (!timestamp || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const calculatedHash = Array.from(new Uint8Array(signed), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return constantTimeEqual(calculatedHash, receivedHash.toLowerCase());
}

async function wasAlreadyDelivered(paymentId: string) {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return false;

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("payment_events")
      .select("processed_at")
      .eq("provider", PAYMENT_PROVIDER)
      .eq("event_id", paymentId)
      .maybeSingle();

    if (error) {
      console.error("[mercadopago] no fue posible revisar idempotencia", error);
      return false;
    }
    return Boolean(data?.processed_at);
  } catch (error) {
    console.error("[mercadopago] idempotencia no disponible", error);
    return false;
  }
}

async function markAsDelivered(paymentId: string, payment: MercadoPagoPayment, email: string) {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return;

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payment_events").upsert(
      {
        provider: PAYMENT_PROVIDER,
        event_id: paymentId,
        event_type: "payment.approved",
        email,
        payload: payment,
        processed_at: new Date().toISOString(),
      },
      { onConflict: "provider,event_id" },
    );
    if (error) console.error("[mercadopago] no fue posible registrar entrega", error);
  } catch (error) {
    console.error("[mercadopago] no fue posible registrar entrega", error);
  }
}

export const Route = createFileRoute("/api/mercadopago/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const accessToken = process.env["MERCADOPAGO_ACCESS_TOKEN"];
        const makeWebhookUrl = process.env["MERCADOPAGO_WEBHOOK_URL"];
        if (!accessToken || !makeWebhookUrl) {
          console.error("[mercadopago] faltan variables para procesar el webhook");
          return Response.json({ received: false }, { status: 503 });
        }

        let notification: MercadoPagoNotification = {};
        try {
          notification = (await request.json()) as MercadoPagoNotification;
        } catch {
          // Algunas notificaciones incluyen el ID solamente en la URL.
        }

        const url = new URL(request.url);
        const queryDataId = url.searchParams.get("data.id");
        const paymentId = String(queryDataId ?? notification.data?.id ?? "").trim();
        const notificationType = url.searchParams.get("type") ?? notification.type;

        if (notificationType && notificationType !== "payment") {
          return Response.json({ received: true, ignored: "unsupported_type" });
        }
        if (!paymentId) {
          return Response.json({ received: false, error: "missing_payment_id" }, { status: 400 });
        }

        const webhookSecret = process.env["MERCADOPAGO_WEBHOOK_SECRET"];
        if (webhookSecret) {
          const signatureIsValid = await validateSignature(
            request,
            queryDataId ?? paymentId,
            webhookSecret,
          );
          if (!signatureIsValid) {
            console.warn("[mercadopago] firma de webhook inválida", { paymentId });
            return Response.json({ received: false, error: "invalid_signature" }, { status: 401 });
          }
        }

        if (await wasAlreadyDelivered(paymentId)) {
          return Response.json({ received: true, delivered: true, duplicate: true });
        }

        const paymentResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (paymentResponse.status === 404) {
          return Response.json({ received: true, ignored: "payment_not_found" });
        }
        if (!paymentResponse.ok) {
          console.error("[mercadopago] no fue posible consultar el pago", paymentResponse.status);
          return Response.json({ received: false }, { status: 502 });
        }

        const payment = (await paymentResponse.json()) as MercadoPagoPayment;
        if (payment.status !== "approved") {
          return Response.json({
            received: true,
            ignored: `status_${payment.status ?? "unknown"}`,
          });
        }

        const isExpectedPurchase =
          payment.currency_id === "CLP" &&
          payment.transaction_amount === PREMIUM_PRICE &&
          payment.external_reference?.startsWith("premium-");
        if (!isExpectedPurchase) {
          console.warn("[mercadopago] pago aprobado no corresponde al producto Premium", {
            paymentId,
            currency: payment.currency_id,
            amount: payment.transaction_amount,
            externalReference: payment.external_reference,
          });
          return Response.json({ received: true, ignored: "purchase_mismatch" });
        }

        const email = payment.payer?.email?.trim().toLowerCase();
        if (!email) {
          console.error("[mercadopago] pago aprobado sin correo del comprador", { paymentId });
          return Response.json({ received: false, error: "missing_payer_email" }, { status: 502 });
        }

        const makeResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "premium.payment.approved",
            payment_id: String(payment.id ?? paymentId),
            email,
            first_name: payment.payer?.first_name ?? "",
            last_name: payment.payer?.last_name ?? "",
            amount: payment.transaction_amount,
            currency: payment.currency_id,
            external_reference: payment.external_reference,
            approved_at: payment.date_approved ?? null,
            live_mode: payment.live_mode ?? notification.live_mode ?? null,
          }),
        });
        if (!makeResponse.ok) {
          console.error("[mercadopago] Make rechazó la entrega", makeResponse.status);
          return Response.json({ received: false }, { status: 502 });
        }

        await markAsDelivered(paymentId, payment, email);
        return Response.json({ received: true, delivered: true });
      },
    },
  },
});
