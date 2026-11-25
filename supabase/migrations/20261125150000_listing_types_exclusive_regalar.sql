-- «Regalar» va siempre solo.
--
-- La restricción anterior solo comprobaba que cada elemento estuviera en el
-- conjunto permitido, así que la base aceptaba un anuncio `['regalar','vender']`.
-- La regla vive en la interfaz (TYPE_SETS), pero una regla que solo vive en el
-- cliente no es una regla: se puede escribir por la API.

alter table public.listings drop constraint if exists listings_types_allowed;

alter table public.listings
	add constraint listings_types_allowed
	check (
		types <@ array['vender', 'cambiar', 'regalar']::text[]
		and (not ('regalar' = any (types)) or cardinality(types) = 1)
	);
