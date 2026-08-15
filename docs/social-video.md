# Reels Botanic — Guía y arquitectura (IG + TikTok)

Carril de video vertical (`reels` en Instagram + `TikTok`) generado de forma **agéntica**: un humano aporta título + concepto, opencode (con el Agent Skill de Remotion) genera el guion (`script.json`), descarga imágenes/clips según contexto (Pexels), y un renderer determinista produce el `mp4` 9:16. Carril paralelo al blog y a los posts estáticos: **no bloquea el MVP**.

## Decisiones tomadas

| Decisión | Opción | Motivo |
|---|---|---|
| Tecnología de render | **Remotion** (React, código como fuente de verdad) | Motion graphics real (no Ken Burns), determinista, batch, versionable en git, coste 0 |
| Formato del guion | `script.json` = **inputProps** de la composición | Sin capa de transformación: el mismo archivo que revisa el humano alimenta el render |
| Biblioteca de motion | **Adoptar librerías prehechas restilizadas a marca vía composición `Catalog`** (RemotionUI + `ondajs`; TikTokTextBox/SwiftClip a petición; onda.video/onda-engine descartado: motor GPU independiente, no es Remotion) | No reinventar animaciones; escenas que ya funcionan estéticamente |
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

**Evaluación visual**: el subagente [`visual-eval`](social-eval.md) (`opencode-go/qwen3.7-plus`) verifica cada asset de stock descargado con Pexels (foto o clip) contra el contexto de la escena. Invocado automáticamente por el build agent tras `bun run stock fetch`. Los renders propios NO se auditan con `visual-eval`: la verificación de calidad es humana (parar y preguntar).

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
- **Evaluación visual**: cada asset de stock descargado se pasa al subagente [`visual-eval`](social-eval.md) (`opencode-go/qwen3.7-plus`) antes de fijarlo en `script.json`. Para clips de vídeo (stock Pexels), primero `bun run frames <mp4> <png>` para generar un contact-sheet y luego `@visual-eval` sobre el PNG. Los renders de Remotion no se auditan con `visual-eval` (verificación humana: parar y preguntar).

## Audio

- **Música**: Pixabay Music (Pixabay License, **sin atribución**, comercial OK). Integrada vía `<Audio src={staticFile("social/<slug>/music.mp3")} volume={0.6} />` dentro del `AbsoluteFill` de `BotanicReel.tsx`. Remotion recorta el audio al `durationInFrames` automáticamente.
- **Búsqueda de música**: la API pública de Pixabay **no expone música** (solo imágenes y vídeos). Flujo real: el usuario abre `https://pixabay.com/music/search/?q=bossa+nova` (o equivalente) en el navegador, elige un track, descarga el mp3 a `static/social/<slug>/music.mp3`. Otras fuentes libres sin atribución: **Mixkit** (mixkit.co), **FMA CC0**. Uppbeat descartado (free tier requiere atribución en la descripción del post).
- **Narración** (Fase 2): edge-tts (voz Microsoft, español) → mp3.
- **Captions sincronizadas** (Fase 2): faster-whisper local → `@remotion/captions`.

**Implementado**: el primer reel (`coleccionistas-de-esquejes`) ya incluye audio MP3 brasileño libre a `volume={0.6}`. Audio en slides pendiente.

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
- [x] **Política `visual-eval`** aplicada (solo audita stock; renders propios = auditoría humana)
- [x] **Reel #1 publicable**: `coleccionistas-de-esquejes` ("3 cosas que solo entiendes si eres Plant Lover"). Render entregado: `video/out/coleccionistas-de-esquejes.mp4` (16.2 MB, 23.5s, 1080×1920). Patrones nuevos: hook con slide-in desde la derecha (`translateX(40vw → 0)`); tip con caja glass (`still-950` 70% + `backdropFilter: blur(24px)`, **excepción documentada a "no glassmorphism"** aprobada); wordmark con **path draw escalonado** (B-o-t → sprout → a-n-i-c, `strokeDasharray="100 101"` evita el puntito inicial, fill escalonado, `strokeOpacity` funde el outline al final); ending separado en dos escenas (`outro` solo texto + fade-out, `cta` logo con path draw + botón pill `www.botanicapp.es`); audio MP3 libre (Pixabay) integrado.
- [x] **`monstera-riego`** mantenido como **plantilla técnica** — no se publica.

**Pendiente (por orden):**

- [ ] **1. Plantillas Remotion de reels en GitHub** — buscar y evaluar candidatos con criterios de diseño (Onest/sans cálida, paleta neutra/cálida), animaciones (typewriter/slide-in/fade-in), estructura hook→tips→cta, mantenimiento (último commit < 6 meses) y compatibilidad con Remotion 4. Umbral: ≥4/5 en criterios clave. Antes de forkar, hacer la **prueba de velocidad**: crear `src/lib/social/_drafts/segundo-reel/` y medir cuánto tarda de principio a fin. Si < 30 min/reel → el pipeline actual ya es "template-like", el fork no compensa.
- [ ] **2. Catálogo de elementos 9:16** — composición `Catalog` (`video/src/catalog/`) con slots INTRO/HOOK/TIP/QUOTE/OUTRO/TRANSICIÓN/ENDING (empieza vacía). Sesiones por elemento: elegir componente (RemotionUI `npx remotion-ui add <c>`, Onda `npx ondajs add <c>`) → restilizar a marca → revisar en Studio → `git commit` + inventario en `video/CATALOG.md`. Hito 1 = INTRO
- [ ] **3. Cablear elementos aprobados** en `BotanicReel.tsx`/`BotanicSlide.tsx` (eliminar duplicación: `SlideContent` inline, `Outro`/`ProgressDots` duplicados, `Tip` sin soporte vídeo).
- [ ] **4. Audio en slides** — incorporar `<Audio>` a `BotanicSlide.tsx`.
- [ ] **5. Batch semanal operativo** — hito 6 del plan original (cadencia 3-4x/semana).

> Nota: este modelo no recibe imágenes; la auditoría visual del render es humana (parar y preguntar). `visual-eval` es solo para verificar stock.
