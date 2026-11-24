# DB — schema del marketplace y de auth

Mapa de lo que existe y del porqué de lo que la DDL no cuenta. Las columnas, tipos, índices y políticas se consultan en la base de datos: aquí no se copian.

## Tablas

| Tabla | Qué guarda | Relación |
|---|---|---|
| `profiles` | Una fila por usuario autenticado | `id` → `auth.users(id)`, con borrado en cascada |
| `categories` | Catálogo de tipos de anuncio | — |
| `listings` | Anuncios del marketplace P2P | `seller_id` → `profiles`, `category_id` → `categories` |
| `listing_images` | Galería de cada anuncio | `listing_id` → `listings`, con borrado en cascada |
| `waitlist` | Apuntes a la lista de espera | Ver [schema-waitlist.md](schema-waitlist.md) |

## Auth y perfiles

El alta de usuario no crea el perfil desde la aplicación: lo hace el trigger `on_auth_user_created` sobre `auth.users`, con la función `SECURITY DEFINER` `handle_new_user()`. Toma el `username` de los metadatos del registro y, si no viene, genera uno con prefijo `user_`. Eso evita que un registro a medias deje un usuario sin perfil.

`profiles.username` es único y es la identidad pública del usuario.

## RLS

Toda tabla tiene RLS activa. La forma de cada política:

- **`profiles`** — lectura pública; insertar, actualizar y borrar, solo lo propio.
- **`categories`** — solo lectura pública. Se llena por migración.
- **`listings`** — se lee lo activo o lo propio; escribir, solo lo propio. Un anuncio `reserved`, `sold` o `deleted` deja de ser visible para los demás sin borrarse.
- **`listing_images`** — lectura ligada al anuncio padre; escritura, solo el dueño.
- **`waitlist`** — únicamente `INSERT` para anónimos. No hay lectura directa: el total se expone por la vista `waitlist_count`.

## Índices

Cada uno responde a una consulta concreta, no son decorativos:

- `listings(seller_id)` — los anuncios de un vendedor.
- `listings(category_id)` — el filtro por categoría.
- `listings(status, created_at DESC)` — el listado de activos, ya ordenado.
- `listings(lat, lng)` parcial, solo filas con coordenadas — las consultas del mapa.
- `listing_images(listing_id)` — la galería de un anuncio.

## Storage

Bucket `listing-images`: lectura pública, escritura reservada a la carpeta del usuario. Los tipos admitidos son webp, jpeg y png; el límite por archivo es de 512 KB. La ruta es `{user_id}/{listing_id}/{uuid}.{ext}`, y las políticas comprueban que el primer segmento coincide con `auth.uid()`.

## Alcance

Este mapa son las tablas que existen. Favoritos, deseos, chat, comunidad y notificaciones **todavía no tienen esquema**: sus rutas existen en la aplicación y su persistencia está por diseñar.
