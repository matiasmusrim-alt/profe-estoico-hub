import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { COPILOT_URL, DEMO_URL, PAYMENT_URL } from "@/lib/config";
import {
  MessageCircleQuestion,
  ListTree,
  PenLine,
  ScanSearch,
  BookMarked,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  Check,
  Rocket,
  Star,
  KeyRound,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const flowSteps = [
  { icon: Sparkles, text: "Tú aportas tu experiencia docente." },
  { icon: MessageCircleQuestion, text: "El Copilot realiza preguntas inteligentes." },
  { icon: ListTree, text: "Organiza tu reflexión." },
  { icon: PenLine, text: "Fortalece la redacción." },
  { icon: ScanSearch, text: "Analiza la coherencia." },
  { icon: BookMarked, text: "Revisa los criterios oficiales." },
  { icon: UserCheck, text: "Tú tomas siempre la decisión final." },
];

const ecosystem = {
  available: [
    { title: "Mentor Evaluación Docente", desc: "Copilot especializado en el instrumento oficial." },
  ],
  soon: [
    { title: "Simulador ECEP", desc: "Práctica del conocimiento específico." },
    { title: "Biblioteca Docente", desc: "Documentos y rúbricas curadas." },
    { title: "Banco de Evidencias", desc: "Organiza evidencias de tu práctica." },
    { title: "Currículum Diversificado", desc: "Herramientas para la diversificación." },
    { title: "PIE", desc: "Apoyo al Programa de Integración Escolar." },
    { title: "Gestión Escolar", desc: "Módulos para equipos directivos." },
  ],
};

const comparison = {
  others: [
    "Cursos grabados",
    "Material estático",
    "Respuestas generales",
    "Debes adaptarte al método",
  ],
  ours: [
    "Copilot conversacional",
    "Retroalimentación personalizada",
    "Análisis basado en rúbricas",
    "Se adapta a tu realidad profesional",
  ],
};

const faqs = [
  {
    q: "¿Reemplaza mi trabajo profesional?",
    a: "No. Profe Estoico acompaña tu reflexión y organización, pero la autoría y el juicio profesional son siempre tuyos.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. La plataforma está diseñada para ser sencilla, elegante y comprensible desde el primer minuto.",
  },
  {
    q: "¿Qué incluye esta primera versión?",
    a: "El acceso oficial al Copilot Evaluación Docente. Próximamente sumaremos biblioteca, simulador ECEP, comunidad y seguimiento de progreso.",
  },
  {
    q: "¿Cómo obtengo acceso?",
    a: "Puedes probar la Demo gratuita o adquirir el acceso Premium. Tras la compra recibes tu licencia y la validación ocurre directamente dentro del Copilot: solo pulsa \"Ya tengo licencia\" para continuar.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container-page pt-20 pb-24 md:pt-32 md:pb-36 text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <span className="gold-rule" /> Plataforma oficial
            </span>
            <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl mx-auto text-foreground">
              La plataforma inteligente para preparar tu{" "}
              <span className="italic text-primary">Evaluación Docente</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Organiza tu portafolio, fortalece tu reflexión profesional y trabaja junto a un
              Copilot especializado que respeta completamente tu autoría profesional.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href={DEMO_URL} target="_blank" rel="noreferrer" className="btn-primary">
                <Rocket size={18} strokeWidth={1.6} />
                Probar Demo
              </a>
              <a href={PAYMENT_URL} target="_blank" rel="noreferrer" className="btn-secondary">
                <Star size={18} strokeWidth={1.6} />
                Comprar Acceso Premium
              </a>
              <a href={COPILOT_URL} target="_blank" rel="noreferrer" className="btn-secondary">
                <KeyRound size={18} strokeWidth={1.6} />
                Ya tengo licencia
              </a>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Pensada para docentes chilenos · IA ética · Desarrollo continuo
            </p>
          </div>
        </div>
      </section>

      {/* ¿CÓMO QUIERES COMENZAR? */}
      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <span className="gold-rule" />
          <h2 className="mt-4 font-display text-3xl md:text-5xl">¿Cómo quieres comenzar?</h2>
          <p className="mt-4 text-muted-foreground">
            Elige el camino que mejor se ajuste a tu momento profesional.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <article className="card-elegant relative">
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Gratuito
            </span>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/5 text-primary border border-border mb-4">
              <Rocket size={24} strokeWidth={1.6} />
            </div>
            <h3 className="font-display text-2xl text-foreground">Demo Gratuita</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Conoce cómo trabaja Profe Estoico. Podrás utilizar el Mentor de Evaluación Docente durante una cantidad limitada de interacciones para experimentar su metodología y comprobar cómo fortalece tu reflexión profesional.
            </p>
            <div className="mt-6">
              <a href={DEMO_URL} target="_blank" rel="noreferrer" className="btn-primary w-full">
                Probar Demo
              </a>
            </div>
          </article>

          <article className="card-elegant relative">
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Premium
            </span>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/5 text-primary border border-border mb-4">
              <Star size={24} strokeWidth={1.6} />
            </div>
            <h3 className="font-display text-2xl text-foreground">Premium</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Accede sin restricciones al Mentor de Evaluación Docente y a todos los módulos que se incorporarán progresivamente dentro del ecosistema Profe Estoico.
            </p>
            <div className="mt-6">
              <a href={PAYMENT_URL} target="_blank" rel="noreferrer" className="btn-primary w-full">
                Comprar Acceso
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ¿CÓMO FUNCIONA? */}
      <section id="como-funciona" className="bg-secondary/50 border-y border-border/60">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <span className="gold-rule" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">¿Cómo funciona?</h2>
            <p className="mt-4 text-muted-foreground">
              Un camino claro para comenzar a trabajar con tu Mentor IA.
            </p>
          </div>

          <ol className="mt-14 max-w-2xl mx-auto space-y-6">
            {[
              "Prueba gratuitamente el Copilot.",
              "Explora su metodología mediante la versión Demo.",
              "Si deseas continuar, adquiere tu acceso Premium.",
              "Recibe tu licencia automáticamente por correo.",
              "Vuelve con el botón \"Ya tengo licencia\" y continúa con el mismo Mentor IA.",
            ].map((step, i, arr) => {
              const isLast = i === arr.length - 1;
              return (
                <li key={step} className="relative">
                  <div className="card-elegant flex flex-col items-center text-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg mb-3">
                      {i + 1}
                    </span>
                    <p className="font-display text-lg text-foreground">{step}</p>
                  </div>
                  {!isLast && (
                    <div aria-hidden className="flex justify-center py-3">
                      <span className="h-6 w-px bg-border" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* PREMIUM */}
      <section id="premium" className="container-page py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <div className="card-elegant border-gold/40">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Acceso Premium
            </span>
            <div className="mt-4">
              <span className="gold-rule" />
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl text-foreground">
              ¿Qué incluye el acceso Premium?
            </h2>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Acceso completo al Mentor Evaluación Docente",
                "Actualizaciones permanentes",
                "Acceso a nuevos módulos",
                "Biblioteca Docente",
                "Comunidad",
                "Simulador ECEP (cuando sea publicado)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                  <Check size={16} className="mt-0.5 text-gold shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={PAYMENT_URL} target="_blank" rel="noreferrer" className="btn-primary">
                <Star size={18} strokeWidth={1.6} />
                Comprar Acceso Premium
              </a>
              <a href={COPILOT_URL} target="_blank" rel="noreferrer" className="btn-secondary">
                <KeyRound size={18} strokeWidth={1.6} />
                Ya tengo licencia
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ASÍ TRABAJA */}
      <section id="flujo" className="container-page py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <span className="gold-rule" />
          <h2 className="mt-4 font-display text-3xl md:text-5xl">Así trabaja Profe Estoico</h2>
          <p className="mt-4 text-muted-foreground">
            Un flujo sereno y estructurado que acompaña cada etapa de tu preparación.
          </p>
        </div>

        <ol className="mt-14 max-w-3xl mx-auto space-y-4">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === flowSteps.length - 1;
            return (
              <li key={step.text} className="relative">
                <div className="card-elegant flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary border border-border">
                    <Icon size={20} strokeWidth={1.6} />
                  </span>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Paso 0{i + 1}
                    </div>
                    <div className="font-display text-lg text-foreground">{step.text}</div>
                  </div>
                </div>
                {!isLast && (
                  <div aria-hidden className="flex justify-center py-2">
                    <span className="h-6 w-px bg-border" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-12 text-center text-sm italic text-muted-foreground max-w-2xl mx-auto">
          "La IA acompaña el proceso. El juicio profesional siempre pertenece al docente."
        </p>
      </section>

      {/* ECOSISTEMA */}
      <section id="ecosistema" className="bg-secondary/50 border-y border-border/60">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="gold-rule" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              Un ecosistema para el desarrollo profesional
            </h2>
            <p className="mt-4 text-muted-foreground">
              Empezamos con la Evaluación Docente. Crecemos junto a la comunidad.
            </p>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <CheckCircle2 size={14} className="text-gold" /> Disponible ahora
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ecosystem.available.map((m) => (
                <article key={m.title} className="card-elegant relative">
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Activo
                  </span>
                  <h3 className="font-display text-lg text-foreground pr-20">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <Clock size={14} /> Próximamente
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ecosystem.soon.map((m) => (
                <article key={m.title} className="card-elegant opacity-90">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    En desarrollo
                  </span>
                  <h3 className="mt-3 font-display text-lg text-foreground">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIVA */}
      <section id="comparativa" className="container-page py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <span className="gold-rule" />
          <h2 className="mt-4 font-display text-3xl md:text-5xl">¿Por qué Profe Estoico?</h2>
          <p className="mt-4 text-muted-foreground">
            Un método vivo, personalizado y anclado en la práctica real de aula.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <div className="rounded-xl border border-border bg-secondary/40 p-7">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Otros sistemas
            </div>
            <h3 className="mt-2 font-display text-xl text-foreground">El modelo tradicional</h3>
            <ul className="mt-6 space-y-3">
              {comparison.others.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <X size={16} className="mt-0.5 text-muted-foreground shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gold/40 bg-background p-7 shadow-[var(--shadow-elegant)]">
            <div className="text-[10px] uppercase tracking-widest text-gold">Profe Estoico</div>
            <h3 className="mt-2 font-display text-xl text-foreground">Un método vivo</h3>
            <ul className="mt-6 space-y-3">
              {comparison.ours.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/90">
                  <Check size={16} className="mt-0.5 text-gold shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* COMPROMISO ÉTICO */}
      <section id="etica" className="bg-secondary/50 border-y border-border/60">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> IA Responsable
            </span>
            <div className="mt-4">
              <span className="gold-rule" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Compromiso ético
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight text-foreground">
              La IA no reemplaza tu juicio profesional.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-[15px] leading-relaxed text-foreground/85">
            <p>
              El Asistente Profe Estoico fue diseñado para{" "}
              <strong>acompañar el proceso de reflexión docente</strong>.
            </p>
            <ul className="space-y-3">
              {[
                "No inventa experiencias.",
                "No suplanta la práctica profesional.",
                "No genera evidencias falsas.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p>
              Su propósito es{" "}
              <em>
                ayudar a organizar ideas, fortalecer la reflexión, mejorar la redacción y
                comprender los criterios oficiales
              </em>
              , respetando siempre la autoría profesional del docente.
            </p>
          </div>
        </div>
      </section>

      {/* BETA */}
      <section id="beta" className="container-page py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Primera generación Beta
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-5xl text-foreground">
            Construyendo junto a los primeros docentes.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Estamos trabajando junto a los primeros docentes que utilizarán Profe Estoico durante
            la Evaluación Docente 2026. Sus experiencias ayudarán a construir la plataforma
            educativa más robusta del país.
          </p>
          <div className="mt-8 flex justify-center">
            <a href={DEMO_URL} target="_blank" rel="noreferrer" className="btn-primary">
              Probar la Demo
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-secondary/50 border-t border-border/60">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="gold-rule" />
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Preguntas frecuentes</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Las dudas más comunes al comenzar. Si te queda otra, escríbenos.
            </p>
          </div>
          <div className="md:col-span-8 divide-y divide-border">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-6 text-foreground">
                  <span className="font-display text-lg">{f.q}</span>
                  <span className="text-gold transition-transform group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed pr-10">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
