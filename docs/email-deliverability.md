# Email Deliverability — Auditoría

Investigación de por qué algunos emails de Botanic llegan a spam. Ejecutado en pasos verificables.

---

## Hito 1 — Auditoría inicial (2026-08-18)

### DNS público de `botanicapp.es`

Comprobado con `Resolve-DnsName` (Windows) y `nslookup` (8.8.8.8) — ambos coinciden.

| Registro | Estado | Valor |
|---|---|---|
| TXT @ | ⚠️ parcial | `google-site-verification=ZpuiweX1eJRIaKixqV8eQAzHMMu86ek_rKltF2qENf4` |
| **SPF (TXT @)** | ❌ **AUSENTE** | — (debería ser `v=spf1 include:_spf.resend.com ~all`) |
| DKIM (`resend._domainkey`) | ✅ presente | (clave pública Resend) |
| DMARC (`_dmarc`) | ✅ presente | `v=DMARC1; p=none; rua=mailto:verdukactus@gmail.com; ruf=mailto:verdukactus@gmail.com; fo=1` |
| **MX @** | ❌ **AUSENTE** | — |
| NS | ✅ Vercel | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |

**Hallazgo crítico**: SPF y MX no están en DNS, contraviniendo la documentación de Resend ("SPF is automatically set up when you verify your domain with Resend"). AGENTS.md afirma que DKIM+SPF+MX están configurados — la realidad es DKIM ✓ + DMARC ✓, pero **SPF y MX faltan**.

### Tests multi-cuenta

Email de confirmación (versión actual sin tocar) enviado a:
- `verdukactus@gmail.com` → Resend ID `b03f26bc-27cb-45d4-80b6-6f80a93c7cc6` (200 OK)
- `verdu@live.com` → Resend ID `8543c490-f540-4d7d-acbb-618906a33f4c` (200 OK)

**Pendiente de reportar por el usuario** (no automatizable desde aquí):
- Bandeja de entrada vs Spam en cada cliente.
- Pestaña "Mostrar original" / Authentication-Results de Gmail.
- Ver código fuente del mensaje en Outlook.

### Hallazgos de código (revisión estática)

| Aspecto | Estado | Impacto en spam |
|---|---|---|
| FROM `Botanic <no-reply@botanicapp.es>` | ❌ usa `no-reply@` | Resend Deliverability Insights lo marca como warning |
| Reply-to | ❌ no definido | Sin engagement reply, peor reputación |
| List-Unsubscribe header | ❌ ausente | Gmail marca agresivamente sin él |
| Dirección física en footer | ❌ ausente | Requisito RGPD/LSSI + filtro spamassassin |
| HTML+text | ✅ ambos presentes | OK |
| Preheader | ✅ presente | OK |
| Header image | ⚠️ 1200×630 al 100% ancho | Ratio imagen/texto alto, alt text decorativo |
| Emoji asunto | ✅ sin emojis | OK |
| Palabras-spam | "lanzamiento", "regalar" (pocas, bajo riesgo) | OK |
| Open/click tracking en Resend | ❌ desactivado | Mejora engagement signals → reputación |
| Volumen de envío | Muy bajo (waitlist transaccional puntual) | Sin warmup → reputación fría |
| Dominio nuevo (creado 2026-08-01) | ~17 días | Sin historial de confianza |

### Causas ordenadas por probabilidad

1. **SPF ausente** → muchos receptores (Gmail, Outlook, spamassassin) suben el spam score sin SPF pass.
2. **MX ausente** → no es bloqueante para enviar, pero algunos filtros puntúan negativamente.
3. **FROM `no-reply@`** → Resend lo flagea, además reduce engagement real.
4. **Reputación de dominio fría** → dominio < 1 mes, sin warmup.
5. **Sin List-Unsubscribe header** → Gmail marca con más agresividad.
6. **Sin dirección física** → filtros tipo spamassassin penalizan.

### Acciones inmediatas recomendadas

#### 1. Añadir SPF y MX en Vercel DNS (CRÍTICO)

Vercel DNS para `botanicapp.es`:

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.resend.com ~all` | 60 |
| MX | `@` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) | 60 |

> Nota: Resend envía desde infraestructura AWS SES. El MX recomendado por Resend para recibir bounces es el de la región configurada (eu-west-1). Verificar valor exacto en panel de Resend una vez añadido el registro.

#### 2. Endurecer DMARC (Hito 2)

Actual `_dmarc.botanicapp.es`:
```
v=DMARC1; p=none; rua=mailto:verdukactus@gmail.com; ruf=mailto:verdukactus@gmail.com; fo=1
```

Recomendación una vez SPF/DKIM estén validados:
- Mantener `p=none` durante 2-4 semanas para收集 reports.
- Subir a `p=quarantine` o `p=reject` cuando los reports sean limpios.
- `rua` y `ruf` actualmente apuntan a `verdukactus@gmail.com` — funciona pero es personal; considerar mailbox dedicado tipo `dmarc@botanicapp.es` cuando exista el inbound.

#### 3. Activar tracking en Resend

`Open Tracking: false` y `Click Tracking: false` actualmente. Los tracking signals ayudan a construir reputación de engagement con Gmail. Recomendado: **activar ambos**.

#### 4. Fixes de código (Hito 2)

- **A. Dirección física** en `src/lib/emails/layout.ts` footer.
- **B. Reply-to** `hola@botanicapp.es` en `src/routes/api/waitlist/+server.ts`.
- **C. List-Unsubscribe header** (RFC 8058 one-click):
  ```
  List-Unsubscribe: <mailto:unsubscribe@botanicapp.es>
  List-Unsubscribe-Post: List-Unsubscribe=One-Click
  ```
- **D. FROM realista** evaluar migrar de `no-reply@` a `hola@botanicapp.es` (o mantener `no-reply@` y usar `hola@` solo como reply-to).
- **E. Header image** `max-width:480px` + alt text descriptivo largo.

#### 5. Warmup (cuando llegue el broadcast del blog, idea #5)

- Configurar **Google Postmaster Tools** para monitorizar reputación con Gmail.
- Microsoft **SNDS** para Outlook.
- Subir volumen gradualmente (no tenemos tráfico masivo ahora, así que el broadcast será nuestro warmup real).

---

## Hito 2 — Fixes de código ✅ aplicado

Resultados del Hito 1:
- **Gmail** → ✅ bandeja de entrada
- **Outlook (live.com)** → ❌ Junk

Outlook es más estricto con SPF, confirma la hipótesis principal.

### Cambios aplicados (commit sugerido único)

**`src/lib/emails/layout.ts`:**
- ➕ Constante `EMAIL_LEGAL` con titular, NIF, domicilio (de `aviso-legal.md`) y contacto.
- ➕ Footer físico-legal con datos del titular (RGPD/LSSI + filtro spamassassin).
- ➕ Header image: `displayWidth=480px` (max-width), alt text descriptivo largo (no decorativo).

**`src/routes/api/waitlist/+server.ts`:**
- FROM: `Botanic <no-reply@botanicapp.es>` → **`Botanic <hola@botanicapp.es>`** (Resend flagea `no-reply@`).
- ➕ `replyTo: ["hola@botanicapp.es"]` (engagement real).
- ➕ `headers` con `List-Unsubscribe` + `List-Unsubscribe-Post: One-Click` (Gmail marca con más agresividad sin él).

### Verificación

- `bun run check` → 0 errores, 0 warnings.
- Email re-enviado con código nuevo:
  - `verdukactus@gmail.com` → Resend ID `58fee599-c4b0-49d0-94e8-826fdb61cf8e` (200 OK)
  - `verdu@live.com` → Resend ID `791d5683-15b3-442e-9d55-40d4f429d4ca` (200 OK)

### � Acción pendiente en Vercel DNS (CRÍTICO, no automatizable desde aquí)

Outlook seguirá marcando spam hasta que se añada el registro SPF. El usuario debe añadir en Vercel → DNS Records para `botanicapp.es`:

| Tipo | Nombre | Valor |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.resend.com ~all` |

Una vez añadido, verificar con:
```powershell
nslookup -type=txt botanicapp.es 8.8.8.8
```

Si Resend sugiere un valor distinto para SPF en su panel (tras añadir el dominio), usar ese.

---

## Hito 3 — Re-medir (pendiente)

Bloqueado por la acción DNS del usuario (añadir SPF en Vercel).

Pasos una vez aplicado el SPF:
1. Re-enviar email con `bun run scripts/email-test-hito1.ts`.
2. Verificar bandeja de entrada en Gmail + Outlook.
3. Capturar Authentication-Results de ambos para confirmar SPF pass.
4. Si Outlook pasa: SPF era el problema principal. Si sigue en Junk, abrir sub-hito para investigar contenido/puntuación de Outlook.
5. Meta: entrega directa en ambos sin tocar nada más.

---

## Hito 4 — Backlog

- [ ] Configurar Google Postmaster Tools
- [ ] Configurar Microsoft SNDS
- [ ] Diseñar página `/unsubscribe` propia (cuando Resend no gestione automáticamente)
- [ ] Endurecer DMARC a `p=quarantine` → `p=reject` (gradual)
- [ ] Evaluar dominio dedicado para emails transaccionales vs marketing (`mail.botanicapp.es` o `updates.botanicapp.es`)
- [ ] Actualizar AGENTS.md para reflejar el estado real de DNS (DKIM ✓, DMARC ✓, **SPF + MX pendientes**)

---

## Fuentes

- [Resend — Why are my emails going to spam](https://resend.com/docs/knowledge-base/why-are-my-emails-going-to-spam)
- [Resend — How to avoid Gmail's spam folder](https://resend.com/docs/knowledge-base/how-do-i-avoid-gmails-spam-folder)
- [Resend — How to avoid Outlook's spam folder](https://resend.com/docs/knowledge-base/how-do-i-avoid-outlooks-spam-folder)
- [Resend — Implementing DMARC](https://resend.com/docs/dashboard/domains/dmarc)
- [Resend — Add an unsubscribe link to transactional emails](https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails)
