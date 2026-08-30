# Módulo — Marketplace P2P

## Propósito

Permitir la compra, venta, intercambio y regalo de plantas y productos relacionados entre particulares. Es el núcleo del producto.

## Vistas principales

- `/app` — feed de anuncios cercanos (raíz, browse abierto).
- `/app/anuncios` — listado completo.
- `/app/buscar` — resultados de búsqueda.
- `/app/mapa` — exploración geográfica.
- `/app/anuncio/:slug` — detalle (slug del título + token, estilo Wallapop).
- `/app/publicar` — crear anuncio.
- `/app/anuncio/:slug/editar` — editar anuncio.
- `/app/mis-anuncios` — anuncios propios.
- `/app/favoritos` — anuncios marcados como favoritos, con búsqueda en vivo por término (título, ubicación, categoría, vendedor).

Inventario completo en [ROUTES.md](ROUTES.md).

## Modos de descubrimiento

### Lista

El usuario explora anuncios ordenados por proximidad o por el criterio seleccionado.

### Mapa

El usuario explora geográficamente los anuncios disponibles (Leaflet). El mapa está agrupado **por vendedor**, no por anuncio, para no saturar la vista:

- Cada marker muestra el **avatar** (iniciales), el **nombre**, el **nº de plantas**
  (según los filtros activos) y la **puntuación** del vendedor (★ 1–5, 1 decimal,
  estilo valoraciones de Google).
- Los vendedores se ordenan por **rating descendente** (empate por nº de reviews).
- Si hay más vendedores visibles de los que caben, se muestra un **máximo por nivel
  de zoom** (los mejor valorados) y el resto se agrupa en **chips de vendedores
  ocultos** por zona. El nº de chips también tiene tope; los sobrantes se fusionan
  en el chip vecino más cercano. Al hacer zoom, el mapa se refresca y se revelan
  más vendedores (hasta mostrar todos a zoom alto).
- **Anti-apilado**: las chips no quedan apiladas entre sí ni pegadas a los markers
  de vendedor — al renderizar se resuelven las colisiones en espacio de píxel
  (fusión del par más cercano que `minDistance`) y el chip se aparta del marker con
  un empuje mínimo por el eje de menor penetración (AABB, desplazamiento
  `transform` determinista).
- **Clic en un vendedor** → su perfil público (`/app/perfil/:username`).
- **Clic en un chip** → zoom al grupo (los vendedores se muestran individuales).

El rating es **mock-only** (no persiste en Supabase) mientras no exista el sistema
de reviews real.

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
- Acción para guardar / quitar de favoritos (requiere login).

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

### Deseos del vendedor (anuncios de cambio)

Si el anuncio es de **cambio**, el detalle muestra el bloque **"Está buscando"**
(antes de "Este vendedor también tiene"): scroll horizontal con peek de
los deseos del vendedor, cards **solo texto** (keywords, ubicación, presupuesto;
los deseos no tienen imagen) que enlazan al **perfil del vendedor**. El deseo
elegido como "cambio por" (`listing.wishId`) va primero con el badge "Deseado".

El **perfil público** tiene la sección **"Sus deseos"** (filas de texto con
estado activo/pausado): si es el usuario actual se muestran sus deseos
(`wishes.list`), si no los deseos mock por vendedor en
`src/lib/mock/seller-wishes.ts` (solo algunos vendedores — el resto no muestra
sección). En el perfil propio hay un enlace "Gestionar deseos" → `/app/deseos`.


## Crear anuncio

Debe contener los campos necesarios para representar una futura publicación:

- Imágenes (1–5).
- Título.
- Descripción.
- Categoría.
- Precio (opcional, puede ser gratuito / intercambio).
- Ubicación.

**Implementación (wireframe)**: formulario en `/app/publicar` (P2P-05, reemplaza
el placeholder) en **4 fases** con botones Continuar/Volver y **sin indicador de
progreso**. Al enviar guarda en memoria en
`src/lib/stores/user-listings.svelte.ts` (patrón `wishes`) y muestra una
**pantalla de éxito** ("¡Anuncio publicado!") dentro de la misma ruta con preview
en miniatura y acciones: **Ver mi anuncio**, **Compartir** (Web Share API),
**Publicar otro anuncio** (resetea el formulario) y "Ir a Mis anuncios". El
detalle (`/app/anuncio/:slug`) resuelve primero desde ese store y cae al seed.

1. **Categoría** — título "¿Qué quieres publicar?", grid de las 8 categorías (se
   eliminó "Libros y guías": con "Otros" basta). Si se elige **Plantas** aparece
   el selector de **tamaño** (3 cards: Pequeña/Mediana/Grande) para tenerlo antes
   de crear la descripción. Si la categoría es `plantas` o `esquejes` se activa
   la fase 3 (análisis); si no, se omite (Fotos → Detalles).
2. **Fotos** — `PhotoPicker.svelte` (1–5) del pool local de la categoría
   (`/images/seed/`), primera = portada. Solo representación, sin subida real
   (spec [cross-cutting.md § Imágenes](cross-cutting.md#imágenes)).
3. **Análisis** (solo plantas/esquejes) — `PhotoAnalysis.svelte` muestra la
   portada con una línea de escaneo y "Analizando fotografía…" (spinner centrado)
   durante un **mínimo de 2 s** mientras llama a Pl@ntNet. Resultado: hasta **4
   candidatas** con score (mejor preseleccionada) en una lista estilo Mi Botanic
   + opción "Ninguna de estas"; error → Reintentar + Continuar sin identificar.
   Una vez por portada; volver y cambiar la foto re-lanza.
4. **Detalles** — categoría (recap con "Cambiar") y preview de fotos (carrusel
   swipe con dots, sin contador ni flechas ni thumbnails; borde sutil ring) en
   bloques de bg blanco. Un bloque aparte agrupa **título + descripción** con el
   botón conjunto **"Sugerir con IA"** (rellena ambos en una llamada). La Card
   siguiente: **tipo** multi-select (Vender y Cambiar combinables; Regalar
   exclusivo; precio oculto en Regalar y opcional en Cambiar), **especie**
   (opcional) y **ubicación**. Si el tipo incluye **cambiar**, aparece al final
   el bloque **"¿Qué quieres a cambio?"**: un **acordeón** con "Elegir de mis
   deseos" y "Crear un nuevo deseo" (abrir uno colapsa el otro; bordes sutiles).
   El mini-form del deseo incluye keywords, ubicación, categoría, presupuesto y
   avisarme. El intercambio se guarda en `listing.wishId` y el detalle lo muestra
   ("Cambio por: …").

- **Especie** (`PlantSpecies`, opcional): modelo estructurado mínimo
  (`name` display + `scientific`/`genus`/`family`/`confidence`/`source`) que
  refleja la futura tabla `species`. Autocomplete de `PLANT_TERMS` (manual) o
  rellenada por la fase de análisis.
- **Identificación por IA (Pl@ntNet)**: el análisis autocompleta **título** (si
  vacío), **categoría → Plantas** (solo si no estaba elegida) y **especie**;
  todo es editable. La **descripción no se autocompleta** (decisión: la redacta
  el vendedor o se sugiere con IA). Las fotos webp se convierten a jpeg **en el
  cliente** (Canvas); la clave vive solo en el servidor
  (`src/routes/api/identify-plant/+server.ts`). Detalle del flujo y cuotas en
  [architecture.md § Identificación y cuidados](../../architecture.md#identificación-y-cuidados-de-plantas-híbrido--post-wireframe).
- **Título + descripción con IA (botón conjunto)**: en la fase 4, "Sugerir con IA"
  llama a `src/routes/api/suggest-description/+server.ts`, que genera **título y
  descripción en una sola llamada** con un LLM de tier gratis — **Groq**
  (`GROQ_API_KEY`, modelo `openai/gpt-oss-20b`, `temperature 0.4`,
  `max_completion_tokens 300`, `reasoning_effort: low`, y `response_format:
  json_schema` estricto `{title, description}`) o **Gemini**
  (`GEMINI_API_KEY`, `gemini-2.0-flash`) como fallback. La clave vive solo en el
  servidor. El prompt (plantilla fija) redacta de forma **natural y orgánica**
  usando solo los datos proporcionados (categoría, especie, tamaño si plantas,
  tipo, precio, ubicación, cuidados si los hay): **no inventar**, español
  natural de España, tono cálido sin sonar a tienda, título claro ≤80 caracteres,
  sin emojis/hashtags y sin los caracteres «—» ni «–». El resultado es editable.
- **Categoría Bulbos**: añadida al catálogo mock (`seed-data.ts` + filtros +
  seed). Sin pool de imágenes propio → usa el fallback a `plantas`. El analizador
  no se aplica a bulbos (foto de un bulbo identifica mal); la especie se rellena
  a mano.
- **Borradores**: `src/lib/stores/listing-draft.svelte.ts` persiste **varios
  borradores** en `localStorage` (`botanic_publicar_draft`). En la fase 4 el botón
  "Guardar borrador" guarda y **navega a `/app/borradores`** (sin pasar por el
  diálogo de salida); al volver a `/app/publicar` con borradores aparece un
  banner para **Continuar** (el más reciente), **Descartar** o **Ver todos**.
  La ruta `/app/borradores` lista los borradores (continuar → `/app/publicar?draft=id`,
  eliminar); también hay una entrada "Borradores" en Mi Botanic. Si se intenta
  salir con datos sin guardar (navegación interna o el "Cancelar" del header) se
  abre un diálogo: **Guardar borrador y salir** / **Salir sin guardar** /
  **Seguir editando**; además `beforeunload` avisa al recargar o cerrar. Al
  publicar se elimina el borrador activo y se omite el aviso. Post-wireframe los
  borradores migrarán a Supabase (tabla `drafts` + storage de imágenes).
- **Header**: en `/publicar` el botón de acciones del header pasa de "Buscar" a
  **Cancelar** (hace `history.back()`).
- **Ubicación**: autocomplete de barrios (`LOCATIONS`), prellenada desde
  `profile.location_label` y editable por anuncio. En producción la fuente
  principal es la ubicación guardada en el perfil (editable por anuncio), con
  GPS como atajo opcional — nunca es el mecanismo obligatorio.
- **Vendedor**: `sellerInfo` se construye desde el perfil del usuario
  autenticado (`data.profile` + `data.user.email`); rating/reviews en 0.

## Ubicación

El P2P utiliza ubicación para descubrimiento y búsqueda. El usuario debe poder conceder, rechazar o revisar su configuración de ubicación desde `/app/ajustes/ubicacion`.

## Responsive

Aplica la regla global de [cross-cutting.md § Responsive](cross-cutting.md#responsive). Listados, mapa y detalle deben funcionar en escritorio y móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
