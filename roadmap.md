# Roadmap

## Timeline visual

```
2026                        2027                        2028
├────Q3─────Q4────┤         ├────Q1─────Q2─────Q3─────Q4────┤       ├────Q1───────►
│                 │         │                              │       │
MVP PWA          Validación App Nativa                    │       Expansión
Coste 0          1.000 users RN / Flutter                 │       Latam + IA
                 Iteración  Monetización                   │       Ronda seed
```

## Fase 0 — MVP PWA (Julio-Agosto 2026)

**Duración**: 6 sprints (~8-10 semanas)

**Objetivo**: Lanzar PWA funcional con coste 0.

**Estado de ejecución**: ver [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md) (única fuente de checkboxes por sprint). **Siguiente**: Sprint 1 — Setup + Auth (registro email + Google OAuth, schema `profiles` + `categories`).

| Sprint | Semana | Contenido | Hito |
|---|---|---|---|
| 1 | 1 | Setup + Auth (SvelteKit + Supabase + login) | Usuario se registra |
| 2 | 2 | Listings CRUD (publicar, fotos, editar) | Usuario publica anuncio |
| 3 | 3-4 | Búsqueda + explorar + mapa | Visitante encuentra plantas |
| 4 | 5 | Favoritos + perfiles + reviews | Comunidad con reputación |
| 5 | 6 | Chat en tiempo real | Comprador y vendedor contactan |
| 6 | 7-8 | PWA + SEO + polish | App lista para público |

**Detalle completo**: [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md)

**Ideas y backlog pendiente**: [`docs/ideas.md`](docs/ideas.md)

**Carril paralelo — Blog (SEO + lead gen)**: ✅ implementado. Blog estático en Markdown sin CMS (`/blog`), cadencia 2/semana en arranque, programación automática con cron (GitHub Actions → Vercel Deploy Hook), 1 post real público + 3 en `_drafts/`. Detalle completo en [`docs/blog.md`](docs/blog.md).

**Carril paralelo — Redes sociales**: 🚧 PoC implementado. Reels IG/TikTok + posts/carruseles IG generados con **Remotion** desde guiones agénticos (`script.json`), assets vía Pexels, publicación manual en batch semanal. Detalle en [`docs/social-video.md`](docs/social-video.md) y [`docs/social-post.md`](docs/social-post.md).

**Carril paralelo — Poster A3 (captación offline)**: ✅ implementado. HTML standalone en `poster/`, fuera de SvelteKit/Vercel. Render manual via `bun run poster` → Chrome → Cmd+P → PDF A3. Diseño on-brand (tokens sincronizados con `DESIGN.md`): fondo `tranquil-200` + textura de hojas al 25%, headline "El wallapop de las plantas", sub unificado (tríada + gancho + "Plant Lovers"), QR 80×80mm sin marco apuntando a `www.botanicapp.es`. Detalle y workflow en [`poster/README.md`](poster/README.md).

## Fase 1 — Validación (Q4 2026)

- Crecimiento orgánico a **1.000 usuarios activos**
- Iteración basada en feedback real
- Mejora de reputación y confianza
- Upgrade a Supabase Pro (~25€/mes) si hay tracción

## Fase 2 — App nativa (Q1 2027)

- Migración a **React Native** (compartimos TypeScript con la web)
- Notificaciones push nativas
- Cámara integrada
- Geolocalización precisa
- Publicación en App Store + Google Play

## Fase 3 — Monetización (Q2-Q3 2027)

- Plan Pro (~3,99€/mes) para vendedores avanzados
- Anuncios destacados (1€/día)
- Suscripción Viveros (~19€/mes)
- Comisión opcional 3-5% en transacciones protegidas

## Fase 4 — Expansión (2028)

- Internacionalización a Latinoamérica
- Identificación de plantas por foto (IA)
- Comunidad social: foros, guías, eventos
- Posible ronda seed

## Criterios para pasar de fase

| Transición | Condición |
|---|---|
| MVP → Validación | App estable, primeras transacciones |
| Validación → App nativa | 1.000 usuarios activos |
| App nativa → Monetización | 500 transacciones/mes |
| Monetización → Expansión | Ingresos > costes + tracción sostenida |
