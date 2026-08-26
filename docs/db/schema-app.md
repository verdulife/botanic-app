# DB — Schema app (marketplace + auth)

Schema del Hito 1 implementado (auth, profiles, listings) + pendientes para los siguientes hitos. Cada tabla lleva RLS desde la migración que la crea, nunca después.

## Implementado

### `profiles` — 1 fila por usuario autenticado

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location_label TEXT,
  lat FLOAT8,
  lng FLOAT8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Trigger `on_auth_user_created` (AFTER INSERT en `auth.users`) crea fila automáticamente con `username = COALESCE(raw_user_meta_data->>'username', 'user_<8chars>')`. Función `SECURITY DEFINER`.

**RLS**: 4 policies (`profiles_select_public`, `profiles_insert_own`, `profiles_update_own`, `profiles_delete_own`).

### `categories` — catálogo de tipos de listing

```sql
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

8 categorías seed: semillas, esquejes, plantas, tiestos, accesorios, herramientas, libros, otros.

**RLS**: `categories_select_public` (lectura pública; INSERT/UPDATE/DELETE solo via service role o migración).

### `listings` — anuncios del marketplace P2P

```sql
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category_id INT NOT NULL REFERENCES public.categories(id),
  price DECIMAL(10,2),
  location_label TEXT,
  lat FLOAT8,
  lng FLOAT8,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','reserved','sold','deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX idx_listings_category_id ON public.listings(category_id);
CREATE INDEX idx_listings_status_created ON public.listings(status, created_at DESC);
CREATE INDEX idx_listings_location ON public.listings(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
```

**RLS**:
- `listings_select_active_or_owner` — SELECT si `status='active'` OR `seller_id = auth.uid()`
- `listings_insert_own` — INSERT con `seller_id = auth.uid()`
- `listings_update_own` — UPDATE propio
- `listings_delete_own` — DELETE propio

### `listing_images` — galería por listing

```sql
CREATE TABLE public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listing_images_listing_id ON public.listing_images(listing_id);
```

**RLS**:
- `listing_images_select` — SELECT si el listing padre está activo o es propio
- `listing_images_insert_own` / `update_own` / `delete_own` — solo si `seller_id = auth.uid()`

### Storage — bucket `listing-images`

- Público (lectura sin auth)
- Max 500KB por archivo
- MIME types: `image/webp`, `image/jpeg`, `image/png`
- Path format: `{user_id}/{listing_id}/{uuid}.{ext}`
- Policies validan `auth.uid()::text = (storage.foldername(name))[1]` para write/update/delete

## Schema de personalización del feed

Añadido en preparación del feed adaptativo. `profiles` se queda como tabla
de identidad; toda la personalización vive en tablas satélite.

### `user_events` — log raw de comportamiento

```sql
CREATE TABLE public.user_events (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  target_type TEXT,
  target_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_user_type_created ON public.user_events(user_id, event_type, created_at DESC);
CREATE INDEX idx_events_target ON public.user_events(target_type, target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_events_user_created ON public.user_events(user_id, created_at DESC);

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_insert_own" ON public.user_events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "events_select_own" ON public.user_events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "events_delete_own" ON public.user_events FOR DELETE USING (user_id = auth.uid());
-- sin UPDATE: append-only
```

### `user_category_interests` — M2M con peso + fuente

```sql
CREATE TABLE public.user_category_interests (
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id INT  NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  weight      REAL NOT NULL DEFAULT 1.0,
  source      TEXT NOT NULL DEFAULT 'explicit',  -- 'explicit' | 'browse' | 'wish' | 'save'
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, category_id)
);
CREATE INDEX idx_interests_weight ON public.user_category_interests(user_id, weight DESC);

ALTER TABLE public.user_category_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interests_select_own" ON public.user_category_interests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "interests_insert_own" ON public.user_category_interests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "interests_update_own" ON public.user_category_interests FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "interests_delete_own" ON public.user_category_interests FOR DELETE USING (user_id = auth.uid());
```

### `feed_banners` — catálogo de banners

```sql
CREATE TABLE public.feed_banners (
  id                    TEXT PRIMARY KEY,  -- 'register_prompt', 'create_first_listing', etc.
  title                 TEXT NOT NULL,
  body                  TEXT,
  cta_label              TEXT,
  cta_href               TEXT,
  target_user_state     TEXT NOT NULL DEFAULT 'all',  -- 'all' | 'anon' | 'new' | 'inactive'
  min_days_since_signup INT,
  max_days_since_signup INT,
  position              TEXT NOT NULL DEFAULT 'inline',  -- 'top' | 'inline_3' | 'inline_8'
  weight                INT  NOT NULL DEFAULT 100,
  active                BOOLEAN NOT NULL DEFAULT true,
  starts_at             TIMESTAMPTZ,
  ends_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_banners_active_weight ON public.feed_banners(active, weight DESC) WHERE active = true;

ALTER TABLE public.feed_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners_select_public" ON public.feed_banners FOR SELECT USING (active = true);
-- INSERT/UPDATE/DELETE: solo admin (service_role) — no policies; solo vía migración o backend admin
```

### `feed_banner_views` + `user_banner_dismissals` — tracking

```sql
CREATE TABLE public.feed_banner_views (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID,  -- null para anónimos
  banner_id   TEXT NOT NULL REFERENCES public.feed_banners(id) ON DELETE CASCADE,
  context     TEXT,
  shown_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  clicked_at  TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ
);
CREATE INDEX idx_banner_views_banner ON public.feed_banner_views(banner_id, shown_at DESC);
CREATE INDEX idx_banner_views_user_banner ON public.feed_banner_views(user_id, banner_id, shown_at DESC)
  WHERE user_id IS NOT NULL;

ALTER TABLE public.feed_banner_views ENABLE ROW LEVEL SECURITY;
-- anónimos pueden INSERTar (tracking sin auth)
CREATE POLICY "banner_views_insert_anon" ON public.feed_banner_views FOR INSERT WITH CHECK (true);
-- anónimos no pueden SELECTar (no hay user_id)
CREATE POLICY "banner_views_select_own" ON public.feed_banner_views FOR SELECT USING (user_id = auth.uid());
-- sin UPDATE: append-only

CREATE TABLE public.user_banner_dismissals (
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  banner_id   TEXT NOT NULL REFERENCES public.feed_banners(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, banner_id)
);

ALTER TABLE public.user_banner_dismissals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_banner_dismissals_select_own" ON public.user_banner_dismissals FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_banner_dismissals_insert_own" ON public.user_banner_dismissals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_banner_dismissals_delete_own" ON public.user_banner_dismissals FOR DELETE USING (user_id = auth.uid());
```

> **Decisión**: el contenido de los banners (title, body, cta) empieza hardcoded en `src/lib/feed/banners.ts`.
> La tabla `feed_banners` solo recibe contenido vía service_role. Tracking de
> impresiones/clicks/dismissals en DB desde día 1. Cuando sepamos qué banners
> funcionan, migramos el contenido a DB sin perder históricos.

## Pendiente para siguientes hitos

Orden aproximado (ver PLAN.md para el backlog completo):

```sql
-- Hito 3+: favoritos
CREATE TABLE favorites (
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- Hito 4-5: deseos y matching
CREATE TABLE wishes (...);            -- criterios del deseo
CREATE TABLE wish_alerts (...);       -- preferencias de notificación
CREATE TABLE wish_matches (...);      -- resultado del matching automático

-- Hito 5-6: comunidad
CREATE TABLE community_posts (...);
CREATE TABLE community_replies (...);

-- Hito 7: chat
CREATE TABLE conversations (...);
CREATE TABLE messages (...);

-- Hito 8: notificaciones
CREATE TABLE notifications (...);
```

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).