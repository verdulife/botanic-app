# Arquitectura — visión global

Cross-cutting únicamente. Detalle por módulo en el [AGENTS.md](AGENTS.md) correspondiente (web, email, db, flutter).

## Diagrama

```
[Usuario] → [Cloudflare DNS/CDN → Vercel Edge] → [SvelteKit SSR]
                                                       │
                           ┌───────────────────────────┤
                           ▼                           ▼
                   [Supabase DB]              [Supabase Storage]
                   (PostgreSQL + Auth          (imágenes de listings)
                    + Realtime chat)
```

## Stack

| Capa | Tecnología | Propósito | Coste |
|---|---|---|---|
| Framework | SvelteKit 5 | SSR + PWA + routing | $0 |
| Lenguaje | TypeScript 5 | Tipado | $0 |
| Estilos | TailwindCSS 4 | Utilidades | $0 |
| Gestor | Bun 1.3 | Solo `bun install` / `bun run` | $0 |
| Backend | Supabase Free | DB + Auth + Storage + Realtime — [docs/db/AGENTS.md](docs/db/AGENTS.md) | $0 |
| Mapas | Leaflet + OSM | Sin API key | $0 |
| Email | Resend Free | Transaccional + broadcasts — [docs/email/AGENTS.md](docs/email/AGENTS.md) | $0 |
| Hosting | Vercel Hobby | SSR + CDN | $0 |
| DNS/CDN | Cloudflare Free | DDoS + CDN · dominio `botanicapp.es` (NS en Vercel) | $0 |
| App nativa | Flutter | Fase 2 — [docs/flutter/AGENTS.md](docs/flutter/AGENTS.md) | — |

**Coste total MVP: 0 €/mes**.

## Design system

[DESIGN.md](DESIGN.md) es autoridad global de tokens y marca (paleta Still/Lino, 3 familias tipográficas — Fraunces + Inter + JetBrains Mono — motion, Do's & Don'ts). Aplica a web, emails y futura app Flutter.

> Nota histórica: carril social (Remotion/Pexels) y póster A3 retirados ago 2026. El wordmark del logo vive solo en `src/lib/components/Logo.svelte`.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](AGENTS.md#cómo-mantener-los-docs).