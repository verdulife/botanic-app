# Web — contrato del módulo

Frontend único en **SvelteKit 3** con Svelte 5: landing, blog y web app bajo `/app`.

Stack, límites y verificación → [ARCHITECTURE.md](../../ARCHITECTURE.md) · autoridad visual y movimiento → [DESIGN.md](../../DESIGN.md) · interacción, gestos y pantallas → [UX.md](../ux/UX.md) · reglas de la web app → [../app/AGENTS.md](../app/AGENTS.md).

## Documentación del módulo

| Doc | Contenido |
|---|---|
| [BLOG.md](BLOG.md) | Frontmatter, loader, pipeline de imágenes, cron y guía de IA |
| [IMAGES-CREDITS.md](IMAGES-CREDITS.md) | Registro de atribución de las imágenes del blog; lo reescribe `scripts/images.mjs` |

## Reglas

- Componentes `src/lib/components/ui/`: convención `shadcn-svelte`. Se usan tal cual; el tema se ajusta con CSS propio, no sobreescribiendo el CLI.
- Tailwind 4 es CSS-first: `@import "tailwindcss"` y `@theme inline` en `src/app.css`, sin archivo de configuración. Skill `tailwind-4-docs`.
- Svelte 5 con runes. Skills `svelte-core-bestpractices` y `svelte-code-writer`.
- El logo vectorial vive solo en `src/lib/components/Logo.svelte` y se consume con `?raw`.
