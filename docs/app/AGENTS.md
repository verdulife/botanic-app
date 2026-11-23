# App — contrato del módulo

Webapp de Botanic bajo `/app`: marketplace P2P de plantas entre particulares —vender, cambiar, regalar— con deseos, comunidad, chat, perfil y ajustes. Producto y voz → [PRODUCT.md](../../PRODUCT.md); autoridad visual → [DESIGN.md](../../DESIGN.md); stack, límites y verificación → [ARCHITECTURE.md](../../ARCHITECTURE.md).

| Doc | Contenido |
|---|---|
| Este archivo | Acceso, convenciones y comportamiento transversal |
| [FUNCIONAL.md](FUNCIONAL.md) | Reglas funcionales por área: auth, marketplace, deseos, comunidad, chat, notificaciones, perfil y ajustes |
| [UX](../ux/ux.md) | Jerarquía, gestos, registro y feed |

## Acceso

- **Navegar es público; escribir exige sesión.** Raíz `/app`, listados, búsqueda, mapa, detalle de anuncio, comunidad e hilos se leen sin cuenta. Publicar o editar anuncios, guardar, contactar, crear deseo, responder, ver perfil propio, ajustes y notificaciones requieren sesión.
- Sin sesión, toda acción protegida redirige a `/app/login?next=...` y, después de autenticarse, se devuelve al usuario a la acción que interrumpió.
- Cualquier respuesta de `/app*` lleva `X-Robots-Tag: noindex, nofollow`.
- Hay dos modos de autenticación conmutables con `AUTH_MODE` en `src/lib/auth-mode.ts`; con el modo real la sesión se valida siempre contra el servidor, nunca solo con cookies. Reglas de seguridad en [AGENTS.md § Seguridad](../../AGENTS.md#seguridad).

## Convenciones

- Slugs en español, sin tildes, sin eñes y sin artículos. Únicas excepciones en inglés: `login`, `chat` y `market`.
- Búsqueda y filtros viven en la URL: las rutas profundas se abren directamente y cambiar de vista no pierde el estado.

## Comportamiento transversal

- **Adaptación por dispositivo.** Escritorio y móvil impecables, estilo Wallapop: en móvil manda el scroll vertical y las acciones quedan al alcance del pulgar; en escritorio se admite más densidad por pantalla.
- **Scroll horizontal sin barra nativa.** Chips de categorías, carruseles, tabs y listados secundarios ocultan la barra del navegador, llevan flechas en los extremos en escritorio que avanzan al siguiente punto de anclaje y, en móvil, solo el gesto del dedo, sin flechas ni dots.
- **Estados globales.** Toda vista prevé carga, vacío, error, contenido, no autenticado cuando la acción exige sesión y permiso no concedido cuando depende del GPS.
- **Ubicación.** Lo que use GPS contempla concedido, rechazado y no configurado; la ubicación guardada en el perfil es la fuente principal y el GPS solo un atajo.
- **Movimiento.** Se respeta `prefers-reduced-motion`: sin animaciones en bucle ni transiciones cuando el usuario lo pide.
