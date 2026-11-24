-- Límite de intentos por clave, para el alta de la lista de espera.
--
-- En serverless no hay memoria compartida entre instancias, así que un contador
-- en proceso no limita nada. Se hace en la base de datos, que ya está ahí: una
-- tabla con la clave ya hasheada —nunca la IP en claro— y una ventana corta.
--
-- La tabla no lleva políticas: sin políticas y con RLS activa, nadie lee ni
-- escribe salvo la función, que corre con privilegios elevados.

create table public.rate_limit_hits (
  id         bigserial primary key,
  key        text not null,
  created_at timestamptz not null default now()
);

create index idx_rate_limit_key_time on public.rate_limit_hits (key, created_at desc);

alter table public.rate_limit_hits enable row level security;

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_count integer;
begin
  -- Ventana deslizante: lo viejo se tira en la misma llamada, sin cron.
  delete from public.rate_limit_hits
   where key = p_key
     and created_at < now() - make_interval(secs => p_window_seconds);

  select count(*) into v_count
    from public.rate_limit_hits
   where key = p_key
     and created_at >= now() - make_interval(secs => p_window_seconds);

  if v_count >= p_limit then
    return false;
  end if;

  insert into public.rate_limit_hits (key) values (p_key);
  return true;
end;
$function$;

revoke all on function public.check_rate_limit(text, integer, integer) from public;
grant execute on function public.check_rate_limit(text, integer, integer) to anon, service_role;
