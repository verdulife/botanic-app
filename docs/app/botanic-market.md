# Módulo — Botanic Market

## Estado

**MVP: false**. Reservado para fase futura. Slug reservado: `/app/market`.

## Propósito

Marketplace profesional de productos relacionados con plantas y huerto, con experiencia similar a un marketplace de catálogo.

## Vistas preparadas

- `/app/market` — landing / portada.
- `/app/market/buscar` — búsqueda de productos.
- `/app/market/producto/:id` — detalle de producto profesional.

Inventario completo en [ROUTES.md](ROUTES.md).

## Comportamiento actual

La sección debe aparecer en el wireframe como parte del producto futuro, con un placeholder "Próximamente" y enlaces no funcionales.

## Relación con P2P

Cuando Botanic Market esté activo, convivirá con el marketplace P2P como un destino independiente en la navegación principal. Los dos usan **anuncios** como unidad de catálogo (anuncios P2P de particulares / anuncios profesionales de tiendas).

## Afiliados como motor de catálogo (vía de entrada temprana)

Para adelantar el lanzamiento de El Market antes del modelo de tiendas/profesionales
(fase 3), el catálogo puede arrancar como **catálogo afiliado curado** de productos
de plantas y jardinería (Amazon, ManoMano, Leroy Merlin, etc.). Botanic recomienda,
el proveedor vende y paga comisión: sin stock, sin logística, sin pagos integrados,
coste 0.

Detalle técnico y de negocio (proveedores, redes, niveles de implementación
manual/semiautomático/automático, taxonomía y schema DB) en
[../product/afiliados.md](../product/afiliados.md).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
