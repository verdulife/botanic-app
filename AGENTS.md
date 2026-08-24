## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: ninguno

---

# Botanic — Contexto para el agente

Botanic es el marketplace P2P de plantas entre particulares, con **Deseos** (wishlist supervitaminada), **Comunidad** y **El Market de Botanic** como módulos adyacentes. Lanzamiento como PWA; coste objetivo 0 €.

Tagline canónico y brand voice: [PRODUCT.md](PRODUCT.md). Plan y sprints: [PLAN.md](PLAN.md).

## Índice de documentación

- [README.md](README.md) — portada del proyecto
- [PRODUCT.md](PRODUCT.md) — claim, target, capacidades, brand commitments
- [PLAN.md](PLAN.md) — fases, sprints, KPIs, categorías, backlog
- [DESIGN.md](DESIGN.md) — design system (autoridad global)
- [architecture.md](architecture.md) — stack, DB schema, estructura del proyecto

Producto (detalle):

- [docs/mercado.md](docs/mercado.md) — mercado y competencia
- [docs/monetizacion.md](docs/monetizacion.md) — planes e ingreso
- [docs/difusion.md](docs/difusion.md) — canales y táctica

Técnico (operativo):

- [docs/pwa.md](docs/pwa.md) — PWA
- [docs/blog.md](docs/blog.md) — blog (carril SEO)
- [docs/email-deliverability.md](docs/email-deliverability.md) — auditoría email
- [docs/images-credits.md](docs/images-credits.md) — atribución de fotos

Autónomos:

- [press/README.md](press/README.md) — dossier de prensa (*pendiente de regeneración*)

## Reglas de trabajo

- **Paso a paso**: dividir el trabajo en pasos pequeños y verificables, detectando problemas temprano.
- **Hitos verificables**: en tareas grandes, trabajar por hitos y **parar tras cada uno** para reportar. No iniciar el siguiente sin confirmación del usuario.
- **Antes de commit/push**: actualizar docs ([PLAN.md](PLAN.md), [PRODUCT.md](PRODUCT.md), [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md)) si el cambio de código los ha dejado desactualizados. El usuario debe pedir el commit explícitamente.
- **Engram** (memoria del agente): complementario a los docs. Los docs son fuente de verdad canónica; Engram guarda contexto privado de sesión (gotchas, decisiones informales) entre sesiones.
- **Sistema de diseño**: [DESIGN.md](DESIGN.md) es autoridad global. Todo contenido visual (landing, blog, emails, og-image) debe respetarlo.

## Subagentes

- **`@visual-eval`** (`.opencode/agents/visual-eval.md`, modelo `opencode-go/qwen3.7-plus`): audita assets de stock (fotos o clips) — verifica que encajan con el contexto de la escena. El pipeline social que lo usaba (Remotion/Pexels) fue retirado en ago 2026; el agente se conserva para futuro uso con stock. **Nunca** auditar renders propios: la verificación de calidad de lo generado es humana (parar y preguntar).