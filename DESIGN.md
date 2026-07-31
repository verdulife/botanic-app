---
name: Botanic
description: El Wallapop de las plantas — marketplace P2P de plantas entre particulares
colors:
  background: "oklch(0.977 0.008 85)"
  foreground: "oklch(0.28 0.02 55)"
  card: "oklch(0.99 0.006 85)"
  card-foreground: "oklch(0.28 0.02 55)"
  popover: "oklch(0.99 0.006 85)"
  popover-foreground: "oklch(0.28 0.02 55)"
  primary: "oklch(0.465 0.25 146)"
  primary-foreground: "oklch(0.99 0.005 150)"
  secondary: "oklch(0.931 0.061 150)"
  secondary-foreground: "oklch(0.401 0.218 146)"
  muted: "oklch(0.95 0.012 85)"
  muted-foreground: "oklch(0.52 0.02 70)"
  accent: "oklch(0.931 0.061 150)"
  accent-foreground: "oklch(0.401 0.218 146)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-foreground: "oklch(0.98 0.01 27.325)"
  border: "oklch(0.91 0.014 85)"
  input: "oklch(0.91 0.014 85)"
  ring: "oklch(0.527 0.279 146)"
  chart-1: "oklch(0.527 0.279 146)"
  chart-2: "oklch(0.827 0.162 147)"
  chart-3: "oklch(0.79 0.16 90)"
  chart-4: "oklch(0.577 0.245 27.325)"
  chart-5: "oklch(0.28 0.02 55)"
  star: "oklch(0.79 0.16 90)"
typography:
  sans: "Onest Variable, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
  display:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "normal"
    textWrap: "balance"
  h2:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "1.875rem (3xl) / 2.25rem (4xl)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "1rem (lg) / 0.875rem (sm)"
    lineHeight: 1.5
  label:
    fontFamily: "Onest Variable, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.sm}"
    height: "2.25rem (sm) / 2.5rem (default) / 3rem (lg custom)"
    padding: "0 1rem (sm) / 0 2rem (lg custom)"
  button-outline:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.border}"
    textColor: "{colors.foreground}"
  input:
    backgroundColor: "bg-muted/50"
    borderColor: "{colors.border}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  listing-card:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}/60"
    rounded: "{rounded.lg}"
    padding: "0.625rem"
  badge:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.full}"
  pill-category:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
  nav:
    height: "3.5rem (h-14)"
    backgroundColor: "bg-background/85"
    backdrop: "backdrop-blur-md"
    borderBottom: "{colors.border}/70"
  hero-eyebrow:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.full}"
  step-number:
    textColor: "{colors.primary}"
    fontWeight: 800
  waitlist-section:
    backgroundColor: "{colors.secondary}/70"
---

# Design System: Botanic (canon 2026)

## Overview

**Creative North Star: el estándar de categoría de marketplace, ejecutado impecablemente, con voz de economía circular.**

Botanic es la landing de un marketplace P2P de plantas; el listón de acabado es Wallapop + Vinted + Airbnb (elegido por el usuario en el flujo `new-work`, seed `77b83067`, acción `canon`). La página ejecuta la estructura clásica de la categoría — nav, hero foto-liderado, categorías, manifiesto, cómo funciona, por qué, waitlist prefooter y footer — a un nivel de oficio que pueda sentarse junto a esos productos, sin ironía ni quirk. El copy habla en el vocabulario de la economía circular ("segunda vida", "vender, cambiar o regalar", "las plantas se comparten, no se desperdician") y evita declarar como promesas permanentes los "sin envíos", "sin comisiones" ni "solo cerca de ti".

El sistema es cálido y sobrio: un fondo de lino cálido, tinta cálida casi negra, un único acento de Still Green (`#74AA7B`) para el CTA, el logo y los iconos, y un ámbar puntual para las estrellas. La fotografía real de plantas es protagonista en el hero, etiquetada como `Anuncios de ejemplo` donde es material sintético. La profundidad se construye con bordes finos, esquinas redondeadas (`rounded-2xl` en tarjetas, `rounded-full` en pills) y contraste tonal entre superficies; no hay sombras. Se evita explícitamente el `AI slop`: sin degradados de neón, sin blobs animados estridentes, sin glassmorphism, sin serif itálicos decorativos, sin métricas o testimonios inventados. Las únicas animaciones del sistema son el mesh viento de las bandas de categorías y waitlist (The Wind Mesh Rule) y el crossfade de la tarjeta destacada de demo.

**Key Characteristics**
- Estructura clásica de marketplace, executed impeccably.
- Fotografía real de plantas (Unsplash verificado, sujetos nombrados correctamente).
- Un solo acento de color: Still Green, sobre una rampa completa de tints y shades.
- Tipografía Onest Variable (single family, geometrico-humanista) con system stack como fallback.
- Calidez uniforme en todos los neutros (lino/tinta); nunca grises fríos.
- Mobile-first, ritmo vertical generoso y constante.

## Colors

Paleta cálida de lino y Still Green. El verde se usa con propósito (CTA, logo, iconos, anillos de foco); los neutros de lino hacen el resto del trabajo. El ámbar (`star`) es exclusivo para las estrellas de valoración. La `terra` es el único color destructivo.

Dos rampas completas viven en `@theme inline` de `src/app.css` (`still-50…950` y `linen-50…950`), derivadas del Still Green `#74AA7B` y del lino de fondo.

### Primary
- **Still Green 700** (`oklch(0.465 0.25 146)`, ≈ `#517756`) — el acento del sistema como token `primary`. Botón primario, tile del logo, iconos de categorías/pasos, anillos de foco. Contraste 5.09:1 con `primary-foreground` blanco (cumple AA).
- **Still Green 600** (`oklch(0.527 0.279 146)`, ≈ `#5D8862`) — `ring` y `chart-1`, el paso intermedio para foco.

### Neutral (lino cálido)
- **Lino (fondo)** `oklch(0.977 0.008 85)` (`linen-100`) — superficie base.
- **Papel (tarjeta)** `oklch(0.99 0.006 85)` (`linen-50`) — tarjetas y superficies elevadas suaves.
- **Tinta** `oklch(0.28 0.02 55)` — texto principal, headings.
- **Oliva (muted-fg)** `oklch(0.52 0.02 70)` — texto secundario y metadatos.
- **Verdín (border/input)** `oklch(0.91 0.014 85)` (`linen-300`) — bordes, separadores.
- **Muted (superficie)** `oklch(0.95 0.012 85)` (`linen-200`) — bandas alternas y fondo de badges.

### Secondary (tinte de Still Green)
- **Still Green 800 (secondary-fg)** `oklch(0.401 0.218 146)` — texto sobre el tinte verde.
- **Still Green 100 (secondary)** `oklch(0.931 0.061 150)` — chips, eyebrow del hero, icon-tiles, banda de la waitlist al 70%.

### Acentos puntuales
- **Estrella (ámbar)** `oklch(0.79 0.16 90)` — exclusivo para la estrella de valoración.
- **Terra (destructive)** `oklch(0.577 0.245 27.325)` — exclusivo para estados de error, `aria-invalid` y el corazón del footer.

### Charts
- `chart-1` still-600, `chart-2` still-400, `chart-3` ámbar, `chart-4` terra, `chart-5` tinta.

### Rampa Still Green (`still-*`)
| step | oklch | hex |
|---|---|---|
| 50 | `0.967 0.033 149` | `#F1F7F2` |
| 100 | `0.931 0.061 150` | `#E3EEE5` |
| 200 | `0.897 0.1 147` | `#D5E6D7` |
| 300 | `0.861 0.128 148` | `#C7DDCA` |
| 400 | `0.827 0.162 147` | `#BAD5BD` |
| **500** | `0.649 0.334 146` | `#74AA7B` (base) |
| 600 | `0.527 0.279 146` | `#5D8862` |
| **700** | `0.465 0.25 146` | `#517756` |
| 800 | `0.401 0.218 146` | `#46664A` |
| 900 | `0.265 0.159 146` | `#2E4431` |
| 950 | `0.195 0.122 146` | `#233325` |

### Rampa Lino (`linen-*`)
| step | oklch |
|---|---|
| 50 | `0.99 0.006 85` |
| 100 | `0.977 0.008 85` |
| 200 | `0.95 0.012 85` |
| 300 | `0.91 0.014 85` |
| 400 | `0.84 0.02 85` |
| 500 | `0.76 0.025 85` |
| 600 | `0.64 0.028 85` |
| 700 | `0.52 0.03 85` |
| 800 | `0.4 0.03 85` |
| 900 | `0.3 0.028 85` |
| 950 | `0.22 0.025 85` |

### Dark mode
Los mismos tokens se invierten sobre la rampa: `primary` → `still-400`, `secondary`/`accent` → `still-800` con fg `still-100`, `background` → `linen-900`, `card`/`popover` → `linen-950`, `muted` → `linen-800`, `border`/`input` → alphas cálidos sobre lino.

### Reglas nombradas
- **The One Accent Rule.** Still Green y el ámbar son los únicos acentos. El verde aparece en CTA, logo, iconos y foco; el ámbar, solo en la estrella.
- **The Warmth Rule.** Todos los neutros comparten la misma calidez de lino/tierra. No introducir grises fríos ni blancos azulados.
- **The Star Rarity Rule.** El ámbar de la estrella nunca pinta fondos ni chips; solo el glifo de la estrella.
- **The Rarity Rule.** El Still Green se usa con moderación (≤10% de una pantalla); su escasez es lo que hace destacar al CTA y al logo.

## Typography

**Familia única:** Onest Variable (`@fontsource-variable/onest`, single family para todo), con system stack como fallback. Onest está fuera de la lista de defaults prohibidos y aporta un registro geometrico-humanista coherente con el listón (Wallapop/Vinted/Airbnb).

### Jerarquía
- **Display** — peso 300, `clamp(2.25rem, 6vw, 3.75rem)`, `line-height: 1.05`, `letter-spacing: normal`, `text-wrap: balance`. Usado solo en el `h1` del hero. Las palabras de refuerzo van en `font-semibold` (600).
- **H2** — peso 300, `text-3xl`/`text-4xl`, `line-height: 1.2`, `letter-spacing: normal`. Titulares de sección; refuerzo puntual en 600.
- **Body** — peso 400, `text-sm` (0.875rem) en tarjetas, `text-lg` (1rem) en la promesa del hero, `line-height: 1.5`.
- **Label** — peso 500, `text-xs` (0.75rem). Chips, badges, eyebrows, "0X" de los pasos.

### Reglas nombradas
- **The Light Headline Rule.** Los titulares (h1/h2) van en 300 con tracking normal; el 600 queda reservado como refuerzo semántico puntual dentro del titular (`<strong>`). Nunca peso 800 ni tracking-tight en titulares.
- **The Card Title Rule.** Los h3 de tarjeta (manifiesto, pasos, por-qué) van en `font-semibold` (600) fijo, sin refuerzo interno.
- **The Muted Body Rule.** El texto de apoyo va en `text-muted-foreground` para que el titular mande.
- **The One Family Rule.** Onest Variable para todo. No mezclar con serif decorativos, ni mono, ni una segunda grotesk.

## Layout

Mobile-first y centrado. Secciones de anchura acotada (`max-w-6xl` para hero/listas, `max-w-3xl` para la waitlist) centradas, con padding lateral `px-4` → `md:px-6` y vertical `py-16` → `md:py-20`. El hero usa un grid `md:grid-cols-2` con `gap-14` para colocar el copy a la izquierda y la tarjeta destacada de demo a la derecha; en móvil cae debajo del copy.

Bandas alternas para separar secciones sin líneas extra: las secciones claras van sobre `background`, y las bandas (categorías, cómo funciona) van sobre `muted/40` con `border-y`. La waitlist va sobre `secondary/70` como cierre cálido antes del footer.

## Elevation & Depth

Profundidad por **bordes y radio**, no por sombra. Las tarjetas usan `rounded-2xl` y `border border-border`; la imagen de la tarjeta destacada usa `rounded-xl`. No hay `box-shadow` en el sistema; la elevación se comunica con el contraste tonal (fondo `background` vs tarjeta `card`) y los bordes finos.

### Reglas nombradas
- **The Border-By-Default Rule.** La profundidad se comunica con un borde fino y un radio generoso, no con sombra.

## Shapes

- `rounded-sm` (0.5rem) en botón e input.
- `rounded-md` (0.75rem) en el `radius` base de shadcn.
- `rounded-xl` (0.75rem) en la imagen de la tarjeta destacada.
- `rounded-2xl` (1.5rem) en tarjetas de manifiesto, pasos, por-qué y la tarjeta destacada.
- `rounded-full` en pills de categoría, badges, eyebrow y avatares.

## Components

### Nav
Sticky `top-0`, fondo `bg-background/85` con `backdrop-blur-md` y `border-b border-border/70`. Altura `h-14` y contenedor `max-w-6xl`. Logo a la izquierda: tile `size-8 rounded-lg bg-primary text-primary-foreground` con `Sprout`, seguido del wordmark `Botanic` en negrita. CTA `Únete a la waitlist` a la derecha (variant default, `size=sm`).

### Hero — left column
- Eyebrow: pill `bg-secondary text-secondary-foreground rounded-full`, `Recycle` `size-3.5` + "La economía circular de las plantas".
- `h1` display (60px/300) con `text-wrap: balance` y refuerzos `font-semibold` (600): "Dale una **segunda vida** a tus plantas".
- Párrafo en `text-lg text-muted-foreground`, `max-w-md` ("Saca más partido a tus plantas y encuentra las que siempre quisiste. Vender, cambiar o regalar: las plantas nunca se tiran, cambian de manos.").
- CTA primary: `size=lg` con `class="h-12 px-8 text-base"`.
- `text-sm text-muted-foreground` ("Pronto · sé de los primeros en entrar") debajo del CTA.

### Hero — right column: tarjeta destacada de demo
**Una sola tarjeta destacada** `rounded-2xl border border-border bg-card max-w-96 mx-auto` que muestra un anuncio a la vez (envuelta en `{#key active}` con `transition:fade` de 400ms):
- Foto `aspect-square w-full rounded-t-2xl object-cover` (Unsplash verificada, 640×640).
- Info: `h3` `truncate text-sm font-semibold` con el nombre de la planta, `MapPin size-3` + barrio en `text-xs text-muted-foreground`, `Star size-3 fill-star text-star` + rating + nº de reseñas en `text-xs`, precio `text-sm font-bold` alineado a la derecha.

**Rotación:** avanza automáticamente cada 4s (`$effect` + `setInterval`), se pausa en hover/focus (`paused`), y queda estático con `prefers-reduced-motion`. **Dots**: fila centrada de 3 botones `size-2 rounded-full` (activo `bg-primary`, inactivo `bg-border`), `aria-label="Ver {name}"`, clic → selecciona.

Los tres anuncios de ejemplo:
- `1614594975525-e45190c55d0b` → Monstera deliciosa · Chamberí · 4.9 (38) · 12 €
- `1509423350716-97f9360b4e09` → Aloe vera en maceta · Lavapiés · 5.0 (12) · 6 €
- `1485955900006-10f4d324d411` → Suculentas variadas · Malasaña · 4.8 (25) · 9 €

**Lista de reemplazo (cuando el usuario las publique):** las tres fotos son de stock; en cuanto el equipo tenga anuncios reales, sustituir las URLs y los textos por los definitivos.

### Categorías
Banda `border-y border-border/70 bg-muted/40`, contenedor `max-w-6xl` con `flex flex-wrap justify-center gap-2.5 py-6`. Pills `rounded-full border border-border bg-background px-4 py-2 text-sm font-medium` con icono `text-primary size-4`:
- Semillas · `Sprout`
- Esquejes · `Scissors`
- Plantas · `Leaf`
- Tiestos · `ShoppingBasket`
- Accesorios · `Shovel`

### Manifiesto
Sección centrada `max-w-6xl`, `h2` 300 con refuerzo 600 + subtítulo `text-muted-foreground`. Titular: "Las plantas se **comparten**, no se **desperdician**". Copy en el vocabulario de economía circular ("vender, cambiar o regalar", "economía circular, hecha fácil"). Dos tarjetas `rounded-2xl border border-border bg-card p-4` en grid `md:grid-cols-2`, layout horizontal (imagen izquierda + texto derecha). Cada tarjeta lleva una imagen `size-28 md:size-44 rounded-2xl object-cover` (Unsplash verificada, 640×640, `loading="lazy"`) a la izquierda y un `h3 text-lg font-semibold` + párrafo `text-sm text-muted-foreground` a la derecha. Vendedores: foto `photo-1711915744121` (persona sosteniendo una planta en maceta). Compradores: foto `photo-1714379773066` (manos acercándose a una planta en maceta blanca).

### Cómo funciona
Banda `border-y border-border/70 bg-muted/40`, `h2` + subtítulo, grid `md:grid-cols-3`. Cada paso: número `text-sm font-extrabold text-primary` ("01/02/03"), icon-tile `bg-secondary`, `h3 text-lg font-semibold`, párrafo `text-sm text-muted-foreground`. Pasos: "Publica tu planta", "Encuentra tu planta", "Acuerda el trato".

### Por qué Botanic
Sección centrada, `h2` + subtítulo, grid `md:grid-cols-3` con tres tarjetas `rounded-2xl border border-border bg-card p-6`:
- Pensado para plantas · `ShieldCheck`
- Sostenible por naturaleza · `MapPin`
- Comunidad de confianza · `Star`

### Waitlist
`id="waitlist"`, `scroll-mt-16`, banda `bg-secondary/70 px-4 py-16 md:py-20`. Contenedor `max-w-3xl`, `h2` centrado, párrafo `max-w-md text-muted-foreground`, `WaitlistForm`:
- Input con icono `Mail` `text-muted-foreground` y `placeholder` `tu@email.com`, fondo `bg-muted/50`, foco con `focus-visible:ring-ring`.
- Botón `size=lg` `Unirme a la lista` con `Send` a la derecha; estados: `loading` deshabilitado con texto "Enviando…", `success` mensaje en `text-foreground`, `error` mensaje en `text-destructive` con `aria-invalid`.
- Microcopy en `text-xs text-muted-foreground`.

### Footer
`border-t border-border/70`, párrafo `text-xs text-muted-foreground` con `Heart` `fill-destructive text-destructive` en línea ("Hecho con ♥ para la comunidad plant lover").

## SEO

- `<title>` "Botanic — Tu marketplace de plantas de confianza" vía `<svelte:head>` en `+page.svelte`.
- `<meta name="description">` con la propuesta en una línea.
- `og:title`, `og:description`, `og:type=website`.
- `lang="es"` en `app.html`.
- Una sola `<h1>`; las secciones usan `<h2>`; los nombres de los listings son `<h3>`.
- Todas las imágenes llevan `alt` real (nombre de la planta).
- Iconos decorativos llevan `aria-hidden="true"`.

## Performance

- Imágenes de Unsplash servidas a 640×640 con `loading="lazy"`.
- Tipografía self-hosted vía `@fontsource-variable/onest` (sin CDN externo).
- Animaciones del sistema limitadas a: mesh viento (solo `transform` + `opacity`, composición GPU, sin repintados) y crossfade del panel demo (400ms). Ambas desactivadas con `prefers-reduced-motion`.
- Sin `box-shadow` decorativos.
- `bun run build` sin warnings; el contrato de dirección sobrevive al build (verificado con grep en `.svelte-kit/output`).

## Motion

### The Wind Mesh Rule
Las bandas de **categorías** y **waitlist** llevan un mesh gradient fijo que evoca el movimiento de las hojas al viento.

- **Implementación**: dos capas de `radial-gradient` (`mesh-a`/`mesh-b`) con la rampa Still/Lino a baja opacidad (25–45%), en crossfade de `opacity` (14s, `alternate`) mientras el contenedor hace un drift de `translate3d` ±1.5% y `rotate` ±1deg (40s, `alternate`). Solo `transform` + `opacity`.
- **Paleta**: tintes de Still (`still-100/200/300`) y lino cálido; en dark, la rampa oscura (`still-800/900`, `linen-900`). Nunca neón ni tonos fuera de rampa.
- **Accesibilidad**: `aria-hidden="true"`, `pointer-events-none`, y `@media (prefers-reduced-motion: reduce)` deja el mesh estático.
- **Restricción**: solo en esas dos bandas. No extender a tarjetas, hero, fondo de página ni secciones de contenido.

### The Demo Crossfade Rule
La **tarjeta destacada de demo** del hero rota entre los anuncios de ejemplo con un crossfade de `opacity` de 400ms (`transition:fade` de Svelte sobre `{#key active}`).

- **Rotación**: auto cada 4s vía `$effect` + `setInterval`; se pausa en hover/focus (`paused`) y no arranca con `prefers-reduced-motion`.
- **Navegación**: dots `size-2 rounded-full` (activo `bg-primary`, inactivo `bg-border`) con `aria-label="Ver {name}"`.
- **Restricción**: solo en esta tarjeta. El resto de la landing no tiene transiciones.

## Do's and Don'ts

**Do**
- Usar el Still Green con moderación: CTA, logo, iconos de chips, anillos de foco.
- Usar Onest Variable para todo el texto.
- Etiquetar como "Anuncios de ejemplo" cualquier tarjeta que use material sintético.
- Mantener la calidez de lino/tinta en todos los neutros.
- Medir la altura de hero y rhythm en una rejilla vertical, no por secciones aisladas.
- Sustituir las fotos de stock por anuncios reales en cuanto estén disponibles, manteniendo la tarjeta destacada de demo.
- Animar solo `transform` y `opacity` (mesh) o el crossfade del panel demo; respetar `prefers-reduced-motion`.

**Don't**
- No introducir sombras flotantes, glassmorphism o degradados de neón.
- No usar una segunda familia tipográfica ni un serif decorativo.
- No fabricar métricas, testimonios o cifras de la landing.
- No enlazar a `/app` ni añadir CTAs muertos.
- No usar el verde como color de fondo de pantalla completa.
- No extender el mesh viento fuera de las bandas de categorías y waitlist, ni el crossfade fuera de la tarjeta destacada.
- No re-introducir `box-shadow` ni el contenedor exterior del panel demo.
