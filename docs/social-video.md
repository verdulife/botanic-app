# Reels Botanic — Guía y arquitectura (IG + TikTok)

Carril de video vertical (`reels` en Instagram + `TikTok`) generado de forma **agéntica**: un humano aporta título + concepto, opencode (con el Agent Skill de Remotion) genera el guion (`script.json`), descarga imágenes/clips según contexto (Pexels), y un renderer determinista produce el `mp4` 9:16. Carril paralelo al blog y a los posts estáticos: **no bloquea el MVP**.

## Decisiones tomadas

| Decisión | Opción | Motivo |
|---|---|---|
| Tecnología de render | **Remotion** (React, código como fuente de verdad) | Motion graphics real (no Ken Burns), determinista, batch, versionable en git, coste 0 |
| Formato del guion | `script.json` = **inputProps** de la composición | Sin capa de transformación: el mismo archivo que revisa el humano alimenta el render |
| Biblioteca de motion | **Adoptar librerías prehechas** (RemotionUI, Remotion Scenes, Onda, TikTokTextBox, SwiftClip) evaluadas por preview en Studio | No reinventar animaciones; escenas que ya funcionan estéticamente |
| Estructura en repo | `video/` como **carpeta autónoma** (package.json propio, fuera de workspaces y de la build de Vercel) | Deploy Vercel sigue en ~30s; Remotion no entra en la app SvelteKit |
| Browser | **Chrome Headless Shell** descargado por Remotion (no Puppeteer/Playwright) | Versión pinned determinista, ~50% más ligero que Chrome completo |
| Fuentes de stock | **Pexels API** (fotos + clips de vídeo 9:16) | Atribución no requerida, B-roll vertical real para dar movimiento |
| Motion styles | **3 sistemas**: `energy` / `cozy` / `minimal` | Energía, calidez orgánica y editorial; A/B de qué mueve más |
| Duración | ~20s (5-6 slides), hook primer frame, CTA final | Ritmo TikTok + formato consejo |
| Audio | Fase 2: Pixabay audio + edge-tts (TTS español) | Diferido; el pipeline genera el vídeo **sin pista** |
| Publicación | Manual: Meta Business Suite (IG) + TikTok Studio | Las APIs sociales no permiten posteo automático gratis |
| Cadencia | 3-4x/semana, batch semanal generado por adelantado | Consistencia sin quemar audiencia |

## Flujo agéntico

```
1. HUMANO    → título + concepto (más o menos ampliado)
2. GUION     → opencode genera src/lib/social/posts/<slug>/script.json
               usando una plantilla del catálogo (templates/manifest.json) + un estilo
3. ASSETS    → opencode ejecuta scripts/stock.mjs (Pexels) por contexto de cada escena
4. COMPOSICIÓN → video/BotanicReel.tsx mapea cada escena del JSON → componente prehecho
5. RENDER    → npx remotion render → out/<slug>.mp4 (1080×1920)
6. REVISIÓN  → humano (copy, precisión botánica, marca)
7. PROGRAMAR → batch semanal → Meta Business Suite + TikTok Studio (manual)
```

**Principio rector**: el agente escribe **datos** (`script.json`), nunca animación. La biblioteca de motion se construye/adopta una vez; el LLM solo compone. Menor coste de tokens, computación y tiempo, con calidad estética garantizada.

**Evaluación visual**: el subagente [`visual-eval`](social-eval.md) (`opencode-go/qwen3.7-plus`) verifica cada asset descargado con Pexels y audita los mp4 renderizados. Invocado automáticamente por el build agent tras `bun run stock fetch`.

## script.json (inputProps)

```json
{
  "title": "3 errores al regar tu monstera",
  "style": "energy",
  "template": "tip-stack",
  "duration": 20,
  "platform": ["ig", "tiktok"],
  "scenes": [
    { "type": "hook",  "text": "¿Riegas tu monstera así?", "duration": 2 },
    { "type": "tip",   "text": "Error 1: agua del grifo",  "media": "pexels:<id>", "duration": 4 },
    { "type": "tip",   "text": "Error 2: riego sin drenaje", "media": "pexels:<id>", "duration": 4 },
    { "type": "outro", "cta": "Sigue para más cuidados 🌱", "logo": true, "duration": 3 }
  ]
}
```

- `media` referencia a la fuente (p. ej. `pexels:<id>`) o ruta local bajo `static/social/<slug>/`.
- La composición `BotanicReel` recibe este JSON como props: `npx remotion render ... --props="./script.json"`.

## Biblioteca de fragmentos reutilizables

| Fragmento | Uso | Origen |
|---|---|---|
| `Hook` | Primer frame con gancho + kinetic type | RemotionUI / propio |
| `Tip` | Consejo + imagen/clip, animación por estilo | RemotionUI / Remotion Scenes |
| `Outro` | **Pantalla final: logo + CTA + handle** | RemotionUI `end-card` adaptado |
| `Transition` / `BrandSprite` | Brote animado de marca entre escenas | Onda / propio |
| `ProgressDots` | Indicador de avance del carrusel | Remotion Scenes |

Catálogo de plantillas/estilos en `video/templates/manifest.json` (lo consulta el agente para generar guiones válidos).

## Sistemas de estilo (motion languages)

| Estilo | Personalidad | Easing/movimiento |
|---|---|---|
| `energy` | dinámico, enérgico, punch | springs rápidos, kinetic type agresivo, cortes secos |
| `cozy` | orgánico, cálido, acogedor | easing suave, escala/fade lento, formas redondeadas, motivos hoja |
| `minimal` | editorial, limpio, tipográfico | movimiento contenido, mucho aire, seriedad |

Cada estilo es un set de tokens (`video/src/styles/*.ts`): colores de marca (oklch), tipografía Onest, easing, timing. Los componentes los consumen por prop `style`.

## Arquitectura técnica

- **`video/`** es un proyecto Remotion **autónomo** con su propio `package.json` y `node_modules`. La app SvelteKit (raíz) no lo importa ni lo instala: `bun install` en raíz no lo toca, Vercel no lo builda. Render solo local (o CI aparte si algún día).
- **Estilo visual**: toda superficie visual hereda tokens de [`DESIGN.md`](../DESIGN.md) (autoridad global, impeccable). El surface brief específico está en [`video/DESIGN.reels.md`](../video/DESIGN.reels.md). Antes de cualquier render: `bun run tokens && bun run fonts && bun run lint:brand`.
- **Deps**: `remotion`, `@remotion/cli`, React. Browser: Chrome Headless Shell (`npx remotion browser ensure`). Compatible con Bun.
- **Renderer**: `video/src/BotanicReel.tsx` lee `inputProps` y compone `Sequence`s por escena.
- **Studio**: `npx remotion studio` para preview en tiempo real y decidir entre librerías.
- **Stills**: el carrusel de IG = los mismos componentes renderizados como PNG (`npx remotion still`), 1080×1350 (4:5) o 1080×1080.
- **Estilos de marca**: reutiliza tokens de `scripts/generate-og.mjs` (gradient oklch + Onest).

### Estructura

```
video/
├── package.json              # autónomo, fuera de workspaces
├── remotion.config.ts
├── templates/manifest.json   # catálogo de plantillas/estilos para el agente
└── src/
    ├── Root.tsx
    ├── BotanicReel.tsx       # script.json → composición
    ├── scenes/               # Hook, Tip, Outro, Transition, BrandSprite (adoptados/adaptados)
    ├── styles/               # energy.ts | cozy.ts | minimal.ts
    └── assets/               # logo, gradient de marca
src/lib/social/
├── _drafts/<slug>/script.json    # en trabajo (fuera de render por defecto)
└── posts/<slug>/script.json      # revisados/programados
static/social/<slug>/             # assets descargados (Pexels) + out
scripts/
└── stock.mjs                 # Pexels: fotos + vídeo vertical → static/social/
.opencode/skills/remotion     # Agent Skill oficial de Remotion
.opencode/skills/motion-skills# pack TikTok/Reels (iart-ai)
```

## Imágenes y vídeo: sourcing (Pexels)

- `bun run stock search "<query>"` → lista fotos (con filtro orientación vertical/portrait) y clips de vídeo 9:16 de Pexels.
- `bun run stock fetch <nº> <dest>` → descarga al asset local (foto jpg/webp vía sharp; clip mp4) y registra la referencia.
- API key en `.env.local` (`PEXELS_API_KEY`). Límites: 200 req/h, 20.000/mes (de sobra).
- **Atribución**: no requerida por la licencia Pexels; opcional agradecer al autor en el copy. **No** usar Commons ni Unsplash en redes (Commons queda para el blog; Unsplash descartado).
- **Evaluación visual**: cada asset descargado se pasa al subagente [`visual-eval`](social-eval.md) (`opencode-go/qwen3.7-plus`) antes de fijarlo en `script.json`. Para clips de vídeo y mp4 renderizados por Remotion, primero `bun run frames <mp4> <png>` para generar un contact-sheet y luego `@visual-eval` sobre el PNG.

## Audio (Fase 2, diferido)

- **Música**: Pixabay audio (licencia limpia, sin atribución).
- **Narración**: edge-tts (voz Microsoft, español, gratis, sin cuenta) → mp3.
- **Captions sincronizadas**: faster-whisper (local) para word-timestamps → estilo karaoke.
- Se integra con `@remotion/captions` y `<Audio>` de Remotion. El pipeline actual genera el mp4 **sin pista**; la música se puede añadir también desde la librería de la propia app (IG/TikTok) al publicar.

## Publicación y cadencia

- **Cadencia**: 3-4x/semana (difusión.md). Batch semanal generado y revisado por adelantado.
- **Programación**: manual — Meta Business Suite (IG, gratuito) + TikTok Studio (programador nativo). No hay cron porque las APIs sociales no permiten posteo automático gratuito.
- **Mix de contenido**: 50/50 repurpose del blog (un post → carrusel/reel) + ideas originales.
- **Métricas a vigilar** (batch a batch): retención >30s, shares, conversión a la waitlist (CTA con link en bio).

## Guía de estilo para generación IA

- **Tone**: Botanic — cercano, claro, útil. Público Plant Lovers. Sin clickbait, sin relleno.
- **Hook**: frase corta con tensión/curiosidad en los primeros 1.5-2s. Texto grande (se ve en silencio).
- **Estructura reel**: hook → 3-4 tips/value → CTA (sigue, guarda, waitlist).
- **Texto**: ≤6-8 palabras por slide legible en móvil; Onest bold.
- **Mix**: ~80% tips/cuidados/propagación, ~20% estética/historias de marca (estilo `cozy`/`minimal`).
- **CTA**: siempre pantalla final con logo + handle. En IG, link en bio → waitlist.
- **Noticias/factual**: revisión humana obligatoria de precisión botánica antes de programar.
- **Idioma**: español (market España).

## Estado de implementación

- [x] Docs (este + `social-post.md`)
- [x] `video/` scaffold + browser ensure
- [x] `BotanicReel.tsx` + `styles/*` (energy/cozy/minimal)
- [x] `templates/manifest.json`
- [x] `scripts/stock.mjs` (Pexels, probado en real: fotos + clips 9:16)
- [x] Skills en `.opencode/skills/` (`remotion-best-practices`)
- [x] `src/lib/social/_drafts/ + posts/`
- [x] **PoC end-to-end**: `script.json` → Pexels → `mp4` 9:16 + stills carrusel 4:5 ✓
- [x] **Alineación al design system**: tokens oklch vía `bun run tokens` (`brand.generated.ts`), fuente variable Onest en `static/fonts/` (`bun run fonts`), `bun run lint:brand`, jerarquía tipográfica exacta de la landing (display 300, strong 600, label 500, dato destacado 700, nunca 800/900; excepción 700 + `text-shadow` token-based sobre foto). Detalle en `video/DESIGN.reels.md`

**Pendiente (por orden):**

- [ ] **1. Pruebas con Remotion Studio** — evaluar en paralelo vía `bun run studio` las librerías decididas en el plan (RemotionUI `social-clip`, Remotion Scenes, Onda, TikTokTextBox, SwiftClip) y adoptar las que pasen el preview como `video/src/components/scenes/*` propias
- [ ] **2. Re-render + auditoría visual del PoC** — regenerar `video/out/poc-reel-v2.mp4` (pesos/sombras corregidos) y pasar por `@visual-eval` (contact sheet: `bun run frames`)
- [ ] **3. Clip de vídeo de fondo en escenas `tip`** — hoy solo foto; el mp4 Pexels se descarga (`stock fetch:video`) pero la escena usa `<Img>`
- [ ] **4. Audio Fase 2** — Pixabay (música) + edge-tts (narración español) + faster-whisper (word-timestamps) + `@remotion/captions`
- [ ] **5. Batch semanal operativo** — hito 6 del plan original (cadencia 3-4x/semana)

> Nota: este modelo no recibe imágenes; toda auditoría visual del render la hace el humano o `@visual-eval`.
