# Módulo — Comunidad

## Propósito

Crear una comunidad de preguntas y respuestas sobre plantas, jardinería y huerto. Formato estilo Reddit: cada publicación es un hilo que admite respuestas.

## Vistas

- `/app/comunidad` — feed principal.
- `/app/comunidad/buscar` — búsqueda (no MVP).
- `/app/comunidad/publicar` — crear publicación o pregunta.
- `/app/hilo/:id` — publicación + respuestas.
- `/app/hilo/:id/responder` — formulario de respuesta.
- `/app/mis-publicaciones` — publicaciones propias del usuario.

Inventario completo en [ROUTES.md](ROUTES.md).

## Modelo de contenido

- **Publicación** — unidad raíz. Tiene título, cuerpo, autor, fecha, categoría (opcional) y un conjunto de respuestas.
- **Hilo** — vista que combina una publicación y todas sus respuestas. La URL canónica del hilo es `/app/hilo/:id`.

Detalle de las entidades en [ENTITIES.md](ENTITIES.md).

## Flujo principal

1. Usuario entra en Comunidad.
2. Explora el feed o usa la búsqueda.
3. Crea una publicación / pregunta.
4. Otros usuarios abren el hilo y responden.

Una publicación de comunidad debe poder abrirse directamente desde una notificación o un enlace compartido.

## Alcance

El MVP se centra en texto y estructura básica de preguntas/respuestas. Moderación avanzada, votos, comunidades temáticas y capacidades sociales adicionales quedan fuera del core.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Feed, hilo y creación deben funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
