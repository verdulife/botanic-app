# DB — Schema waitlist

```sql
CREATE TABLE waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
-- RLS: solo INSERT (anon), sin SELECT directo
```

- **Vista `waitlist_count`**: expone el total de apuntes a `anon` sin necesidad de `service_role`. La usa la notificación al admin.
- **RPC `get_waitlist_position(email)`**: `SECURITY DEFINER`, `EXECUTE` solo a `anon`. Devuelve `row_number()` por `(created_at, email)`. Alimenta la tarjeta "Semilla fundadora" del front.
- **Duplicado**: constraint `UNIQUE(email)` → error Postgres `23505`, tratado como éxito (`alreadyRegistered`) en el endpoint, no como fallo.

---
