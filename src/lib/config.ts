// Configuración central de Profe Estoico.
// Toda la arquitectura queda preparada para conectar el Copilot y futuros
// módulos sin reconstruir la aplicación.

export const APP_NAME = "Profe Estoico";
export const APP_TAGLINE = "Plataforma Inteligente para el Desarrollo Profesional Docente";

// URL del Copilot (GPT personalizado). Se reemplazará cuando esté disponible.
// Puede sobrescribirse mediante la variable de entorno VITE_COPILOT_URL.
export const COPILOT_URL: string =
  (import.meta.env.VITE_COPILOT_URL as string | undefined) ??
  "https://chat.openai.com/";

// URL de la Demo gratuita del Copilot. Se reemplazará cuando esté disponible.
// Puede sobrescribirse mediante la variable de entorno VITE_DEMO_URL.
export const DEMO_URL: string =
  (import.meta.env.VITE_DEMO_URL as string | undefined) ??
  "https://chat.openai.com/";

// URL de compra de acceso Premium. Se reemplazará cuando esté disponible.
// Puede sobrescribirse mediante la variable de entorno VITE_PAYMENT_URL.
export const PAYMENT_URL: string =
  (import.meta.env.VITE_PAYMENT_URL as string | undefined) ??
  "https://lemonsqueezy.com/";

export type ModuleStatus = "available" | "coming-soon";

export interface PortalModule {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  action?: {
    label: string;
    href?: string;
    external?: boolean;
  };
}

export const PORTAL_MODULES: PortalModule[] = [
  {
    id: "copilot",
    title: "Copilot Evaluación Docente",
    description:
      "Tu asistente especializado para reflexionar, organizar ideas y comprender los criterios oficiales.",
    status: "available",
    action: { label: "Abrir Copilot", href: COPILOT_URL, external: true },
  },
  {
    id: "biblioteca",
    title: "Biblioteca",
    description:
      "Documentos oficiales, rúbricas y materiales curados para tu preparación.",
    status: "coming-soon",
  },
  {
    id: "simulador",
    title: "Simulador ECEP",
    description:
      "Practica el conocimiento específico con simulaciones alineadas al instrumento.",
    status: "coming-soon",
  },
  {
    id: "comunidad",
    title: "Comunidad",
    description:
      "Un espacio profesional para compartir experiencias con colegas comprometidos.",
    status: "coming-soon",
  },
  {
    id: "progreso",
    title: "Mi progreso",
    description:
      "Visualiza tu avance, tus reflexiones y tus hitos a lo largo del proceso.",
    status: "coming-soon",
  },
];
