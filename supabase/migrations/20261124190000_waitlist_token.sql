-- Cierra el oráculo de la lista de espera.
--
-- `get_waitlist_position(text)` estaba concedida a `anon` y devolvía la posición
-- de cualquier correo que le pasaras: cualquiera podía tantear direcciones y
-- saber si estaban apuntadas y en qué puesto, sin ser suyas.
--
-- A partir de aquí la consulta va por un testigo por fila. Un uuid de 128 bits
-- no se enumera, así que conceder la función a `anon` deja de ser un problema:
-- solo puede preguntar quien ya tiene el testigo, es decir, quien se apuntó.

alter table public.waitlist
  add column access_token uuid not null default gen_random_uuid();

alter table public.waitlist
  add constraint waitlist_access_token_key unique (access_token);

create or replace function public.get_waitlist_position(target_token uuid)
returns integer
language sql
stable security definer
set search_path to 'public'
as $function$
  select pos
  from (
    select access_token, row_number() over (order by created_at, email)::int as pos
    from public.waitlist
  ) r
  where r.access_token = target_token
$function$;

revoke all on function public.get_waitlist_position(text) from public;
drop function public.get_waitlist_position(text);

revoke all on function public.get_waitlist_position(uuid) from public;
grant execute on function public.get_waitlist_position(uuid) to anon, service_role;

-- El alta la hace esta función y no un `insert` desde el cliente: el rol anónimo
-- no puede leer la tabla, y `insert ... select` necesitaría hacerlo. Aquí el
-- testigo solo se devuelve cuando la fila es nueva; si el correo ya estaba, la
-- función no devuelve nada y quien llama no puede distinguirlo de un alta.

create or replace function public.join_waitlist(p_email text)
returns table (wait_position integer, token uuid)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_token uuid;
begin
  insert into public.waitlist (email)
  values (lower(trim(p_email)))
  on conflict (email) do nothing
  returning access_token into v_token;

  if v_token is null then
    return;
  end if;

  return query
    select r.pos, v_token
    from (
      select access_token, row_number() over (order by created_at, email)::int as pos
      from public.waitlist
    ) r
    where r.access_token = v_token;
end;
$function$;

revoke all on function public.join_waitlist(text) from public;
grant execute on function public.join_waitlist(text) to anon, service_role;
