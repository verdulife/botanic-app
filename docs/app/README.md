# Botanic — Documentación funcional del wireframe

Esta carpeta define la **estructura funcional y de navegación** del wireframe de Botanic, sin entrar en stack, arquitectura, base de datos ni APIs (esos aspectos viven en otros docs).

## Objetivo

Servir como contexto modular para agentes de desarrollo. El agente debe poder leer solo los documentos necesarios para la tarea actual.

## Principios

- Botanic parte de un **core MVP** y busca un **Minimum Product Lovable (MPL)**.
- Todas las vistas existen como rutas reales, aunque algunas estén marcadas `MVP: false`.
- **Fase actual: wireframe neutro.** Primero se construye un wireframe navegable con componentes base de shadcn-svelte, sin estilos propios. Después se aplica el design system global (ver [DESIGN.md](../../DESIGN.md)). Esta separación facilita el update visual sin tocar la estructura.
- El wireframe debe poder recorrerse como un prototipo navegable dentro de la aplicación web (`src/routes/app/**`).
- Las funcionalidades no MVP se muestran como parte del producto y pueden usar placeholders explícitos (ej. "Aquí irá el mapa", "Aquí irá el sistema de chat").

## Convenciones de slugs

Todas las rutas tienen el prefijo `/app/`. Los slugs van **en español, sin tildes, sin eñes y sin artículos** (`/app/anuncios`, no `/app/anúncios` ni `/app/el-anuncio`).

**Excepciones universales en inglés** (estándar web): `/app/login`, `/app/chat`, `/app/market` (reservado para Botanic Market futuro).

| Tipo | Forma |
|---|---|
| Listado (plural) | `/app/anuncios`, `/app/deseos`, `/app/comunidad` |
| Detalle (singular) | `/app/anuncio/:id`, `/app/deseo/:id`, `/app/hilo/:id` |
| Acciones | Verbo en infinitivo: `/app/publicar`, `/app/registro`, `/app/bienvenida` |
| Mi cuenta | `/app/mis-anuncios`, `/app/mis-publicaciones`, `/app/guardados` |

Inventario completo y definitivo en [ROUTES.md](ROUTES.md).

## Documentos

| Doc | Contenido |
|---|---|
| [AGENT_PROMPT.md](AGENT_PROMPT.md) | Prompt principal para el agente |
| [VISION.md](VISION.md) | Definición funcional general |
| [ROADMAP.md](ROADMAP.md) | Alcance MVP / MPL / futuro |
| [NAVIGATION.md](NAVIGATION.md) | Navegación global, 4 destinos principales y reglas de acceso |
| [ROUTES.md](ROUTES.md) | Inventario completo de rutas y flags MVP |
| [ENTITIES.md](ENTITIES.md) | Entidades funcionales y relaciones |
| [p2p-marketplace.md](p2p-marketplace.md) | Compra/venta entre usuarios (anuncios) |
| [wishlist.md](wishlist.md) | Deseos, coincidencias y alertas |
| [community.md](community.md) | Publicaciones e hilos |
| [chat.md](chat.md) | Mensajería entre usuarios |
| [notifications.md](notifications.md) | Centro de notificaciones |
| [auth.md](auth.md) | Registro, login y recuperación |
| [profile.md](profile.md) | Perfil propio y perfiles públicos |
| [settings.md](settings.md) | Ajustes de usuario |
| [botanic-market.md](botanic-market.md) | Marketplace profesional (futuro) |
| [cross-cutting.md](cross-cutting.md) | Responsive, scroll horizontal, GPS, búsqueda, imágenes, permisos, estados globales |

## Regla para el agente

Antes de implementar una vista o módulo, localizar en [ROUTES.md](ROUTES.md) la ruta correspondiente y seguir las referencias al documento funcional específico. No cargar documentación innecesaria.

Para contexto transversal: [AGENTS.md](../../AGENTS.md) (raíz), [PRODUCT.md](../../PRODUCT.md) (autoridad de producto), [DESIGN.md](../../DESIGN.md) (autoridad visual — aplicar **solo después** del wireframe neutro).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
