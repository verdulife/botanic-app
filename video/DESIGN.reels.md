---
name: Reels & carruseles Botanic
description: Surface brief para mp4 9:16 (reels IG/TikTok) y stills 4:5 (carruseles IG) generados con Remotion desde `video/`. Hereda tokens y reglas de [`DESIGN.md`](../DESIGN.md).
inherits: ../DESIGN.md
mode: Persuade
canvas:
  reel: { width: 1080, height: 1920, fps: 30 }
  slide: { width: 1080, height: 1350, fps: 30 }
typography_in_video:
  family: "Onest Variable"
  weight_display: 300       # The Light Headline Rule (landing h1/h2)
  weight_strong: 600        # refuerzo semántico puntual dentro del titular (<strong>)
  weight_h3: 600            # The Card Title Rule (h3 de tarjeta, fijo)
  weight_label: 500         # eyebrow / chip / pill / microcopy
  weight_price: 700         # dato destacado (precio, CTA final, wordmark)
  weight_never: [800, 900] # prohibidos (The One Family Rule)
  size_display: "80–120px"
  size_h2: "48–58px"
  size_body: "40–52px"
  size_label: "24–32px"
  line_height_display: 1.05
  line_height_h2: 1.2
  line_height_body: 1.5
  tracking: "normal"
  text_wrap: "balance"
  legibility_over_image:
    weight: 700              # compensación de legibilidad AA sobre foto
    text_shadow_token: "color-mix(in oklch,<bg-token> 35%, transparent)"
    rationale: "excepción documentada; la landing no usa 700 en h1/h2, pero mp4/still a 1080×1920 requiere peso alto para mantener contraste AA sobre foto de Pexels. Se compensa con text-shadow del color del fondo."
overlay_over_image:
  reel: "linear-gradient(180deg, var(--bg-from) 0%, var(--bg-to) 100%)"
  slide: "linear-gradient(180deg, var(--bg-from) 0%, var(--bg-to) 100%)"
  text_on_image: "linen-50"
logo:
  source: ../../static/favicon.svg
  background: "linen-100"
  foreground: "still-800"
cta_handle: "@botanic.app"
---

# Surface Brief: Reels & carruseles (Remotion)

## Overview

Esta superficie genera **mp4 9:16** (reels IG/TikTok) y **stills 4:5** (carruseles IG) con **Remotion 4** desde la carpeta autónoma `video/`. El guion `script.json` (en `src/lib/social/`) es el único input humano: el agente escribe **datos**, nunca animación. La composición se renderiza con `bunx remotion render/still`. La auditoría visual va al subagente [`visual-eval`](.opencode/agents/visual-eval.md).

**Modo**: `Persuade` — el visitante decide y actúa; el diseño ES el producto. Cada escena debe ganarse la atención y empujar al CTA en menos de 20s (reel) o 1 slide (carrusel).

**Hereda toda la autoridad visual de `DESIGN.md`** (paleta Still/Lino, tipografía Onest Variable, reglas nombradas: One Accent, Warmth, One Family, Rarity, Star Rarity, Light Headline). Este brief **solo añade** lo específico de motion graphics: motion styles, mesh estático, escalas tipográficas, overlays y reglas de portabilidad (no hay Tailwind, no hay CSS variables de `:root` en tiempo de render, no hay squircle portable).

## Tokens consumidos (de `DESIGN.md` frontmatter)

| Token | oklch | Uso en vídeo |
|---|---|---|
| `still-900` | `oklch(0.265 0.159 146)` | fondo `energy`, texto principal sobre fondo claro |
| `still-950` | `oklch(0.195 0.122 146)` | texto principal en `cozy` (alta jerarquía) |
| `still-800` | `oklch(0.401 0.218 146)` | logo foreground, `accent` minimal |
| `still-700` | `oklch(0.465 0.25 146)` | `accent` cozy (warm CTA) |
| `still-400` | `oklch(0.827 0.162 147)` | `accent` energy (high contrast) |
| `still-300` | `oklch(0.861 0.128 148)` | mesh suave (variante clear) |
| `still-200` | `oklch(0.897 0.1 147)` | mesh suave |
| `still-100` | `oklch(0.931 0.061 150)` | mesh suave |
| `linen-50` | `oklch(0.99 0.006 85)` | texto principal sobre fondo oscuro |
| `linen-100` | `oklch(0.977 0.008 85)` | fondo `cozy`, logo background |
| `linen-200` | `oklch(0.95 0.012 85)` | fondo `minimal`, mesh atenuado |
| `linen-300` | `oklch(0.91 0.014 85)` | mesh |

**Importante**: los tokens se resuelven en tiempo de render desde `video/src/brand.generated.ts` (auto-generado por `bun run tokens` desde el frontmatter de `DESIGN.md`). Si impeccable regenera `DESIGN.md`, regenera y re-renderiza. **No editar `brand.generated.ts` a mano.**

## Motion styles

Tres sistemas coherentes con la marca. Cada uno mapea a tokens Still/Lino (no se introducen colores nuevos).

### `energy`
- **Personalidad**: dinámico, punch, alto contraste.
- **Uso**: tips y reels cortos (≤20s).
- **Fondo**: `still-900` (oscuro profundo).
- **Texto principal**: `linen-50`.
- **Acento**: `still-400` (verde claro para high contrast sobre dark).
- **Overlay sobre foto**: `linear-gradient(180deg, oklch(still-900/.15) 0%, oklch(still-900/.90) 100%)`.
- **Texto sobre imagen**: `linen-50` siempre (con shadow 0 2px 24px rgba(11,45,16,0.35)).

### `cozy`
- **Personalidad**: orgánico, cálido, acogedor.
- **Uso**: estética, historias de marca, carruseles lifestyle.
- **Fondo**: `linen-100` (crema cálido).
- **Texto principal**: `still-950`.
- **Acento**: `still-700` (verde profundo, como el CTA primary de la web).
- **Overlay sobre foto**: `linear-gradient(180deg, oklch(linen-100/0) 0%, oklch(linen-100/.85) 100%)`.

### `minimal`
- **Personalidad**: editorial, limpio, tipográfico.
- **Uso**: citas, statements, carruseles de marca.
- **Fondo**: `linen-200` (neutro).
- **Texto principal**: `still-900`.
- **Acento**: `still-800`.
- **Overlay sobre foto**: `linear-gradient(180deg, oklch(still-950/0) 0%, oklch(still-950/.75) 100%)`.

**Regla**: los tres motion styles son **rotaciones estéticas**, no introducen colores. Todo color sale de la paleta Still/Lino.

## Tipografía en vídeo

La jerarquía sigue **al pie de la letra** las reglas de la landing (ver [`DESIGN.md`](../DESIGN.md) líneas 207–225 y 234–243). Cualquier excepción queda documentada en el frontmatter y se compensa con `text-shadow` token-based para mantener contraste AA.

- **Familia única**: `Onest Variable`. Cargada vía `@remotion/fonts` desde `staticFile("fonts/onest-variable.woff2")` (woff2 copiado por `bun run fonts` desde `node_modules/@fontsource-variable/onest/files/onest-latin-wght-normal.woff2`). Si la fuente no existe, `Remotion` loguea un warning y renderiza en fallback `system-ui` — ejecutar `bun run fonts` antes de cualquier render.

### Jerarquía

| Nivel | Weight | Tamaño | Uso | Equivalente en landing |
|---|---|---|---|---|
| Display | **300** | 80–120px | hook, cover (sin foto) | h1/h2 hero (`font-light`) |
| Display + refuerzo | **600** | mismo | `<strong>` dentro del titular | `<strong class="font-semibold">` |
| H2 / Cita | **300** | 48–58px | quote, outro | h2 secciones |
| H3 / Slide | **600** | 48–58px | h3 de tarjeta cuando aparezca | h3 tarjeta (`font-semibold` fijo) |
| Tip sobre foto* | **700** | 48–58px | tip con media (Pexels) | **excepción documentada** (ver más abajo) |
| Body / Label | **500** | 40–52px | cuerpo, eyebrow, handle `@botanic.app` | label/pill (`font-medium`) |
| Dato destacado | **700** | 40–56px | CTA final ("Sigue para más cuidados") | precio, wordmark (`font-bold`) |

\* **Compensación sobre foto**: la landing usa 300 en h1/h2 incluso con foto de fondo porque la `font-weight: 300` de Onest mantiene buena legibilidad al tamaño de la web. En mp4/still a 1080×1920 el mismo peso 300 sobre foto Pexels con filtro se ve débil (probado). Por eso el tip con media **sube a 700** y se compensa con `text-shadow` del color del fondo (`color-mix(in oklch, <bg-token> 35%, transparent)`). El asterisco deja claro que esto es una excepción local al surface brief, no rompe la jerarquía global.

### Reglas de aplicación

- **Titular sin foto** (hook, cover, outro, quote) → **300**. Idéntico a la landing.
- **Titular sobre foto** (tip con media) → **700 + text-shadow token-based**. Excepción documentada.
- **Refuerzo semántico** dentro de cualquier titular → `<strong>` con **600**.
- **CTA final** ("Sigue para más cuidados") → **700** (dato destacado, como precio).
- **Handle `@botanic.app`** → **500** (label/eyebrow, como los chips de categoría).
- **Eyebrow / microcopy** → **500**.
- **Nunca 800 ni 900** en ningún componente de `video/src/`. (Prohibido por el frontmatter `weight_never`.)

### Text-shadow token-based (compensación sobre foto)

```ts
// video/src/brand.ts: cada motion style ya define `shadow` como token:
//   energy  → `0 2px 24px color-mix(in oklch, still-900 35%, transparent)`
//   cozy    → `0 2px 24px color-mix(in oklch, linen-100 35%, transparent)`
//   minimal → `0 2px 24px color-mix(in oklch, still-950 35%, transparent)`

// En Tip.tsx / BotanicSlide.tsx (slide, tip y quote con media):
textShadow: hasMedia ? style.shadow : "none",
```

La sombra hereda el token del tono de fondo del motion style (el mismo del overlay), no un valor hardcodeado:

- `energy` sobre foto → `still-900` con 35% alpha (halo oscuro tras texto `linen-50`).
- `cozy` sobre foto → `linen-100` con 35% alpha (halo claro tras texto `still-950`).
- `minimal` sobre foto → `still-950` con 35% alpha (halo oscuro tras texto `linen-50`).

### Otras reglas

- **Tracking**: `normal` siempre. **Nunca `tracking-tight` ni `tracking-wide`** (rompe The Light Headline Rule).
- **Line-height**: `1.05` para display, `1.1`–`1.2` para h2/slide/tip, `1.5` para body/label.
- **Text-wrap**: `balance` para headlines (≤3 líneas), `pretty` para body.
- **Max-width por línea**: ≤ 85% del ancho del canvas para legibilidad móvil.
- **Text-wrap**: `balance` para headlines (≤3 líneas), `pretty` para body.
- **Max-width por línea**: ≤ 80% del ancho del canvas para legibilidad móvil.

## Mesh estático (The Wind Mesh Rule)

Misma paleta y geometría del mesh de la landing (`src/routes/+page.svelte` líneas 430–631) pero **sin animación** (`breathe`/`drift`) y sin `filter: saturate(1.5)` (ralentiza el render). Tres variantes:

- **`cozy`** (idéntica a la variante suave de la landing): `still-100`/`still-200`/`still-300`/`linen-300` a 22–45% alpha. Se aplica en cover y outro de carruseles/reels cozy.
- **`energy`**: `still-700`/`still-800`/`still-900` + `linen-900` a 50–75% alpha. Fondo de cover en reels energy.
- **`minimal`**: `still-200`/`still-300` + `linen-200`/`linen-300` a 18–30% alpha. Fondo de citas.

**Restricciones**:
- Solo en cover, outro y slides donde no haya foto. **Nunca** debajo de una foto con media.
- `pointer-events: none`, `aria-hidden="true"`.

## Logo y CTA final

- **Logo**: paths SVG de `static/favicon.svg` (componente `video/src/components/Logo.tsx`). Siempre `bg: linen-100`, `fg: still-800`. Tamaño display: 110–120px en reels 9:16, 100–110px en carruseles 4:5.
- **CTA final**: última escena con `logo + handle "@botanic.app"`. CTA en **700** (`weight_price`, dato destacado, como el precio de la landing); handle en **500** (`weight_label`). El color del accent sigue siendo `still-400`/`still-700`/`still-800` según el motion style. Sin texto adicional debajo.

## Overlays sobre imagen

- **Coherencia con el motion style**:
  - `energy` sobre foto: overlay `linear-gradient(180deg, still-900/.15 0%, still-900/.90 100%)` + texto `linen-50` con shadow `0 2px 24px rgba(11,45,16,.35)`.
  - `cozy` sobre foto: overlay `linear-gradient(180deg, linen-100/0 0%, linen-100/.85 100%)` + texto `still-950`.
  - `minimal` sobre foto: overlay `linear-gradient(180deg, still-950/0 0%, still-950/.75 100%)` + texto `still-50`.
- **Contraste**: la opacidad final del overlay garantiza ≥ 4.5:1 de contraste con el texto (WCAG AA).

## Restricciones absolutas (The Portability Rules)

Estas reglas son específicas de motion graphics y **se suman** a las de `DESIGN.md`:

- **The One Family Rule (vídeo)** — solo `Onest Variable`. Nunca `system-ui`, `sans-serif`, `Helvetica`, `Arial` u otra familia externa. El fallback de Tailwind (`system-ui, -apple-system, …`) **no se aplica** en mp4/stills porque Remotion no carga el sistema de tokens; solo vale la familia declarada en `Root.tsx` con `loadFont`.
- **The One Accent Rule (vídeo)** — Still Green es el único acento. El ámbar `star` sigue siendo exclusivo de estrellas (no se usa en reels/carruseles).
- **The Warmth Rule (vídeo)** — todos los neutros salen de la rampa Lino (no `zinc-*` ni grises fríos).
- **No sombras flotantes en mp4** — la elevación se construye con overlay `linear-gradient` sobre la imagen, no con `box-shadow`. Las sombras en mp4 añaden bytes y rompen la regla "elevación por borde" de `DESIGN.md`.
- **No degradados fuera del mesh** — el único patrón decorativo de fondo es la versión estática del mesh. Prohibidos: gradientes cónicos, glassmorphism, neon, rainbow.
- **No Tailwind utility classes en Remotion** — Remotion no resuelve `bg-primary` ni `text-still-900`. Siempre valores oklch directos (`oklch(0.265 0.159 146)`) o `BRAND.still900` desde `video/src/brand.ts`.
- **No `corner-shape: squircle`** — no portable a mp4. Usar `border-radius` generoso (≥ 1rem en chips, ≥ 1.5rem en botones) como sustituto.
- **CTA final obligatorio** — cada reel/carrusel termina con logo + handle. Sin excepciones.

## Do's

- Usar **siempre** `BRAND.*` o `oklch(...)` directamente. Nunca hex hardcodeado.
- Cargar fuentes con `@remotion/fonts` desde `staticFile("fonts/...")`.
- Aplicar overlay oscuro/claro según motion style para garantizar legibilidad AA.
- Mencionar el handle `@botanic.app` en la última escena (consistente con el wordmark de la landing).
- Regenerar `brand.generated.ts` con `bun run tokens` cada vez que cambie `DESIGN.md`.
- Ejecutar `bun run lint:brand` antes de commit. Falla con cualquier hex/fuente externos.
- Auditar el render con `@visual-eval` (subagente `opencode-go/qwen3.7-plus`) tras `bunx remotion render`.

## Don'ts

- No introducir colores fuera de Still/Lino. Si necesitas un tono, ajusta alpha o elige otra rampa.
- No usar `font-family: 'Onest', system-ui, sans-serif`. Solo `Onest Variable`.
- No usar `tracking-tight` ni `font-weight: 900`.
- No usar `box-shadow` ni `filter: drop-shadow` en mp4.
- No usar `bg-primary` / `text-foreground` de Tailwind. Chrome no los resuelve sin Tailwind compilado.
- No usar mesh animado (`breathe`/`drift`) en mp4/stills — solo la versión estática.
- No hardcodear tokens en código. Si añades un color, primero al frontmatter de `DESIGN.md`, luego `bun run tokens`.

## Implementación técnica

| Archivo | Rol |
|---|---|
| `video/src/brand.ts` | Exporta `BRAND` (re-exporta `brand.generated.ts` + tipos semánticos). |
| `video/src/brand.generated.ts` | ⚠️ Auto-generado por `bun run tokens`. No editar a mano. |
| `video/src/styles.ts` | `getStyle(name)` mapea `MotionStyle` → `StyleTokens` (bg/text/accent/overlay). |
| `video/src/mesh.ts` | Componente `<MeshBackground variant="cozy"\|"energy"\|"minimal" />`. |
| `video/src/Root.tsx` | Carga Onest con `@remotion/fonts` + registra composiciones. |
| `video/src/components/Logo.tsx` | SVG paths de `static/favicon.svg`, bg/fg desde `BRAND`. |
| `video/src/components/scenes/Hook.tsx` · `Tip.tsx` · `Outro.tsx` | Composición por motion style. |
| `video/src/BotanicReel.tsx` · `BotanicSlide.tsx` | Composiciones 9:16 / 4:5. |
| `scripts/sync-brand-tokens.mjs` | Lee frontmatter de `DESIGN.md` → `brand.generated.ts`. |
| `scripts/copy-fonts.mjs` | Copia Onest woff2 a `static/fonts/`. |
| `scripts/lint-brand.mjs` | Caza hex hardcodeados y `font-family` que no sea `Onest Variable`. |
| `.opencode/agents/visual-eval.md` | Audita coherencia de marca (bloque "Coherencia de marca" en la respuesta). |

## Auditoría de coherencia

Tras cada render (`bunx remotion render` o `bunx remotion still`):

1. **Lint**: `bun run lint:brand` (debe pasar).
2. **Visual**: `@visual-eval video/out/<slug>.mp4` — el subagente responde con las secciones fijas más una nueva **"Coherencia de marca"** que evalúa:
   - **Tipografía**: ¿se ve Onest Variable? (curvas humano-geometricas, sin serif, sin monospace).
   - **Paleta**: ¿los fondos/acabados salen de Still/Lino? Penalizar si hay magenta, naranja saturado o grises fríos.
   - **Overlay**: ¿oscuro sobre foto para legibilidad?
   - **CTA final**: ¿logo + handle presentes en la última escena?
   - **Mesh**: si hay mesh, ¿está en Still/Lino (no en neón)?

Si la recomendación es ≠ `usar`, iterar.
