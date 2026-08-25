# Prompt — Botanic Functional Wireframe

Actúa como agente de implementación del **wireframe navegable de Botanic**.

Lee primero:

1. `README.md`
2. `VISION.md`
3. `ROUTES.md`
4. `NAVIGATION.md`
5. Solo después, los módulos `.md` necesarios para las vistas que vayas a implementar.

## Objetivo

Construir todas las rutas funcionales descritas en `ROUTES.md` para que el producto pueda recorrerse como un prototipo navegable dentro de la aplicación web existente.

## Restricciones

- No crear un proyecto separado ni una SPA paralela.
- Utilizar el enrutado real ya existente del proyecto.
- No implementar todavía lógica de negocio, persistencia, backend ni integraciones reales salvo que ya formen parte del proyecto existente.
- No implementar todavía GPS real, mapas reales, chat real, notificaciones reales ni búsqueda real. Representarlos mediante placeholders funcionales.
- Los controles deben ser interactivos a nivel de navegación: botones, enlaces y acciones de avance deben llevar a la ruta correspondiente.
- Los formularios deben mostrar sus campos y estados principales, aunque no procesen datos reales.
- Los componentes que representen una capacidad todavía no implementada deben mostrar un placeholder explícito, por ejemplo: `Aquí irá el mapa`, `Aquí irá el sistema de chat`, etc.
- Mantener la interfaz deliberadamente neutra y wireframe: fondo blanco, contornos negros, jerarquía tipográfica simple y ausencia de diseño visual definitivo.
- No invertir tiempo en detalles estéticos que no aporten a la validación del flujo.

## MVP flag

Cada ruta de `ROUTES.md` tiene `MVP: true` o `MVP: false`.

- `MVP: true`: debe quedar representada y navegable como parte del primer producto funcional.
- `MVP: false`: también debe existir como pantalla/ruta del wireframe completo, pero su funcionalidad real puede permanecer como placeholder.

El flag **no elimina la pantalla**. Solo determina si pertenece al alcance funcional inicial.

## Resultado esperado

Al finalizar debe poderse navegar por:

- autenticación;
- marketplace P2P;
- búsqueda por lista y por mapa;
- publicación y detalle de artículos;
- deseos y alertas;
- comunidad y sus hilos;
- chat;
- notificaciones;
- perfil y ajustes;
- Botanic Market como sección futura.

No añadir funcionalidades nuevas que no estén descritas en la documentación sin registrarlas primero como propuesta funcional.
