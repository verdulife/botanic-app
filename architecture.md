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

## Identificación y cuidados de plantas (híbrido — post-wireframe)

Al publicar, el vendedor sube la 1ª foto → se identifica la especie y se autocompleta el formulario (campos editables). Como Pl@ntNet **solo identifica especie** (no da cuidados), se combina con una API de cuidados cacheando en nuestra DB para bajar consumo.

**Flujo:**

```
Foto → [Pl@ntNet] → especie + score (+ nombre común, familia)
        ├─ especie en nuestra DB → cargo cuidados curados (0 consumo)
        └─ especie nueva → [Perenual] → cuidados (riego, luz, ph, tierra)
                           └─ guardo en DB (especie → cuidados) → reutilizable
```

**Decisiones tomadas:** autocompletar siempre pero editable (con aviso "¿Es esta tu planta?"); las llamadas a las APIs **nunca** desde el cliente (Edge Function / server, la key no se expone).

**Cuotas tier free (revisar en docs oficiales):**

| API | Cuota free | Rol |
|---|---|---|
| Pl@ntNet | ~500 identificaciones/día | Identificar especie |
| Perenual | ~100 request/día | Cuidados de la especie (riego, luz, ph…) |

Perenual es el cuello de botella → se consulta solo la 1ª vez por especie; si se agota, encolar/especies "pendientes de cuidados" sin bloquear al vendedor.

**Documentación oficial:**
- Pl@ntNet: https://my.plantnet.org/doc/getting-started/introduction
- Perenual: https://perenual.com/docs/api

**Credenciales:** `PLANTNET_API_KEY` y `PERENUAL_API_KEY` en `.env.local` (no versionado).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](AGENTS.md#cómo-mantener-los-docs).