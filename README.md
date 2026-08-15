# Profe Estoico Hub

Quiero construir la plataforma oficial de Profe Estoico.

No es una página web.

Es el inicio de un ecosistema tecnológico para docentes chilenos.

La plataforma debe diseñarse como un SaaS moderno, escalable y modular.

Su objetivo es convertirse en el lugar donde un docente gestione toda su preparación para la Evaluación Docente y, posteriormente, otros procesos profesionales.

Esta primera versión NO debe integrar todavía inteligencia artificial propia ni la API de OpenAI.

El Copilot ya existe como un GPT personalizado y, por ahora, la plataforma solamente actuará como el portal oficial de acceso.

Toda la arquitectura debe quedar preparada para integrar posteriormente ese Copilot sin reconstruir la aplicación.

──────────────────────────

IDENTIDAD

Nombre:

Profe Estoico

Subtítulo:

Plataforma Inteligente para el Desarrollo Profesional Docente

Concepto:

Elegante.

Minimalista.

Profesional.

Tecnológica.

Inspirada en el estoicismo moderno.

Nunca infantil.

Nunca recargada.

Debe transmitir confianza.

──────────────────────────

DISEÑO

Colores:

Azul marino

Blanco

Gris muy claro

Detalles dorados

Mucho espacio en blanco.

Tarjetas modernas.

Animaciones suaves.

Responsive para celular, tablet y computador.

──────────────────────────

PÁGINA PRINCIPAL

Hero principal.

Título:

"La forma más inteligente de preparar tu Evaluación Docente."

Subtítulo:

"Organiza tu trabajo, fortalece tu reflexión profesional y avanza con apoyo especializado."

Botón principal:

Ingresar

Botón secundario:

Solicitar acceso

Más abajo:

Beneficios

Compromiso Ético

Testimonios (placeholder)

Preguntas frecuentes

Footer

──────────────────────────

COMPROMISO ÉTICO

Crear una sección elegante llamada:

"La IA no reemplaza tu juicio profesional."

Texto:

El Asistente Profe Estoico fue diseñado para acompañar el proceso de reflexión docente.

No inventa experiencias.

No suplanta la práctica profesional.

No genera evidencias falsas.

Su propósito es ayudar a organizar ideas, fortalecer la reflexión, mejorar la redacción y comprender los criterios oficiales, respetando siempre la autoría profesional del docente.

──────────────────────────

LOGIN

Crear pantalla de acceso.

Correo

Contraseña

Botón Entrar

Botón Recuperar contraseña

──────────────────────────

PORTAL PRIVADO

Después del login mostrar:

Bienvenido a Profe Estoico

¿Qué deseas hacer hoy?

Mostrar tarjetas grandes.

1.

Copilot Evaluación Docente

Estado:

Disponible

Botón:

Abrir Copilot

(Dejar preparada una variable configurable llamada COPILOT_URL para conectar posteriormente el GPT.)

2.

Biblioteca

Estado:

Próximamente

3.

Simulador ECEP

Estado:

Próximamente

4.

Comunidad

Estado:

Próximamente

5.

Mi progreso

Estado:

Próximamente

──────────────────────────

IMPORTANTE

No desarrollar todavía:

API OpenAI

Chatbot

Simulador

Cursos

Solo dejar la arquitectura preparada para crecer durante los próximos años.

Quiero un código limpio, profesional y escalable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cca06775-f017-4df5-94e7-dd7faa556f30).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Configuración de fase 1

1. Copia `.env.example` a `.env.local` y completa los valores en el entorno de despliegue. Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` ni `OPENAI_API_KEY` con el prefijo `VITE_`.
2. Aplica, en orden, las migraciones de `supabase/migrations` al proyecto Supabase.
3. En Supabase Auth habilita correo/contraseña, confirmación de correo y registra las URL de redirección `/auth/callback` y `/nueva-clave` para producción y desarrollo.
4. Configura la clave OpenAI solo en el runtime del servidor. `OPENAI_MODEL` es opcional y usa `gpt-5-mini` por defecto.

La cuota demo es de 10 mensajes por usuario. Se consume atómicamente en PostgreSQL desde el servidor y se reembolsa si OpenAI falla. Las rutas privadas verifican la sesión y las operaciones sensibles vuelven a verificar el JWT en el servidor.
