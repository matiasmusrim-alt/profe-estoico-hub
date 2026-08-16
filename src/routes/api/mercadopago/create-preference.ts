import { createFileRoute } from "@tanstack/react-router";

const PREMIUM_TITLE = "Acceso Premium — Mentor de Evaluación Docente";
const PREMIUM_PRICE = 39990;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export const Route = createFileRoute("/api/mercadopago/create-preference")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const accessToken = process.env["MERCADOPAGO_ACCESS_TOKEN"];
        if (!accessToken) {
          console.error("[mercadopago] MERCADOPAGO_ACCESS_TOKEN no está configurado");
          return jsonError(
            "El medio de pago no está configurado todavía. Intenta más tarde o escríbenos.",
            503,
          );
        }

        const origin = new URL(request.url).origin;
        const externalReference = `premium-${Date.now()}-${crypto.randomUUID()}`;
        const webhookUrl = process.env["MERCADOPAGO_WEBHOOK_URL"];

        const preference: Record<string, unknown> = {
          items: [
            {
              title: PREMIUM_TITLE,
              quantity: 1,
              unit_price: PREMIUM_PRICE,
              currency_id: "CLP",
            },
          ],
          external_reference: externalReference,
          back_urls: {
            success: `${origin}/pago?status=success`,
            failure: `${origin}/pago?status=failure`,
            pending: `${origin}/pago?status=pending`,
          },
        };

        if (webhookUrl) {
          preference["notification_url"] = webhookUrl;
        }

        try {
          const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              "X-Idempotency-Key": externalReference,
            },
            body: JSON.stringify(preference),
          });

          const payload = (await response.json()) as {
            init_point?: string;
            sandbox_init_point?: string;
            id?: string;
          };

          if (!response.ok) {
            console.error("[mercadopago] error al crear preferencia", response.status, payload);
            return jsonError("No fue posible iniciar el pago. Inténtalo nuevamente.", 502);
          }

          const initPoint = payload.init_point ?? payload.sandbox_init_point;
          if (!initPoint) {
            console.error("[mercadopago] respuesta sin init_point", payload);
            return jsonError("No fue posible iniciar el pago. Inténtalo nuevamente.", 502);
          }

          return Response.json({
            init_point: initPoint,
            preference_id: payload.id ?? null,
            external_reference: externalReference,
          });
        } catch (error) {
          console.error("[mercadopago] fallo de red al crear preferencia", error);
          return jsonError("No fue posible contactar al medio de pago.", 502);
        }
      },
    },
  },
});
