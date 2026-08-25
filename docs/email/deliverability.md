# Email — Deliverability (estado actual)

Auditoría cerrada (hitos 1-3, ago 2026). Detalle histórico completo con fechas y comandos de verificación en [deliverability-log.md](deliverability-log.md) — cárgalo solo si necesitas el porqué o repetir un test.

## Estado DNS (`botanicapp.es`)

| Registro | Estado |
|---|---|
| DKIM (`resend._domainkey`) | ✅ |
| DMARC (`_dmarc`) | ✅ `p=none` |
| SPF (TXT @) | ✅ (fix aplicado hito 2) |
| MX @ | ✅ (fix aplicado hito 2) |

## Estado de entrega por proveedor

| Proveedor | Estado |
|---|---|
| Gmail | ✅ Bandeja de entrada |
| Outlook (live.com) | ⚠️ Junk — atribuido a reputación de dominio nuevo, no a config. Re-testar post-lanzamiento con más volumen. |

## Fixes de código ya aplicados (`src/lib/emails/layout.ts`, `src/routes/api/waitlist/+server.ts`)

- FROM `hola@botanicapp.es` (no `no-reply@`) + `replyTo`.
- Footer físico-legal (RGPD/LSSI).
- Header `List-Unsubscribe` + `List-Unsubscribe-Post: One-Click`.
- Header image `max-width:480px` + alt text descriptivo.

## Backlog (pendiente)

- [ ] Google Postmaster Tools + Microsoft SNDS.
- [ ] Página `/unsubscribe` propia.
- [ ] Endurecer DMARC `p=none` → `p=quarantine` → `p=reject` cuando los reports estén limpios.
- [ ] Evaluar dominio dedicado para marketing (`updates.botanicapp.es`) vs transaccional.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
