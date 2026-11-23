# Botanic — estado, alcance y negocio

Material de planificación personal. Salió del repositorio porque **decide qué construir, no cómo
construirlo**, y eso lo decide el humano y lo documenta en su vault. Los documentos que quedan en el
repo (`AGENTS.md`, `ARCHITECTURE.md`, `PRODUCT.md`, `DESIGN.md`) son los que interfieren en cómo se
escribe el código.

**No es documentación del proyecto**: no se enlaza desde `AGENTS.md` y ningún agente debe usarlo como
fuente de verdad. Cuando esté en el vault de Obsidian, esta carpeta se borra.

## Estado a noviembre de 2026

- **Con datos reales**: landing, blog y lista de espera (Supabase y Resend operativos).
- **Completa y navegable**: la web app `/app`. Ya no es un wireframe: es el diseño final, sobre datos mock y con `AUTH_MODE = 'mock'`.
- **Sin empezar**: el backend de la web app. Sin autenticación real, sin tablas en uso, sin PWA instalable.

## Alcance del MVP

| Área | Capacidad | UI | Datos |
|---|---|---|---|
| Lista de espera | Captura de email, confirmación, compartir | ✅ | ✅ |
| Blog | Artículos con imágenes locales y Open Graph por entrada | ✅ | ✅ |
| Cuenta | Registro con email y Google, sesión, recuperación, bienvenida | ✅ | — |
| Perfil | Perfil propio y público, avatar, ubicación | ✅ | — |
| Anuncios | Publicar con 1-5 fotos, editar y borrar los propios | ✅ | — |
| Catálogo | Grid, búsqueda por texto, filtros, detalle con galería | ✅ | — |
| Mapa | Leaflet + OpenStreetMap, markers por vendedor con valoración, chips de ocultos | ✅ | — |
| Favoritos | Guardar anuncios y listarlos | ✅ | — |
| Chat | Conversación desde el anuncio, lista de chats, no leídos, marcar como vendido | ✅ | — |
| Valoraciones | 1-5 estrellas, una por par, media en el perfil | ✅ | — |
| Deseos | Crear un deseo, listarlo, coincidencias y alertas | ✅ | — |
| Comunidad | Feed, hilo, responder, mis publicaciones | ✅ | — |
| Instalación | PWA instalable con funcionamiento básico sin conexión | — | — |

## Fuera del MVP

| Capacidad | Fase |
|---|---|
| Envíos con etiquetas | 2 |
| App nativa (Flutter) y notificaciones push | 2 |
| Web multiidioma (catalán, gallego, euskera) | 2 |
| Pagos integrados | 3 |
| El Market de Botanic y cuentas de tienda | 3 |
| El Market vía afiliados | 3 |
| Live shopping y subastas | 4 |
| Identificación de plantas por foto (IA) | 4 |
| Feed adaptativo (banners y personalización) | Posterior al MVP |

## Trabajo pendiente

### Datos y backend

- Autenticación real: cambiar `AUTH_MODE` a `supabase`, retirar `src/lib/mock/auth-server.ts` y las ramas `isMockAuth()`.
- Migraciones `profiles`, `categories`, `listings`, `listing_images` y el resto, con RLS desde la migración que las crea. Schema en `docs/db/schema-app.md`.
- Sustituir el mock por consultas reales: 30 archivos dependen de `$lib/mock`, incluidos los stores de usuario, anuncios y deseos.
- Storage de imágenes: bucket `listing-images` y subida de fotos en el formulario de publicación.
- Realtime en el chat: Supabase Realtime para conversaciones y mensajes.

### Instalación

- Enchufar el PWA: `@vite-pwa/sveltekit` está en dependencias pero no aparece en `vite.config.ts`, y `static/` no tiene manifest ni iconos 192/512. Faltan service worker, precaching y prompt de instalación.

### Interfaz

- Interruptor de modo oscuro (los tokens existen en `DESIGN.md`).
- Páginas 404, de error, vacío y sin conexión.
- Prueba manual en móvil y escritorio antes de cerrar el MVP.

### Calidad

- Prettier y ESLint: no hay ninguno configurado.
- Suite de pruebas: la única es `pnpm design:test`, sobre el gate del sistema de diseño.
- Migrar `$lib` a `#lib`: SvelteKit 3 retiró `$lib`; quedan 305 importaciones por mover.
- Tipar `scripts/` en `tsconfig.json`.
- Primer despliegue en Vercel: `adapter-vercel` configurado, sin estrenar.

## Fases

| Fase | Periodo | Objetivo | Estado |
|---|---|---|---|
| 0 — MVP PWA | Jul–Ago 2026 | Lanzar PWA funcional con coste 0 | En curso |
| 1 — Validación | Q4 2026 | 1.000 usuarios activos, iteración con feedback | Pendiente |
| 2 — App nativa | Q1 2027 | Flutter, notificaciones, cámara | Pendiente |
| 3 — Monetización | Q2–Q3 2027 | Plan Pro, destacados, suscripciones profesionales | Pendiente |
| 4 — Expansión | 2028 | Latam, identificación por foto (IA), foro, ronda seed | Pendiente |

| Transición | Condición |
|---|---|
| MVP → Validación | App estable, primeras transacciones |
| Validación → App nativa | 1.000 usuarios activos |
| App nativa → Monetización | 500 transacciones/mes |
| Monetización → Expansión | Ingresos > costes + tracción sostenida |

## Métricas

| Fase | Métrica | Objetivo |
|---|---|---|
| MVP (0) | Suscriptores lista de espera | 1.000 |
| MVP (0) | Posts de blog publicados | 16-20 (colchón) |
| Validación (1) | Usuarios registrados | 500 |
| Validación (1) | Anuncios activos | 200 |
| Validación (1) | Transacciones | 50 |
| Validación (1) | Retención semanal | >30 % |

## Monetización y expansión

- **Fase 3** — Plan Pro, anuncios destacados y suscripciones para profesionales. Incluye El Market de Botanic como catálogo profesional con cuentas de tienda.
- **Fase 4** — Latam, identificación de plantas por foto con IA, foro y ronda seed.

## Difusión y comunidad

La campaña de difusión se ejecuta en un proyecto aparte; aquí queda como contexto.

- Email semanal con el blog.
- Emails de comunidad («ya somos X», explicación de funcionalidades nuevas).
- Reforzar «lista de espera»: comunicar mejor qué implica apuntarse.
- Buzón de ideas / canal de feedback, además de la lista de espera.
- Email de pre-lanzamiento para las Semillas fundadoras.
- Merchandising de plantas (camisetas con hojas y similares).
- Contenido de valor que dé sensación de comunidad.
- Rediseño de logotipo.
- Badge «fundador» para los primeros 100 usuarios, sin comunicar nunca el tamaño total del grupo.

## Features aparcadas

### El Market vía afiliados

Adelantar el catálogo profesional con programas de afiliación. Detalle, schema y niveles en `docs/product/afiliados.md`.

- Alta en Amazon Afiliados y solicitud en Awin (Leroy Merlin ES y ManoMano ES). La PA-API v5 exige 3 ventas en 180 días para activarse.
- Mock de catálogo afiliado: `src/lib/mock/market-products.ts` y cablear las rutas `/app/market/*`, hoy `RoutePlaceholder`.
- Migración `affiliate_providers`, `affiliate_products`, `affiliate_category_map` y `affiliate_clicks`, con RLS desde el primer día.
- Importador de feeds y curaduría agéntica: mapeo de categorías externas a la taxonomía de Botanic y revisión con IA.
- Proxy de clicks `/out` con analítica propia y automatización completa.

### Identificación y cuidados de plantas

Al publicar, el vendedor sube la primera foto, se identifica la especie y se autocompleta el formulario
(campos editables). Pl@ntNet solo identifica especie y no da cuidados, así que se combina con una API
de cuidados cacheando en la base de datos para bajar consumo.

```
Foto → [Pl@ntNet] → especie + score (+ nombre común, familia)
        ├─ especie en DB → cuidados curados (0 consumo)
        └─ especie nueva → [Perenual] → cuidados (riego, luz, ph, tierra)
                           └─ guardar en DB (especie → cuidados) → reutilizable
```

**Decisiones**: autocompletar siempre pero editable, con aviso «¿Es esta tu planta?»; las llamadas a
las APIs nunca desde el cliente.

**Cuotas free**: Pl@ntNet ~500 identificaciones/día; Perenual ~100 request/día. Perenual es el cuello
de botella, así que se consulta solo la primera vez por especie; si se agota, se encola la especie sin
bloquear al vendedor.

**Documentación oficial**: Pl@ntNet https://my.plantnet.org/doc/getting-started/introduction ·
Perenual https://perenual.com/docs/api

**Evolución a coste 0**: cuando haya fotos UGC con especie confirmada (el aviso genera etiquetas
positivas), entrenar un clasificador ligero (MobileNet/EfficientNet-lite → ONNX) para las top-N
especies, servido en cliente con onnxruntime-web o en edge gratis, sin que la imagen salga del
dispositivo. Pl@ntNet quedaría como fallback para la cola larga.

**Credenciales**: `PLANTNET_API_KEY` y `PERENUAL_API_KEY` en `.env.local`.

### Feed adaptativo

Módulos horizontales del feed descritos en `docs/ux/FEED_UX.md`. El schema ya está escrito en `docs/db/schema-app.md`: migración `add_feed_personalization_schema` con `user_events`, `user_category_interests`, `feed_banners`, `feed_banner_views` y `user_banner_dismissals`, con RLS desde el primer día.

- Tracking en base de datos desde el día 1.
- Banners en `src/lib/feed/banners.ts`, migrables a base de datos sin perder históricos.

### Multiidioma

Web en catalán, gallego y euskera, prevista para la fase 2. Pendiente de decidir: routing del idioma, framework de i18n, SEO con `hreflang` y traducción profesional frente a traducción con IA.

## Ideas de ingeniería

- Convertir en monorepo: separar responsabilidades por carpeta antes de escalar a subagentes.

## Cerrado, sin acción pendiente

- Emails en spam — auditoría y correcciones aplicadas (`docs/email/deliverability.md`).
- Cron keep-alive de Supabase Free — implementado.
- `waitlist_count` verificada contra la realidad.
- Documentos para impresión — póster A3 implementado y retirado en agosto de 2026 (fuente en git).
- Imágenes reales de plantas — 72 webp en `static/images/seed/`, servidas en local.
- Design system — cerrado en `DESIGN.md` como fuente de verdad.
