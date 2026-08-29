# Botanic — Inventario de rutas

Todas las rutas tienen el prefijo `/app/`. Slugs en español (sin tildes, sin eñes, sin artículos), excepto `login`, `chat` y `market` (universales). Detalle en [README.md § Convenciones de slugs](README.md#convenciones-de-slugs).

| ID | Slug | Vista | MVP |
|---|---|---|---|
| AUTH-01 | `/app/login` | Iniciar sesión | true |
| AUTH-02 | `/app/registro` | Registro | true |
| AUTH-03 | `/app/recuperar-contrasena` | Recuperar contraseña | true |
| AUTH-04 | `/app/verificar-cuenta` | Verificación de cuenta | true |
| AUTH-05 | `/app/bienvenida` | Onboarding inicial | true |
| P2P-00 | `/app` | Marketplace P2P (raíz, browse abierto sin login) | true |
| P2P-01 | `/app/anuncios` | Listado de anuncios | true |
| P2P-02 | `/app/buscar` | Resultados de búsqueda | true |
| P2P-03 | `/app/mapa` | Búsqueda por mapa | true |
| P2P-04 | `/app/anuncio/:id` | Detalle de anuncio | true |
| P2P-05 | `/app/publicar` | Crear anuncio | true |
| P2P-06 | `/app/anuncio/:id/editar` | Editar anuncio | true |
| P2P-07 | `/app/mis-anuncios` | Mis anuncios | true |
| P2P-08 | `/app/favoritos` | Favoritos | true |
| P2P-09 | `/app/compras` | Mis compras | false |
| P2P-10 | `/app/ventas` | Mis ventas | false |
| WISH-01 | `/app/deseos` | Lista de deseos | true |
| WISH-02 | `/app/deseos/nuevo` | Crear deseo | true |
| WISH-03 | `/app/deseo/:id` | Detalle de deseo | true |
| WISH-04 | `/app/deseo/:id/coincidencias` | Coincidencias | true |
| WISH-05 | `/app/deseo/:id/alerta` | Configuración de alerta | true |
| COMM-01 | `/app/comunidad` | Comunidad | true |
| COMM-02 | `/app/comunidad/buscar` | Buscar en comunidad | false |
| COMM-03 | `/app/comunidad/publicar` | Crear publicación / pregunta | true |
| COMM-04 | `/app/hilo/:id` | Hilo | true |
| COMM-05 | `/app/hilo/:id/responder` | Responder | true |
| COMM-06 | `/app/mis-publicaciones` | Mis publicaciones de comunidad | false |
| CHAT-01 | `/app/chat` | Lista de conversaciones | true |
| CHAT-02 | `/app/chat/:id` | Conversación | true |
| CHAT-03 | `/app/chat/nuevo/:usuarioId` | Nueva conversación | true |
| CHAT-04 | `/app/chat/:id/compartir/:anuncioId` | Compartir anuncio en chat | true |
| NOTIF-01 | `/app/notificaciones` | Centro de notificaciones | true |
| PROF-01 | `/app/perfil` | Mi perfil | true |
| PROF-02 | `/app/perfil/editar` | Editar perfil | true |
| PROF-03 | `/app/perfil/:usuarioId` | Perfil público | true |
| SET-01 | `/app/ajustes` | Ajustes | true |
| SET-02 | `/app/ajustes/cuenta` | Cuenta | false |
| SET-03 | `/app/ajustes/privacidad` | Privacidad | false |
| SET-04 | `/app/ajustes/ubicacion` | Ubicación | true |
| SET-05 | `/app/ajustes/ayuda` | Ayuda | false |
| MARKET-01 | `/app/market` | Botanic Market (futuro) | false |
| MARKET-02 | `/app/market/producto/:id` | Producto profesional | false |
| MARKET-03 | `/app/market/buscar` | Buscar productos profesionales | false |

## Notas

- **`/app` es la raíz del P2P** y debe ser browse abierto (sin login). El listado principal de anuncios puede vivir en `/app` directamente; `/app/anuncios` queda como ruta equivalente para acceso explícito.
- Las acciones de escritura (publicar, chatear, guardar, crear deseo, responder) requieren autenticación. El wireframe debe representar el estado "no autenticado" cuando aplique (ver [cross-cutting.md](cross-cutting.md#estados-globales)).
- `P2P-09` y `P2P-10` (compras/ventas) son `MVP:false` porque Botanic no incluye pagos integrados en el MVP (ver [PRODUCT.md](../../PRODUCT.md)). Pueden existir como pantallas placeholder.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
