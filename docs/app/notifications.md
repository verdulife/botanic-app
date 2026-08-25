# Módulo — Notificaciones

## Propósito

Centralizar eventos relevantes para el usuario.

## Fuentes MVP

- Coincidencia con un deseo.
- Nuevo mensaje de chat.
- Actividad relacionada con una interacción de comunidad (respuesta a una publicación propia).

## Comportamiento

La notificación debe poder abrir el recurso asociado cuando exista:

- Deseo → coincidencia → detalle del anuncio.
- Chat → conversación directa.
- Comunidad → hilo.

El centro de notificaciones (`/app/notificaciones`) es una vista independiente y accesible desde cualquier área.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Lista de notificaciones debe funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
