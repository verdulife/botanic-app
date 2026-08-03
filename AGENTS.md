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
│   ├── blog.md
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
- `src/lib/supabase.ts` con `createClient`. `WaitlistForm.svelte` hace `fetch('/api/waitlist')`; duplicado (`23505`) se trata como éxito **sin enviar ningún email** y la respuesta (`alreadyRegistered`) muestra feedback al usuario ("Ya estás en la waitlist"). En altas nuevas se lanza un confeti de celebración (`canvas-confetti`, paleta de la landing, respeta `prefers-reduced-motion`).
- Rutas: `/` (landing), `/app` (marketplace con datos mock, noindex) y `/api/waitlist` (POST).
- **Blog (carril paralelo SEO/lead gen)**: implementado. Estático en Markdown sin CMS, URL plana `/blog/[slug]`, cadencia 2/semana en arranque, `date` del frontmatter como programador + cron GitHub Actions diario (`publish-daily.yml`, 7 AM España) → Vercel Deploy Hook. Borradores en `src/lib/blog/_drafts/` (fuera del glob); publicar = mover a `src/lib/blog/posts/` con fecha. **Loads server-only** (`+page.server.ts`) porque `gray-matter`/`js-yaml`/`marked` son APIs Node y rompían la navegación SPA en cliente (arreglado: 500 → 200). 1 post real publicado ("Cómo nació Botanic", Albert Verdú), 3 fakes en `_drafts/`. Componentes: `BlogIndex` (cards `aspect-square` como el hero), `BlogCta` (reutiliza `WaitlistForm`), `Logo` (SVG vectorial con texto trazado a paths + brote lucide), `AppFooter` (compartido landing + blog, nav Inicio·Blog). Artículo: título + subtitle (description) + `<hr>` + hero image 16/9 + `prose-botanic` con lead destacado. SEO por post: title, description, canonical, OG absoluto, `summary_large_image`, JSON-LD BlogPosting + BreadcrumbList. Sitemap + RSS generados. Header sticky con `backdrop-blur`. Tipografía `@tailwindcss/typography` con tokens de marca. Detalle completo en [`docs/blog.md`](docs/blog.md).
- PWA y Auth aún sin implementar.
- Emails de la waitlist operativos con Resend: dominio `botanicapp.es` verificado (DKIM + SPF + MX, región eu-west-1), Audience "waitlist" (id `fbe9c75b-b2d4-41b3-89e9-848f7755de43`), API key en `.env.local`, ruta `POST /api/waitlist` (insert + confirmación al usuario + aviso a `ADMIN_NOTIFY_EMAIL` — admite múltiples emails separados por coma — + alta en Audience, solo en fila nueva). El aviso admin incluye **total de apuntes** consultado desde la vista `waitlist_count` (anon, sin necesidad de service_role). `WaitlistForm.svelte` conectado. Probado en real: ambos emails `delivered`. Emails en **HTML con marca** (`src/lib/emails/`: layout + confirmation + adminNotify, estilos inline). Header con `og-image.jpg` (banner de marca, ~23 KB), el mismo asset optimizado (sharp) que se usa en el OG metadata (`og:image`/`twitter:image`). Asuntos sin emojis: confirmación "¡Gracias por apuntarte a la waitlist de Botanic!" y aviso admin "Nuevo en la waitlist". DMARC añadido en Vercel DNS (`_dmarc.botanicapp.es`, `p=none`); verificación pendiente.
- **Pendiente**: verificar DMARC en producción (mail-tester/Outlook, `dmarc=pass`); diseñar la baja/unsubscribe (Resend la gestionará automáticamente en broadcasts; página propia diferida). Actualizar `ADMIN_NOTIFY_EMAIL` (con ambos emails separados por coma) en `.env.local` y Vercel. Crear vista `waitlist_count` en Supabase: `CREATE VIEW waitlist_count AS SELECT count(*) AS total FROM waitlist; GRANT SELECT ON waitlist_count TO anon;`. Tabla `waitlist` vaciada (0 filas) para pruebas.
- **Auditoría de secretos (2026-08)**: revisado todo el historial de git. `.env.local`, `.opencode/supabase-auth.json` y ninguna clave real (Resend/Supabase) estuvieron jamás en el repo; solo `.env.example` con placeholders. Se detectó que el commit `77e18dc` había commiteado artefactos de navegación del skill Impeccable (`.impeccable/`, perfil de Chrome) en el historial de un repo **público**. El historial se reescribió con `git filter-repo` (purgado completo de `.impeccable/`) y se hizo force-push; los blobs ya no son accesibles desde ninguna ref (verificado: 0). `.impeccable/` completo quedó en `.gitignore` para que no vuelva a subirse.

## Siguiente paso

Sprint 1 — Setup + Auth (registro email + Google OAuth, schema `profiles` + `categories`). Detalle en [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md).

## Para empezar a desarrollar

1. `bun install`
2. `bun run dev`
3. Seguir [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md)

## Reglas de trabajo

- Trabajar **paso a paso**: dividir el trabajo en pasos pequeños y verificables, detectando problemas temprano en lugar de ejecutar muchos cambios de golpe.
- **Hitos**: en tareas grandes, trabajar por hitos pequeños verificables. Al terminar un hito, **parar y reportar** el resultado; no iniciar el siguiente hito sin confirmación del usuario.
- Si el usuario pide **hacer un commit o un push**, recomienda primero **actualizar los docs** (AGENTS.md, docs/, roadmap.md) si el cambio de código los ha dejado desactualizados.
