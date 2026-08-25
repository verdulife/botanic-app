# Email — Contexto del módulo (Resend)

Envío transaccional y de campaña vía Resend. Nunca desde el cliente — siempre por server route SvelteKit. Marca visual y copy deben respetar [DESIGN.md](../../DESIGN.md) y [PRODUCT.md](../../PRODUCT.md) (terminología sin anglicismos) — autoridad global, no la dupliques aquí.

## Estado

| Área | Estado |
|---|---|
| Respuesta automática waitlist (confirmación + notif. admin + alta en Audience) | ✅ Hecho |
| Deliverability (SPF/DKIM/DMARC/MX) | ✅ Resuelto |
| Emails de novedades y lanzamiento (broadcast) | 🔶 Pendiente — infra lista, falta contenido |

## Documentación del módulo

| Doc | Contenido | Ubicación |
|---|---|---|
| resend-setup | Config del proveedor, flujo waitlist completo, plantillas, backlog de novedades/lanzamiento | [resend-setup.md](resend-setup.md) |
| deliverability | Estado actual de DNS y entrega por proveedor + fixes aplicados | [deliverability.md](deliverability.md) |
| deliverability-log | Log histórico completo de la auditoría (hitos fechados) — solo bajo demanda | [deliverability-log.md](deliverability-log.md) |

## Código relevante

- `src/lib/emails/` — plantillas (`layout.ts`, `confirmation.ts`, `adminNotify.ts`)
- `src/routes/api/waitlist/+server.ts` — endpoint de alta
- `scripts/email-preview.mjs`, `scripts/email-send.mjs` — preview y envío manual (`bun run email:preview`, `bun run email:send`)

## Reglas específicas de este módulo

- Cualquier plantilla nueva reutiliza `layout.ts` (header + footer legal ya resueltos) — no reimplementar el layout.
- Antes de tocar DNS o headers de entrega, revisar [deliverability.md](deliverability.md) para no repetir un fix ya aplicado.
- Nuevas campañas usan el Audience "waitlist" existente en Resend, no crear uno nuevo.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
