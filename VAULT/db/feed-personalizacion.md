# Feed — personalización (diseño, no aplicado)

Diseño de esquema escrito el 2026 y **no aplicado** a la base de datos: las cinco tablas no existen. Sale del repo el 24-nov porque `docs/db/schema-app.md` lo presentaba con la misma tipografía que lo aplicado. Cuando se aplique, vuelve al mapa con su DDL real.

Recuperado de `docs/db/schema-app.md` (líneas 101-214).

---

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
