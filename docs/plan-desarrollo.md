# Plan de desarrollo

6 sprints (~8-10 semanas).

## Estado actual

Ya hecho:

- Scaffold SvelteKit 5 + TypeScript + TailwindCSS 4
- Landing completa: hero, copy "conocer a gente nueva", waitlist (UI con mock), favicon, OG image, metas SEO, JSON-LD, sitemap + robots, llms.txt
- Rutas `/` (landing) y `/app` (marketplace con datos mock, noindex)
- Waitlist conectada a Supabase: proyecto Free `botanic`, tabla `waitlist` (email único) con RLS solo-insert, `src/lib/supabase.ts`, `WaitlistForm.svelte` → `fetch('/api/waitlist')` con duplicado (`23505`) tratado como éxito y feedback `alreadyRegistered` en el form (sin reenviar email)
- Emails waitlist (Resend): dominio `botanicapp.es` verificado (DKIM + SPF + MX), API key, Audience "waitlist", ruta `POST /api/waitlist` (insert + confirmación al usuario + aviso al admin + alta en Audience, solo en fila nueva), `WaitlistForm.svelte` conectado. Probado en real (ambos emails `delivered`). Emails en **HTML con marca** (`src/lib/emails/`), asuntos sin emojis

**Siguiente tarea — Sprint 1: Setup + Auth** (ver abajo).

**Carril paralelo — Blog**: blog estático en Markdown sin CMS para SEO + lead gen. No bloquea los sprints. Plan, arquitectura, guía de estilo y workflow en [`docs/blog.md`](docs/blog.md).

- [x] Conectar Supabase (`/supabase`) y crear proyecto Free tier
- [x] `.env.local` con `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY` (+ `.env.example`)
- [x] Tabla `waitlist` (email único) + RLS solo-insert
- [x] `src/lib/supabase.ts` con `createClient`
- [x] Integrar en `WaitlistForm.svelte`: `insert` + tratar duplicado (`23505`) como éxito con feedback `alreadyRegistered`
- [x] Verificar: `bun run check` y prueba manual

**Emails de la waitlist (Resend) — hecho:**

- [x] Verificar dominio `botanicapp.es` en Resend (DKIM/SPF/MX) + crear API key y Audience "waitlist"
- [x] Env vars: `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL` (admite varios emails separados por coma), `RESEND_AUDIENCE_ID`, `SUPABASE_SERVICE_ROLE_KEY` (`.env.local` + `.env.example`)
- [x] Ruta `POST /api/waitlist`: insert + confirmación al usuario + aviso al admin + alta en Audience (solo fila nueva)
- [x] `WaitlistForm.svelte` → `fetch('/api/waitlist')`
- [x] Verificar: `bun run check` + prueba real (recibir emails)
- [x] Diseñar los emails automáticos con HTML (marca Botanic: layout en `src/lib/emails/`, estilos inline, header con `og-image.jpg` optimizado con sharp y compartido con el OG metadata)
- [x] Feedback de duplicado en el form (`alreadyRegistered`, sin reenvío de email) + confeti de celebración en altas nuevas (`canvas-confetti`, paleta de la landing)

## Sprint 1 — Setup + Auth (Semana 1)

- [x] `bun create svelte@latest botanic --template typescript`
- [x] TailwindCSS
- [ ] Prettier, ESLint
- [ ] Proyecto Supabase (DB + Auth + Storage)
- [ ] Schema: profiles, categories + seed
- [ ] @vite-pwa/sveltekit + manifest básico
- [ ] Auth (email + Google OAuth)
- [ ] RLS en profiles
- [ ] Layout global (Navbar, Footer, MobileNav)
- [ ] Login + Register
- [ ] Manejo de sesión

**Hito**: Usuario se registra y ve la landing.

## Sprint 2 — Listings CRUD (Semana 2)

- [ ] Schema listings + listing_images
- [ ] Formulario de creación con fotos
- [ ] Página de detalle con galería
- [ ] Editar / borrar (solo vendedor)
- [ ] RLS listings e images

**Hito**: Usuario publica y gestiona anuncios.

## Sprint 3 — Búsqueda + Explorar (Semana 3-4)

- [ ] `/explore` con grid de listings
- [ ] Búsqueda por texto (ILIKE)
- [ ] Filtros: categoría, precio, ubicación
- [ ] Mapa Leaflet + OSM con resultados
- [ ] SSR para SEO (meta tags)
- [ ] Estados vacíos y skeleton
- [ ] Landing con destacados

**Hito**: Visitante busca y encuentra plantas cerca.

## Sprint 4 — Favoritos + Perfiles + Reviews (Semana 5)

- [ ] Schema favorites + reviews
- [ ] Añadir/quitar favoritos
- [ ] Página de favoritos
- [ ] Perfil público + listings del usuario
- [ ] Editar perfil propio
- [ ] Sistema de reviews (1 por par)
- [ ] Rating medio en perfil

**Hito**: Comunidad con reputación.

## Sprint 5 — Chat (Semana 6)

- [ ] Schema conversations + messages
- [ ] Iniciar conversación desde listing
- [ ] Lista de chats en `/inbox`
- [ ] Chat con Realtime subscriptions
- [ ] Badge de no leídos
- [ ] RLS en conversaciones y mensajes
- [ ] Botón "marcar como vendido"

**Hito**: Comprador y vendedor se comunican.

## Sprint 6 — PWA + SEO + Polish (Semana 7-8)

- [ ] Service worker + precaching
- [ ] Manifest completo + iconos
- [ ] Prompt de instalación
- [ ] OG tags para compartir
- [ ] Sitemap.xml + robots.txt
- [ ] Páginas 404, error, empty, offline
- [ ] Testing manual móvil/desktop
- [x] Landing teaser + waitlist (UI, sin backend)

**Hito**: MVP listo para lanzar.
