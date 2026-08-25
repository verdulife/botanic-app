# Module — Cross-cutting Functional Behaviors

## GPS / Location

Se utiliza principalmente para:

- ordenar publicaciones por cercanía;
- buscar publicaciones en mapa;
- gestionar la ubicación del usuario.

Debe existir una experiencia de permiso/rechazo y una vista de configuración de ubicación.

## Search

El producto necesita dos familias de búsqueda:

- búsqueda de publicaciones P2P;
- búsqueda de comunidad (no MVP obligatorio).

La búsqueda P2P puede representarse mediante campo de búsqueda, filtros y cambio a modo mapa.

## Images

Las publicaciones P2P deben contemplar carga de imágenes. El wireframe solo representa el componente.

## Permissions

Cualquier funcionalidad que dependa de GPS debe contemplar estado concedido, rechazado y no configurado, aunque inicialmente se represente visualmente.

## Global states

Las vistas deberían prever al menos estos estados:

- loading;
- empty;
- error;
- contenido;
- no autenticado cuando corresponda;
- permisos no concedidos cuando corresponda.
