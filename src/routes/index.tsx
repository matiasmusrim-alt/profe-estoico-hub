import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const benefits = [
  {
    title: "Reflexión estructurada",
    body:
      "Un método sereno para organizar tu pensamiento pedagógico y llegar a la evaluación con claridad.",
  },
  {
    title: "Criterios oficiales al alcance",
    body:
      "Comprende los criterios del instrumento sin ruido, con lenguaje claro y aplicable a tu aula.",
  },
  {
    title: "Escritura profesional",
    body:
      "Fortalece la redacción reflexiva que exige el proceso, respetando siempre tu voz y tu autoría.",
  },
  {
    title: "Un proceso, no un atajo",
    body:
      "No promete milagros. Promete acompañarte con seriedad, semana a semana, hasta el día clave.",
  },
];

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
    a: "Solicítalo desde el botón principal. Revisamos cada solicitud con calma para mantener una comunidad profesional y comprometida.",
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
              La forma más inteligente de preparar tu{" "}
              <span className="italic text-primary">Evaluación Docente</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Organiza tu trabajo, fortalece tu reflexión profesional y avanza con apoyo especializado.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth" className="btn-primary">Ingresar</Link>
              <Link
                to="/auth"
                search={{ tab: "signup" }}
                className="btn-secondary"
              >
                Solicitar acceso
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Pensada para docentes chilenos · Enfoque estoico · Sin promesas vacías
            </p>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="gold-rule" />
          <h2 className="mt-4 font-display text-3xl md:text-5xl">Un ecosistema, no un atajo.</h2>
          <p className="mt-4 text-muted-foreground">
            Profe Estoico es el inicio de una plataforma pensada para acompañarte durante años en
            tu desarrollo profesional. Empezamos por la Evaluación Docente.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <article key={b.title} className="card-elegant">
              <div className="text-gold font-display text-2xl">0{i + 1}</div>
              <h3 className="mt-3 font-display text-lg text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COMPROMISO ÉTICO */}
      <section id="etica" className="bg-secondary/50 border-y border-border/60">
        <div className="container-page py-20 md:py-28 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <span className="gold-rule" />
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Compromiso ético
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl leading-tight text-foreground">
              La IA no reemplaza tu juicio profesional.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-[15px] leading-relaxed text-foreground/85">
            <p>
              El Asistente Profe Estoico fue diseñado para <strong>acompañar el proceso de reflexión docente</strong>.
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
              Su propósito es <em>ayudar a organizar ideas, fortalecer la reflexión, mejorar la redacción y
              comprender los criterios oficiales</em>, respetando siempre la autoría profesional del docente.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS placeholder */}
      <section className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="gold-rule" />
          <h2 className="mt-4 font-display text-3xl md:text-4xl">Voces docentes</h2>
          <p className="mt-3 text-muted-foreground">
            Pronto compartiremos aquí testimonios reales de docentes que forman parte del ecosistema.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <blockquote key={i} className="card-elegant">
              <div className="text-gold font-display text-3xl leading-none">"</div>
              <p className="mt-3 text-sm text-muted-foreground italic">
                Testimonio próximamente. Estamos escuchando a la primera generación de la comunidad.
              </p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted" />
                <div className="text-xs">
                  <div className="text-foreground">Docente {i}</div>
                  <div className="text-muted-foreground">Región de Chile</div>
                </div>
              </footer>
            </blockquote>
          ))}
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
