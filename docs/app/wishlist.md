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

La lista de deseos vive en `/app/deseos` (única fuente de verdad). Se accede
desde la navegación y desde la sección Favoritos (`/app/favoritos`). Incluye
búsqueda en vivo por término (palabras clave, categoría, ubicación).

El detalle (`/app/deseo/:id`) muestra criterios (categoría, presupuesto, dónde),
estado, nº de coincidencias y un toggle funcional de alerta (store `wishes`),
con accesos a coincidencias y configuración de alerta.

Inventario completo en [ROUTES.md](ROUTES.md).

## Criterios del deseo

Al crear un deseo (`/app/deseos/nuevo`) el formulario pide lo mínimo y prellena el resto:

- **Palabras clave** (texto libre, único obligatorio) con autocomplete de `PLANT_TERMS`.
- **Ubicación** en un único autocomplete que cubre todo el alcance jerárquico:
  **todo el país / comunidad autónoma / provincia / ciudad** (datos estáticos en
  `src/lib/mock/locations.ts`). Sin valor prerellenado; vacío = "Todo el país".
- **Avisarme** (toggle, default ON) — el fin del deseo es notificar.
- **Categoría** (opcional, "Cualquiera" por defecto) y **Presupuesto** ("hasta X €", opcional)
  colapsados en "Más opciones".
- **Estado** no se pide: todo deseo nuevo nace `activo`; se pausa desde la lista.

Ambos autocompletes (`AutocompleteInput.svelte`) son **flotantes** (dropdown que no
empuja el contenido, con chevron) y excluyen el **match exacto**: una opción ya
escogida no vuelve a aparecer como sugerencia.

Los deseos se guardan en memoria en `src/lib/stores/wishes.svelte.ts` (patrón
`favorites`); al crear, se prepone y se vuelve a `/app/deseos`. Con Supabase
esto pasa a ser un `insert` real.

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
