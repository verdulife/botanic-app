---
name: tailwind-4-docs
description: Tailwind CSS v4 guidance for implementing, refactoring and reviewing styles. Use when writing or reviewing Tailwind v4 classes, configuring @theme / @utility / @variant, or migrating from v3. Ships a curated playbook and a gotchas list; for exhaustive reference, consult the official docs.
---

# Tailwind v4

Guía curada de Tailwind CSS v4 para este proyecto. No incluye el corpus de documentación: se apoya en un playbook y en una lista de trampas, y para el detalle exhaustivo se consultan las docs oficiales.

## Cómo usarla

1. Antes de escribir o revisar clases, lee `references/gotchas.md`. Es una lista corta de trampas que en v4 fallan sin avisar.
2. Para implementar, refactorizar o revisar, lee `references/engineering-playbook.md`.
3. Si el detalle no está en ninguno de los dos, consulta https://tailwindcss.com/docs o la guía de plataforma `modern-web-guidance`. No inventes sintaxis de v4.

## Qué hay aquí

- `references/engineering-playbook.md` — cómo decidir entre utilidad, token, utilidad propia y componente.
- `references/gotchas.md` — variantes apiladas, sintaxis de variables arbitrarias, `@theme` anidado, renombres de utilidades.
- `references/docs-source.txt` — metadatos de una instantánea de documentación que nunca se materializó. Esta copia no tiene `references/docs/`.
- `scripts/sync_tailwind_docs.py` — el script que materializaría esa instantánea si alguna vez se quiere el corpus completo en local (requiere red, Python y aceptar la licencia de `tailwindlabs/tailwindcss.com`).

## Contexto de este proyecto

- **Sin archivo de configuración**: Tailwind 4 entra por `@tailwindcss/vite` y el tema se declara en `src/app.css` con `@theme inline`.
- **Los tokens los define `DESIGN.md`**, y se validan con `pnpm design:check`. No se añaden valores sueltos: si falta un color, un radio o una sombra, se añade al sistema.
- `@plugin "@tailwindcss/typography"` para la prosa del blog, y modo oscuro con `@custom-variant dark (&:is(.dark *))`.

## Migration checklist

Al migrar de v3 a v4, confirma siempre:

- Soporte de navegador y expectativas de compatibilidad.
- Cambios de tooling: `@tailwindcss/postcss`, `@tailwindcss/cli`, `@tailwindcss/vite`.
- Sintaxis de importación: `@import "tailwindcss"` sustituye a las directivas `@tailwind`.
- Utilidades renombradas o eliminadas, formato del prefijo y posición del modificador importante.
- Cambios en variantes, transformaciones y valores arbitrarios.
