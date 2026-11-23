# Arquitectura — visión global

Cross-cutting únicamente: qué tecnología hay, cómo se conecta y qué reglas cruzan todos los módulos. El detalle de cada módulo vive en [docs/](docs/) y no se repite aquí.

## Diagrama

```
[Usuario] → [Cloudflare DNS/CDN → Vercel Edge] → [SvelteKit SSR]
                                                       │
                           ┌───────────────────────────┤
                           ▼                           ▼
                   [Supabase DB]              [Supabase Storage]
                   (PostgreSQL + Auth          (imágenes de listings)
                    + Realtime chat)
```

El DNS vive en Vercel (`ns1` y `ns2.vercel-dns.com`) y el sitio se sirve desde Vercel Edge.

## Stack

| Capa | Tecnología | Propósito | Coste |
|---|---|---|---|
| Framework | SvelteKit 3 | SSR y routing | $0 |
| UI | Svelte 5 | Componentes y runes | $0 |
| Lenguaje | TypeScript 6 | Tipado | $0 |
| Estilos | TailwindCSS 4 | Utilidades | $0 |
| Componentes | shadcn-svelte + bits-ui 2 | Base de la UI de app | $0 |
| Build | Vite 8 | Servidor de desarrollo y build | $0 |
| Gestor | pnpm 12 | Solo `pnpm install` / `pnpm run` | $0 |
| Runtime | Node 24 (mise) | Versión fijada en `mise.toml` y en `engines` | $0 |
| Backend | Supabase Free | DB + Auth + Storage + Realtime — [docs/db/AGENTS.md](docs/db/AGENTS.md) | $0 |
| Mapas | Leaflet + OSM | Sin API key | $0 |
| Email | Resend Free | Transaccional y broadcasts — [docs/email/AGENTS.md](docs/email/AGENTS.md) | $0 |
| Hosting | Vercel Hobby | SSR + CDN | $0 |
| DNS | Vercel DNS | `ns1`/`ns2.vercel-dns.com` · dominio `botanicapp.es` | $0 |
| CDN/WAF | Cloudflare Free | DDoS y CDN por delante del host | $0 |
| Instalación | PWA con `@vite-pwa/sveltekit` | Service worker, manifest e instalación desde el navegador | $0 |
| App nativa | Flutter | Fase 2 — [docs/flutter/AGENTS.md](docs/flutter/AGENTS.md) | — |

**Coste total del MVP: 0 €/mes.**

SvelteKit 3 cambió cosas que un agente formado en versiones anteriores escribe mal: `$lib` se sustituyó por imports de subruta (`#lib`), `svelte.config.js` desapareció y `$app/environment` pasó a `$app/env`. El entorno público se genera desde `src/env.ts`; sin ese archivo el build falla aunque la variable exista.

Las versiones de la tabla son las mayores, no las exactas: son las que cambian cómo se escribe el código. El número preciso vive en `package.json`.

## UI y estilos

- **shadcn-svelte no es una dependencia**: los componentes se instalan con su CLI y se copian al proyecto, hoy 12 en `src/lib/components/ui`. `components.json` fija el registro, los alias (`ui` → `$lib/components/ui`, `utils` → `$lib/utils`) y `baseColor: olive`. Un componente nuevo se trae con el CLI y se adapta ahí; no se escribe desde cero.
- **bits-ui 2** son las primitivas accesibles que hay debajo: foco, teclado, `aria` y comportamiento de cada componente.
- **Tailwind 4 no tiene archivo de configuración**: se integra con `@tailwindcss/vite` y el tema se declara en `src/app.css` con `@theme inline`. La tipografía de artículo entra como plugin de CSS (`@plugin "@tailwindcss/typography"`) y el modo oscuro es la variante `@custom-variant dark (&:is(.dark *))`, activada por la clase `.dark`.
- **`cn()`** combina `clsx` y `tailwind-merge` en `$lib/utils`, y las variantes de componente se escriben con `tailwind-variants`.
- **Iconos** con `@lucide/svelte`, decorativos siempre `aria-hidden`.

Las convenciones de uso de estas librerías las fijan las skills del proyecto —`shadcn-svelte`, `svelte-code-writer`, `svelte-core-bestpractices`, `tailwind-4-docs` y `modern-web-guidance`—, indexadas en [AGENTS.md](AGENTS.md).

## Verificación

| Comando | Qué comprueba |
|---|---|
| `pnpm check` | Tipos y plantillas con `svelte-check` sobre el tsconfig del proyecto |
| `pnpm build` | Build de producción con `adapter-vercel`; es la prueba de que nada se rompió |
| `pnpm design:check` | `DESIGN.md` contra la especificación del formato: tokens rotos, referencias y secciones |
| `pnpm design:test` | El propio gate, con nueve casos de éxito y de fallo |

## Design system

[DESIGN.md](DESIGN.md) es la fuente de verdad de tokens, tipografía, forma, movimiento y reglas visuales, y se valida con `pnpm design:check`. Este documento no repite ninguno de sus valores.

## Identificación de plantas

Al publicar, la primera foto identifica la especie y autocompleta el formulario, siempre editable, con un aviso de confirmación.

- Corre **en servidor**: `src/routes/api/identify-plant/+server.ts`. La API key nunca llega al cliente.
- Pl@ntNet rechaza webp, así que la conversión a jpeg ocurre **en el cliente** con Canvas antes de enviar.
- El resultado se guarda como `PlantSpecies` estructurada: nombre, nombre científico, familia, confianza y origen.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](AGENTS.md#cómo-mantener-los-docs).
