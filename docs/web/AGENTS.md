# Web — Contexto del módulo (SvelteKit)

Frontend único en SvelteKit 5: **landing** (hecha), **blog** (hecho), **web app marketplace** (pendiente, mock en `/app`). Stack/diagrama → [architecture.md](../../architecture.md); design system → [DESIGN.md](../../DESIGN.md) (autoridad global, no duplicar).

## Estado

| Área | Estado | Ruta |
|---|---|---|
| Landing + waitlist | ✅ | `src/routes/+page.svelte` |
| Blog | ✅ | `src/routes/blog/**` |
| Web app (marketplace) | 🔶 Mock | `src/routes/app/**` |
| Legal | ✅ | `src/routes/aviso-legal`, `src/routes/politica-de-privacidad` |

## Documentación del módulo

| Doc | Contenido | Ubicación |
|---|---|---|
| blog | Frontmatter, loader, pipeline imágenes, cron, guía IA | [blog.md](blog.md) |
| pwa | `@vite-pwa/sveltekit` | [pwa.md](pwa.md) |
| images-credits | Atribución imágenes Wikimedia del blog | [images-credits.md](images-credits.md) |
| design-components | Landing (Hero, abanico, waitlist, footer) + SEO/perf | [design-components.md](design-components.md) |

**Web app marketplace (próximo trabajo)**: estructura de carpetas y esquema de rutas en [architecture.md](../../architecture.md) ("Estructura del proyecto SvelteKit"); sprints (Auth → Listings → Búsqueda → Favoritos → Chat → PWA/SEO) en [PLAN.md](../../PLAN.md).

## Reglas específicas

- UI: cargar skill `impeccable` (tabla en AGENTS.md raíz) — trae PRODUCT.md + DESIGN.md.
- Componentes `src/lib/components/ui/`: convención `shadcn-svelte`.
- Tailwind v4 (CSS-first, `@import "tailwindcss"`, sin `tailwind.config.js`): skill `tailwind-4-docs` (snapshot local, no se commitea).
- Svelte 5: runes (`$state`, `$derived`, `$props`) — skills `svelte-core-bestpractices` / `svelte-code-writer`.
- Logo vectorial vive solo en `src/lib/components/Logo.svelte` (consumido vía `?raw`).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).