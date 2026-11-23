# Botanic — contexto del proyecto

Este documento es un índice y un conjunto de reglas. Cada pregunta se responde donde vive:

| Pregunta | Dónde |
|---|---|
| Qué es Botanic, a quién habla y con qué voz | [PRODUCT.md](PRODUCT.md) |
| Cómo está construido: stack, límites y verificación | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Cómo se ve: tokens, tipografía, forma, movimiento y reglas visuales | [DESIGN.md](DESIGN.md) |
| Qué ven los visitantes humanos | [README.md](README.md) |
| Qué está construido | El código |

**Carga selectiva.** Este es el único contexto transversal. Los `AGENTS.md` de módulo se cargan solo si la tarea cae dentro de ese módulo. Si un documento de módulo no cuadra con el código, manda el código.

## Módulos

Cada `AGENTS.md` de módulo es autocontenido y enlaza de vuelta aquí.

| Módulo | Área | AGENTS.md |
|---|---|---|
| web | Landing, blog y app web — SvelteKit | [docs/web/AGENTS.md](docs/web/AGENTS.md) |
| app | Rutas, entidades, navegación y UX cross-cutting | [docs/app/AGENTS.md](docs/app/AGENTS.md) |
| db | Esquema, migraciones y políticas de Supabase | [docs/db/AGENTS.md](docs/db/AGENTS.md) |
| email | Transaccionales y campañas con Resend | [docs/email/AGENTS.md](docs/email/AGENTS.md) |
| flutter | App nativa | [docs/flutter/AGENTS.md](docs/flutter/AGENTS.md) |
| product | Mercado, monetización y difusión | [docs/product/AGENTS.md](docs/product/AGENTS.md) |

## Skills

Viven en `.pi/skills/` y se cargan solas cuando la tarea encaja con su disparador.

| Skill | Para qué | SKILL.md |
|---|---|---|
| shadcn-svelte | Componentes shadcn: CLI, composición, estilos, tema desde DESIGN.md | [.pi/skills/shadcn-svelte/SKILL.md](.pi/skills/shadcn-svelte/SKILL.md) |
| svelte-code-writer | Documentación y análisis de código Svelte 5 | [.pi/skills/svelte-code-writer/SKILL.md](.pi/skills/svelte-code-writer/SKILL.md) |
| svelte-core-bestpractices | Runes, snippets y patrones del core de Svelte 5 | [.pi/skills/svelte-core-bestpractices/SKILL.md](.pi/skills/svelte-core-bestpractices/SKILL.md) |
| tailwind-4-docs | Guía curada de Tailwind v4: playbook, trampas y migración | [.pi/skills/tailwind-4-docs/SKILL.md](.pi/skills/tailwind-4-docs/SKILL.md) |
| modern-web-guidance | Plataforma web con datos de Baseline: dialogs, formularios, a11y, CWV | [.pi/skills/modern-web-guidance/SKILL.md](.pi/skills/modern-web-guidance/SKILL.md) |

## MCP

Los servidores están declarados en `.pi/mcp.json`: Supabase (esquema, SQL, migraciones y advisors) y Resend (dominios, plantillas y broadcasts) por OAuth, y Context7 para documentación de librerías. La autenticación es por máquina, con `/mcp login <nombre>`.

## Cómo se trabaja

- **Paso a paso con hitos verificables**: en tareas grandes, parar tras cada hito y reportar.
- **Servidor de desarrollo**: siempre en segundo plano, nunca en primer plano; se para al terminar la verificación.
- **Verificación antes de cerrar**: `pnpm check` para tipos, `pnpm build` para producción y `pnpm design:check` cuando se toca UI. Qué comprueba cada uno, en [ARCHITECTURE.md](ARCHITECTURE.md).
- **Sistema de diseño**: [DESIGN.md](DESIGN.md) es la fuente de verdad visual. Un valor nuevo entra ahí primero, y después al código.
- **Plataforma**: el suelo lo pone el stack. Por encima, Baseline Widely available como margen de seguridad; si una función del navegador no lo es, se aplican las guías de fallback de `modern-web-guidance`, y si no hay fallback limpio se avisa y se decide.
- **Ámbito**: la regla es para features del navegador. El framework y la librería de componentes no se someten a Baseline, porque no son plataforma.
- **Nada de cifras inventadas**: ni usuarios, ni testimonios, ni métricas.

## Cómo mantener los docs

- **Lo que el código ya expresa no se registra.** Pantallas, tablas, módulos, piezas de producto y estado: se leen del código.
- **Un hecho, un solo hogar.** Si algo aparece en dos sitios, se queda en el que corresponde y el otro enlaza.
- **Lo que envejece no entra.** Versiones exactas, estado del despliegue y listas de tareas se leen de `package.json` o del plan del humano.
- **Aquí se escribe el cómo, no el qué.** El alcance y el orden son del humano.

## Seguridad

**Credenciales MCP**

- Los servidores MCP se declaran en `.pi/mcp.json`: solo URL y paquete, nunca secretos.
- Supabase y Resend piden OAuth por máquina. Se re-autentica en cada clon o cambio de máquina, y nunca se copian credenciales entre máquinas.
- Si una credencial se filtra, se revoca el grant en el dashboard del proveedor: la revocación server-side invalida cualquier copia.
- **Nunca commitear** un `.env*` con valores reales. Las claves viven en `.env.local` y en el dashboard del host.

**Reglas de `/app`**

- Hay dos modos de autenticación, y `AUTH_MODE` en `src/lib/auth-mode.ts` conmuta entre ellos.
- Con el modo real, la sesión se valida siempre contra el servidor, nunca solo con cookies.
- Las cuentas de prueba viven en `.mock-auth/`, que está gitignored y no se commitea.
- Cualquier respuesta de `/app*` lleva `X-Robots-Tag: noindex, nofollow`.
- Navegar es público; escribir exige sesión y redirige a `/app/login?next=...`.
- El detalle de la autenticación, las RLS y el Storage está en [docs/app/auth.md](docs/app/auth.md) y [docs/db/AGENTS.md](docs/db/AGENTS.md).
