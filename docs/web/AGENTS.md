# Web — Contexto del módulo (SvelteKit)

Frontend único en SvelteKit 5: **landing** (hecha), **blog** (hecho), **web app marketplace** (pendiente, mock en `/app`). Stack/diagrama → [architecture.md](../../architecture.md); design system → [DESIGN.md](../../DESIGN.md) (autoridad global, no duplicar).

## Estado

| Área | Estado | Ruta |
|---|---|---|
| Landing + waitlist | ✅ | `src/routes/+page.svelte` |
| Blog | ✅ | `src/routes/blog/**` |
| Web app (marketplace) | 🔶 Wireframe neutro | `src/routes/app/**` |
| Legal | ✅ | `src/routes/aviso-legal`, `src/routes/politica-de-privacidad` |

## Documentación del módulo

| Doc | Contenido | Ubicación |
|---|---|---|
| blog | Frontmatter, loader, pipeline imágenes, cron, guía IA | [blog.md](blog.md) |
| pwa | `@vite-pwa/sveltekit` | [pwa.md](pwa.md) |
| images-credits | Atribución imágenes Wikimedia del blog | [images-credits.md](images-credits.md) |
| design-components | Landing (Hero, abanico, waitlist, footer) + SEO/perf | [design-components.md](design-components.md) |

**Web app marketplace**: documento funcional del wireframe en [../app/README.md](../app/README.md) (entidades, rutas, navegación, módulos, cross-cutting). Carga selectiva: lee solo el módulo afectado por la vista a implementar. Esquema de rutas y sprints en [PLAN.md](../../PLAN.md); autoridad visual en [DESIGN.md](../../DESIGN.md) — se aplica **después** del wireframe neutro.

## Reglas específicas

- UI: cargar skill `impeccable` (tabla en AGENTS.md raíz) — trae PRODUCT.md + DESIGN.md. **En la fase de wireframe neutro todavía NO aplicar DESIGN.md.**
- Componentes `src/lib/components/ui/`: convención `shadcn-svelte`. En wireframe se usan tal cual del CLI sin custom CSS.
- Tailwind v4 (CSS-first, `@import "tailwindcss"`, sin `tailwind.config.js`): skill `tailwind-4-docs` (snapshot local, no se commitea).
- Svelte 5: runes (`$state`, `$derived`, `$props`) — skills `svelte-core-bestpractices` / `svelte-code-writer`.
- Logo vectorial vive solo en `src/lib/components/Logo.svelte` (consumido vía `?raw`).
- **Web app (`/app/**`)**: raíz browseable sin login en `/app`. Detalle funcional en [../app/README.md](../app/README.md); reglas de UX cross-cutting (responsive + scroll horizontal) en [../app/cross-cutting.md](../app/cross-cutting.md). **Auth mock** activo durante el wireframe: sesión local simulada (cookie `botanic_mock_session`), conmutable a Supabase con `AUTH_MODE` en `src/lib/auth-mode.ts`. Ver [../app/auth.md](../app/auth.md).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).