-- Límite de intentos por clave, dentro del propio alta.
--
-- Primero hubo una función aparte, `check_rate_limit(p_key, p_limit,
-- p_window_seconds)`, concedida a `anon`. Cualquier función concedida a `anon`
-- es un endpoint público, así que quien la llamara elegía el límite y la
-- ventana, y podía pasar una ventana negativa para vaciar la clave o
-- preagotarla. Se elimina.
--
-- Ahora el límite vive dentro de `join_waitlist`, que ya es el único punto
-- público legítimo, con límite y ventana fijos y sin argumentos que el cliente
-- pueda torcer. La clave llega hasheada por el servidor con una sal secreta, de
-- modo que nadie puede calcular la de otra persona.

create table public.rate_limit_hits (
  id         bigserial primary key,
  key        text not null,
  created_at timestamptz not null default now()
);

create index idx_rate_limit_key_time on public.rate_limit_hits (key, created_at desc);

alter table public.rate_limit_hits enable row level security;

drop function if exists public.check_rate_limit(text, integer, integer);
drop function if exists public.join_waitlist(text);

create or replace function public.join_waitlist(p_email text, p_rate_key text)
returns table (wait_position integer, token uuid)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_token  uuid;
  v_hits   integer;
  c_limit  constant integer  := 5;
  c_window constant interval := interval '1 hour';
begin
  -- Ventana deslizante: lo viejo se tira en la misma llamada, sin cron.
  delete from public.rate_limit_hits
   where key = p_rate_key
     and created_at < now() - c_window;

  select count(*) into v_hits
    from public.rate_limit_hits
   where key = p_rate_key
     and created_at >= now() - c_window;

  if v_hits >= c_limit then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.rate_limit_hits (key) values (p_rate_key);

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

revoke all on function public.join_waitlist(text, text) from public;
grant execute on function public.join_waitlist(text, text) to anon, service_role;
