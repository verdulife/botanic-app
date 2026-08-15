# Posts de Instagram — Guía y arquitectura (IG feed + carruseles)

Carril de **imágenes estáticas** para el feed de Instagram (posts simples 1:1 y carruseles 4:5/1:1), generado de forma **agéntica** con el mismo motor de render que los reels: un humano aporta título + concepto, opencode genera el guion (`script.json`), descarga las fotos (Pexels), y Remotion renderiza los **stills** (PNG). Carril paralelo al blog y a los reels: no bloquea el MVP.

## Decisiones tomadas

| Decisión | Opción | Motivo |
|---|---|---|
| Tecnología de render | **Remotion `npx remotion still`** (mismo motor que reels) | Una sola biblioteca de motion para video e imagen; componentes reutilizables entre carrusel y reel |
| Formato | Carrusel **4:5 (1080×1350)** por defecto; 1:1 para citas y piezas simples | 4:5 maximiza espacio en feed móvil |
| Guion | Mismo `script.json` que los reels (subconjunto: escenas `slide`) | Un formato, un pipeline |
| Plantillas de slide | `Tip` (consejo+imagen), `Quote` (cita minimal), `Cover` (portada del carrusel), `Outro` (CTA) | Reutiliza los fragmentos de la biblioteca |
| Fuentes de foto | **Pexels API** (fotos portrait) | Atribución no requerida; mismo sourcing que reels |
| Tipografía | Onest bold, mismo sistema de estilos `energy`/`cozy`/`minimal` | Coherencia de marca en todo el feed |
| Publicación | Manual: Meta Business Suite (programador gratuito) | APIs de IG no permiten posteo automático gratis |
| Cadencia | 2-3x/semana, batch semanal | Consistencia sin saturar feed |
| Relación con reels | ~50% del contenido carrusel = repurpose de un post del blog; el resto ideas originales | El blog alimenta ambos carriles |

## Flujo agéntico

```
1. HUMANO    → título + concepto
2. GUION     → opencode genera src/lib/social/posts/<slug>/script.json
               (plantilla carrusel del catálogo + estilo)
3. ASSETS    → scripts/stock.mjs (Pexels) por contexto de cada slide
4. RENDER    → npx remotion still → out/<slug>/slide-N.png (1080×1350)
5. REVISIÓN  → humano (copy, precisión botánica, marca)
6. PROGRAMAR → batch semanal → Meta Business Suite (manual)
```

## script.json (subconjunto carrusel)

```json
{
  "title": "5 plantas imposibles de matar",
  "style": "energy",
  "template": "carousel-tips",
  "platform": ["ig"],
  "scenes": [
    { "type": "cover", "text": "5 plantas imposibles de matar", "duration": 0 },
    { "type": "slide", "text": "Sansevieria: riego mensual", "media": "pexels:<id>", "duration": 0 },
    { "type": "slide", "text": "Pothos: tolera poca luz", "media": "pexels:<id>", "duration": 0 },
    { "type": "outro", "cta": "Guarda este carrusel 🌿", "logo": true, "duration": 0 }
  ]
}
```

- Las escenas tipo `cover`/`slide`/`outro` se renderizan como PNG (`npx remotion still` por frame), no como video.
- Cada slide: imagen de fondo (foto Pexels, oscurecida con overlay de marca) + tipografía Onest bold.
- `ProgressDots` indica la posición dentro del carrusel en cada slide.

## Plantillas de slide

| Plantilla | Uso | Composición |
|---|---|---|
| `Cover` | Portada del carrusel | Logo + título grande + mesh oficial + hint "swipe →" |
| `Tip` | Consejo + foto | Imagen fondo + overlay `linear-gradient` + texto destacado (Onest Variable) |
| `Quote` | Cita / statement de marca | Fondo minimal, texto centrado, mucho aire |
| `Outro` | CTA final | Logo + handle + "sigue / guarda / waitlist" |

**Estilo visual**: tokens de [`DESIGN.md`](../DESIGN.md); surface brief en [`video/DESIGN.reels.md`](../video/DESIGN.reels.md). Tipografía única Onest Variable, paleta Still/Lino, mesh estático de marca. Antes de renderizar: `bun run tokens && bun run fonts && bun run lint:brand`.

## Imágenes: sourcing (Pexels)

- `bun run stock search "<query>"` → fotos portrait de Pexels.
- `bun run stock fetch <nº> <dest>` → descarga local (jpg/webp vía sharp) bajo `static/social/<slug>/`.
- API key `PEXELS_API_KEY` en `.env.local`. **Atribución no requerida** (licencia Pexels).
- El resto de reglas de sourcing (no Commons/Unsplash en redes) aplican igual que en reels.
- **Evaluación visual**: cada foto descargada se pasa al subagente [`visual-eval`](social-eval.md) (`opencode-go/qwen3.7-plus`) antes de fijarla en `script.json`. Si recomienda rebuscar, se ajusta el query.

## Publicación y cadencia

- **Cadencia**: 2-3x/semana (difusion.md), batch semanal.
- **Programación**: manual — Meta Business Suite (gratuito, permite programar carruseles e imágenes).
- **Métricas a vigilar**: saves (guardados), shares, alcance, conversión vía link en bio → waitlist.

## Guía de estilo para generación IA

- **Tone**: Botanic — cercano, claro, útil.
- **Slide**: 1 idea por slide, ≤6-8 palabras legibles, Onest bold.
- **Estructura carrusel**: cover → 4-5 slides de contenido → CTA final.
- **Mix**: ~80% tips/cuidados, ~20% estética/historias de marca.
- **CTA**: siempre slide final con logo + handle.
- **Noticias/factual**: revisión humana obligatoria de precisión botánica.
- **Idioma**: español (market España).

## Estado de implementación

- [x] Docs (este + `social-video.md`)
- [x] `video/` scaffold + browser ensure
- [x] Componentes `Cover`/`Tip`/`Quote`/`Outro` + `styles/*` (en `BotanicSlide.tsx`)
- [x] `scripts/stock.mjs` (Pexels, probado en real)
- [x] Skills en `.opencode/skills/` (`remotion-best-practices`)
- [x] `src/lib/social/_drafts/ + posts/`
- [x] **PoC end-to-end**: carrusel 4:5 (cover + slide con foto Pexels de fondo) ✓
- [x] **Alineación al design system** (idem reels: tokens, Onest Variable, lint:brand, jerarquía tipográfica de la landing)

**Pendiente (por orden):**

- [ ] **1. Re-render + auditoría visual** — regenerar `video/out/poc-carousel-*.png` (cover ahora 300, slides 700 + shadow) y pedir revisión humana (parar y preguntar; no usar `@visual-eval`)
- [ ] **2. Extraer escenas propias** — mover `Cover`/`Tip`/`Quote`/`Outro` de `BotanicSlide.tsx` a `video/src/components/scenes/*` reutilizables con los reels
- [ ] **3. Batch semanal operativo** — cadencia 2-3x/semana, ~50% repurpose del blog
