# Botanic — Navegación

## Navegación principal (4 destinos)

1. **Marketplace P2P** — anuncios, búsqueda, mapa.
2. **Deseos** — búsquedas activas, coincidencias, alertas.
3. **Comunidad** — publicaciones e hilos.
4. **Botanic Market** — futuro; en el wireframe se muestra con placeholder "Próximamente".

La forma visual concreta (tabs, drawer lateral, bottom bar, header…) queda abierta al desarrollo. La documentación solo fija que los 4 destinos deben ser accesibles desde la navegación principal.

## Acceso sin login

El marketplace P2P debe poder recorrerse sin autenticación: feed, búsqueda, mapa, detalle de anuncio, comunidad y hilos son públicos.

Las acciones siguientes **requieren autenticación** y deben mostrar el estado "no autenticado" cuando aplique (ver [cross-cutting.md](cross-cutting.md#estados-globales)):

- Publicar anuncio, editar, eliminar.
- Guardar anuncio.
- Iniciar chat.
- Crear deseo y activar alerta.
- Responder en comunidad.
- Acceder a perfil propio y ajustes.
- Ver notificaciones.

## Acciones globales

Además de la navegación principal, deben existir accesos contextuales a:

- Notificaciones.
- Perfil / cuenta.
- Ajustes.
- Crear publicación (CTA destacado en P2P y comunidad).
- Búsqueda.
- Chat cuando existan conversaciones.

## Reglas

- El estado de navegación debe mantenerse al cambiar entre vistas.
- Las rutas profundas deben poder abrirse directamente.
- Un anuncio P2P puede originar un flujo hacia chat (Contactar).
- Una coincidencia de deseo puede originar un flujo hacia el detalle de un anuncio.
- Una notificación puede llevar directamente al recurso relacionado.
- Un hilo de comunidad debe poder abrirse directamente y volver al listado.

## Responsive

La webapp se adapta a escritorio y móvil (estilo Wallapop). Detalle en [cross-cutting.md](cross-cutting.md#responsive).

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
