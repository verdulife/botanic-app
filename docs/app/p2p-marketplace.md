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

### Cuidados de la planta

Cuando el anuncio es de una planta con especie identificada, el detalle muestra una
caja de cuidados (entre la ubicación y el vendedor) con 3 celdas:

- **Riego** y **Luz**: 1/2/3 iconos (gotas / soles) rellenos según el nivel, con el resto
  de iconos en gris sutil.
- **Toxicidad**: solo texto neutro (sin color) con 3 posibilidades: `No`, `Sí`, `Mascotas`.

El dataset de cuidados vive en `src/lib/mock/plant-care.ts` y, post-wireframe, en la tabla
`plant_care` de Supabase (ver [architecture.md](../../architecture.md) "Identificación y
cuidados de plantas"). Si no hay datos para la especie, la caja se oculta.

### Ayuda (IA + comunidad)

Debajo de la descripción hay una caja "¿Dudas? Resuélvelas al momento" con dos botones en
línea y neutros (sin preferencia visual), comunidad primero:

- **Comunidad** → `/app/comunidad`.
- **Preguntar a la IA** → abre Perplexity con un **prompt contextual** prehhecho: incluye
  precio (regalo/cambio/precio), ubicación y categoría, pide a la IA evaluar si es una buena
  compra (contrastando precios habituales, qué revisar antes) y, en plantas, añade una guía
  breve de cuidados.

### Acciones sobre la imagen

Sobre la galería (fija, no se desplaza con el slider) dos botones apilados a la derecha:

- **Guardar en favoritos** (corazón, toggle) — requiere login post-wireframe.
- **Compartir** — Web Share API, con fallback a portapapeles.

El galería es un carrusel deslizable (imagen 4:5, dots como indicador no-navegación).


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
