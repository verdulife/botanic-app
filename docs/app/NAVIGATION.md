# Botanic — Navegación

## Navegación principal

La navegación permanente se compone de:

1. **Marketplace P2P** (raíz `/app`) — anuncios, búsqueda, filtros, modos de vista (Lista / Mapa / Match).
2. **Comunidad** (`/app/comunidad`) — publicaciones e hilos.
3. **Botanic Market** (`/app/market`) — futuro; en el wireframe se muestra con placeholder "Próximamente".
4. **Mi Botanic** (`/app/mi-botanic`) — área personal: perfil, notificaciones, mis anuncios, guardados, conversaciones, deseos/alertas, ajustes, anunciar.

La forma visual concreta (bottom nav móvil, header, drawer lateral…) está definida en detalle en [docs/ux/NAVIGATION_UX.md](../ux/NAVIGATION_UX.md).

Deseos y Anunciar **no** ocupan posición en la navegación inferior — viven dentro de Mi Botanic como acción/funcionalidad secundaria.

## Acceso sin login

El marketplace P2P debe poder recorrerse sin autenticación: feed, búsqueda, filtros, mapa, detalle de anuncio, comunidad y hilos son públicos.

Las acciones siguientes **requieren autenticación** y deben redirigir a `/app/login?next=...` cuando no hay sesión (ver [docs/ux/UX_GUIDELINES.md](../ux/UX_GUIDELINES.md#10-ux-de-registro)):

- Publicar anuncio, editar, eliminar.
- Guardar anuncio.
- Iniciar chat.
- Crear deseo y activar alerta.
- Responder en comunidad.
- Acceder a perfil propio y ajustes.
- Ver notificaciones.

## Acciones globales

Además de la navegación principal, deben existir accesos contextuales a:

- Notificaciones (🔔 en el header, badge con no leídas).
- Búsqueda (campo en el header, persistente).
- Anunciar (desde Mi Botanic + tarjetas contextuales del feed).
- Chat cuando existan conversaciones (dentro de Mi Botanic).

## Modos de vista del P2P

El marketplace P2P ofrece tres modos de vista del mismo dataset filtrado:

- **Lista** (default) — grid de cards.
- **Mapa** — descubrimiento geográfico.
- **Match** — vista relajada full-screen vertical, "enamorate de esa planta".

Selector único en `[Vista ▾]` debajo del header. Cambiar de vista **conserva** búsqueda y filtros (ver [docs/ux/UX_GUIDELINES.md](../ux/UX_GUIDELINES.md#7-modos-de-vista-del-p2p)).

## Reglas

- El estado de navegación debe mantenerse al cambiar entre vistas.
- Las rutas profundas deben poder abrirse directamente.
- Un anuncio P2P puede originar un flujo hacia chat (Contactar).
- Una coincidencia de deseo puede originar un flujo hacia el detalle de un anuncio.
- Una notificación puede llevar directamente al recurso relacionado.
- Un hilo de comunidad debe poder abrirse directamente y volver al listado.
- Cuando el registro interrumpe una acción, devolver al usuario a esa acción tras login (`next` param).

## Responsive

La webapp se adapta a escritorio y móvil (estilo Wallapop). Detalle en [cross-cutting.md](cross-cutting.md#responsive). La navegación inferior con auto-hide en scroll está definida en [docs/ux/NAVIGATION_UX.md](../ux/NAVIGATION_UX.md#6-auto-hide-de-la-navegación-inferior-en-scroll).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).