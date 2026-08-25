# DB — Contexto del módulo (Supabase)

PostgreSQL + Auth + Storage + Realtime, tier Free. Proyecto `botanic` (eu-central-1). Cliente en `src/lib/supabase.ts`. Límites del plan Free abajo — vigilarlos al diseñar cualquier tabla o política nueva.

## Estado

| Área | Estado |
|---|---|
| Tabla `waitlist` + RLS + RPC posición | ✅ Hecho |
| Schema app (`profiles`, `listings`, `categories`, `favorites`, `conversations`, `messages`, `reviews`) | 🔶 Pendiente (Sprints 1-5 de PLAN.md) |

## Documentación del módulo

| Doc | Contenido | Ubicación |
|---|---|---|
| schema-waitlist | Tabla `waitlist`, RLS, vista de conteo y RPC de posición (ya implementado) | [schema-waitlist.md](schema-waitlist.md) |
| schema-app | Schema completo objetivo de la web app: tablas, RLS policies, Realtime (pendiente de crear) | [schema-app.md](schema-app.md) |

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
