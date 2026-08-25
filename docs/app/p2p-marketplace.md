# Module — P2P Marketplace

## Purpose

Permitir la compraventa entre particulares de plantas y productos relacionados.

## Core views

- Feed de publicaciones cercanas.
- Resultados de búsqueda.
- Búsqueda por mapa.
- Detalle de publicación.
- Crear publicación.
- Mis publicaciones.

## Discovery modes

### Lista

El usuario explora publicaciones ordenadas por proximidad o por el criterio seleccionado.

### Mapa

El usuario explora geográficamente publicaciones disponibles y puede seleccionar una para abrir su detalle.

El wireframe representa el mapa mediante un placeholder; no implementar integración cartográfica todavía.

## Detail

Debe representar, como mínimo:

- imágenes;
- título;
- información descriptiva;
- ubicación aproximada;
- precio, cuando aplique;
- información básica del vendedor;
- acción para iniciar contacto por chat.

## Create listing

Debe contener los campos necesarios para representar una futura publicación, incluyendo imágenes, título, descripción, precio y ubicación.

La implementación inicial puede ser visual y no persistir datos.

## Location

El P2P utiliza ubicación para descubrimiento y búsqueda. El usuario debe poder conceder, rechazar o revisar su configuración de ubicación.
