---
version: alpha
name: Botanic
description: "Marketplace P2P de plantas entre particulares. Cálido y sobrio: lino, tinta cálida, un verde funcional y ámbar solo en las estrellas."
---

# Botanic · Sistema de diseño

La identidad visual de Botanic: landing, blog, web app, emails, instalación y futura app Flutter. Se lee antes de escribir cualquier token, clase o componente.

**Los tokens de este documento son normativos.** Definen el valor correcto, no una aproximación de lo que hay. Cuando el código no coincida, el defecto está en el código y se corrige ahí. Si el diseño cambia, se cambia primero aquí y después se propaga: un valor nuevo no entra por un componente.

## Overview

El estándar de categoría de un marketplace, ejecutado con voz de economía circular. El listón de acabado es **Wallapop + Vinted + Airbnb**: estructura clásica —hero foto-liderado, categorías, funcionalidades, por qué, lista de espera, footer— a un nivel de oficio que pueda sentarse junto a esos productos, sin ironía ni quirk.

El sistema es **cálido y sobrio**. Un lino cálido hace de suelo, la tinta es cálida casi negra, el verde solo aparece donde hay una acción y el ámbar se reserva a la valoración. La fotografía real de plantas es protagonista; la interfaz no compite con ella.

La calidez es la firma: ningún neutro es frío ni azulado, en ninguna superficie. Lo que se evita de forma explícita es el resultado genérico de plantilla: degradados de neón, glassmorphism, serif decorativos, métricas o testimonios inventados.

## Colors

La paleta es cálida de lino con un acento verde. El verde tiene rol funcional y escasez deliberada: su rareza es lo que hace que el CTA destaque.

```yaml
colors:
  primary: "oklch(0.687 0.089 148)"
  primary-foreground: "oklch(0.99 0.005 150)"
  ring: "oklch(0.687 0.089 148)"
  star: "oklch(0.79 0.16 90)"
  still:
    "50": "oklch(0.972 0.012 145)"
    "100": "oklch(0.931 0.026 145)"
    "200": "oklch(0.863 0.047 146)"
    "300": "oklch(0.768 0.075 147)"
    "400": "oklch(0.687 0.089 148)"
    "500": "oklch(0.557 0.104 148)"
    "600": "oklch(0.471 0.093 148)"
    "700": "oklch(0.404 0.076 149)"
    "800": "oklch(0.349 0.06 149)"
    "900": "oklch(0.309 0.048 150)"
    "950": "oklch(0.221 0.032 151)"
  tranquil:
    "50": "oklch(0.985 0.025 100)"
    "100": "oklch(0.97 0.068 100)"
    "200": "oklch(0.935 0.128 99)"
    "300": "oklch(0.895 0.163 95)"
    "400": "oklch(0.847 0.171 87)"
    "500": "oklch(0.782 0.161 81)"
    "600": "oklch(0.67 0.144 71)"
    "700": "oklch(0.544 0.124 61)"
    "800": "oklch(0.468 0.107 57)"
    "900": "oklch(0.415 0.094 53)"
    "950": "oklch(0.281 0.068 49)"
  linen:
    "50": "oklch(0.99 0.006 85)"
    "100": "oklch(0.977 0.008 85)"
    "200": "oklch(0.95 0.012 85)"
    "300": "oklch(0.91 0.014 85)"
    "400": "oklch(0.84 0.02 85)"
    "500": "oklch(0.76 0.025 85)"
    "600": "oklch(0.64 0.028 85)"
    "700": "oklch(0.52 0.03 85)"
    "800": "oklch(0.4 0.03 85)"
    "900": "oklch(0.3 0.028 85)"
    "950": "oklch(0.22 0.025 85)"
  light:
    background: "oklch(0.977 0.008 85)"
    foreground: "oklch(0.28 0.02 55)"
    card: "oklch(0.99 0.006 85)"
    card-foreground: "oklch(0.28 0.02 55)"
    popover: "oklch(0.99 0.006 85)"
    popover-foreground: "oklch(0.28 0.02 55)"
    secondary: "oklch(0.931 0.026 145)"
    secondary-foreground: "oklch(0.349 0.06 149)"
    accent: "oklch(0.931 0.026 145)"
    accent-foreground: "oklch(0.349 0.06 149)"
    muted: "oklch(0.95 0.012 85)"
    muted-foreground: "oklch(0.52 0.02 70)"
    border: "oklch(0.91 0.014 85)"
    input: "oklch(0.91 0.014 85)"
    destructive: "oklch(0.577 0.245 27.325)"
    destructive-foreground: "oklch(0.98 0.01 27.325)"
  dark:
    background: "oklch(0.3 0.028 85)"
    foreground: "oklch(0.95 0.01 90)"
    card: "oklch(0.22 0.025 85)"
    card-foreground: "oklch(0.95 0.01 90)"
    popover: "oklch(0.22 0.025 85)"
    popover-foreground: "oklch(0.95 0.01 90)"
    secondary: "oklch(0.349 0.06 149)"
    secondary-foreground: "oklch(0.931 0.026 145)"
    accent: "oklch(0.349 0.06 149)"
    accent-foreground: "oklch(0.931 0.026 145)"
    muted: "oklch(0.4 0.03 85)"
    muted-foreground: "oklch(0.74 0.02 70)"
    border: "oklch(0.95 0.01 90 / 12%)"
    input: "oklch(0.95 0.01 90 / 15%)"
    destructive: "oklch(0.704 0.191 22.216)"
    destructive-foreground: "oklch(0.98 0.01 22.216)"
```

Los valores de marca no cambian entre modos: `primary`, `ring` y `star` son los mismos en claro y oscuro. Lo que cambia son las superficies, el texto y los bordes, agrupados en `light` y `dark`.

- **Still Green** (`still-400`) es el acento: CTA, logo, iconos y anillo de foco. Nunca es fondo de una pantalla completa.
- **Lino** (`linen-*`) hace de fondo, tarjeta, superficie alterna y borde. `linen-100` es el suelo, `linen-50` la tarjeta.
- **Still Green 100** (`secondary`) tiñe chips, icon-tiles y la banda de la lista de espera.
- **Tranquil** (amarillo) es el acento complementario: rompe la monotonía en estados, badges y en la cara trasera de la lista de espera. No sustituye al verde en una acción.
- **Ámbar** (`star`) solo pinta el glifo de la estrella y la puntuación del mapa.
- **Terra** (`destructive`) solo marca error e `aria-invalid`.
- **Footer**: superficie de lino con `border-t`, texto `muted-foreground`, enlaces y corazón `still-600`, y "Plant Lovers" en `foreground`. Cálido como el resto del sistema, sin bloque oscuro.

**Contraste.** `primary-foreground` es casi blanco sobre `still-400`: ≈2,7:1. Sirve para botón y texto grande, nunca para párrafo. Para texto verde sobre superficie clara se usa `still-600` o `still-700`; `still-400` sobre lino da ≈2,6:1.

## Typography

Tres familias con rol estricto, autoalojadas con `fontsource-variable`, sin CDN. Fraunces aporta el carácter editorial de la marca; Inter sostiene la lectura y la interfaz; JetBrains Mono marca lo técnico y lo secundario.

```yaml
typography:
  display-hero:
    fontFamily: Fraunces Variable
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.05
    fontVariation: '"opsz" 144, "SOFT" 30'
  display-section:
    fontFamily: Fraunces Variable
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.2
    fontVariation: '"opsz" 144, "SOFT" 30'
  heading-feature:
    fontFamily: Fraunces Variable
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.2
    fontVariation: '"opsz" 144, "SOFT" 30'
  heading-card:
    fontFamily: Fraunces Variable
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    fontVariation: "normal"
  body:
    fontFamily: Inter Variable
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.5
  body-strong:
    fontFamily: Inter Variable
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
  prose:
    fontFamily: Inter Variable
    fontSize: 17px
    fontWeight: 300
    lineHeight: 1.75
  button:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  eyebrow:
    fontFamily: JetBrains Mono Variable
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.04em
  headline-strong:
    fontFamily: Fraunces Variable
    fontSize: 48px
    fontWeight: 400
    lineHeight: 1.05
    fontVariation: '"opsz" 144, "SOFT" 30'
  display-hero-md:
    fontFamily: Fraunces Variable
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.05
    fontVariation: '"opsz" 144, "SOFT" 30'
  display-section-md:
    fontFamily: Fraunces Variable
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1.2
    fontVariation: '"opsz" 144, "SOFT" 30'
```

- **Titulares de marketing**: Fraunces 400 con `opsz 144` y `SOFT 30` forzados en h1 y h2. Los tokens `-md` son el paso responsive desde el breakpoint `md`; `display-hero` y `display-section` son el tamaño de móvil. Los h3 usan tamaño óptico natural, salvo el grande del carrusel de funcionalidades, que activa el tratamiento de display con la utilidad `.display-opsz` (`.no-opsz` lo desactiva, y lo usan las tarjetas del blog). Nunca peso 800 ni `tracking-tight`.
- **Superficie de la app**: la UI de producto no usa Fraunces. `/app/**` escribe todo en Inter —titulares, cuerpo, botones— y el mecanismo es el wrapper `.app-ui`: anula la familia, el `fontVariation` y el italic de `<strong>`. Un h1-h3 con `font-display` dentro de `.app-ui` es un defecto.
- **`<strong>`**: dentro de h1/h2/h3 es italic Fraunces 400 en `still-400` (en h3, sin forzar `opsz`); dentro de p sube a Inter 600, sin italic ni color. `headline-strong` es el token del primero y `body-strong` el del segundo.
- **Eyebrows, tags y etiquetas de pill** van en `.eyebrow`: JetBrains Mono 400, 13 px, uppercase, `letterSpacing` 0.04em, color `still-500`. No admiten `<strong>` dentro.
- **Ritmo del texto**: `text-wrap: balance` en h1-h3 y `pretty` en p. El cuerpo de artículo usa `prose` (17 px / 1.75).

## Layout

Mobile-first y centrado, con bandas de ancho completo y contenedor centrado. El ritmo vertical es generoso y constante: es lo que hace que la página respire sin necesidad de líneas ni adornos.

```yaml
spacing:
  base: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 80px
  section-lg: 112px
  band: 40px
  container: 1280px
  container-narrow: 1152px
```

- Todas las bandas usan `container` (1280 px) con padding lateral de 16, 24 y 32 px según el breakpoint. La lista de espera es una banda compacta: `band` de alto y `container-narrow` dentro.
- Secciones de contenido: `section` de padding vertical, que pasa a `section-lg` a partir de `md`.
- El hero es un grid de dos columnas con 48-64 px de separación; en móvil el copy se centra y respira con 64 px arriba.
- Las secciones se separan con bandas alternas sobre `muted` con `border-y`, no con líneas sueltas.

## Elevation & Depth

La profundidad la construyen el borde fino y el radio generoso; la sombra llega después, solo como indicio de que algo se puede tocar.

- Tarjetas y contenedores van con `border` de 1 px y nunca con una sombra pesada. El contraste tonal entre superficies hace el trabajo.
- La sombra escala con la interacción: `shadow-xs` en la imagen dentro de una tarjeta, `shadow-sm` en tarjeta y botón en reposo, `shadow-md` al pasar el cursor por una tarjeta del blog.
- El abanico del hero eleva la tarjeta en primer plano con su propia sombra, aplicada por estado y no solo por `:hover`, para que la rotación automática también la muestre.
- Los markers del mapa usan dos capas de sombra y suben 1 px al pasar el cursor.
- Quedan fuera del sistema las sombras de color, los glows y el glassmorphism.

## Shapes

El lenguaje de forma es redondeado y generoso: el radio es parte de la calidez, y no se mezcla con esquinas rectas en la misma vista.

```yaml
rounded:
  base: 0.625rem
  image: 0.75rem
  card: 1rem
  pill: 9999px
```

- `card` (1rem, `rounded-2xl`) en tarjetas del abanico, del carrusel de funcionalidades y del por-qué.
- `image` (0.75rem, `rounded-xl`) en la imagen dentro de la tarjeta y en las miniaturas de los markers.
- `pill` (`rounded-full`) en botones, pills de categoría, el campo de la lista de espera y el botón "Unirme" integrado en él.
- `base` es el radio de shadcn del que derivan los controles del sistema de componentes.

## Motion & Micro-interaction

El movimiento es corto y funcional: confirma un cambio de estado, no decora. Nada hace bucle salvo dos piezas de marca —el abanico del hero y la malla de la banda de categorías— y ambas se desactivan con `prefers-reduced-motion`.

```yaml
motion:
  state-change:
    duration: 120ms
    timingFunction: ease
  surface-enter:
    duration: 300ms
    timingFunction: cubic-bezier(0.32, 0.72, 0, 1)
  surface-exit:
    duration: 200ms
    timingFunction: cubic-bezier(0.32, 0.72, 0, 1)
  overlay-in:
    duration: 200ms
    timingFunction: ease-out
  overlay-out:
    duration: 150ms
    timingFunction: ease-in
  fan-shift:
    duration: 350ms
    timingFunction: cubic-bezier(0.22, 1, 0.36, 1)
  flip:
    duration: 700ms
    timingFunction: ease-out
  fan-cycle:
    duration: 2500ms
    timingFunction: linear
```

- **Qué se anima**: `transform` y `opacity`, más `box-shadow` donde la sombra comunica interacción. Nada que obligue a recalcular layout.
- **Ritmo**: los cambios locales caben en `state-change`; lo que entra en pantalla tarda más y desacelera (`surface-enter`), lo que sale acelera (`surface-exit`).
- **Abanico del hero**: tres tarjetas en `.fan-stage` con `perspective: 1400px`, origen al 85 % y `rotateY(-8deg)`; cada `.fan-card` rota y escala por variable CSS. El foco cambia cada `fan-cycle` con `fan-shift`, se pausa en hover y focus, y no arranca con movimiento reducido.
- **Malla de viento**: solo en la banda de categorías. Dos capas de degradado radial con tintes de rampa que hacen crossfade alternado y lento, mientras la capa deriva con traslación y rotación de muy poca amplitud. Es decorativa: `aria-hidden`, sin interacción y estática con movimiento reducido.
- **Volteo de la lista de espera**: solo en esa tarjeta, al confirmar un registro. Perspectiva de 1400 px, `preserve-3d`, giro de 700 ms de derecha a izquierda, caras con `backface-visibility: hidden` y la trasera pre-rotada sobre `tranquil-200`. La altura en móvil la calcula JS; el foco pasa al titular trasero, la cara inactiva queda `inert` y con movimiento reducido el cambio es instantáneo.
- **Sheet de filtros** (`/app`): entra con `surface-enter` desde arriba y sale con `surface-exit`; el overlay usa `overlay-in` y `overlay-out`.

## Voice & Content Strategy

La voz y la terminología son autoridad de producto: se definen en [PRODUCT.md](PRODUCT.md). Aquí solo lo que afecta a la interfaz escrita.

- **Tono**: cercano y de comunidad, nunca técnico ni frío. Sin exclamaciones ni superlativos de marketing.
- **Capitalización**: sentence case en titulares, botones, etiquetas de formulario y elementos de menú.
- **Etiquetas de acción**: verbo y resultado ("Publicar anuncio", "Guardar deseo", "Unirme a la lista"), nunca "OK" ni "Enviar".
- **Estados vacíos**: dicen qué va aquí y ofrecen la acción de crear. **Errores**: qué ha fallado y cuál es el siguiente paso, sin disculpas ni códigos.
- **Números y fechas**: formato español (`dd/mm/aaaa`), tiempo relativo en listas ("hace 3 min") y espacio entre cifra y unidad (`16 px`).
- **Restricciones de copy**: no se prometen "sin envíos", "sin comisiones", "quedar en mano" ni "solo cerca de ti". La semilla fundadora nunca comunica el tamaño del grupo.

## Components

Guía de estilo de los átomos del sistema. Los componentes base son los de shadcn-svelte; lo propio de Botanic son los envoltorios de marca.

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  button-outline:
    backgroundColor: "{colors.light.card}"
    textColor: "{colors.light.foreground}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  input-waitlist:
    backgroundColor: "{colors.light.background}"
    textColor: "{colors.light.foreground}"
    rounded: "{rounded.pill}"
    height: 56px
  card-listing:
    backgroundColor: "{colors.light.card}"
    textColor: "{colors.light.foreground}"
    rounded: "{rounded.card}"
    padding: 14px
  card-blog:
    backgroundColor: "{colors.light.card}"
    textColor: "{colors.light.foreground}"
    rounded: "{rounded.card}"
  pill-category:
    backgroundColor: "{colors.light.background}"
    textColor: "{colors.light.foreground}"
    rounded: "{rounded.pill}"
  badge-eyebrow:
    textColor: "{colors.still.500}"
    typography: "{typography.eyebrow}"
  band-waitlist:
    backgroundColor: "{colors.light.secondary}"
    textColor: "{colors.light.secondary-foreground}"
  logo-wordmark:
    height: 24px
  footer:
    textColor: "{colors.light.muted-foreground}"
```

- **Botones**: primario relleno de `primary`, secundario con `card` y borde. Radio `pill` siempre; el icono va a `aria-hidden` si es decorativo.
- **Tarjetas**: borde de 1 px, radio `card` y sombra de reposo. La del abanico es `card-listing` y la del blog añade la imagen con `rounded` `image` y `shadow-xs`.
- **Entradas**: el campo de la lista de espera es alto, redondeado y con el botón integrado a la derecha.
- **Wordmark**: el logo es un SVG (`Logo.svelte`) con el Sprout integrado en la letra "t" y `fill: currentColor`: hereda el color del texto que lo envuelve y se dimensiona por altura (24 px en la cabecera). No es tipografía: no lleva familia, peso ni tamaño de fuente.
- Implementación viva: `@src/lib/components/AppHeader.svelte`, `@src/lib/components/AppFooter.svelte`, `@src/lib/components/Logo.svelte`, `@src/lib/components/waitlist/WaitlistForm.svelte`, `@src/lib/components/blog/BlogIndex.svelte`.

## Do's and Don'ts

- Do usar el verde solo en la acción, el logo, los iconos y el foco: un único CTA destacado por pantalla.
- Do mantener la calidez de lino y tinta en todos los neutros, también en estados vacíos y deshabilitados.
- Do servir las imágenes desde `static/images/` en `.webp` con gemelo `.jpg`, y etiquetar como "Anuncios de ejemplo" cualquier tarjeta con material sintético.
- Do respetar `prefers-reduced-motion` en todo lo que se mueva.
- Don't usar `still-400` como color de texto sobre superficie clara: da ≈2,6:1.
- Don't añadir una cuarta familia tipográfica, un serif decorativo ni una segunda grotesk.
- Don't introducir sombras de color, glows, glassmorphism ni degradados de neón.
- Don't usar el verde como fondo de pantalla completa ni extender la malla o el abanico fuera de su sección.
- Don't fabricar métricas, testimonios ni cifras, ni usar URLs de Unsplash.
- Don't añadir navegación ni CTAs en la landing fuera del CTA a la lista de espera.
