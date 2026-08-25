# App — Contexto del módulo (wireframe funcional)

Documentación funcional y de navegación de la webapp de Botanic. Fuente canónica de producto → [PRODUCT.md](../../PRODUCT.md); design system → [DESIGN.md](../../DESIGN.md) (se aplica **después** del wireframe neutro); estado técnico y routing → [docs/web/AGENTS.md](../web/AGENTS.md); planificación → [PLAN.md](../../PLAN.md).

## Estado

| Área | Estado | Notas |
|---|---|---|
| Wireframe neutro | 🔶 En construcción | Hito actual: rutas navegables con shadcn-svelte base |
| Design system | 🔶 Pendiente | Se aplica después sobre el wireframe sin tocar estructura |
| Lógica de negocio | 🔴 Pendiente | No implementar en esta fase |

## Documentación del módulo

| Doc | Contenido |
|---|---|
| [README.md](README.md) | Índice, principios y convenciones de slugs |
| [AGENT_PROMPT.md](AGENT_PROMPT.md) | Prompt principal para el agente |
| [VISION.md](VISION.md) | Visión funcional general |
| [ROADMAP.md](ROADMAP.md) | Alcance MVP / MPL / futuro |
| [NAVIGATION.md](NAVIGATION.md) | Navegación global y reglas de acceso |
| [ROUTES.md](ROUTES.md) | Inventario de rutas y flags MVP |
| [ENTITIES.md](ENTITIES.md) | Entidades funcionales y relaciones |
| [p2p-marketplace.md](p2p-marketplace.md) | Marketplace P2P (anuncios) |
| [wishlist.md](wishlist.md) | Deseos, coincidencias y alertas |
| [community.md](community.md) | Publicaciones e hilos |
| [chat.md](chat.md) | Mensajería |
| [notifications.md](notifications.md) | Centro de notificaciones |
| [auth.md](auth.md) | Autenticación |
| [profile.md](profile.md) | Perfil propio y público |
| [settings.md](settings.md) | Ajustes |
| [botanic-market.md](botanic-market.md) | Botanic Market (futuro) |
| [cross-cutting.md](cross-cutting.md) | Responsive, scroll horizontal, GPS, búsqueda, imágenes, permisos, estados |

## Reglas específicas

- **Wireframe primero, estilos después.** Esta fase usa shadcn-svelte base sin estilos custom. El design system global se aplica en una fase posterior sin modificar la estructura.
- **Todas las rutas con prefijo `/app/`** y slugs en español (sin tildes, sin eñes, sin artículos). Excepciones universales: `login`, `chat`, `market` (Botanic Market).
- **Browse sin login en `/app`.** La raíz del marketplace, anuncios, comunidad, mapa y detalle son públicos. Las acciones de escritura requieren autenticación y deben mostrar el estado "no autenticado" cuando aplique.
- **Acceso en producción**: en `src/hooks.server.ts` hay un gate de **Basic Auth** que protege `/app/*` con la variable `APP_PASSWORD` (fallback hardcodeado). Ver [AGENTS.md § Seguridad — protección de `/app` en producción](../../AGENTS.md#seguridad--protección-de-app-en-producción) para rotación y comportamiento SEO.
- **UX sobre UI.** Adaptación impecable a escritorio y móvil (estilo Wallapop). Detalle en [cross-cutting.md § Responsive](cross-cutting.md#responsive).
- **Scroll horizontal sin barra visible.** Flechas en escritorio, gesto natural en móvil. Detalle en [cross-cutting.md § Scroll horizontal sin barra visible](cross-cutting.md#scroll-horizontal-sin-barra-visible).

## Skills aplicables

- `impeccable` — cuando llegue la fase de aplicar design system (no antes).
- `svelte-code-writer` / `svelte-core-bestpractices` — implementación de componentes Svelte 5.
- `shadcn-svelte` — para incorporar componentes base vía CLI.
- `tailwind-4-docs` — utilidades responsive (`sm`, `md`, `lg`, `xl`).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
