# Módulo — Perfil

## Vistas

- `/app/perfil` — mi perfil (autenticado).
- `/app/perfil/editar` — editar mi perfil.
- `/app/perfil/:usuarioId` — perfil público de otro usuario.

Inventario completo en [ROUTES.md](ROUTES.md).

## Relación con P2P

El perfil público debe poder abrirse desde un anuncio (tocar el nombre del vendedor) o desde una conversación.

## Alcance

El MVP necesita identidad básica del usuario (avatar, nombre, ubicación aproximada, anuncios activos) y navegación hacia sus áreas propias. Reputación avanzada, valoraciones y badges pueden quedar fuera del core inicial.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Perfil propio y público deben funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
