-- Baseline del esquema de Botanic.
--
-- Reproduce el estado que ya está aplicado en el proyecto de Supabase, que se
-- construyó antes de versionar las migraciones en el repositorio. Se genera
-- leyendo el catálogo de la base de datos, no de memoria.
--
-- No se ejecuta contra la base actual: su función es poder reconstruir el
-- esquema desde cero tras un `drop`, que es aceptable porque todo es data de
-- pruebas. A partir de aquí, cada cambio de esquema entra como una migración
-- nueva y fechada.

-- ---------------------------------------------------------------- tablas

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique,
  full_name     text,
  avatar_url    text,
  bio           text,
  location_label text,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.categories (
  id         serial primary key,
  slug       text not null unique,
  name       text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.listings (
  id             uuid primary key default gen_random_uuid(),
  seller_id      uuid not null references public.profiles (id) on delete cascade,
  title          text not null,
  description    text,
  category_id    integer not null references public.categories (id),
  price          numeric(10, 2),
  location_label text,
  lat            double precision,
  lng            double precision,
  status         text not null default 'active'
                 check (status in ('active', 'reserved', 'sold', 'deleted')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.listing_images (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  url          text not null,
  storage_path text not null,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- índices

create index idx_listings_seller_id on public.listings (seller_id);
create index idx_listings_category_id on public.listings (category_id);
create index idx_listings_status_created on public.listings (status, created_at desc);
create index idx_listings_location on public.listings (lat, lng)
  where lat is not null and lng is not null;
create index idx_listing_images_listing_id on public.listing_images (listing_id);

-- ---------------------------------------------------------------- fila por usuario

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      'user_' || substring(new.id::text, 1, 8)
    )
  );
  return new;
end;
$function$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- lista de espera

create view public.waitlist_count as
  select count(*) as total from public.waitlist;

create or replace function public.get_waitlist_position(target_email text)
returns integer
language sql
stable security definer
set search_path to 'public'
as $function$
  select pos
  from (
    select email, row_number() over (order by created_at, email)::int as pos
    from public.waitlist
  ) r
  where lower(r.email) = lower(target_email)
$function$;

revoke all on function public.get_waitlist_position(text) from public;
grant execute on function public.get_waitlist_position(text) to anon, service_role;

-- ---------------------------------------------------------------- RLS

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.listings       enable row level security;
alter table public.listing_images enable row level security;
alter table public.waitlist       enable row level security;

create policy profiles_select_public on public.profiles
  for select using (true);
create policy profiles_insert_own on public.profiles
  for insert with check (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_delete_own on public.profiles
  for delete using (id = auth.uid());

create policy categories_select_public on public.categories
  for select using (true);

create policy listings_select_active_or_owner on public.listings
  for select using (status = 'active' or seller_id = auth.uid());
create policy listings_insert_own on public.listings
  for insert with check (seller_id = auth.uid());
create policy listings_update_own on public.listings
  for update using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy listings_delete_own on public.listings
  for delete using (seller_id = auth.uid());

create policy listing_images_select on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and (l.status = 'active' or l.seller_id = auth.uid())
    )
  );
create policy listing_images_insert_own on public.listing_images
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and l.seller_id = auth.uid()
    )
  );
create policy listing_images_update_own on public.listing_images
  for update using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and l.seller_id = auth.uid()
    )
  );
create policy listing_images_delete_own on public.listing_images
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_images.listing_id
        and l.seller_id = auth.uid()
    )
  );

-- El alta es anónima y no hay lectura directa: el total sale por la vista.
create policy waitlist_insert_anon on public.waitlist
  for insert to anon with check (email is not null);

grant select on public.waitlist_count to anon;

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  524288,
  array['image/webp', 'image/jpeg', 'image/png']
);

create policy listing_images_read_public on storage.objects
  for select using (bucket_id = 'listing-images');

create policy listing_images_upload_own_folder on storage.objects
  for insert with check (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy listing_images_update_own_folder on storage.objects
  for update using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy listing_images_delete_own_folder on storage.objects
  for delete using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
