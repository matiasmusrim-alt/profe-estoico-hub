import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/config";

const searchSchema = z.object({
  tab: z.enum(["login", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(search.tab ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido de vuelta");
        navigate({ to: "/portal" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/portal` },
        });
        if (error) throw error;
        toast.success("Solicitud enviada", {
          description: "Revisa tu correo para confirmar tu acceso.",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocurrió un error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!email) return toast.error("Ingresa tu correo primero");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Enviamos las instrucciones a tu correo");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Panel izquierdo — narrativa */}
      <aside className="hidden md:flex bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/90">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 font-display">
              P
            </span>
            <span className="font-display">{APP_NAME}</span>
          </Link>
          <div className="max-w-md">
            <span className="inline-block h-px w-10 bg-gold" />
            <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight">
              "No controlamos lo que ocurre, sino cómo respondemos."
            </h2>
            <p className="mt-4 text-primary-foreground/70 text-sm italic">— Epicteto</p>
            <p className="mt-8 text-sm text-primary-foreground/80 leading-relaxed">
              Un espacio sereno para preparar tu Evaluación Docente con claridad, orden y sentido profesional.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </aside>

      {/* Panel derecho — formulario */}
      <main className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Link to="/" className="text-sm text-muted-foreground">← Volver</Link>
          </div>
          <span className="gold-rule" />
          <h1 className="mt-4 font-display text-3xl text-foreground">
            {mode === "login" ? "Bienvenido de vuelta" : "Solicitar acceso"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Ingresa a tu portal profesional."
              : "Crea tu cuenta para comenzar tu preparación."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                Correo
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-ring transition"
                placeholder="tu@correo.cl"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-ring transition"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Solicitar acceso"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={onReset}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Recuperar contraseña
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                ¿Aún no tienes acceso?{" "}
                <button onClick={() => setMode("signup")} className="text-foreground hover:text-gold transition-colors">
                  Solicítalo aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setMode("login")} className="text-foreground hover:text-gold transition-colors">
                  Ingresar
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
