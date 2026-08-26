# Botanic — Contexto global para el agente

Marketplace P2P de plantas entre particulares + **Deseos** (wishlist), **Comunidad**, **El Market de Botanic**. PWA; coste objetivo 0 €. Stack: TypeScript · Dart (fase 2) · bun · sin add-ons. Autoridad producto → [PRODUCT.md](PRODUCT.md); planificación → [PLAN.md](PLAN.md); diseño → [DESIGN.md](DESIGN.md); técnica → [architecture.md](architecture.md). **Carga selectiva**: este es el único contexto transversal (docs, planning, brand); los AGENTS.md de módulo se cargan solo si la tarea cae dentro del módulo.

## Documentación raíz

| Doc | Rol | Ubicación |
|---|---|---|
| README | Setup local + portada | [README.md](README.md) |
| PRODUCT | Claim, target, brand voice (autoridad producto) | [PRODUCT.md](PRODUCT.md) |
| PLAN | Fases, sprints, KPIs, backlog | [PLAN.md](PLAN.md) |
| DESIGN | Design system (autoridad visual global) | [DESIGN.md](DESIGN.md) |
| architecture | Stack, diagrama, costes, hosting | [architecture.md](architecture.md) |

## Módulos

Cada AGENTS.md de módulo es autocontenido, enlaza de vuelta aquí y a PRODUCT/DESIGN sin duplicar contenido.

| Módulo | Ámbito | AGENTS.md |
|---|---|---|
| web | Landing + blog (hecho) + web app marketplace (wireframe en curso) — SvelteKit | [docs/web/AGENTS.md](docs/web/AGENTS.md) |
| app | Wireframe funcional de la web app (rutas, entidades, navegación, UX cross-cutting) | [docs/app/AGENTS.md](docs/app/AGENTS.md) |
| email | Transaccionales (waitlist, hecho) + campaña (pendiente) — Resend | [docs/email/AGENTS.md](docs/email/AGENTS.md) |
| db | Supabase — waitlist (hecho) + schema app (pendiente) | [docs/db/AGENTS.md](docs/db/AGENTS.md) |
| flutter | App nativa (fase 2, pendiente) | [docs/flutter/AGENTS.md](docs/flutter/AGENTS.md) |
| product | Mercado, monetización, difusión (contexto de negocio) | [docs/product/AGENTS.md](docs/product/AGENTS.md) |

## Skills (opencode)

| Skill | Para qué | SKILL.md |
|---|---|---|
| impeccable | Diseño/redesign UI, auditoría visual, design system | [.opencode/skills/impeccable/SKILL.md](.opencode/skills/impeccable/SKILL.md) |
| shadcn-svelte | Componentes shadcn para Svelte — CLI, composición, estilos | [.opencode/skills/shadcn-svelte/SKILL.md](.opencode/skills/shadcn-svelte/SKILL.md) |
| svelte-code-writer | Guía de escritura de código Svelte 5 idiomático | [.opencode/skills/svelte-code-writer/SKILL.md](.opencode/skills/svelte-code-writer/SKILL.md) |
| svelte-core-bestpractices | Buenas prácticas del core de Svelte 5 (runes, snippets) | [.opencode/skills/svelte-core-bestpractices/SKILL.md](.opencode/skills/svelte-core-bestpractices/SKILL.md) |
| tailwind-4-docs | Snapshot de Tailwind v4 — utilities, variants, config, migración v3→v4 | [.opencode/skills/tailwind-4-docs/SKILL.md](.opencode/skills/tailwind-4-docs/SKILL.md) |

## Subagentes

| Agente | Para qué | AGENT.md |
|---|---|---|
| visual-eval | Audita assets de stock contra la escena (modelo `opencode-go/qwen3.7-plus`). **Nunca** audita renders propios (verificación humana). Carril social retirado ago 2026; se conserva para uso futuro. | [.opencode/agents/visual-eval.md](.opencode/agents/visual-eval.md) |

## Cómo mantener los docs

| Doc | Trigger | Acción |
|---|---|---|
| `README.md` | Setup local cambia | Editar pasos; verificar `bun install` desde cero |
| `PRODUCT.md` | Claim, target o brand commitment cambia | Reautorizar manualmente (autoridad producto) |
| `PLAN.md` | Tarea se completa | Marcar `[x]`; no mover texto fuera del doc |
| `DESIGN.md` | Token o componente global cambia | Reautorizar (autoridad visual) |
| `architecture.md` | Stack, hosting o coste cambia | Actualizar diagrama + tabla de costes |
| `AGENTS.md` raíz | Convención transversal nueva | Añadir regla en "Reglas de trabajo"; revisar AGENTS.md de módulos |
| `docs/<módulo>/AGENTS.md` | Regla específica del módulo cambia | Editar; mantener enlace de vuelta a raíz |
| `docs/<módulo>/*.md` (técnicos) | Feature o decisión del módulo cambia | Editar; añadir regla en "Reglas específicas" si aplica |
| `docs/email/deliverability-log.md` | Incidencia de entregabilidad | Append-only (nunca reescribir entradas previas) |

**Plantilla in-file** (al final de cualquier doc técnico que no sea autoridad):

```markdown
> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](AGENTS.md#cómo-mantener-los-docs).
```

## Reglas de trabajo (globales)

- **Paso a paso + hitos verificables**: en tareas grandes, parar tras cada hito y reportar. No iniciar el siguiente sin OK.
- **Antes de commit/push** (explícito del usuario): docs afectados actualizados (raíz + módulo + PLAN/PRODUCT/DESIGN si aplica). El usuario pide el commit; nunca automático.
- **Engram** complementa docs: docs = verdad canónica; Engram = contexto privado entre sesiones.
- **Sistema de diseño**: [DESIGN.md](DESIGN.md) es autoridad visual global — landing, blog, webapp, emails, og-image, futura app Flutter.

## Seguridad — credenciales MCP

- Tokens OAuth (Supabase, Resend) en `.opencode/*-auth.json` — **por máquina**, no por repo. `.gitignore` los excluye (`*-auth.json` + entrada explícita).
- **Re-autenticar** en cada clon / cambio de máquina (`/supabase auth login`). Nunca copies `*-auth.json` entre máquinas.
- **¿Credencial filtrada?** → revocar el grant en el dashboard del proveedor. Revocación server-side invalida cualquier copia.
- `opencode.json` contiene config del tool (URLs MCP, plugins), **no secretos**. Si ves secretos ahí, muévelos al `*-auth.json` correspondiente.

## Seguridad — autenticación y autorización en `/app`

- `/app/*` usa **Supabase Auth** (email+password + magic link recovery) integrado vía `@supabase/ssr` en `src/hooks.server.ts`. No hay Basic Auth gate.
- Cada request crea `event.locals.supabase` (cliente SSR con cookies). `event.locals.safeGetSession()` valida sesión contra el servidor (`getUser()`) tras leer las cookies (`getSession()`); nunca se confía solo en cookies para auth checks.
- SEO: cualquier respuesta de `/app*` lleva la cabecera `X-Robots-Tag: noindex, nofollow` (los motores no indexan).
- **Browse sin login**: `/app`, `/app/anuncios`, `/app/comunidad`, `/app/mapa`, `/app/anuncio/:id` son públicos (espec del wireframe). Las acciones de escritura (publicar, chatear, crear deseo, guardar) requieren sesión y deben redirigir a `/app/login?next=...` cuando el `safeGetSession()` devuelve `user: null`.
- **RLS**: cada tabla (`profiles`, `categories`, `listings`, `listing_images`) lleva RLS desde la migración que la crea. Storage `listing-images` con policies que validan `auth.uid()::text = (storage.foldername(name))[1]`. Ver [docs/db/AGENTS.md](docs/db/AGENTS.md) y [docs/db/schema-app.md](docs/db/schema-app.md).
- **Resend SMTP pre-prod** (checklist cuando abramos beta):
  - [ ] Supabase `Authentication` → `Providers` → `Email` → **Enable Custom SMTP** con credenciales Resend (`smtp.resend.com:465`)
  - [ ] Personalizar `Confirm signup`, `Magic link`, `Reset password` templates con branding Botanic
  - [ ] Sender email: `noreply@botanicapp.es` (DNS DKIM ya configurado en Resend)
- **Nunca commitear** `.env*` con valores reales (`.gitignore` debe incluirlos). Las claves Supabase viven en `.env.local` (local) y en el dashboard del host (producción).