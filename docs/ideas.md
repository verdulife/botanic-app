# Ideas

Ideas, tareas pendientes y oportunidades detectadas. Cuando una idea se concrete, se migra al roadmap o al plan de desarrollo.

---

## Feedback de usuarios (Facebook orgánico)

1. **Rework del copy de la landing** — reescribir el copy para dejar más clara la idea de lo que es la app y lo que ofrece, añadiendo las funcionalidades core (vender, cambiar, regalar semillas, esquejes, brotes, plantas y tiestos), entre otros.
2. **Waitlist — expectativas claras** — al apuntarse, la gente se queda esperando un mensaje más claro de que "ya está". Falta un email de confirmación más explícito sobre el estado de la lista.
3. **Reforzar "lista de espera"** — hay gente que no lo tiene claro y espera poder usar la app ya. Comunicar mejor que es una lista de espera y todo lo que implica.

## Email / Deliverabilidad

4. ✅ **Emails en spam** — auditoría inicial completada (Hito 1 ✅) y fixes aplicados (Hito 2 ✅: FROM `hola@`, replyTo gmail, List-Unsubscribe headers, footer físico-legal, header image 600px). **Hito 3 ✅ (2026-08-20)**: re-test con código nuevo — Gmail entregado, Outlook sigue en Junk atribuido a calentamiento de dominio (no a configuración). Re-testear post-lanzamiento con volumen. Backlog Hito 4: Postmaster Tools + SNDS, endurecer DMARC, Open/Click tracking. Detalle completo + plan en [`docs/email-deliverability.md`](docs/email-deliverability.md).
5. **Email semanal con blog** — programar envío con las 2 publicaciones de la semana para persistir en memoria de la gente.
6. **Emails de comunidad** — crear sensación de comunidad: "ya somos X usuarios", "te explicamos X funcionalidad", etc.

## Producto / Experiencia

7. **Botón/enlace de compartir** — la gente que le encanta la idea quiere compartir con otros. Crear sistema para facilitar el compartir.
8. **Buzón de ideas / canal de feedback** — pensar en algo para que la gente pueda dar feedback o proponer ideas. Hay que darle una vuelta ya que solo existe la waitlist actualmente.

## Contenido

9. **Merchandising de plantas** — camisetas con hojas de plantas raras, etc. Buscar más ideas para esto.
10. **Contenido de valor** — ideas para dar a los seguidores cosas que creen sentimiento de comunidad o beneficio propio en lugar de spam.
11. ✅ **Documentos para impresión** — poster A3 implementado en `poster/` (autónomo, fuera de Vercel). Pendientes fase 2: derivados A4/A5, horizontal, render automatizado.

## Branding / Diseño

12. **Rediseño de logotipo**.
13. **Rediseño de paleta de colores**.
14. **Crear design system**.

## Arquitectura / Developer Experience

15. **Convertir en monorepo** — definir bien cada parte y separar responsabilidades claramente.
16. **Optimizar documentos para agentes IA** — crear un agent global + agents por sección (web, database/backend, app, video/social — generador de reels/carruseles, etc.). Así se consumen menos tokens, liberamos la ventana de contexto de ruido en cada sesión y cada carpeta es independiente a nivel agentico de las otras (aunque siempre pueden existir consultas internas).

    **Opinión del agente (2026-08-17)**: buena idea, pero hacer **15 antes** (el monorepo) porque define las carpetas sobre las que vivirá cada subagente. Orden recomendado: (1) monorepo con carpetas `web/`, `database/`, `app/`, `social/`, `docs/`; (2) `AGENTS.md` raíz corto (proyecto, stack, decisiones clave, reglas) + `AGENTS.md` por carpeta con lo específico. Cada sesión carga raíz + el suyo. Naming: **`social/`** mejor que `video/` porque ya no es solo reels — también carruseles, IG feed, futuro TikTok. Riesgos a vigilar: acoplamiento real entre secciones (`DESIGN.md`, `WaitlistForm` compartido, `waitlist_count` consumido por el email admin) → el agente global existe para esos solapamientos; sincronización (varios AGENTS.md pueden divergir si cambia una convención transversal, ej. un token de marca). Subagentes específicos ya existentes (`@visual-eval`) se mantienen y se referencian desde el AGENTS.md de su sección.

17. **Web multiidioma (catalán, gallego, euskera)** — ampliar la web pública a las lenguas cooficiales: catalán, gallego y euskera. Decisiones pendientes: (a) **estrategia de routing** — subdominios (`ca.botanicapp.es`) vs. prefijos de path (`/ca/`, `/gl/`, `/eu/`) vs. detección por `Accept-Language`; (b) **i18n framework** — `svelte-i18n` vs. `Paraglide JS` (de Inlang, más moderno, type-safe, optimizado para bundle) vs. solución nativa SvelteKit (hooks + stores); (c) **SEO y hreflang** — `hreflang` por idioma, canonical por locale, sitemaps por idioma, URLs canónicas en español como fallback; (d) **qué traducir primero** — landing + páginas legales obligatorias, blog como segunda fase; (e) **contenido por idioma** — traducción profesional vs. comunitaria vs. IA revisada (coste/calidad/coherencia de marca); (f) **autoría del blog** — los autores normalizados ("Albert", "Domadora de Gatos", "Laia") ¿se mantienen o se localizan?; (g) **espera vs. MVP** — probablemente Fase 2 (post-validación) por coste de traducción, pero el routing y el framework deben decidirse pronto para no tener que migrar. Considerar también variantes de gl (`gl-es` vs. `gl`) y de eu/vasco.

18. ✅ **Cron keep-alive de Supabase Free** — implementado en `.github/workflows/keep-alive-supabase.yml` (cron diario `0 6 * * *` UTC ≈ 7-8 AM España + `workflow_dispatch` para test manual). Usa `curl` contra el endpoint REST de Supabase (`GET /rest/v1/waitlist_count?select=total&limit=1`), que cuenta como actividad de BD y evita la pausa automática tras 7 días sin queries. Credenciales: secrets `SUPABASE_URL` + `SUPABASE_ANON_KEY` (anon key, **sin permisos admin**). Notificación nativa de GH configurada (`Settings → Notifications → Workflows → Failed only`). **Decisión de seguridad clave**: se eligió anon + view en vez de `service_role` o DB password porque el proyecto solo usa anon, manteniendo la superficie de ataque mínima. **Cuando pasemos a Supabase Pro**, el cron deja de ser necesario para evitar la pausa (mantener como health check o desinstalar).

19. ✅ **Revisar `waitlist_count` para paridad con la realidad** — resuelto (2026-08-20). **Conclusión**: la view (`SELECT count(*) FROM waitlist`) es un contador **en vivo** que corre como `postgres` (security definer, `reloptions=null`), así que **nunca puede desincronizarse** de la tabla (35 = 35, y como `anon` devuelve 35). La confusión inicial del usuario venía de Supabase Studio en móvil (muestra 20 filas por página, parecía un total paginado). **Fix aplicado** (migración `revoke_waitlist_excess_grants`): se revocaron los grants sobrantes de `anon`/`authenticated` — el peligro real era que la anon key pública tenía `TRUNCATE` sobre `waitlist`, y **RLS no cubre TRUNCATE** (cualquiera podría vaciar la tabla). Estado final: `anon`/`authenticated` → solo `INSERT` en `waitlist` + solo `SELECT` en `waitlist_count`. `service_role`/`postgres` intactos (borrado manual en Studio sigue funcionando). Verificado como anon: view devuelve 35, `DELETE`/`TRUNCATE` denegados, `INSERT` OK. **Descartadas** las mejoras de la idea: trigger + tabla contador denormalizada (sobreingeniería, crearía divergencia) y validación en el cron keep-alive (la view es live, nada que validar).
