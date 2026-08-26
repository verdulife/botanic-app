# DB — Contexto del módulo (Supabase)

PostgreSQL + Auth + Storage + Realtime, tier Free. Proyecto `botanic` (eu-central-1). Cliente en `src/lib/supabase.ts`. Límites del plan Free abajo — vigilarlos al diseñar cualquier tabla o política nueva.

## Estado

| Área | Estado |
|---|---|
| Tabla `waitlist` + RLS + RPC posición | ✅ Hecho |
| Schema Hito 1 (`profiles` + `categories` + `listings` + `listing_images`) + Storage `listing-images` + RLS | ✅ Hecho |
| Auth: `@supabase/ssr` cookies + form actions (login, registro, magic link, recuperar, signOut) + `/auth/callback` | ✅ Hecho |
| Seed mock generoso + wipe pre-prod (`scripts/seed-mock.ts`, `scripts/wipe-mock.ts`) | ✅ Hecho |
| Schema futuro: `favorites`, `wishes`, `wish_alerts`, `wish_matches`, `community_posts`, `community_replies`, `conversations`, `messages`, `notifications` | 🔶 Pendiente (siguientes hitos) |
| **Schema de personalización del feed**: `user_events`, `user_category_interests`, `feed_banners`, `feed_banner_views`, `user_banner_dismissals` (RLS desde día 1, aplicado **antes de implementar banners** del feed) | 🔶 Pendiente (próxima tarea) |

## Documentación del módulo

| Doc | Contenido | Ubicación |
|---|---|---|
| schema-waitlist | Tabla `waitlist`, RLS, vista de conteo y RPC de posición (ya implementado) | [schema-waitlist.md](schema-waitlist.md) |
| schema-app | Schema del marketplace + auth: tablas implementadas, RLS, storage policies, plus pendientes para siguientes hitos | [schema-app.md](schema-app.md) |

## Límites Supabase Free

| Recurso | Límite |
|---|---|
| DB | 500 MB / proyecto |
| Storage | 1 GB |
| MAU (auth) | 50.000 / mes |
| Bandwidth | 5 GB egress |
| Proyectos | 2 activos |
| Inactividad | Pausa tras 7 días sin uso — hay cron `keep-alive-supabase.yml` en `.github/workflows/` |

## Reglas específicas de este módulo

- Toda tabla nueva lleva RLS desde el commit que la crea, nunca después.
- Preferir `SECURITY DEFINER` + `EXECUTE` restringido a `anon` sobre exponer `service_role` al cliente (patrón ya usado en `get_waitlist_position`).
- Antes de crear el schema app, confirmar con el usuario si sigue el orden de sprints de [PLAN.md](../../PLAN.md) o hay cambios de alcance.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
