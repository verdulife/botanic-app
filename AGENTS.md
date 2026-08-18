## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: none

---

# Botanic — Contexto para OpenCode

## Proyecto

Comunidad donde las plantas conocen a gente (semillas, esquejes, brotes, plantas, tiestos). Vender, cambiar o regalar. MVP como PWA con coste 0, app nativa en el futuro.

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
| MVP sin envíos | Solo quedar en mano | Simplifica el MVP drásticamente (decisión de fase, no promesa de marca) |
| Sin pagos integrados | Los usuarios se pagan fuera | Evita integración compleja y comisiones |
| Sin identificacion IA | Se pospone a Fase 4 | No necesaria para validar |
| Sin live shopping | Se pospone | Palmstreet ya lo hace, no es el core |
| Sin app nativa al inicio | PWA primero | Coste 0, validación rápida |
| React Native > Flutter | Para futuro nativo | Ya usamos TypeScript |
| Emails | Resend Free | 3k tx/mes + broadcasts; integra con Supabase Auth vía SMTP |
| SEO paginación blog | `index, follow` en `/blog/pagina/2+` | Las URLs de posts son permanentes (sitemap + interlinks); el desplazamiento entre páginas del listado es normal y no penaliza. Revisar con `noindex` cuando haya ~80-90 posts |
| Cumplimiento legal | Páginas legales + checkbox GDPR | RGPD/LSSI-CE, MVP válido |

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
│   ├── monetizacion.md
│   ├── social-video.md    # Reels IG + TikTok (Remotion, agéntico)
│   └── social-post.md     # IG feed + carruseles (stills Remotion)
├── video/                 # Proyecto Remotion autónomo (reels/carruseles)
├── poster/                # Proyecto autónomo A3 para impresión (posters, flyers)
├── scripts/               # Stock (Pexels), OG, etc.
├── src/lib/social/        # Guiones script.json (posts/, _drafts/)
├── src/lib/legal/         # Markdown de páginas legales
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
- **Cron keep-alive de Supabase Free** ✅: workflow `.github/workflows/keep-alive-supabase.yml` (cron diario `0 6 * * *` UTC ≈ 7-8 AM España + `workflow_dispatch`). Ping vía `curl` al endpoint REST `waitlist_count` con anon key (secrets `SUPABASE_URL` + `SUPABASE_ANON_KEY`). Evita la pausa automática de Supabase Free tras 7 días sin queries sin introducir credenciales admin nuevas. Notificación nativa de GH configurada para fallos.
- `src/lib/supabase.ts` con `createClient`. `WaitlistForm.svelte` hace `fetch('/api/waitlist')`; duplicado (`23505`) se trata como éxito **sin enviar ningún email** y la respuesta (`alreadyRegistered`) muestra feedback al usuario ("Ya estás en la waitlist"). En altas nuevas se lanza un confeti de celebración (`canvas-confetti`, paleta de la landing, respeta `prefers-reduced-motion`). Checkbox de consentimiento GDPR con validación client-side + server-side (`consent === true` en `/api/waitlist`). Disclaimer actualizado: "contenido del blog".
- Rutas: `/` (landing), `/app` (marketplace con datos mock, noindex) y `/api/waitlist` (POST).
- **Blog (carril paralelo SEO/lead gen)**: implementado. Estático en Markdown sin CMS, URL plana `/blog/[slug]`, cadencia 2/semana en arranque, `date` del frontmatter como programador + cron GitHub Actions diario (`publish-daily.yml`, 7 AM España) → Vercel Deploy Hook. Borradores en `src/lib/blog/_drafts/` (fuera del glob); publicar = mover a `src/lib/blog/posts/` con fecha. **Loads server-only** (`+page.server.ts`) porque `gray-matter`/`js-yaml`/`marked` son APIs Node y rompían la navegación SPA en cliente (arreglado: 500 → 200). 1 post real publicado ("Cómo nació Botanic", autor Albert). Autores centralizados en `src/lib/blog/authors.ts`: constante `AUTHORS = ["Albert", "Domadora de Gatos", "Laia"]` + `resolveAuthor()` ("Domadora de Gatos" es firma pública, sin nombre real en el sitio; "Albert Verdú" se normaliza a "Albert"). 4 fakes/borradores con fechas. Componentes: `BlogIndex` (cards `aspect-square` como el hero), `BlogCta` (reutiliza `WaitlistForm`), `Logo` (SVG vectorial con texto trazado a paths + brote lucide), `AppFooter` (compartido landing + blog, nav Inicio·Blog). Artículo: título + subtitle (description) + `<hr>` + hero image 16/9 + `prose-botanic` con lead destacado. SEO por post: title, description, canonical, OG absoluto, `summary_large_image`, JSON-LD BlogPosting + BreadcrumbList. Sitemap + RSS generados. Header sticky con `backdrop-blur`. Tipografía `@tailwindcss/typography` con tokens de marca. Detalle completo en [`docs/blog.md`](docs/blog.md).
- **Imágenes del blog (pipeline)**: sourcing en Wikimedia Commons sin key con scripts (`bun run img search`/`img fetch`), filtro de licencias CC BY/CC BY-SA/PD, atribución registrada en `docs/images-credits.md`. Optimización webp+jpg ≤ 100 KB por formato (14 MB → ~800 KB en la pasada inicial). WebP automático: cada `<img>` bajo `/images/` se sirve como `<picture>` con `<source webp>` (renderer de `marked`; hero y cards equivalentes); créditos en cursiva bajo cada imagen y campo `imageCredit` en el frontmatter para el hero.
- **Redes sociales (carril paralelo)**: motor **Remotion** en `video/` (autónomo, fuera de Vercel; browser = Chrome Headless Shell; `remotion.config.ts` apunta publicDir a `../static` para que `staticFile()` resuelva `static/social/<slug>/...`). Guion agéntico `script.json` (= inputProps): el agente escribe **datos**, nunca animación. Stock: `scripts/stock.mjs` (Pexels: `search`/`search:video`/`fetch`/`fetch:video`, verticales 9:16, atribución no requerida; `PEXELS_API_KEY` en `.env.local`). Composiciones `BotanicReel` (reel 9:16) + `BotanicSlide` (carrusel 4:5). Render: `bunx remotion render BotanicReel src/index.ts --props=<script.json>`. **Estado del carril**:
  - **monstera-riego**: reel PoC (3 errores al regar tu monstera) usado **solo como plantilla técnica** — no se publica.
  - **coleccionistas-de-esquejes**: primer reel publicable. Concepto "3 cosas que solo entiendes si eres Plant Lover" (tribu, no "plant care" genérico). 3 tips con caja glass (`still-950` 70% + `backdropFilter: blur(24px)`) sobre vídeos Pexels verticales. Wordmark con **path draw** escalonado (B-o-t 0-45%, sprout 30-70%, a-n-i-c 55-90% con fills; `strokeDasharray="100 101"` + offset `101-draw*1.01` elimina el puntito inicial; `strokeOpacity` 1→0 al final funde el outline → fill limpio). Ending separado en dos escenas: `outro` (solo texto, slide-in desde la derecha + fade-out) + `cta` (logo con path draw + delay 0.8s + fade-in inicial 0→24 + botón pill `www.botanicapp.es`, duración 5s). **Audio**: MP3 brasileña libre (Pixabay, sin atribución) integrada vía `<Audio>` de Remotion a `volume={0.6}`. Render entregado: `video/out/coleccionistas-de-esquejes.mp4` (16.2 MB, 23.5s, 1080×1920).
  - **Política `visual-eval`** aplicada a 8 archivos (`.opencode/agents/visual-eval.md`, `AGENTS.md`, `docs/social-eval.md`, `video/DESIGN.reels.md`, etc.): solo audita stock; renders propios = auditoría humana.
  - **Pipeline**: `bun run stock fetch:video <nº> <dest>` → `@visual-eval <dest>` → si recomendación ≠ `usar`, re-buscar. `bun run frames <mp4> <png>` para contact-sheets. Auditoría final del mp4: humana (parar y mostrar al usuario).
  - **Pendientes**: sesión de catálogo por elemento (Hito 1 = INTRO); cablear elementos aprobados en `BotanicReel`/`BotanicSlide` (eliminar duplicación: `SlideContent` inline, `Outro`/`ProgressDots` duplicados, `Tip` sin soporte vídeo); re-render + auditoría; audio pendiente de incorporar a slides; **próxima iteración**: evaluar plantillas Remotion de reels en GitHub para ver si compensa forkar una base externa vs. seguir con `script.json` data-driven.
  - Detalle en [`docs/social-video.md`](docs/social-video.md) y [`docs/social-post.md`](docs/social-post.md).
- **Poster A3 (carril paralelo — captación offline)**: ✅ implementado. HTML standalone + CSS plano en `poster/` (mismo patrón autónomo que `video/`, fuera de SvelteKit/Vercel). Render: `bun run poster` → `http://localhost:4322/poster/` → Chrome Cmd+P → PDF A3. Diseño actual: fondo `tranquil-200` + textura de hojas al 25%, headline "El wallapop de las plantas", sub unificado (tríada + gancho + "Plant Lovers"), QR 80×80mm sin marco apuntando a `www.botanicapp.es`. Tokens sincronizados con `DESIGN.md`. Detalle y workflow en `poster/README.md`.

- PWA y Auth aún sin implementar.
- Emails de la waitlist operativos con Resend: dominio `botanicapp.es` verificado (DKIM en root + SPF/MX en subdomain `send.botanicapp.es`, región eu-west-1). Audience "waitlist" (id `fbe9c75b-b2d4-41b3-89e9-848f7755de43`), API key en `.env.local`, ruta `POST /api/waitlist` (insert + confirmación al usuario + aviso a `ADMIN_NOTIFY_EMAIL` — admite múltiples emails separados por coma — + alta en Audience, solo en fila nueva). El aviso admin incluye **total de apuntes** consultado desde la vista `waitlist_count` (anon, sin necesidad de service_role). `WaitlistForm.svelte` conectado. Probado en real: ambos emails `delivered`. Emails en **HTML con marca** (`src/lib/emails/`: layout + confirmation + adminNotify, estilos inline). Header con `og-image.jpg` (banner de marca, ~23 KB), el mismo asset optimizado (sharp) que se usa en el OG metadata (`og:image`/`twitter:image`). Asuntos sin emojis: confirmación "¡Gracias por apuntarte a la waitlist de Botanic!" y aviso admin "Nuevo en la waitlist". DMARC añadido en Vercel DNS (`_dmarc.botanicapp.es`, `p=none`).
  - **DNS real** (verificado con `dig` + `nslookup` 8.8.8.8): `botanicapp.es` TXT @ = solo `google-site-verification`; DKIM = `resend._domainkey.botanicapp.es`; DMARC = `_dmarc.botanicapp.es` con `p=none` + `rua/ruf=mailto:verdukactus@gmail.com`. SPF y MX están en el **subdomain `send.botanicapp.es`** (no en root): `send` TXT = `v=spf1 include:amazonses.com ~all`; `send` MX = `feedback-smtp.eu-west-1.amazonses.com` (pri 10). El subdomain `send.botanicapp.es` **NO** está verificado como dominio separado en Resend (sería feature de pago), pero Resend lo usa como envelope MAIL FROM, así que el SPF pasa al recibir.
- **Mejoras de deliverability (Hito 2 ✅)**: `src/lib/emails/layout.ts` con `EMAIL_LEGAL` (titular, NIF, domicilio de `aviso-legal.md`) → footer físico-legal cumple RGPD/LSSI y filtra spamassassin; header image a 600px max-width con alt text descriptivo largo. `src/routes/api/waitlist/+server.ts`: FROM `Botanic <hola@botanicapp.es>` (antes `no-reply@`, Resend lo flageaba), `replyTo: ["botanictheapp@gmail.com"]` (engagement real, evita buzón que no existe), headers `List-Unsubscribe` + `List-Unsubscribe-Post: One-Click` (RFC 8058, Gmail marca con más agresividad sin él). `svelte-check` OK. Detalle completo en [`docs/email-deliverability.md`](docs/email-deliverability.md).
- **Pendiente deliverability**: re-testar con código Hito 2 en Gmail + Outlook (Hito 3); si Outlook sigue en Junk, abrir investigación adicional (reputación/contenido). Backlog Hito 4: configurar Google Postmaster Tools + Microsoft SNDS para monitorizar reputación; endurecer DMARC a `p=quarantine` → `p=reject` tras 2-4 semanas de reports limpios; activar Open/Click tracking en Resend (mejora engagement signals); limpiar registros huérfanos `send.botanicapp.es` en Vercel si se desea.
- **Cumplimiento legal (2026-08)**: Páginas legales en URLs raíz (`/politica-de-privacidad`, `/aviso-legal`), estilo `prose prose-botanic` con `AppHeader` + `AppFooter`, `noindex, follow`. Checkbox de consentimiento GDPR en WaitlistForm con validación client-side + server-side (`consent === true` en `/api/waitlist`). Disclaimer actualizado: "contenido del blog". Marketing emails diferidos a Resend Broadcasts con `{{{RESEND_UNSUBSCRIBE_URL}}}`.
- **Auditoría de secretos (2026-08)**: revisado todo el historial de git. `.env.local`, `.opencode/supabase-auth.json` y ninguna clave real (Resend/Supabase) estuvieron jamás en el repo; solo `.env.example` con placeholders. Se detectó que el commit `77e18dc` había commiteado artefactos de navegación del skill Impeccable (`.impeccable/`, perfil de Chrome) en el historial de un repo **público**. El historial se reescribió con `git filter-repo` (purgado completo de `.impeccable/`) y se hizo force-push; los blobs ya no son accesibles desde ninguna ref (verificado: 0). `.impeccable/` completo quedó en `.gitignore` para que no vuelva a subirse.

## Siguiente paso

1. **Plantillas Remotion de reels en GitHub** — buscar y evaluar candidatos con criterios de diseño (Onest/sans cálida, paleta neutra), animaciones (typewriter/slide-in/fade), estructura hook→tips→cta, mantenimiento y compatibilidad con Remotion 4. Umbral: ≥4/5 en criterios clave. Antes de forkar, probar la velocidad del pipeline actual creando un segundo reel (`src/lib/social/_drafts/segundo-reel/`) para confirmar si compensa el fork.
2. Sprint 1 — Setup + Auth (registro email + Google OAuth, schema `profiles` + `categories`). Detalle en [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md).

## Para empezar a desarrollar

1. `bun install`
2. `bun run dev`
3. Seguir [`docs/plan-desarrollo.md`](docs/plan-desarrollo.md)

## Reglas de trabajo

- Trabajar **paso a paso**: dividir el trabajo en pasos pequeños y verificables, detectando problemas temprano en lugar de ejecutar muchos cambios de golpe.
- **Hitos**: en tareas grandes, trabajar por hitos pequeños verificables. Al terminar un hito, **parar y reportar** el resultado; no iniciar el siguiente hito sin confirmación del usuario.
- Si el usuario pide **hacer un commit o un push**, recomienda primero **actualizar los docs** (AGENTS.md, docs/, roadmap.md) si el cambio de código los ha dejado desactualizados.
- **Engram (memoria del agente)** — Instalado en esta máquina. Complementario a los docs: AGENTS.md/docs/roadmap.md siguen siendo la fuente de verdad canónica (se actualizan a propósito); Engram guarda memoria privada de sesión (gotchas, decisiones informales, contexto entre sesiones) sin duplicar los docs.
- **Subagente `visual-eval`** (`.opencode/agents/visual-eval.md`, modelo `opencode-go/qwen3.7-plus`):
  - **Siempre**, tras `bun run stock fetch <nº> <dest>` sobre un asset destinado a `script.json` como `media`, invoca `@visual-eval <dest>` con el contexto de la escena. Si la recomendación ≠ `usar`, vuelve a buscar con otro query o ajusta el `media` del guion antes de renderizar.
  - **Nunca** usar `visual-eval` para auditar resultados propios renderizados (reel/still/carrusel). La verificación de calidad de lo que generamos es **humana**: parar y preguntar al usuario. Para clips de **stock** Pexels sí: `bun run frames <mp4> <out.png>` → `@visual-eval <out.png>` con el contexto de la escena.
- **Sistema de diseño** — Todo contenido visual (reel, carrusel, post de blog, email, asset Pexels) debe respetar [`DESIGN.md`](DESIGN.md) (impeccable, autoridad global de tokens y reglas) y el surface brief de cada superficie (p. ej. [`video/DESIGN.reels.md`](video/DESIGN.reels.md) para reels y carruseles). **NUNCA** usar tipografías que no sean `Onest Variable`, ni colores fuera de la paleta Still/Lino o tokens semánticos, ni radios fuera de `--radius: 0.625rem`, ni gradientes fuera del mesh oficial. Antes de cualquier render social, ejecuta `bun run tokens && bun run fonts && bun run lint:brand`. Tras renderizar, la auditoría de coherencia es humana: parar y preguntar al usuario (nunca `visual-eval`).
