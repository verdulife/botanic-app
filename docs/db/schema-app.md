# DB — Schema app (pendiente)

Schema objetivo de la web app marketplace, a implementar según los sprints de [PLAN.md](../../PLAN.md) (Sprint 1: profiles/categories · Sprint 2: listings/listing_images · Sprint 4: favorites/reviews · Sprint 5: conversations/messages). **Ninguna de estas tablas existe todavía en Supabase.**

## Tablas

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

## RLS Policies clave

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

## Chat en tiempo real (Supabase Realtime)

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

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
```
