# Módulo — Deseos (Wishlist)

## Propósito

Permitir que el usuario indique qué está buscando y convertir esa necesidad en una alerta activa.

## Flujo

1. Entrar en Deseos.
2. Ver deseos existentes.
3. Crear un deseo.
4. El sistema muestra coincidencias existentes, cuando existan.
5. El usuario puede activar una alerta.
6. El usuario recibe una notificación cuando aparece un anuncio compatible.

## Vistas

- `/app/deseos` — lista de deseos.
- `/app/deseos/nuevo` — crear deseo.
- `/app/deseo/:id` — detalle de deseo.
- `/app/deseo/:id/coincidencias` — anuncios que encajan.
- `/app/deseo/:id/alerta` — configuración de alerta (on/off, frecuencia, canales).

Inventario completo en [ROUTES.md](ROUTES.md).

## Criterios del deseo

Al crear un deseo se pueden definir:

- **Palabras clave** (texto libre).
- **Categoría** (semillas, esquejes, plantas, tiestos, accesorios).
- **Rango de precio** (mínimo y máximo, opcional).
- **Ubicación** (radio o zona).
- **Estado** (activo / en pausa).

Detalle de la entidad en [ENTITIES.md](ENTITIES.md#deseo).

## Coincidencias

El wireframe debe representar un estado de "matching" mediante contenido simulado (anuncios de ejemplo). No implementar todavía el motor real de coincidencias.

Las coincidencias se muestran como notificaciones y también en `/app/deseo/:id/coincidencias`.

## Alertas

Una alerta activa sobre un deseo genera notificaciones cuando aparece un anuncio que encaja con sus criterios. En el wireframe, las alertas se representan como un toggle on/off y un selector de canal simulado.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Lista, creación y detalle deben funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
