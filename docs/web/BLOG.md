# Blog — guía y arquitectura

Estático (Markdown, sin CMS). Carril paralelo de SEO y captación: autoridad entre Plant Lovers y alimentar la lista de espera.

## Decisiones

| Decisión | Opción | Motivo |
|---|---|---|
| Árbol de URLs | Plano, `/blog/[slug]` | Corto y renombrable; la categoría es solo metadato |
| Programación | `date` del frontmatter + cron | Publicar sin mover archivos |
| Borradores | `_drafts/`, fuera del glob | No puede filtrarse a sitemap, feed ni rutas; publicar es mover |
| Imágenes | Wikimedia Commons con pipeline propio, fallback de marca | Coste 0 y licencias claras |
| Autor | Alias público en `authors.ts` | Pueden firmar colaboradores sin exponer nombres reales |
| OG por post | Marca por defecto; generado con sharp queda para después | Coste 0 primero |

## Contrato del frontmatter

```yaml
---
title: "Cómo propagar Monstera deliciosa"
description: "Guía paso a paso..."
date: 2026-08-15      # UTC: fecha SEO y programador a la vez
updated: 2026-09-01   # opcional → muestra "Actualizado el"
category: guias       # guias | noticias | comunidad
tags: [propagacion, monstera]
author: "Elena"       # "Botanic" si se omite
image: /blog/monstera.jpg   # opcional; fallback = gradient de marca
---
```

- El slug se deriva del nombre del archivo y es canónico.
- **`date` futura = programado**: el post está en el bundle pero no sale en el índice, ni en el sitemap, ni en el feed, ni en su ruta. Un slug inexistente o programado da 404.
- No existe campo `draft`: `_drafts/` cubre el trabajo en curso.
- El autor del frontmatter es el identificador y también el nombre público; los alias se cambian en `authors.ts` sin tocar los posts.

## Decisiones técnicas que no se leen en el código

- **Desfase horario**: `isPublished()` resta dos horas para alinear con la hora peninsular. Sin eso, un post con `date: 2026-08-03` aparece a las 02:00, no a medianoche.
- **Los `load` son de servidor**: `gray-matter`, `js-yaml` y `marked` son APIs de Node y rompían la navegación SPA en cliente. La navegación cliente va por `__data.json`.
- **`prerender`**: índice, artículo y paginación se generan en build con `entries` = slugs publicados. HTML estático por SEO.
- **Metas por post**: canonical, `og:*` y `twitter:*` con `summary_large_image` y URL absoluta, más JSON-LD `BlogPosting` y `BreadcrumbList`. La imagen OG del frontmatter se resuelve a URL absoluta; sin ella, la de marca.

## Autores

- `AUTHORS` en `src/lib/blog/authors.ts` lista los alias posibles.
- `resolveAuthor()` devuelve el nombre público del byline y del JSON-LD: la firma pública se muestra tal cual, los nombres reales se normalizan al nombre de pila, y lo desconocido se muestra como venga. Sin `author`, firma `Botanic`.

## Imágenes: dónde salen y cómo entran

Fuente: Wikimedia Commons, filtrando por licencia libre (CC BY, CC BY-SA, dominio público), ancho mínimo de 1200 px y preferencia por destacadas y de calidad.

- `pnpm img search "<query>"` — busca y lista candidatas.
- `pnpm img fetch <nº> <dest>` — descarga, optimiza a webp y jpg con presupuesto de tamaño y registra la atribución en [IMAGES-CREDITS.md](IMAGES-CREDITS.md).
- `pnpm img:optimize [--force]` — audita y reoptimiza las imágenes del blog.

Cada imagen se sirve como `<picture>` con fuente webp y respaldo jpg: si falta el webp, el navegador cae al jpg.

**La atribución es obligatoria**, no una cortesía. Bajo cada imagen inline, una línea en cursiva con autor y licencia; el hero la toma del campo `imageCredit`. El registro de [IMAGES-CREDITS.md](IMAGES-CREDITS.md) es la fuente, y arrastra una advertencia propia: las entradas marcadas como provisionales no están verificadas contra Commons y hay que comprobarlas antes de publicar.

## Publicación programada

- El cron `.github/workflows/publish-daily.yml` dispara a las 05:00 UTC (07:00 en España) un `curl` al Deploy Hook de Vercel: el redeploy publica lo que ya cumplió su `date`.
- Hace falta crear el Deploy Hook en Vercel y guardar su URL como secret `VERCEL_DEPLOY_HOOK_URL` en GitHub.
- Para publicar antes del cron, se lanza el hook a mano o se redespliega desde Vercel.
- Todas las fechas van en UTC para evitar desfases.

## Cadencia y flujo

1. Recolectar temas preguntando a los Plant Lovers, hasta tener colchón con keyword real.
2. Generar el `.md` en `_drafts/` siguiendo la guía de estilo.
3. Revisar a mano: precisión y calidad de marca. En noticias, contraste de fuentes obligatorio.
4. Mover a `posts/` con `date` futura según la cadencia.
5. El cron los activa el día que toca.

## Guía de estilo para generación con IA

- **Tono**: cercano, claro, útil, para Plant Lovers. Sin clickbait y sin relleno.
- **Estructura SEO**: título con keyword, descripción con gancho, H2 y H3 descriptivos, extracto y preguntas frecuentes donde encajen.
- **Mezcla**: mayoría de guías de cuidados y propagación, minoría de actualidad.
- **Interlinks**: entre artículos y hacia la landing.
- **CTA**: cerrar cada artículo con el CTA a la lista de espera, usando el componente y no texto duplicado.
- **Noticias**: fecha, fuentes y revisión humana antes de programar.
