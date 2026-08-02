# Blog Botanic — Guía y arquitectura

Blog estático basado en Markdown, sin CMS. Carril paralelo de SEO + lead gen: **no bloquea el MVP**. Objetivo: ganar autoridad entre los Plant Lovers y alimentar la waitlist desde cada artículo.

## Decisiones tomadas

| Decisión | Opción | Motivo |
|---|---|---|
| CMS | Sin CMS, Markdown estático | Coste 0, cero infra, ideal para contenido generado por IA |
| Árbol de URLs | Plano: `/blog/[slug]` | Corto, renombrable. Categoría solo como metadato |
| Programación | `date` del frontmatter como programador + cron | Publicación automática sin mover archivos |
| Borradores | Carpeta `_drafts/` (fuera del glob) | No puede filtrarse a sitemap/feed/rutas; publicar = mover |
| Cadencia | 2/semana en arranque, 1-2/semana en régimen | Dominio nuevo necesita indexación rápida; calidad revisada |
| Batch inicial | 16-20 artículos antes de publicar | ~2-3 meses de colchón a 2/semana |
| Sitemap | Ruta generada (`sitemap.xml/+server.ts`) | Se autoactualiza al añadir posts |
| RSS | `/blog/feed.xml` desde el inicio | Distribución y agregadores |
| OG images | Marca por defecto; `image:` override. Por-post generado con sharp = fase posterior | Coste 0 primero |
| Imágenes artículos | Fallback de marca (gradient + título) si no hay `image:`; sourcing del batch por decidir | No bloquea la estructura |
| Autor | Multi-autor: campo `author` en frontmatter; `Botanic` por defecto | Pueden firmar colaboradores |
| Enlace blog | `/blog` en el footer de la landing | Interlinking y descubrimiento |

## Árbol de URLs

```
/blog                          → índice (grid de cards, paginado 9/página)
/blog/[slug]                   → artículo
/blog/feed.xml                 → RSS
/sitemap.xml                   → ruta generada (incluye /, /app, /blog, todos los posts)
```

## Schema frontmatter

```yaml
---
title: "Cómo propagar Monstera deliciosa"
description: "Guía paso a paso para multiplicar tu monstera..."
date: 2026-08-15              # UTC. Fecha SEO (datePublished, lastmod) Y programador
updated: 2026-09-01           # opcional → muestra "Actualizado el"
category: guias               # guias | noticias | comunidad
tags: [propagacion, monstera]
author: "Elena"               # multi-autor; "Botanic" por defecto si se omite
image: /blog/monstera.jpg     # opcional; fallback = gradient de marca
---
```

- **Slug**: se deriva del nombre del archivo (canónico).
- **`date` = programador**: un post con `date` futura está en el bundle pero invisible (no sale en `/blog`, ni en sitemap, ni en feed, ni en la ruta detalle).
- **No existe `draft`**: `_drafts/` cubre el trabajo en curso.

## Arquitectura técnica

- **Deps**: `marked` (md → HTML), `gray-matter` (frontmatter), `@tailwindcss/typography` (prose).
- **Loader**: `import.meta.glob('/src/lib/blog/posts/**/*.md', { eager: true, query: '?raw', import: 'default' })` en `src/lib/blog/posts.ts`. Sin cambios en `vite.config.ts`. Se añade `declare module '*.md?raw'` en `src/app.d.ts`.
- **Filtrado**: el loader excluye posts con `date > now` y los de `_drafts/` (fuera del glob). ⚠️ **Nota Bun/Windows**: `Date.parse("YYYY-MM-DD")` en Bun local se interpreta en zona horaria local (no UTC como dice el spec). En producción (Vercel/Linux) funciona correctamente.
- **Rutas**: los `load` son `+page.server.ts` (server-only) — `gray-matter`/`js-yaml`/`marked` son APIs Node y rompían la navegación SPA en cliente (500). La navegación cliente usa `__data.json`.
- **Rutas**: `/blog`, `/blog/[slug]` y `/blog/pagina/[page]` con `export const prerender = true` y `entries` = slugs publicados. HTML estático en build (SEO).
- **404**: slug inexistente o programado → `error(404)`.
- **Metas SEO por post**: title, description, canonical, og:*, twitter:* (con `summary_large_image` y URL absoluta), JSON-LD `BlogPosting` + `BreadcrumbList`.
- **OG image**: `image:` del frontmatter con URL absoluta (`base` + path); fallback a `og-image.jpg` de marca.
- **CTA waitlist**: componente `BlogCta.svelte` reutiliza `<WaitlistForm />` al final de cada artículo + banner en el índice.
- **Logo + footer**: `Logo.svelte` (SVG vectorial con texto trazado a paths + brote lucide) y `AppFooter.svelte` (nav Inicio·Blog) compartidos entre landing y `/blog`.
- **Cards**: `BlogIndex.svelte` con imagen `aspect-square` (mismo tratamiento que las cards del hero: `p-3.5`, `rounded-xl`, `border`, `shadow-xs`).
- **Artículo**: título + subtitle (description) + metadatos + `<hr>` separador + hero image `16/9` + prosa con lead destacado.
- **Header sticky**: el navbar del blog (`+layout.svelte`) usa `sticky top-0` con `backdrop-blur` y `border-b`.

### Estructura de archivos

```
src/lib/blog/
├── posts.ts                    # tipos + loader + helpers (getAllPosts, getPostBySlug, readingTime)
├── utils.ts                    # formatDate, categoryLabel, escapeXml
├── _drafts/                    # NO se compilan (fuera del glob)
│   ├── como-propagar-monstera.md
│   ├── cuidados-suculentas-principiantes.md
│   └── tissue-culture-plantas.md
└── posts/                      # publicados o programados
    └── como-nacio-botanic.md

src/routes/blog/
├── +layout.svelte              # Logo + back-link + AppFooter, sticky header
├── +page.server.ts             # load: posts paginados (9/página)
├── +page.svelte                # índice con BlogIndex + BlogCta
├── pagina/[page]/
│   └── +page.server.ts         # load: paginación
├── [slug]/
│   ├── +page.server.ts         # load: post por slug + relacionados
│   └── +page.svelte            # artículo + SEO metas + CTA + relacionados
└── feed.xml/+server.ts         # RSS

src/routes/sitemap.xml/+server.ts   # reemplaza a static/sitemap.xml (se borra)
src/lib/components/blog/BlogIndex.svelte
src/lib/components/blog/BlogCta.svelte
src/lib/components/Logo.svelte      # SVG vectorial (texto + brote trazados a paths)
src/lib/components/AppFooter.svelte # compartido landing + blog
```

## Programación de publicaciones

- **`date` futura** = post programado. El loader lo excluye en build.
- **Cron GitHub Actions** (`.github/workflows/publish-daily.yml`): `0 5 * * *` UTC (7:00 España) → `curl` al **Vercel Deploy Hook** → redeploy → los posts cuya `date` ya pasó se publican solos.
- **Setup**: crear Deploy Hook en Vercel (Settings → Deploy Hooks) y guardar la URL como secret `VERCEL_DEPLOY_HOOK_URL` en GitHub.
- **Publicar antes del cron**: disparar el hook a mano o "Redeploy" en Vercel.
- **Fechas en UTC** para evitar desfases horarios.

## Cadencia y flujo de contenido

1. **Recolectar temas**: preguntar a Plant Lovers (familia/amigos) → colchón de temas con keyword real.
2. **Generar**: IA generativa produce el `.md` en `_drafts/` siguiendo la guía de estilo.
3. **Revisar** (humano): precisión, sobre todo en noticias (fact-check), y calidad de marca.
4. **Programar**: mover a `posts/` con `date` futura según la cadencia (2/semana en arranque).
5. **Publicar**: el cron los activa el día que toca.

## Guía de estilo para generación IA

- **Tone**: Botanic — cercano, claro, útil. Público Plant Lovers. Sin clickbait, sin relleno.
- **Estructura SEO**: title (keyword), description con gancho, H2/H3 descriptivos, extracto, preguntas frecuentes donde aplique (para JSON-LD).
- **Mix**: ~80% guías de cuidados y propagación, ~20% actualidad/noticias (p.ej. tissue culture).
- **Interlinks**: enlazar artículos relacionados entre sí y a la landing.
- **CTA**: cerrar cada artículo con CTA a la waitlist (componente, no texto duplicado).
- **Noticias**: fecha, fuentes y revisión humana obligatoria antes de programar.
- **Asuntos/extensiones**: sin emojis en títulos.

## Estado de implementación

- [x] Deps: `marked`, `gray-matter`, `@tailwindcss/typography`
- [x] `src/app.d.ts`: `declare module '*.md?raw'`
- [x] `src/lib/blog/posts.ts` (loader + filtro `date`)
- [x] Rutas `/blog`, `/blog/[slug]`, `feed.xml`, `sitemap.xml`
- [x] `BlogCta.svelte` (reutiliza `WaitlistForm`, logo + título)
- [x] Typography en `src/app.css` con tokens de marca (`.prose-botanic`, lead p destacado, body 1.0625rem)
- [x] Workflow cron GitHub Actions + Deploy Hook Vercel (`publish-daily.yml`)
- [x] Prueba con `.md` falso (guía, noticia, fecha futura) → movidos a `_drafts/`
- [x] Post real: "Cómo nació Botanic" (Albert Verdú, comunidad, 3 imágenes)
- [ ] Batch 16-20 artículos en `_drafts/`
