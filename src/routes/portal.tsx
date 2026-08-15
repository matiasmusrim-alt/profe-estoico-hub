import { createFileRoute, Link } from "@tanstack/react-router";
import { requireSession } from "@/lib/auth";
import { PrivateShell } from "@/components/private-shell";
import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, ChartNoAxesColumn, GraduationCap, Users } from "lucide-react";
import { PAYMENT_URL } from "@/lib/config";
export const Route = createFileRoute("/portal")({
  ssr: false,
  beforeLoad: requireSession,
  component: Portal,
});
const modules = [
  {
    title: "Mentor Evaluación Docente",
    desc: "Conversación privada con límite demo protegido en el servidor.",
    icon: BrainCircuit,
    available: true,
  },
  { title: "Biblioteca", desc: "Documentos y rúbricas curadas.", icon: BookOpen },
  { title: "Simulador ECEP", desc: "Práctica del conocimiento específico.", icon: GraduationCap },
  { title: "Comunidad", desc: "Espacio profesional entre docentes.", icon: Users },
  { title: "Mi progreso", desc: "Seguimiento de tus avances.", icon: ChartNoAxesColumn },
];
function Portal() {
  return (
    <PrivateShell>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-medium uppercase tracking-widest text-accent-foreground">
          Portal privado
        </p>
        <h1 className="mt-2 font-serif text-4xl text-primary">Bienvenido a Profe Estoico</h1>
        <p className="mt-3 text-muted-foreground">¿Qué deseas hacer hoy?</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
          <span className="flex-1 text-foreground">
            La demo incluye 10 respuestas del mentor. El acceso Premium cuesta $39.990 CLP.
          </span>
          <a href={PAYMENT_URL} target="_blank" rel="noreferrer" className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
            Comprar Premium
          </a>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ title, desc, icon: Icon, available }) => (
            <article key={title} className="rounded-2xl border bg-background p-6 shadow-sm">
              <Icon className="size-7 text-primary" />
              <div className="mt-5 flex items-start justify-between gap-3">
                <h2 className="font-serif text-xl text-primary">{title}</h2>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${available ? "bg-emerald-100 text-emerald-800" : "bg-secondary text-muted-foreground"}`}
                >
                  {available ? "Disponible" : "Próximamente"}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
              {available && (
                <Button asChild className="mt-6">
                  <Link to="/mentor">Abrir mentor</Link>
                </Button>
              )}
            </article>
          ))}
        </div>
      </main>
    </PrivateShell>
  );
}
