# Catálogo de elementos 9:16 (Botanic)

**Qué es**: un vídeo-catálogo en la composición `Catalog` (1080×1920, 30 fps) que reúne los **elementos reutilizables** del carril social (intro, hooks, tips, quotes, outros, transiciones, endings). Cada segmento está etiquetado en el timeline y en pantalla. Es una **herramienta de sesión**, no un producto final: se construye elemento a elemento con el usuario.

**Cómo se usa**: `bun run studio` en `video/` → composición `Catalog` → arrastra/scrollea por los segmentos. Los slots vacíos muestran su placeholder (mesh + etiqueta). Al aprobar un elemento, se asigna a su slot y el segmento queda con contenido real.

## Ritual de aprobación (por elemento)

1. El usuario elige un componente (RemotionUI, Onda, propia o a medida) para un segmento.
2. Instalar: `npx remotion-ui@latest add <componente>` (o `npx ondajs add <componente>`) desde `video/`.
3. **Restilizar a marca** (ver reglas abajo) e integrarlo en el slot (`video/src/catalog/slots.tsx` → `element: <Componente ... />`).
4. Revisar en Studio: tamaños, colores, composición, legibilidad, tiempos.
5. Ajustar hasta que pase.
6. **Guardar = `git commit`** (un commit por elemento aprobado) + actualizar el inventario de abajo.

Solo se trabaja 9:16 de momento; la variante 4:5 (posts) se retoma después.

## Reglas de marca al restilizar (no negociable)

Fuente completa: `video/DESIGN.reels.md` y `DESIGN.md`.

- **Tipografía**: solo las **3 familias del sistema** (Fraunces Variable + Inter Variable + JetBrains Mono Variable, tokens `FONT_FAMILY`/`FONT_FAMILIES` en `src/brand.ts`). Jerarquía: Fraunces 400 (+ opsz 144 SOFT 30) display con strongs italic + still-400; Inter 300 body con strongs 600; JetBrains Mono 400 uppercase tracking still-500 en eyebrows. Botones Inter 600. **Nunca 800/900.** `letterSpacing: normal` excepto eyebrow (`0.04em`), `textWrap: balance` en titulares.
- **Color**: solo paleta oklch Still/Lino (tokens `COLORS` en `src/brand.ts`), o tokens semánticos de estilo (`energy`/`cozy`/`minimal`).
- **Radios**: solo `--radius: 0.625rem` (o `full` para pills/chips).
- **Fondos**: mesh oficial (`MeshBackground`) o token `background` del estilo. **Sin `box-shadow`**, **sin gradientes fuera del mesh**, sin patrones ajenos.
- **Sobre foto**: peso 700 + `text-shadow` al 35% del bg-token.
- **Marca**: logo vectorial (`Logo.tsx`), `cta_handle` `@botanic.app` en CTAs.
- Cualquier componente de librería hereda su "motion identity" por defecto; **no es un lock**: al copiar el source (source-you-own) se re-skinnean colores/fuentes vía CSS variables (`--onda-*`, etc.) apuntando a los tokens de marca.

## Inventario

| Segmento | Estado | Componente | Origen | Notas |
|---|---|---|---|---|
| INTRO | 🔲 vacío | — | — | — |
| HOOK | 🔲 vacío | — | — | — |
| TIP | 🔲 vacío | — | — | — |
| QUOTE | 🔲 vacío | — | — | — |
| OUTRO | 🔲 vacío | — | — | — |
| TRANSICIÓN | 🔲 vacío | — | — | — |
| ENDING | 🔲 vacío | — | — | — |

## Al final del catálogo

- Cablear los elementos aprobados en `BotanicReel.tsx` / `BotanicSlide.tsx` (eliminar duplicación: `SlideContent` inline, `Outro`/`ProgressDots` duplicados, `Tip` sin soporte vídeo).
- Actualizar `docs/social-video.md`, `docs/social-post.md`, `AGENTS.md` y `video/README.md`.
- Audio fuera (Fase 2).
