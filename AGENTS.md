## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: none

---

# Botanic — Contexto para OpenCode

## Proyecto

Marketplace P2P de plantas (semillas, esquejes, brotes, plantas, tiestos). MVP como PWA con coste 0, app nativa en el futuro.

## Stack

- SvelteKit 5 + TypeScript + TailwindCSS 4
- Supabase Free (PostgreSQL, Auth, Storage, Realtime)
- @vite-pwa/sveltekit para PWA
- Leaflet + OpenStreetMap para mapas (gratis)
- Resend Free para emails (transaccional + broadcasts); dominio `botanicapp.es`
- Vercel Hobby + Cloudflare Free para hosting
- Bun como gestor de paquetes (no runtime)

## Decisiones clave ya tomadas

| Decisión | Opción | Motivo |
|---|---|---|
| MVP sin envíos | Solo quedar en mano | Simplifica el MVP drásticamente |
| Sin pagos integrados | Los usuarios se pagan fuera | Evita integración compleja y comisiones |
| Sin identificacion IA | Se pospone a Fase 4 | No necesaria para validar |
| Sin live shopping | Se pospone | Palmstreet ya lo hace, no es el core |
| Sin app nativa al inicio | PWA primero | Coste 0, validación rápida |
| React Native > Flutter | Para futuro nativo | Ya usamos TypeScript |
| Emails | Resend Free | 3k tx/mes + broadcasts; integra con Supabase Auth vía SMTP |

## Estructura del proyecto

```
botanic-app/
├── README.md              # Overview + índice
├── AGENTS.md              # Este archivo — contexto para agents
├── roadmap.md             # Roadmap 2026-2028
├── architecture.md        # Arquitectura + tech stack
├── docs/                  # Documentación detallada
│   ├── concepto.md
│   ├── mercado.md
│   ├── mvp-scope.md
│   ├── plan-desarrollo.md
│   ├── pwa.md
│   ├── difusion.md
│   └── monetizacion.md
└── press/                 # Dossier de prensa
    └── README.md
```

## Costes

| Fase | Coste/mes |
|---|---|
| MVP (0-6 meses) | 0 € |
| Post-validación (Supabase Pro) | ~25 € |
| Escalado | Variable |

## Estado actual

- Landing pública terminada: hero, copy "conocer a gente nueva", waitlist conectada a Supabase, favicon, OG image, metas SEO, JSON-LD, sitemap + robots, llms.txt.
- Proyecto Supabase Free `botanic` (ref `whfctiwljwdamnypthrz`, eu-central-1). Tabla `waitlist` (email único) con RLS solo-insert (anon). Credenciales en `.env.local` (git-ignored); `.env.example` con placeholders.
- `src/lib/supabase.ts` con `createClient`. `WaitlistForm.svelte` hace `fetch('/api/waitlist')`; duplicado (`23505`) se trata como éxito.
- Rutas: `/` (landing), `/app` (marketplace con datos mock, noindex) y `/api/waitlist` (POST).
- PWA y Auth aún sin implementar.
- Emails de la waitlist operativos con Resend: dominio `botanicapp.es` verificado (DKIM + SPF + MX, región eu-west-1), Audience "waitlist" (id `fbe9c75b-b2d4-41b3-89e9-848f7755de43`), API key en `.env.local`, ruta `POST /api/waitlist` (insert + confirmación al usuario + aviso a `ADMIN_NOTIFY_EMAIL` + alta en Audience, solo en fila nueva) y `WaitlistForm.svelte` conectado. Probado en real: ambos emails `delivered`. Emails en **HTML con marca** (`src/lib/emails/`: layout + confirmation + adminNotify, estilos inline). Header con `og-image.jpg` (banner de marca, ~23 KB), el mismo asset optimizado (sharp) que se usa en el OG metadata (`og:image`/`twitter:image`).

## Siguiente paso

Sprint 1 — Setup + Auth (registro email + Google OAuth, schema `profiles` + `categories`). Detalle en [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md).

## Para empezar a desarrollar

1. `bun install`
2. `bun run dev`
3. Seguir [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md)

## Reglas de trabajo

- Trabajar **paso a paso**: dividir el trabajo en pasos pequeños y verificables, detectando problemas temprano en lugar de ejecutar muchos cambios de golpe.
- Si el usuario pide **hacer un commit o un push**, recomienda primero **actualizar los docs** (AGENTS.md, docs/, roadmap.md) si el cambio de código los ha dejado desactualizados.
