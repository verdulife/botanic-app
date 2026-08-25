# Botanic — Functional Product Documentation

Esta carpeta define exclusivamente la **estructura funcional y de navegación** de Botanic.

No define stack, arquitectura técnica, base de datos, APIs ni decisiones visuales finales. Esos aspectos ya están definidos fuera de esta documentación.

## Objetivo

Servir como contexto modular para agentes de desarrollo. El agente debe poder leer solo los documentos necesarios para la tarea actual.

## Principios

- Botanic parte de un **core MVP** y busca un **Minimum Product Lovable (MPL)**.
- Todas las vistas deben existir como rutas reales, aunque algunas estén marcadas `MVP: false`.
- El wireframe inicial debe ser navegable, pero sin implementar todavía la lógica de negocio.
- Las funcionalidades no MVP deben mostrarse como parte del producto y pueden utilizar placeholders.
- La navegación debe reflejar el producto final previsto, no únicamente el MVP.

## Documentos

- `AGENT_PROMPT.md` — prompt principal para el agente.
- `VISION.md` — definición funcional general.
- `ROADMAP.md` — alcance MVP / MPL / futuro.
- `NAVIGATION.md` — navegación global y reglas de acceso.
- `ROUTES.md` — inventario completo de rutas y flags MVP.
- `ENTITIES.md` — entidades funcionales y relaciones.
- `modules/p2p-marketplace.md` — compra/venta entre usuarios.
- `modules/wishlist.md` — deseos y alertas de búsqueda.
- `modules/community.md` — preguntas, respuestas e hilos.
- `modules/chat.md` — mensajería entre usuarios.
- `modules/notifications.md` — centro de notificaciones.
- `modules/auth.md` — registro, login y recuperación.
- `modules/profile.md` — perfil propio y perfiles públicos.
- `modules/settings.md` — ajustes de usuario.
- `modules/botanic-market.md` — marketplace profesional, actualmente futuro.
- `modules/cross-cutting.md` — GPS, búsqueda, imágenes, permisos y estados compartidos.

## Regla para el agente

Antes de implementar una vista o módulo, localizar en `ROUTES.md` la ruta correspondiente y seguir las referencias al documento funcional específico. No cargar documentación innecesaria.
