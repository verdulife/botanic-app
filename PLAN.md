# PLAN — Botanic

> Documento único de planificación. Fusiona el antiguo `roadmap.md`, `ideas.md`, `plan-desarrollo.md` y `mvp-scope.md`. Una sola fuente de verdad para: fases, sprints, KPIs, categorías y backlog.

## Visión

Botanic es la app P2P de plantas entre particulares, con **Deseos** (wishlist supervitaminada), **Comunidad** y **El Market de Botanic** como módulos adyacentes. Lanzamiento como PWA; coste objetivo 0 €.

Tagline canónico y brand voice: [PRODUCT.md](PRODUCT.md).

## Estado actual

**Fase**: MVP PWA (Fase 0) · pre-desarrollo · landing, lista de espera y blog operativos.
**Siguiente**: Sprint 1 — Setup + Auth (registro email + Google OAuth, schema `profiles` + `categories`).

Detalle de checkboxes por sprint debajo.

---

## Fases (2026-2028)

| Fase | Periodo | Objetivo | Estado |
|---|---|---|---|
| 0 — MVP PWA | Jul–Ago 2026 | Lanzar PWA funcional con coste 0 | En curso |
| 1 — Validación | Q4 2026 | 1.000 usuarios activos, iteración con feedback | Pendiente |
| 2 — App nativa | Q1 2027 | React Native, notificaciones, cámara | Pendiente |
| 3 — Monetización | Q2–Q3 2027 | Plan Pro, destacados, suscripciones profesionales | Pendiente |
| 4 — Expansión | 2028 | Latam, identificación por foto (IA), foro, ronda seed | Pendiente |

### Criterios para pasar de fase

| Transición | Condición |
|---|---|
| MVP → Validación | App estable, primeras transacciones |
| Validación → App nativa | 1.000 usuarios activos |
| App nativa → Monetización | 500 transacciones/mes |
| Monetización → Expansión | Ingresos > costes + tracción sostenida |

---

## Carriles paralelos (no bloquean MVP)

- **Blog** (SEO + lead gen): ✅ implementado. Ver [docs/blog.md](docs/blog.md).
- **Redes sociales** (reels + posts IG): 🚧 PoC. Ver [docs/social-video.md](docs/social-video.md) y [docs/social-post.md](docs/social-post.md).
- **Poster A3** (captación offline): ✅ implementado. Ver [poster/README.md](poster/README.md).

---

## Sprints del MVP

6 sprints (~8-10 semanas). Hito por sprint marcado en negrita al final.

### Sprint 1 — Setup + Auth (Semana 1)

- [x] `bun create svelte@latest botanic --template typescript`
- [x] TailwindCSS
- [x] Proyecto Supabase `botanic` creado (Free tier, eu-central-1)
- [x] `.env.local` con `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY` (+ `.env.example`)
- [x] Tabla `waitlist` (email único) + RLS solo-insert
- [x] `src/lib/supabase.ts` con `createClient`
- [x] Integrar en `WaitlistForm.svelte`: `insert` + tratar duplicado (`23505`) como éxito con feedback `alreadyRegistered`
- [x] Verificar: `bun run check` y prueba manual
- [ ] Prettier, ESLint
- [ ] Schema: profiles, categories + seed
- [ ] @vite-pwa/sveltekit + manifest básico
- [ ] Auth (email + Google OAuth)
- [ ] RLS en profiles
- [ ] Layout global (Navbar, Footer, MobileNav)
- [ ] Login + Register
- [ ] Manejo de sesión

**Hito**: Usuario se registra y ve la landing.

### Sprint 2 — Listings CRUD (Semana 2)

- [ ] Schema listings + listing_images
- [ ] Formulario de creación con fotos
- [ ] Página de detalle con galería
- [ ] Editar / borrar (solo vendedor)
- [ ] RLS listings e images

**Hito**: Usuario publica y gestiona anuncios.

### Sprint 3 — Búsqueda + Explorar (Semana 3-4)

- [ ] `/explore` con grid de listings
- [ ] Búsqueda por texto (ILIKE)
- [ ] Filtros: categoría, precio, ubicación
- [ ] Mapa Leaflet + OSM con resultados
- [ ] SSR para SEO (meta tags)
- [ ] Estados vacíos y skeleton
- [ ] Landing con destacados

**Hito**: Visitante busca y encuentra plantas cerca.

### Sprint 4 — Favoritos + Perfiles + Reviews (Semana 5)

- [ ] Schema favorites + reviews
- [ ] Añadir/quitar favoritos
- [ ] Página de favoritos
- [ ] Perfil público + listings del usuario
- [ ] Editar perfil propio
- [ ] Sistema de reviews (1 por par)
- [ ] Rating medio en perfil

**Hito**: Comunidad con identidad.

### Sprint 5 — Chat (Semana 6)

- [ ] Schema conversations + messages
- [ ] Iniciar conversación desde listing
- [ ] Lista de chats en `/inbox`
- [ ] Chat con Realtime subscriptions
- [ ] Badge de no leídos
- [ ] RLS en conversaciones y mensajes
- [ ] Botón "marcar como vendido"

**Hito**: Comprador y vendedor se comunican.

### Sprint 6 — PWA + SEO + Polish (Semana 7-8)

- [x] Landing teaser + lista de espera (UI, sin backend)
- [ ] Service worker + precaching
- [ ] Manifest completo + iconos
- [ ] Prompt de instalación
- [ ] OG tags para compartir
- [ ] Sitemap.xml + robots.txt
- [ ] Páginas 404, error, empty, offline
- [ ] Testing manual móvil/desktop

**Hito**: MVP listo para lanzar.

---

## Categorías

- Semillas
- Esquejes
- Plantas
- Tiestos
- Accesorios

---

## Alcance MVP

### IN MVP (core)

- [x] Waitlist: captura de email pre-auth (conectada a Supabase)
- [ ] Registro (email + Google OAuth)
- [ ] Perfil básico (username, avatar, ubicación)
- [ ] Publicar anuncio con fotos (1-5)
- [ ] Categorías: semilla, esqueje, planta, tiesto, accesorio
- [ ] Nombre + descripción + precio + ubicación
- [ ] Búsqueda por texto
- [ ] Filtros: categoría, precio, ubicación
- [ ] Mapa Leaflet + OpenStreetMap
- [ ] Detalle de anuncio con galería
- [ ] Favoritos
- [ ] Chat en tiempo real (Supabase Realtime)
- [ ] Perfiles público/privado
- [ ] Valoraciones (1-5 estrellas)
- [ ] PWA instalable

### Nice to have

- [ ] Modo oscuro
- [ ] Compartir con OG tags
- [ ] Badge "fundador" primeros 100 usuarios (recompensa para lista de espera)

### OUT (post-MVP)

| Funcionalidad | Fase prevista |
|---|---|
| Pagos integrados | Fase 3 |
| Envíos con etiquetas | Fase 2 |
| Live shopping / subastas | Fase 4 |
| Identificación por foto (IA) | Fase 4 |
| Foro / comunidad social | Fase 4 |
| Cuentas para profesionales | Fase 3 |
| App nativa (React Native) | Fase 2 |
| Notificaciones push nativas | Fase 2 |

---

## User stories

```
Como usuario quiero registrarme para acceder a la plataforma.
Como usuario quiero publicar un anuncio con fotos para vender mi planta.
Como usuario quiero buscar plantas cerca de mí para encontrar lo que necesito.
Como usuario quiero chatear con el vendedor para acordar la entrega.
Como usuario quiero valorar a otros para construir confianza.
Como usuario quiero guardar favoritos para volver después.
```

---

## KPIs por fase

### MVP (Fase 0)

| Métrica | Objetivo |
|---|---|
| Suscriptores lista de espera | 1.000 |
| Seguidores IG | 1.000 |
| Posts blog publicados | 16-20 (colchón) |

### Validación (Fase 1)

| Métrica | Objetivo |
|---|---|
| Usuarios registrados | 500 |
| Anuncios activos | 200 |
| Transacciones | 50 |
| Retención semanal | >30% |

---

## Backlog de ideas

Lista priorizada. Estado: `[ ]` pendiente · `[~]` en curso · `[x]` cerrado.

### Producto / Landing

- [x] **Rework del copy de la landing** — dejar más clara la idea de la app, funcionalidades core, claim indirecto wallapop, FOMO lista de espera, sin anglicismos (waitlist → "lista de espera", etc.).
- [ ] **Lista de espera — expectativas claras** — al apuntarse, mensaje más explícito del estado de la lista.
- [ ] **Reforzar "lista de espera"** — comunicar mejor que es una lista de espera y lo que implica.
- [ ] **Botón/enlace de compartir** — facilitar que los fans compartan.
- [ ] **Buzón de ideas / canal de feedback** — además de la lista de espera.
- [ ] **Badge "fundador"** — recompensa para los 100 primeros usuarios de la lista de espera (email de pre-lanzamiento).

### Email / comunidad

- [ ] **Email semanal con blog** — programar envío con las 2 publicaciones de la semana.
- [ ] **Emails de comunidad** — sensación de comunidad ("ya somos X", "te explicamos X funcionalidad").

### Contenido

- [ ] **Merchandising de plantas** — camisetas con hojas, etc.
- [ ] **Contenido de valor** — ideas para dar sentimiento de comunidad.

### Branding

- [ ] **Rediseño de logotipo**.
- [ ] **Rediseño de paleta de colores** (parcialmente cubierto por [DESIGN.md](DESIGN.md)).
- [ ] **Crear design system** (en curso; [DESIGN.md](DESIGN.md) autoridad global).

### Arquitectura / DX

- [ ] **Convertir en monorepo** — definir bien cada parte y separar responsabilidades. Hacer **antes** que el siguiente porque define las carpetas de cada subagente.
- [ ] **Optimizar documentos para agentes IA** — agent global + agents por sección (web, database/backend, app, video/social) para consumir menos tokens.

### Multiidioma

- [ ] **Web multiidioma (catalán, gallego, euskera)** — Fase 2 (post-validación). Decisiones pendientes: routing, i18n framework, SEO/hreflang, traducción profesional vs IA.

### Cerradas ✅

- [x] **Emails en spam** — auditoría y fixes aplicados. Re-test Outlook post-lanzamiento. Detalle en [docs/email-deliverability.md](docs/email-deliverability.md).
- [x] **Cron keep-alive de Supabase Free** — implementado.
- [x] **Revisar `waitlist_count` para paridad con la realidad** — confirmado en vivo.
- [x] **Documentos para impresión** — poster A3 implementado en [poster/](poster/).

---

## Programación de difusión

Detalle táctico (canales, cadencia, KPIs específicos por canal) en [docs/difusion.md](docs/difusion.md).