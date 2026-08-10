# Subagente `visual-eval` — evaluación visual

Subagente de opencode (`.opencode/agents/visual-eval.md`, modelo `opencode-go/qwen3.7-plus`) que evalúa imágenes usando visión. Su único trabajo: mirar una imagen y devolver una evaluación estructurada.

## Cuándo se usa

| Caso | Pre-requisito | Comando |
|---|---|---|
| Verificar una **foto** descargada de Pexels antes de meterla como `media` en `script.json` | haber hecho `bun run stock fetch <nº> <dest>` | `@visual-eval <ruta> — <contexto de la escena>` |
| Auditar un **mp4** renderizado por Remotion o un clip Pexels descargado | generar el contact-sheet | `bun run frames <mp4> <out.png>` → `@visual-eval <out.png> — evalúa este contact sheet…` |

El build agent **lo invoca automáticamente** tras cada `bun run stock fetch` (regla en `AGENTS.md`), y tú también puedes invocarlo manualmente con `@visual-eval`.

## Lo que devuelve

Markdown estructurado:

- **Contenido**: qué se ve.
- **Adecuación al contexto**: ✓ / ⚠ / ✗ con motivo.
- **Problemas visuales**: borrosidad, encuadre, contraste, texto cortado, marca de agua, etc.
- **Recomendación**: `usar` / `rebuscar("<query alternativa>")` / `recortar a <sugerencia>`.

## Permisos del subagente

Solo `read` (para ver la imagen). Todo lo demás (`edit`, `bash`, `webfetch`, `task`, etc.) denegado. Hoja pura: evalúa y termina.

## El script `frames`

`bun run frames <input.mp4> <out.png> [count=8] [cols=4] [thumb=280]`

- Extrae frames a 10 fps con `ffmpeg-static` (devDep).
- Selecciona `count` equidistantes, etiqueta cada uno con `m:ss.x · <slug>` (SVG sobre banda semitransparente vía `sharp`).
- Compone grid `cols × ⌈count/cols⌉` con gutter 8px sobre fondo crema (`#f7f3ec`).
- Imprime la ruta absoluta del PNG para que el caller se la pase al subagente.

Para reels largos (>60s) reduce `count` o `cols` para mantener legibilidad.

## Ejemplo de invocación (manual)

```
@visual-eval static/social/monstera-riego/pexels-17619301.jpg — debe ser una monstera en encuadre vertical 9:16, usable como media del tip "Error 1: agua del grifo" en un reel estilo energy.
```

Respuesta esperada:

```
## Contenido
Hoja de monstera en primer plano, encuadre vertical, fondo desenfocado con luz cálida.

## Adecuación al contexto
✓ encaja — sujeto correcto, encuadre 9:16.

## Problemas visuales
- Ligero desenfoque en bordes (aceptable como fondo).

## Recomendación
usar
```

Si no encaja, el subagente sugerirá `rebuscar("monstera watering close-up")` o similar.

## Estado de implementación

- [x] Subagente `.opencode/agents/visual-eval.md` (frontmatter + prompt)
- [x] Permiso `task: visual-eval: allow` en build agent (`opencode.json`)
- [x] Regla de invocación en `AGENTS.md` (Reglas de trabajo)
- [x] `scripts/video-frames.mjs` con ffmpeg-static + sharp
- [x] DevDep `ffmpeg-static` en `package.json` raíz
- [x] Probado: `bun run frames video/out/poc-reel.mp4 scripts/.tmp/poc-reel-grid` → grid 1160×1120, 75.8 KB, 8 frames con timestamps
