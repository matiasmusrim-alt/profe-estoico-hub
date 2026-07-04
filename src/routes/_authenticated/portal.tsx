import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { APP_NAME, PORTAL_MODULES } from "@/lib/config";

export const Route = createFileRoute("/_authenticated/portal")({
  component: PortalPage,
});

function PortalPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/", replace: true });
  };

  const displayName = email ? email.split("@")[0] : "docente";

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Portal header */}
      <header className="border-b border-border bg-background">
        <div className="container-page h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display">
              P
            </span>
            <span className="font-display">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-muted-foreground">{email}</span>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container-page py-14">
        <div className="max-w-2xl animate-fade-up">
          <span className="gold-rule" />
          <h1 className="mt-4 font-display text-4xl md:text-5xl capitalize">
            Bienvenido, {displayName}.
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">¿Qué deseas hacer hoy?</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PORTAL_MODULES.map((mod, idx) => {
            const isAvailable = mod.status === "available";
            return (
              <article
                key={mod.id}
                className="card-elegant flex flex-col animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gold font-display text-xl">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <span
                    className={
                      "text-[10px] uppercase tracking-widest px-2 py-1 rounded-full " +
                      (isAvailable
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {isAvailable ? "Disponible" : "Próximamente"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-foreground">{mod.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {mod.description}
                </p>
                <div className="mt-6">
                  {isAvailable && mod.action?.href ? (
                    <a
                      href={mod.action.href}
                      target={mod.action.external ? "_blank" : undefined}
                      rel={mod.action.external ? "noopener noreferrer" : undefined}
                      className="btn-primary w-full"
                    >
                      {mod.action.label}
                    </a>
                  ) : (
                    <button disabled className="btn-secondary w-full opacity-60 cursor-not-allowed">
                      Próximamente
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-16 text-xs text-muted-foreground max-w-xl">
          Recuerda: el Copilot acompaña tu reflexión, no reemplaza tu juicio profesional. Toda evidencia
          y toda experiencia siguen siendo tuyas.
        </p>
      </main>
    </div>
  );
}
