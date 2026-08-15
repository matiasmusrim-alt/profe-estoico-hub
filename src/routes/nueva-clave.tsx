import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/nueva-clave")({ component: NewPassword });
function NewPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/portal" });
  }
  return (
    <main className="grid min-h-screen place-items-center bg-secondary/30 px-4">
      <section className="w-full max-w-md rounded-2xl border bg-background p-8">
        <h1 className="font-serif text-3xl text-primary">Nueva contraseña</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input name="password" type="password" minLength={8} required />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button className="w-full" disabled={loading}>
            {loading ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </form>
      </section>
    </main>
  );
}
