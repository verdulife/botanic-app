-- Categorías del catálogo.
--
-- El listado sale del seed del proyecto, no de la documentación antigua: son
-- ocho y `bulbos` sustituye a `libros`. Idempotente, para poder reaplicarla
-- tras un drop sin duplicar.

insert into public.categories (slug, name, position) values
  ('semillas',    'Semillas',    0),
  ('esquejes',    'Esquejes',    1),
  ('plantas',     'Plantas',     2),
  ('bulbos',      'Bulbos',      3),
  ('tiestos',     'Tiestos',     4),
  ('accesorios',  'Accesorios',  5),
  ('herramientas','Herramientas',6),
  ('otros',       'Otros',       7)
on conflict (slug) do update
  set name = excluded.name,
      position = excluded.position;
