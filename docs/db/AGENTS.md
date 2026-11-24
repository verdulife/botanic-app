# DB — contrato del módulo

PostgreSQL + Auth + Storage + Realtime en Supabase, proyecto `botanic` (eu-central-1). Cliente en `src/lib/supabase.ts`.

El esquema vive en la base de datos: allí se lee qué tablas hay, con qué columnas y con qué políticas. Aquí queda lo que la DDL no cuenta y lo que no se puede romper.

## Reglas

- Toda tabla nueva lleva RLS en el mismo commit que la crea, nunca después.
- Para exponer datos limitados se prefiere `SECURITY DEFINER` con `EXECUTE` restringido a `anon`, nunca `service_role` en el cliente. Patrón ya usado en `get_waitlist_position`.
- El proyecto se pausa tras siete días sin uso; el workflow `keep-alive-supabase.yml` lo evita.

## Documentación del módulo

| Doc | Contenido |
|---|---|
| [schema-waitlist.md](schema-waitlist.md) | Tabla `waitlist`, su RLS, la vista de conteo y la RPC de posición |
| [schema-app.md](schema-app.md) | Esquema del marketplace y de auth |
