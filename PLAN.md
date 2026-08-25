# PLAN — Botanic

Documento único de planificación: fases, sprints, alcance y backlog, todo en formato checklist. Marca `[x]` al completar una tarea; no muevas texto de aquí a otro doc salvo que deje de ser una tarea (ver [AGENTS.md](AGENTS.md) para reglas de actualización). Producto y brand voice en [PRODUCT.md](PRODUCT.md); no se repiten aquí.

## Estado actual

**Fase 0 — MVP PWA** · landing, lista de espera y blog operativos. Siguiente: Sprint 1 — Setup + Auth (schema `profiles` + `categories`, registro email + Google OAuth).

## Fases (2026-2028)

| Fase | Periodo | Objetivo | Estado |
|---|---|---|---|
| 0 — MVP PWA | Jul–Ago 2026 | Lanzar PWA funcional con coste 0 | En curso |
| 1 — Validación | Q4 2026 | 1.000 usuarios activos, iteración con feedback | Pendiente |
| 2 — App nativa | Q1 2027 | Flutter, notificaciones, cámara | Pendiente |
| 3 — Monetización | Q2–Q3 2027 | Plan Pro, destacados, suscripciones profesionales | Pendiente |
| 4 — Expansión | 2028 | Latam, identificación por foto (IA), foro, ronda seed | Pendiente |

| Transición | Condición |
|---|---|
| MVP → Validación | App estable, primeras transacciones |
| Validación → App nativa | 1.000 usuarios activos |
| App nativa → Monetización | 500 transacciones/mes |
| Monetización → Expansión | Ingresos > costes + tracción sostenida |

## Carriles paralelos (no bloquean el MVP)

- **Blog** (SEO + lead gen): ✅ implementado. Ver [docs/web/blog.md](docs/web/blog.md).
- **Campaña de difusión** (waitlist, redes, contenido): ver [docs/product/difusion.md](docs/product/difusion.md). La ejecución táctica de redes sociales vive en un proyecto aparte — aquí solo entra como mención de contexto general.

## Sprints del MVP

Pre-Sprint + 6 sprints (~8-10 semanas).

### Pre-Sprint 1 — Lista de espera + Compartir

- [x] Respuesta en la web al enviar un email — flip de confirmación con copys y aviso de spam
- [x] Email enviado — email transaccional al apuntarse (vía Resend, ya operativo)
- [x] Sistema para compartir desde la web — tarjeta «Semilla fundadora» + Web Share API en la confirmación de la waitlist
- [x] Sistema para compartir desde los emails — enlaces de compartir incluidos en los emails

**Hito**: Flujo de lista de espera completo end-to-end y compartición activa.

### Sprint 1 — Setup + Auth (Semana 1)

- [x] `bun create svelte@latest botanic --template typescript`
- [x] TailwindCSS
- [x] Proyecto Supabase `botanic` creado (Free tier, eu-central-1)
- [x] `.env.local` con `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY` (+ `.env.example`)
- [x] Tabla `waitlist` (email único) + RLS solo-insert
- [x] `src/lib/supabase.ts` con `createClient`
- [x] Integrar en `WaitlistForm.svelte`: `insert` + tratar duplicado (`23505`) como éxito con feedback `alreadyRegistered`
- [x] Verificar: `bun run check` y prueba manual
- [x] Layout global (Navbar, Footer, MobileNav)
- [ ] Prettier, ESLint
- [ ] Schema: profiles, categories + seed
- [ ] @vite-pwa/sveltekit + manifest básico
- [ ] Auth (email + Google OAuth)
- [ ] RLS en profiles
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
- [x] OG tags para compartir
- [x] Sitemap.xml + robots.txt
- [ ] Service worker + precaching
- [ ] Manifest completo + iconos
- [ ] Prompt de instalación
- [ ] Páginas 404, error, empty, offline
- [ ] Testing manual móvil/desktop

**Hito**: MVP listo para lanzar.

## Alcance MVP

### IN (core)

- [x] Waitlist: captura de email pre-auth (conectada a Supabase)
- [ ] Registro (email + Google OAuth)
- [ ] Perfil básico (username, avatar, ubicación)
- [ ] Publicar anuncio con fotos (1-5)
- [ ] Categorías (ver [PRODUCT.md](PRODUCT.md) → Capabilities and Constraints)
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
| App nativa (Flutter) | Fase 2 |
| Notificaciones push nativas | Fase 2 |

User stories de referencia: [PRODUCT.md](PRODUCT.md) → User stories.

## KPIs por fase

### MVP (Fase 0)

| Métrica | Objetivo |
|---|---|
| Suscriptores lista de espera | 1.000 |
| Posts blog publicados | 16-20 (colchón) |

### Validación (Fase 1)

| Métrica | Objetivo |
|---|---|
| Usuarios registrados | 500 |
| Anuncios activos | 200 |
| Transacciones | 50 |
| Retención semanal | >30% |

## Backlog de ideas

Estado: `[ ]` pendiente · `[~]` en curso · `[x]` cerrado.

### Producto / Landing

- [x] **Rework del copy y la estética de la landing** — claim indirecto Wallapop, FOMO lista de espera, sin anglicismos.
- [ ] **Reforzar "lista de espera"** — comunicar mejor qué implica.
- [ ] **Buzón de ideas / canal de feedback** — además de la lista de espera.
- [x] **Tarjeta "Semilla fundadora"** — PNG 1080×1350 generado en cliente, compartible y descargable. Detalle en [docs/web/design-components.md](docs/web/design-components.md).
- [ ] **Email de pre-lanzamiento para las Semillas fundadoras**.

### Email / comunidad

- [ ] **Email semanal con blog** — ver [docs/email/AGENTS.md](docs/email/AGENTS.md).
- [ ] **Emails de comunidad** ("ya somos X", explicación de funcionalidades).

### Contenido

- [ ] **Merchandising de plantas** — camisetas con hojas, etc.
- [ ] **Contenido de valor** — ideas para dar sentimiento de comunidad.

### Branding

- [ ] **Rediseño de logotipo**.
- [ ] **Rediseño de paleta de colores** (parcialmente cubierto por [DESIGN.md](DESIGN.md)).
- [x] **Crear design system** — [DESIGN.md](DESIGN.md), autoridad global.

### Arquitectura / DX

- [ ] **Convertir en monorepo** — separar responsabilidades por carpeta antes de escalar subagentes.
- [x] **Optimizar documentos para agentes IA** — AGENTS.md global + por módulo.

### Multiidioma

- [ ] **Web multiidioma (catalán, gallego, euskera)** — Fase 2. Pendiente: routing, i18n framework, SEO/hreflang, traducción profesional vs IA.

### Cerradas ✅

- [x] **Emails en spam** — auditoría y fixes aplicados. Detalle en [docs/email/deliverability.md](docs/email/deliverability.md).
- [x] **Cron keep-alive de Supabase Free** — implementado.
- [x] **Revisar `waitlist_count` para paridad con la realidad** — confirmado en vivo.
- [x] **Documentos para impresión** — poster A3 implementado y retirado en ago 2026 (fuente en git).
