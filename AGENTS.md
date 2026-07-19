# Botanic — Contexto para OpenCode

## Proyecto

Marketplace P2P de plantas (semillas, esquejes, brotes, plantas, tiestos). MVP como PWA con coste 0, app nativa en el futuro.

## Stack

- SvelteKit 5 + TypeScript + TailwindCSS 4
- Supabase Free (PostgreSQL, Auth, Storage, Realtime)
- @vite-pwa/sveltekit para PWA
- Leaflet + OpenStreetMap para mapas (gratis)
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

## Para empezar a desarrollar

1. `bun create svelte@latest botanic --template typescript`
2. Configurar Supabase project
3. Seguir [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md)
