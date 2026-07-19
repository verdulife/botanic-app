# Plan de desarrollo

6 sprints (~8-10 semanas).

## Sprint 1 — Setup + Auth (Semana 1)

- [ ] `bun create svelte@latest botanic --template typescript`
- [ ] TailwindCSS, Prettier, ESLint
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
- [ ] Landing teaser + waitlist

**Hito**: MVP listo para lanzar.
