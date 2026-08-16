import { Link } from "@tanstack/react-router";
import { APP_NAME, CONTACT_URL } from "@/lib/config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-lg">
            P
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base text-foreground">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Docencia · Reflexión
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#como-funciona" className="hover:text-foreground transition-colors">
            Cómo funciona
          </a>
          <a href="/#etica" className="hover:text-foreground transition-colors">
            Compromiso ético
          </a>
          <a href="/#faq" className="hover:text-foreground transition-colors">
            Preguntas
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Conocer el Copilot
          </a>
        </div>

      </div>
    </header>
  );
}
