import { APP_NAME, CONTACT_URL, COPILOT_URL, PAYMENT_URL } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-24">
      <div className="container-page py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display">
              P
            </span>
            <span className="font-display text-lg">{APP_NAME}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Plataforma Inteligente para el Desarrollo Profesional Docente. Hecha en Chile,
            con respeto por el juicio profesional de cada maestro.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-foreground mb-3">Plataforma</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="/#como-funciona" className="hover:text-foreground">Cómo funciona</a></li>
            <li><a href="/#etica" className="hover:text-foreground">Compromiso ético</a></li>
            <li><a href="/#faq" className="hover:text-foreground">Preguntas frecuentes</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-foreground mb-3">Acceso</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
                Solicitar información
              </a>
            </li>
            <li>
              <a href={PAYMENT_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
                Comprar Acceso Premium
              </a>
            </li>
            <li>
              <a href={COPILOT_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
                Ya tengo licencia
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-foreground/80 font-display italic leading-relaxed max-w-xl">
            Construido por docentes. Impulsado por Inteligencia Artificial. Respaldado por la
            ética profesional.
          </p>
          <span className="gold-rule" />
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
          <span>© {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</span>
          <span className="flex items-center gap-2">
            <span className="gold-rule" />
            <em className="not-italic">Sapere aude — atrévete a pensar.</em>
          </span>
        </div>
      </div>
    </footer>
  );
}
