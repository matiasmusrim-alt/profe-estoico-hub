import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/recuperar")({ component: Recover });
function Recover() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/nueva-clave`,
    });
    setLoading(false);
    setMessage(
      error
        ? error.message
        : "Si el correo existe, recibirás un enlace para cambiar tu contraseña.",
    );
  }
  return (
    <main className="min-h-screen bg-secondary/30 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border bg-background p-8">
        <Link to="/auth">← Volver</Link>
        <h1 className="mt-6 font-serif text-3xl text-primary">Recuperar contraseña</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input name="email" type="email" required placeholder="tu@correo.cl" />
          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar enlace"}
          </Button>
          {message && (
            <p role="status" className="text-sm">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
