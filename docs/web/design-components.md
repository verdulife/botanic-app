# Design — Componentes de la landing (resumen)

Reglas con nombre, decisiones de diseño y enlaces al código. Spec pixel-a-pixel vive en `src/routes/+page.svelte` (landing completa inline, ~590 líneas) + componentes extraídos.

## Reglas de diseño

- **Fan Rule** (abanico de anuncios en hero): 3 tarjetas con `perspective: 1400px` + `rotateY(-8deg)`. Rotación automática cada 2.5s, pausa en hover/focus, desactivada con `prefers-reduced-motion`. Curva `cubic-bezier(0.22,1,0.36,1)`. CSS en `src/routes/+page.svelte` (clases `.fan-stage`, `.fan-card`).
- **Waitlist Flip Rule**: tarjeta de confirmación con perspectiva + flip 3D en `onsuccess`. Altura gestionada por JS (`syncHeight`) en móvil; desktop = absoluto sin altura fija. Cara trasera: composición "Semilla fundadora" sobre `tranquil-200`. Ver: `WaitlistForm.svelte` + `founder-card.ts`.

## Componentes

| Componente | Función | Ubicación |
|---|---|---|
| Header | Logo + nav | `src/lib/components/AppHeader.svelte` |
| Logo wordmark | "Bo" + Sprout + "anic", escalado en `em` | `src/lib/components/Logo.svelte` |
| Hero + Abanico + Categorías + Funcionalidades + Por qué + Waitlist + Footer | Todo inline en secciones comentadas (`<!-- Hero -->`, etc.) | `src/routes/+page.svelte` |
| Waitlist form | Form compartido (landing + blog) | `src/lib/components/waitlist/WaitlistForm.svelte` |
| Waitlist CTA wrapper | Reutilizado al final de landing y blog | `src/lib/components/blog/BlogCta.svelte` |
| Semilla fundadora | PNG 1080×1350 generado en cliente (Canvas2D) | `src/lib/founder-card.ts` |
| Footer | Línea centrada con corazón | `src/lib/components/AppFooter.svelte` |

## Convenciones

- Tipografía: Fraunces (display, optical) + Inter (UI) + JetBrains Mono (eyebrows/tags) — variables self-hosted.
- Iconos: lucide-svelte con `aria-hidden="true"` si decorativos.
- Imágenes: `.webp` con `.jpg` gemelo, servidas localmente, soft cap 100 KB.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).