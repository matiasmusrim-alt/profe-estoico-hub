# Profe Estoico Hub — Plan de integración SaaS

## a) Estado actual

- App TanStack Start + React 19 + Tailwind v4, con sistema de diseño ya definido (azul marino, blanco, gris claro, dorado; Fraunces/Inter).
- Solo existe una ruta: `src/routes/index.tsx` (landing de 433 líneas) más `__root.tsx`, `site-header.tsx`, `site-footer.tsx`.
- El login, recuperación de contraseña y portal privado fueron eliminados en una iteración anterior: hoy no hay autenticación ni rutas protegidas.
- Lovable Cloud está activo y los clientes generados existen (`client`, `client.server`, `auth-middleware`, `auth-attacher`), y `src/start.ts` ya registra `attachSupabaseAuth`.
- La base de datos está vacía: `src/integrations/supabase/types.ts` no declara ninguna tabla y no hay migraciones.
- `src/lib/config.ts` define `COPILOT_URL`, `DEMO_URL`, `PAYMENT_URL` como enlaces externos placeholder (chat.openai.com / lemonsqueezy.com) usados por los CTA del Hero.
- No hay integración de IA, ni pagos, ni almacenamiento de documentos.

## b) Arquitectura recomendada

```text
Landing público (se conserva)
   └─ CTA: Probar Demo → /registro   Comprar Premium → /precios   Ya tengo licencia → /portal

Auth (correo/contraseña + verificación + recuperación)
   /auth  /auth/callback  /recuperar  /nueva-clave

Portal privado  /_authenticated/*
   /portal        resumen: licencia, usos restantes, proyectos
   /mentor        chat "Profesor Estoico" (indicador por indicador)
   /proyectos/$id detalle de portafolio e indicadores
   /cuenta        perfil, licencia, cerrar sesión

Backend (server functions de TanStack, no edge functions)
   sendMentorMessage   → valida sesión, consume cuota, llama al modelo, guarda mensajes
   getEntitlement      → licencia + usos restantes
   startCheckout       → crea sesión de pago
   /api/public/pago-webhook → activa licencia (firma verificada)
```

Reglas clave:
- El conteo de usos y el gate demo/premium ocurren **solo en el servidor**, dentro de `sendMentorMessage`, en una transacción atómica (función SQL `consume_demo_use`). El navegador nunca decide.
- La clave del modelo vive solo en el servidor (leída dentro del `.handler()`). Recomendación: usar Lovable AI Gateway (sin clave propia) y dejar `OPENAI_API_KEY` como alternativa si insistes en OpenAI directo.
- El prompt de sistema del "Profesor Estoico" vive en un módulo `*.server.ts`, nunca en el bundle del cliente, y no se devuelve al frontend.
- Documentos oficiales: bucket privado de storage + tabla `official_documents` con metadatos (especialidad, módulo, tarea, indicador) para recuperar contexto por consulta. La búsqueda semántica (embeddings) queda como fase 2.

## c) Tablas y seguridad

Todas en `public`, con `GRANT` explícitos, RLS activo y políticas por `auth.uid()`.

| Tabla | Contenido | Acceso |
|---|---|---|
| `profiles` | nombre, especialidad, nivel, creado desde trigger de signup | dueño lee/actualiza |
| `user_roles` (+ enum `app_role`, función `has_role`) | roles admin/user en tabla separada | lectura autenticada; escritura solo service role |
| `licenses` | tipo (`demo`/`premium`), estado, activada_en, referencia de pago | dueño lee; escritura solo service role |
| `demo_usage` | contador de usos por usuario (máx. 10) y registro por evento | dueño lee; escritura solo vía función SQL |
| `portfolio_projects` | proyecto de portafolio: especialidad, módulo, curso | CRUD del dueño |
| `portfolio_indicators` | tarea, subtarea, indicador, estado (`pendiente`/`preliminar`), contenido confirmado | CRUD del dueño vía proyecto |
| `mentor_messages` | rol, contenido, indicador asociado, tokens | dueño lee; inserción vía server function |
| `official_documents` | metadatos de rúbricas/manuales/MBE/Bases + ruta en storage | lectura autenticada (o solo premium); carga solo admin |

Seguridad adicional:
- `consume_demo_use(user_id)` como función `security definer` que verifica licencia, incrementa el contador y devuelve usos restantes o error de cuota. Evita condiciones de carrera y bypass desde el cliente.
- Los usos solo se consumen tras una respuesta exitosa del modelo (o se revierten si falla).
- El webhook de pago se verifica por firma HMAC y es idempotente por id de transacción.
- Nada de auto-confirmación de correo: verificación real activada.

## d) Rutas y componentes nuevos

Rutas: `/auth`, `/auth/callback`, `/recuperar`, `/nueva-clave`, `/precios`, `/gracias` (post-pago), `_authenticated/route.tsx` (gate), `/portal`, `/mentor`, `/proyectos/$id`, `/cuenta`, `api/public/pago-webhook`.

Componentes: `auth-form`, `session-nav` (header consciente de sesión con salir), `entitlement-badge` (usos restantes / Premium), `upgrade-dialog` (invitación al pago al llegar a 10), `mentor-chat` (lista de mensajes + composer), `indicator-panel` (estado y "Indicador X.X finalizado como versión preliminar" con las tres opciones: fortalecer, continuar, revisar otro), `project-picker`, `pricing-card` ($39.990 CLP, pago único).

Landing: mismo diseño; solo se cambian los tres CTA del Hero de enlaces externos a rutas internas y `config.ts` deja de apuntar a placeholders externos.

## e) Variables y credenciales externas

Ya disponibles: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY` (si usamos el gateway de IA).

Faltan por configurar tú:
- Proveedor de pago (Lemon Squeezy, Flow, Mercado Pago o Stripe): clave secreta de API, id de producto/variante y secreto de webhook.
- `OPENAI_API_KEY` solo si eliges OpenAI directo en vez del gateway incluido.
- Dominio de correo verificado si quieres el email de invitación al pago (si no, se usa solo la pantalla).
- Los PDFs oficiales (rúbricas, manuales por especialidad, MBE, Bases Curriculares) para cargarlos al bucket.
- URL del webhook a registrar en el proveedor: `https://project--<id>.lovable.app/api/public/pago-webhook`.

## f) Riesgos y decisiones a confirmar

1. **Proveedor de pago.** Lemon Squeezy no cobra en CLP de forma nativa; Flow/Mercado Pago sí. ¿Cuál usamos? Esto define el webhook y el checkout.
2. **Modelo de IA.** Recomiendo el gateway de IA incluido (sin clave, sin costo de cuenta OpenAI aparte). ¿Aceptas, o exiges OpenAI directo con tu clave?
3. **Reemplazo del GPT existente.** Este plan mueve el mentor *dentro* de la app (no abre chat.openai.com). Confirma que el GPT personalizado se abandona; si no, el conteo seguro de usos no es posible.
4. **Qué cuenta como "uso".** Propongo: 1 uso = 1 mensaje enviado al mentor. Alternativa: 1 uso = 1 indicador trabajado. Elige.
5. **Documentos oficiales y derechos.** Confirmar que puedes almacenar esos PDFs; el acceso será solo para usuarios autenticados.
6. **Alcance de la fase 1.** Sugiero: auth + portal + mentor con cuota + pago. Simulador, Comunidad y Progreso siguen como "en desarrollo".
7. **Migración de compradores previos.** ¿Hay licencias ya vendidas que deban activarse a mano?
8. **Riesgo técnico.** Sin embeddings, el mentor recibe contexto por filtro de metadatos; la calidad depende de cómo etiquetemos los documentos. Los embeddings se agregan en fase 2 si hace falta.
