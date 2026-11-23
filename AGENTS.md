# Botanic — Contexto global para el agente

Marketplace P2P de plantas entre particulares + **Deseos** (wishlist), **Comunidad**, **El Market de Botanic**. PWA; coste objetivo 0 €. Stack: TypeScript · Dart (fase 2) · pnpm · sin add-ons. Autoridad producto → [PRODUCT.md](PRODUCT.md); diseño → [DESIGN.md](DESIGN.md); técnica → [ARCHITECTURE.md](ARCHITECTURE.md). **Carga selectiva**: este es el único contexto transversal (docs, planning, brand); los AGENTS.md de módulo se cargan solo si la tarea cae dentro del módulo.

## Documentación raíz

| Doc | Rol | Ubicación |
|---|---|---|
| README | Setup local + portada | [README.md](README.md) |
| PRODUCT | Claim, target, brand voice (autoridad producto) | [PRODUCT.md](PRODUCT.md) |
| DESIGN | Design system (autoridad visual global) | [DESIGN.md](DESIGN.md) |
| architecture | Stack, diagrama, costes, hosting | [ARCHITECTURE.md](ARCHITECTURE.md) |

## Módulos

Cada AGENTS.md de módulo es autocontenido, enlaza de vuelta aquí y a PRODUCT/DESIGN sin duplicar contenido.

| Módulo | Ámbito | AGENTS.md |
|---|---|---|
| web | Landing + blog (hecho) + app web marketplace sobre datos mock — SvelteKit | [docs/web/AGENTS.md](docs/web/AGENTS.md) |
| app | App web: rutas, entidades, navegación y UX cross-cutting | [docs/app/AGENTS.md](docs/app/AGENTS.md) |
| email | Transaccionales (waitlist, hecho) + campaña (pendiente) — Resend | [docs/email/AGENTS.md](docs/email/AGENTS.md) |
| db | Supabase — waitlist (hecho) + schema app (pendiente) | [docs/db/AGENTS.md](docs/db/AGENTS.md) |
| flutter | App nativa (fase 2, pendiente) | [docs/flutter/AGENTS.md](docs/flutter/AGENTS.md) |
| product | Mercado, monetización, difusión (contexto de negocio) | [docs/product/AGENTS.md](docs/product/AGENTS.md) |

## Skills

Las skills de proyecto viven en `.pi/skills/` (fuente que descubren Pi y el índice `.atl/skill-registry.md`).

| Skill | Para qué | SKILL.md |
|---|---|---|
| shadcn-svelte | Componentes shadcn para Svelte — CLI, composición, estilos | [.pi/skills/shadcn-svelte/SKILL.md](.pi/skills/shadcn-svelte/SKILL.md) |
| svelte-code-writer | Guía de escritura de código Svelte 5 idiomático | [.pi/skills/svelte-code-writer/SKILL.md](.pi/skills/svelte-code-writer/SKILL.md) |
| svelte-core-bestpractices | Buenas prácticas del core de Svelte 5 (runes, snippets) | [.pi/skills/svelte-core-bestpractices/SKILL.md](.pi/skills/svelte-core-bestpractices/SKILL.md) |
| tailwind-4-docs | Snapshot de Tailwind v4 — utilities, variants, config, migración v3→v4 | [.pi/skills/tailwind-4-docs/SKILL.md](.pi/skills/tailwind-4-docs/SKILL.md) |
| modern-web-guidance | Buenas prácticas de la plataforma web (Baseline) — dialogs, formularios, a11y, CWV | [.pi/skills/modern-web-guidance/SKILL.md](.pi/skills/modern-web-guidance/SKILL.md) |


## Reglas de trabajo (globales)

- **Paso a paso + hitos verificables**: en tareas grandes, parar tras cada hito y reportar. No iniciar el siguiente sin OK.
- **Servidor de desarrollo**: se puede arrancar, siempre **en segundo plano** (`pnpm run dev` como job en background, nunca en primer plano). La prohibición anterior queda reducida al primer plano: un servidor que no termina bloquea la conversación esperando una salida que no llega. En segundo plano no bloquea nada, y se para al terminar la verificación.
- **Sistema de diseño**: [DESIGN.md](DESIGN.md) es autoridad visual global — landing, blog, webapp, emails, og-image, futura app Flutter.
- **Soporte de navegador**: Baseline Widely available. Una función que no lo sea necesita detección y fallback, o no se usa. La guía de plataforma se consulta con la skill `modern-web-guidance` antes de escribir HTML, CSS o JS de cliente.

## Seguridad — credenciales MCP

- Tokens OAuth (Supabase, Resend) en `.opencode/*-auth.json` — **por máquina**, no por repo. `.gitignore` los excluye (`*-auth.json` + entrada explícita).
- **Re-autenticar** en cada clon / cambio de máquina (`/supabase auth login`). Nunca copies `*-auth.json` entre máquinas.
- **¿Credencial filtrada?** → revocar el grant en el dashboard del proveedor. Revocación server-side invalida cualquier copia.
- `opencode.json` contiene config del tool (URLs MCP, plugins), **no secretos**. Si ves secretos ahí, muévelos al `*-auth.json` correspondiente.

## Seguridad — autenticación y autorización en `/app`

- **Modo mock (activo)**: `/app/*` usa **autenticación simulada** — sesión local por cookie `botanic_mock_session` y cuentas registradas en `.mock-auth/users.json` (gitignored, no commitear). Sin tokens ni llamadas a Supabase. Registro con auto-confirmación (no hay email) y recuperación de contraseña inerte. **En producción (Vercel serverless) el mock es stateless y determinista** (`NODE_ENV=production`): sin writes de filesystem, los usuarios seed se derivan de `USERS` con salt/timestamps fijos y la cuenta demo siempre funciona; los registros nuevos son efímeros. Conmutar a Supabase real con el flag `AUTH_MODE` en `src/lib/auth-mode.ts`; al conectarlo, retirar el módulo `src/lib/mock/auth-server.ts` y sus ramas `isMockAuth()`.
- **Con Supabase (`AUTH_MODE = 'supabase'`)**: `/app/*` usa **Supabase Auth** (email+password + magic link recovery) integrado vía `@supabase/ssr` en `src/hooks.server.ts`. No hay Basic Auth gate.
- Cada request crea `event.locals.supabase` (cliente SSR con cookies). `event.locals.safeGetSession()` valida sesión contra el servidor (`getUser()`) tras leer las cookies (`getSession()`); nunca se confía solo en cookies para auth checks.
- SEO: cualquier respuesta de `/app*` lleva la cabecera `X-Robots-Tag: noindex, nofollow` (los motores no indexan).
- **Browse sin login**: `/app`, `/app/anuncios`, `/app/comunidad`, `/app/mapa`, `/app/anuncio/:id` son públicos (espec del wireframe). Las acciones de escritura (publicar, chatear, crear deseo, guardar) requieren sesión y deben redirigir a `/app/login?next=...` cuando el `safeGetSession()` devuelve `user: null`.
- **RLS**: cada tabla (`profiles`, `categories`, `listings`, `listing_images`) lleva RLS desde la migración que la crea. Storage `listing-images` con policies que validan `auth.uid()::text = (storage.foldername(name))[1]`. Ver [docs/db/AGENTS.md](docs/db/AGENTS.md) y [docs/db/schema-app.md](docs/db/schema-app.md).
- **Resend SMTP pre-prod** (checklist cuando abramos beta):
  - [ ] Supabase `Authentication` → `Providers` → `Email` → **Enable Custom SMTP** con credenciales Resend (`smtp.resend.com:465`)
  - [ ] Personalizar `Confirm signup`, `Magic link`, `Reset password` templates con branding Botanic
  - [ ] Sender email: `noreply@botanicapp.es` (DNS DKIM ya configurado en Resend)
- **Nunca commitear** `.env*` con valores reales (`.gitignore` debe incluirlos). Las claves Supabase viven en `.env.local` (local) y en el dashboard del host (producción).