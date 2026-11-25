-- Atributos del anuncio que la interfaz ya usaba sobre el mock y que el baseline
-- no incluía: tipo de operación, especie y tamaño.
--
-- `types` es un array porque "vender" y "cambiar" son combinables (una misma
-- planta se puede vender o cambiar); "regalar" va siempre solo.
--
-- `species` es jsonb y no columnas sueltas porque su forma es opcional y
-- variable: nombre, nombre científico, género, familia, confianza y origen
-- (manual o Pl@ntNet).

alter table public.listings
	add column if not exists types text[] not null default '{}'::text[],
	add column if not exists species jsonb,
	add column if not exists size text;

do $$
begin
	if not exists (select 1 from pg_constraint where conname = 'listings_types_allowed') then
		alter table public.listings
			add constraint listings_types_allowed
			check (types <@ array['vender', 'cambiar', 'regalar']::text[]);
	end if;
end
$$;
