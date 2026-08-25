# Cross-cutting — comportamientos funcionales

## Responsive

**Principio**: la webapp se adapta impecablemente a escritorio y móvil (estilo Wallapop).

- **UX > UI.** Priorizar flujos claros, navegación predecible, jerarquía visual correcta y densidad de información adecuada al dispositivo.
- **Mobile-first en layout, mobile o desktop en flujos.** Componentes con `Responsive`/`Breakpoint` (Tailwind): `sm`, `md`, `lg`, `xl`.
- **Navegación principal** puede cambiar de forma entre móvil (bottom bar / drawer) y escritorio (sidebar / top nav), pero los 4 destinos deben seguir siendo accesibles en ambos.
- **Densidad de información**: en escritorio se admite mayor densidad por pantalla; en móvil se prioriza scroll vertical y acciones accesibles con el pulgar.
- **Formularios**: campos stacked en móvil, layout en columnas en escritorio cuando aporte claridad.

## Scroll horizontal sin barra visible

**Regla**: nunca mostrar la barra de scroll horizontal nativa del navegador.

- **Escritorio**: añadir botones de utilidad (flecha izquierda / flecha derecha) en los extremos del contenedor. Al pulsar, hacer scroll suave hasta el siguiente "snap point" o un ancho fijo.
- **Móvil**: usar el gesto natural del dedo (swipe) **sin helpers visibles** (sin flechas, sin dots).
- **Comportamiento esperado** en cualquier lista horizontal: chips de categorías, carruseles de anuncios, listados secundarios, tabs con scroll.

## GPS / Location

- Ordenar anuncios por cercanía.
- Buscar anuncios en mapa.
- Gestionar la ubicación del usuario.

Debe existir una experiencia de permiso/rechazo y una vista de configuración de ubicación.

## Búsqueda

Dos familias:

- Búsqueda de anuncios P2P.
- Búsqueda de comunidad (no MVP obligatorio).

La búsqueda P2P puede representarse mediante campo de búsqueda, filtros y cambio a modo mapa.

## Imágenes

Los anuncios P2P deben contemplar carga de imágenes. El wireframe solo representa el componente.

## Permisos

Cualquier funcionalidad que dependa de GPS debe contemplar estado concedido, rechazado y no configurado, aunque inicialmente se represente visualmente.

## Estados globales

Las vistas deberían prever al menos estos estados:

- loading.
- empty.
- error.
- contenido.
- **no autenticado** cuando la acción requiera sesión.
- **permisos no concedidos** cuando aplique.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
