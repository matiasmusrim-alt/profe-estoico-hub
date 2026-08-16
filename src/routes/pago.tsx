import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type PagoSearch = { status?: "success" | "failure" | "pending" };

export const Route = createFileRoute("/pago")({
  validateSearch: (search: Record<string, unknown>): PagoSearch => {
    const status = search["status"];
    return status === "success" || status === "failure" || status === "pending"
      ? { status }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Resultado del pago | Profe Estoico" },
      {
        name: "description",
        content:
          "Estado de tu pago del Acceso Premium al Mentor de Evaluación Docente de Profe Estoico.",
      },
      { property: "og:title", content: "Resultado del pago | Profe Estoico" },
      {
        property: "og:description",
        content: "Revisa el estado de tu pago del Acceso Premium de Profe Estoico.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PagoResultado,
});

const MESSAGES: Record<string, { title: string; body: string }> = {
  success: {
    title: "Pago recibido",
    body: "Estamos confirmando tu pago con Mercado Pago. Te escribiremos a tu correo con los pasos para activar tu acceso.",
  },
  pending: {
    title: "Pago pendiente",
    body: "Mercado Pago aún no confirma la transacción. Cuando se acredite, te contactaremos por correo.",
  },
  failure: {
    title: "Pago no completado",
    body: "La transacción no se completó. No se realizó ningún cobro; puedes intentarlo nuevamente.",
  },
};

function PagoResultado() {
  const { status } = Route.useSearch();
  const message = status
    ? MESSAGES[status]!
    : {
        title: "Sin información de pago",
        body: "No recibimos un estado de pago para mostrar.",
      };

  return (
    <>
      <SiteHeader />
      <main className="container-page py-24 md:py-32">
        <div className="max-w-xl mx-auto text-center">
          <span className="gold-rule" />
          <h1 className="mt-4 font-display text-3xl md:text-4xl">{message.title}</h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">{message.body}</p>
          <div className="mt-10">
            <Link to="/" className="btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
