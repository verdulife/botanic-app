# Arquitectura

## Diagrama

```
[Usuario] → [Cloudflare DNS/CDN] → [Vercel Edge] → [SvelteKit SSR]
                                                       │
                          ┌────────────────────────────┤
                          ▼                            ▼
                   [Supabase DB]              [Supabase Storage]
                   (PostgreSQL + Auth)         (imágenes de listings)
                   + Realtime (chat)
```

**Flujo**: Cloudflare resuelve DNS → Vercel ejecuta SvelteKit SSR → SvelteKit consulta Supabase en servidor (SEO) → El cliente se conecta directamente a Supabase para chat y actualizaciones.

## Stack

| Capa | Tecnología | Versión | Propósito | Coste |
|---|---|---|---|---|
| Framework | SvelteKit | 5 | SSR + PWA + routing | $0 |
| Lenguaje | TypeScript | 5 | Tipado | $0 |
| Estilos | TailwindCSS | 4 | Utilidades | $0 |
| Gestor | Bun | 1.3 | Solo `bun install` / `bun run` | $0 |
| Backend | Supabase | Free | DB, Auth, Storage, Realtime | $0 |
| Mapas | Leaflet + OSM | — | Sin API key | $0 |
| Email | Resend | Free | Transaccional + broadcasts (waitlist) | $0 |
| Hosting | Vercel | Hobby | SSR + CDN | $0 |
| DNS/CDN | Cloudflare | Free | DDoS + CDN (dominio `botanicapp.es`) | $0 |
| Repo | GitHub | Free | Código + CI/CD | $0 |

**Coste total MVP: 0 €/mes**

> **Dominio**: `botanicapp.es` (registrado por el usuario; nameservers y DNS gestionados en Vercel). Resend envía desde `Botanic <hola@botanicapp.es>` (DKIM en root + SPF/MX en subdomain `send.botanicapp.es`, región eu-west-1; DMARC `p=none`).

## Email (Resend)

- **Proveedor**: [Resend](https://resend.com) (Free: 3.000 emails transaccionales/mes, 100/día; marketing ilimitado hasta 1.000 contactos/mes). Envío vía **SvelteKit server route** (`/api/waitlist`), nunca desde el cliente.
- **Dominio verificado**: `botanicapp.es` → `hola@botanicapp.es`.
- **Flujo alta waitlist**: el usuario hace `POST /api/waitlist` → insert en tabla `waitlist` → se envían (solo en fila nueva):
  1. Email de confirmación al usuario ("¡Gracias por apuntarte a la waitlist de Botanic!").
  2. Notificación a `ADMIN_NOTIFY_EMAIL` (admite uno o varios, separados por coma). Incluye **total de apuntes** consultado desde la vista `waitlist_count` (anon, sin service_role).
  3. Alta del contacto en el **Audience "waitlist"** de Resend (para el broadcast de lanzamiento).
- **Duplicado** (`23505`): respuesta `alreadyRegistered` → el form muestra "Ya estás en la waitlist" sin enviar emails (evita spam al admin).
- **Plantillas**: HTML con la marca de Botanic en `src/lib/emails/` (`layout.ts` + `confirmation.ts` + `adminNotify.ts`), estilos inline, tablas 600px. Header con `og-image.jpg` (banner de marca ~23 KB, `static/og-image.jpg` generado por `scripts/generate-og.mjs` con sharp, mismo asset usado en `og:image`/`twitter:image`). Cada email lleva también su `text` como fallback.
- **Baja/unsubscribe**: diferido. Resend gestionará la baja automáticamente en broadcasts (`{{{RESEND_UNSUBSCRIBE_URL}}}`); página propia de baja pendiente de decidir.

## Límites Supabase Free

| Recurso | Límite |
|---|---|
| DB | 500 MB / proyecto |
| Storage | 1 GB |
| MAU (auth) | 50.000 / mes |
| Bandwidth | 5 GB egress |
| Proyectos | 2 activos |
| Inactividad | Pausa tras 7 días |

## Base de datos

### Schema

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  username    TEXT UNIQUE NOT NULL,
  bio         TEXT,
  avatar_url  TEXT,
  location    TEXT,
  lat         FLOAT8,
  lng         FLOAT8,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,  -- semillas, esquejes, plantas, tiestos, accesorios
  name  TEXT NOT NULL
);

CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id     UUID NOT NULL REFERENCES profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  category_id   INT NOT NULL REFERENCES categories(id),
  price         DECIMAL(10,2) NOT NULL,
  location      TEXT,
  lat           FLOAT8,
  lng           FLOAT8,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active','reserved','sold','deleted')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE listing_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  position    INT DEFAULT 0
);

CREATE TABLE favorites (
  user_id    UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, listing_id)
);

CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id),
  buyer_id    UUID NOT NULL REFERENCES profiles(id),
  seller_id   UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id       UUID NOT NULL REFERENCES profiles(id),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id  UUID NOT NULL REFERENCES profiles(id),
  reviewee_id  UUID NOT NULL REFERENCES profiles(id),
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (reviewer_id, reviewee_id)
);
```

### RLS Policies clave

```sql
-- Listings: cualquiera ve activos; solo el vendedor escribe
CREATE POLICY "listings_select" ON listings FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "listings_insert" ON listings FOR INSERT
  WITH CHECK (seller_id = auth.uid());
CREATE POLICY "listings_update" ON listings FOR UPDATE
  USING (seller_id = auth.uid());

-- Conversaciones y mensajes: solo los participantes
CREATE POLICY "conv_select" ON conversations FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());
CREATE POLICY "messages_select" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
);
```

## Repo: carpeta autónoma `video/` (Remotion)

- **Proyecto Remotion independiente** para reels IG/TikTok y carruseles IG (generación de vídeo 9:16 y stills 4:5). Tiene su **propio `package.json` y `node_modules`** y queda **fuera de workspaces** y fuera de la build de Vercel: `bun install` en raíz no lo toca ni el deploy lo builda (build SvelteKit ~30s).
- Browser de render: **Chrome Headless Shell** descargado por Remotion (`npx remotion browser ensure`) — versión pinned determinista.
- Render local: `npx remotion render` (mp4) y `npx remotion still` (PNG carrusel), leyendo el guion como inputProps.
- Guion agéntico `script.json` en `src/lib/social/`; assets Pexels bajo `static/social/<slug>/` vía `scripts/stock.mjs`.
- Detalle completo en [`docs/social-video.md`](docs/social-video.md) y [`docs/social-post.md`](docs/social-post.md).

## Design system cross-surface

[`DESIGN.md`](DESIGN.md) (impeccable) es la autoridad global de tokens y reglas de marca (paleta Still/Lino, tipografía Onest Variable, motion, Do's & Don'ts). Cada superficie mantiene su propio surface brief (p. ej. [`video/DESIGN.reels.md`](video/DESIGN.reels.md) para reels y carruseles). El script `bun run tokens` regenera `video/src/brand.generated.ts` desde el frontmatter de `DESIGN.md`; `bun run fonts` copia Onest woff2 a `static/fonts/`; `bun run lint:brand` audita `video/src/**` contra tokens. Ver `AGENTS.md` → Reglas de trabajo.

## Estructura del proyecto SvelteKit

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # Button, Input, Modal, Badge, Skeleton
│   │   ├── listings/        # ListingCard, ListingForm, ListingGallery, ListingMap
│   │   ├── chat/            # ConversationList, MessageBubble
│   │   ├── layout/          # Navbar, Footer, MobileNav
│   │   └── profile/         # ReviewList, Avatar
│   ├── server/
│   │   ├── db.ts            # Cliente Supabase SSR
│   │   └── helpers.ts
│   ├── stores/              # auth, filters, toast
│   ├── types/               # TypeScript types
│   └── utils/
├── routes/
│   ├── +layout.svelte       # Layout global + PWA manifest
│   ├── +layout.ts           # Carga sesión Supabase
│   ├── +page.svelte         # Landing
│   ├── (auth)/
│   │   ├── login/           # Login
│   │   ├── register/        # Register
│   │   └── callback/        # OAuth callback
│   ├── explore/             # Búsqueda + filtros + mapa
│   ├── listings/
│   │   ├── [id]/            # Detalle
│   │   ├── new/             # Crear
│   │   └── edit/[id]/       # Editar
│   ├── profile/
│   │   ├── [id]/            # Perfil público
│   │   └── me/              # Perfil propio
│   └── inbox/
│       ├── +page.svelte     # Lista chats
│       └── [id]/            # Chat individual
├── app.html
└── app.css
```

## Conexión Supabase (hooks.server.ts)

```ts
import { createServerClient } from '@supabase/ssr';
export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get, set, remove } }
  );
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    return session;
  };
  return resolve(event);
};
```

## Chat en tiempo real

```ts
// En inbox/[id]/+page.svelte
onMount(() => {
  const channel = supabase
    .channel(`conv:${conversationId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}` },
      (payload) => messages.update(m => [...m, payload.new])
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
});
```
