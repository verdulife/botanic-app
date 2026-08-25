# Módulo — Marketplace P2P

## Propósito

Permitir la compra, venta, intercambio y regalo de plantas y productos relacionados entre particulares. Es el núcleo del producto.

## Vistas principales

- `/app` — feed de anuncios cercanos (raíz, browse abierto).
- `/app/anuncios` — listado completo.
- `/app/buscar` — resultados de búsqueda.
- `/app/mapa` — exploración geográfica.
- `/app/anuncio/:id` — detalle.
- `/app/publicar` — crear anuncio.
- `/app/anuncio/:id/editar` — editar anuncio.
- `/app/mis-anuncios` — anuncios propios.
- `/app/guardados` — anuncios guardados.

Inventario completo en [ROUTES.md](ROUTES.md).

## Modos de descubrimiento

### Lista

El usuario explora anuncios ordenados por proximidad o por el criterio seleccionado.

### Mapa

El usuario explora geográficamente los anuncios disponibles y puede tocar uno para abrir su detalle.

El wireframe representa el mapa mediante un placeholder ("Aquí irá el mapa"). No implementar integración cartográfica en esta fase.

## Browse sin login

La raíz `/app`, el listado, el mapa y el detalle de anuncio son públicos. Solo las acciones de escritura (publicar, editar, guardar, contactar) requieren autenticación y deben mostrar el estado "no autenticado" cuando aplique.

## Detalle de anuncio

Debe representar, como mínimo:

- Imágenes.
- Título.
- Descripción.
- Categoría.
- Ubicación aproximada.
- Precio (cuando aplique).
- Información básica del vendedor.
- Acción para iniciar contacto por chat.
- Acción para guardar / quitar de guardados (requiere login).

## Crear anuncio

Debe contener los campos necesarios para representar una futura publicación:

- Imágenes (1–5).
- Título.
- Descripción.
- Categoría.
- Precio (opcional, puede ser gratuito / intercambio).
- Ubicación.

La implementación inicial puede ser visual y no persistir datos.

## Ubicación

El P2P utiliza ubicación para descubrimiento y búsqueda. El usuario debe poder conceder, rechazar o revisar su configuración de ubicación desde `/app/ajustes/ubicacion`.

## Responsive

Aplica la regla global de [cross-cutting.md § Responsive](cross-cutting.md#responsive). Listados, mapa y detalle deben funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
