# Email — Setup Resend

- **Proveedor**: [Resend](https://resend.com) (Free: 3.000 emails transaccionales/mes, 100/día; marketing ilimitado hasta 1.000 contactos/mes).
- **Envío**: siempre vía SvelteKit server route (`src/routes/api/waitlist/+server.ts`), nunca desde el cliente.
- **Dominio verificado**: `botanicapp.es` → `hola@botanicapp.es`. DKIM en root, SPF/MX en `send.botanicapp.es`, región eu-west-1, DMARC `p=none`. Estado detallado en [deliverability.md](deliverability.md).
- **Plantillas**: HTML en `src/lib/emails/` (`layout.ts` + `confirmation.ts` + `adminNotify.ts`), estilos inline, tablas 600px. Header con `og-image.jpg` (banner de marca, generado con `bun run og`). Cada email incluye `text` como fallback.
- **Baja/unsubscribe**: diferido a Resend (`{{{RESEND_UNSUBSCRIBE_URL}}}` en broadcasts); página propia de baja pendiente (ver backlog en [deliverability.md](deliverability.md)).

## Flujo alta waitlist (hecho)

1. `POST /api/waitlist` → insert en tabla `waitlist` (schema en [../db/schema-waitlist.md](../db/schema-waitlist.md)).
2. Solo en fila nueva se envían:
   - Email de confirmación al usuario.
   - Notificación a `ADMIN_NOTIFY_EMAIL` (uno o varios, coma-separados) con el total desde la vista `waitlist_count`.
   - Alta del contacto en el **Audience "waitlist"** de Resend (para el broadcast de lanzamiento).
3. **Posición en la lista**: RPC `get_waitlist_position(email)` (`SECURITY DEFINER`, `EXECUTE` solo `anon`) → `{ ok, position }` en alta nueva, `{ ok, alreadyRegistered, position }` en duplicado. Alimenta la tarjeta "Semilla fundadora".
4. **Duplicado** (`23505`): responde `alreadyRegistered` + `position`, el form voltea la tarjeta sin reenviar emails (evita spam al admin).

## Emails de novedades/lanzamiento (pendiente)

Backlog priorizado en [PLAN.md](../../PLAN.md) → Backlog de ideas → Email/comunidad:

- [ ] Email de pre-lanzamiento para las Semillas fundadoras (primeros registrados).
- [ ] Email semanal con las 2 publicaciones del blog.
- [ ] Emails de comunidad ("ya somos X", explicación de funcionalidades).
- [ ] Broadcast de lanzamiento al Audience "waitlist" de Resend (infra ya lista, falta contenido/disparo).

Todos deben respetar [DESIGN.md](../../DESIGN.md) (misma marca que `layout.ts`) y la terminología de [PRODUCT.md](../../PRODUCT.md) (sin anglicismos: "waitlist"→"lista de espera", etc.).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
