import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { requireSession } from "@/lib/auth";
import { PrivateShell } from "@/components/private-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getEntitlement, sendMentorMessage } from "@/mentor.functions";
type Message = { role: "user" | "assistant"; content: string };
export const Route = createFileRoute("/mentor")({
  ssr: false,
  beforeLoad: requireSession,
  component: Mentor,
});
function Mentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hola. Cuéntame qué parte de tu Evaluación Docente estás trabajando y qué contexto real debería considerar.",
    },
  ]);
  const [remaining, setRemaining] = useState<number | null | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getEntitlement()
      .then((v) => setRemaining(v.remaining))
      .catch(() => setError("No fue posible cargar tu cuota."));
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = String(new FormData(form).get("message") ?? "").trim();
    if (input.length < 3) return setError("Escribe al menos 3 caracteres.");
    setLoading(true);
    setError("");
    setMessages((m) => [...m, { role: "user", content: input }]);
    form.reset();
    try {
      const result = await sendMentorMessage({ data: { message: input } });
      if (!result.ok) {
        setRemaining(0);
        setError(result.message);
        return;
      }
      setRemaining(result.remaining);
      setMessages((m) => [...m, { role: "assistant", content: result.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al consultar al mentor.");
    } finally {
      setLoading(false);
    }
  }
  const limited = remaining === 0;
  return (
    <PrivateShell>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl text-primary">Mentor Profe Estoico</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu experiencia y juicio profesional siempre tienen la última palabra.
            </p>
          </div>
          <span className="rounded-full border bg-background px-3 py-1 text-sm">
            {remaining === undefined
              ? "Cargando cuota…"
              : remaining === null
                ? "Premium · sin límite"
                : `${remaining} de 10 usos restantes`}
          </span>
        </div>
        <section
          aria-live="polite"
          className="mt-7 min-h-80 space-y-4 rounded-2xl border bg-background p-5"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground">El mentor está reflexionando…</p>
          )}
        </section>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Textarea
            name="message"
            maxLength={4000}
            required
            disabled={loading || limited}
            placeholder={
              limited
                ? "Tu demo alcanzó el límite de 10 usos."
                : "Describe tu situación, evidencia o reflexión…"
            }
            className="min-h-28"
          />
          <Button disabled={loading || limited}>
            {loading ? "Enviando…" : limited ? "Límite alcanzado" : "Enviar al mentor"}
          </Button>
        </form>
      </main>
    </PrivateShell>
  );
}
