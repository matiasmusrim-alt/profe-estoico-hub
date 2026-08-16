// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel sets VERCEL=1 during its build. Nitro's default in the Lovable
// wrapper targets Cloudflare, so select Nitro's Vercel adapter automatically
// when this repository is built by Vercel. Local/Lovable builds keep their
// existing target.
const vercelNitro = process.env.VERCEL ? { preset: "vercel" as const } : undefined;

export default defineConfig({
  ...(vercelNitro ? { nitro: vercelNitro } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
