# Módulo — Chat

## Propósito

Permitir comunicación directa entre usuarios, inicialmente vinculada al marketplace P2P.

## Vistas MVP

- `/app/chat` — lista de conversaciones.
- `/app/chat/:id` — conversación individual.
- `/app/chat/nuevo/:usuarioId` — iniciar nueva conversación (típicamente desde el detalle de un anuncio).
- `/app/chat/:id/compartir/:anuncioId` — compartir un anuncio dentro de una conversación.

Inventario completo en [ROUTES.md](ROUTES.md).

## Flujos principales

### Desde un anuncio

Detalle de anuncio → Contactar → conversación.

### Desde una conversación

Conversación → referencia a anuncio compartido → detalle del anuncio.

## Comportamiento en el wireframe

Representar mensajes, estados de conversación y acciones de envío con datos simulados. No implementar mensajería en tiempo real todavía.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Lista de conversaciones y chat deben funcionar en escritorio y móvil. Considerar layout de dos paneles en escritorio (lista a la izquierda, conversación a la derecha).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
