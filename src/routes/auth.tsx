import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      setError("Ingresa un correo válido y una contraseña de al menos 8 caracteres.");
      setLoading(false);
      return;
    }
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${location.origin}/auth/callback` },
          });
    setLoading(false);
    if (result.error) return setError(result.error.message);
    if (mode === "signup" && !result.data.session)
      return setNotice("Revisa tu correo para confirmar la cuenta.");
    navigate({ to: "/portal" });
  }
  return (
    <main className="min-h-screen bg-secondary/30 px-4 py-16">
      <section className="mx-auto max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <Link to="/" className="text-sm text-muted-foreground">
          ← Volver al inicio
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-primary">
          {mode === "login" ? "Ingresar" : "Crear cuenta demo"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acceso seguro y persistente a tu espacio Profe Estoico.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium">
            Correo
            <Input name="email" type="email" autoComplete="email" required className="mt-1" />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <Input
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              required
              className="mt-1"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="rounded-md bg-secondary p-3 text-sm">
              {notice}
            </p>
          )}
          <Button className="w-full" disabled={loading}>
            {loading ? "Procesando…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm">
          <button
            className="text-primary underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
          </button>
          <Link to="/recuperar" className="text-primary underline">
            Recuperar contraseña
          </Link>
        </div>
      </section>
    </main>
  );
}
