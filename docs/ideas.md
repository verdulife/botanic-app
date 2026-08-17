# Ideas

Ideas, tareas pendientes y oportunidades detectadas. Cuando una idea se concrete, se migra al roadmap o al plan de desarrollo.

---

## Feedback de usuarios (Facebook orgánico)

1. **"El wallapop de las plantas"** — la gente conecta con esta frase. Usarla como gancho en copy y comunicación.
2. **Waitlist — expectativas claras** — al apuntarse, la gente se queda esperando un mensaje más claro de que "ya está". Falta un email de confirmación más explícito sobre el estado de la lista.
3. **Reforzar "lista de espera"** — hay gente que no lo tiene claro y espera poder usar la app ya. Comunicar mejor que es una lista de espera y todo lo que implica.

## Email / Deliverabilidad

4. **Emails en spam** — investigar por qué algunos emails llegan a spam y encontrar soluciones.
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
