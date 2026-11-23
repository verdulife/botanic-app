# Web — Contexto del módulo (SvelteKit)

Frontend único en SvelteKit 5: **landing** (hecha), **blog** (hecho), **web app marketplace** (pendiente, mock en `/app`). Stack/diagrama → [ARCHITECTURE.md](../../ARCHITECTURE.md); design system → [DESIGN.md](../../DESIGN.md) (autoridad global, no duplicar).

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

**Web app marketplace**: documento funcional de la app web en [../app/AGENTS.md](../app/AGENTS.md) (entidades, rutas, navegación, módulos, cross-cutting). Carga selectiva: lee solo el módulo afectado por la vista a implementar. Autoridad visual en [DESIGN.md](../../DESIGN.md), ya aplicada.

## Reglas específicas

- UI: autoridad visual en [DESIGN.md](../../DESIGN.md); contexto de diseño = PRODUCT.md + DESIGN.md. **DESIGN.md ya está aplicado; respétalo en cualquier cambio de UI.**
- Componentes `src/lib/components/ui/`: convención `shadcn-svelte`. Se usan tal cual, sin sobreescrituras de tema del CLI sin custom CSS.
- Tailwind v4 (CSS-first, `@import "tailwindcss"`, sin `tailwind.config.js`): skill `tailwind-4-docs` (snapshot local, no se commitea).
- Svelte 5: runes (`$state`, `$derived`, `$props`) — skills `svelte-core-bestpractices` / `svelte-code-writer`.
- Logo vectorial vive solo en `src/lib/components/Logo.svelte` (consumido vía `?raw`).
- **Web app (`/app/**`)**: raíz browseable sin login en `/app`. Contrato del módulo en [../app/AGENTS.md](../app/AGENTS.md), reglas funcionales en [../app/FUNCIONAL.md](../app/FUNCIONAL.md) y autenticación por `AUTH_MODE` en `src/lib/auth-mode.ts`.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).