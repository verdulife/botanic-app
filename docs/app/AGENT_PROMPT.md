# Prompt — Wireframe neutro de Botanic

Actúa como agente de implementación del **wireframe navegable de Botanic**.

## Orden de lectura obligatorio

1. Este archivo
2. [README.md](README.md)
3. [VISION.md](VISION.md)
4. [ROUTES.md](ROUTES.md)
5. [NAVIGATION.md](NAVIGATION.md)
6. [cross-cutting.md](cross-cutting.md) (reglas de responsive y scroll)
7. Solo después, los módulos `.md` correspondientes a las vistas que vayas a implementar

## Objetivo

Construir todas las rutas funcionales descritas en [ROUTES.md](ROUTES.md) para que el producto pueda recorrerse como un wireframe navegable dentro de la web app existente (`src/routes/app/**`).

## Fase actual: wireframe neutro

- **No aplicar design system todavía.** Este hito es exclusivamente estructural: layout, jerarquía, navegación, formularios en su estado neutro.
- **Usar componentes base de shadcn-svelte** (Button, Input, Card, Sheet, Dialog, Badge, Tabs, etc.) sin custom CSS ni sobreescrituras de tema. El objetivo es que la fase posterior (aplicar [DESIGN.md](../../DESIGN.md)) modifique solo tokens/variants, no la estructura.
- **No invertir tiempo en detalles estéticos.** El wireframe puede usar bordes grises por defecto, tipografía del sistema y placeholders explícitos del tipo "Aquí irá el mapa" para capacidades no implementadas.

## Restricciones

- No crear un proyecto separado ni una SPA paralela.
- Utilizar el enrutado real ya existente del proyecto (`/app/**`).
- No implementar lógica de negocio, persistencia, backend ni integraciones reales.
- No implementar GPS real, mapas reales, chat real, notificaciones reales ni búsqueda real. Representarlos mediante placeholders funcionales.
- Los controles deben ser interactivos a nivel de navegación: botones, enlaces y acciones de avance deben llevar a la ruta correspondiente.
- Los formularios deben mostrar sus campos y estados principales, aunque no procesen datos reales.

## Reglas de UX (cross-cutting)

Estas reglas se aplican **tanto al wireframe como al diseño final**. Detalle en [cross-cutting.md](cross-cutting.md).

1. **Responsive escritorio + móvil (estilo Wallapop).** La webapp debe adaptarse impecablemente a ambos. Priorizar **UX sobre UI**: flujos claros, navegación predecible, jerarquía visual correcta.
2. **Scroll horizontal sin barra visible.** Nunca mostrar la barra de scroll horizontal nativa. En **escritorio**, añadir botones de utilidad (flecha izquierda / flecha derecha). En **móvil**, usar el gesto natural del dedo sin helpers visibles.

## MVP flag

Cada ruta de [ROUTES.md](ROUTES.md) tiene `MVP: true` o `MVP: false`.

- `MVP: true`: debe quedar representada y navegable como parte del primer producto funcional.
- `MVP: false`: también debe existir como pantalla/ruta del wireframe completo, pero su funcionalidad real puede permanecer como placeholder.

El flag **no elimina la pantalla**. Solo determina si pertenece al alcance funcional inicial.

## Resultado esperado

Al finalizar debe poderse navegar por:

- autenticación (login, registro, recuperar contraseña, verificar cuenta, bienvenida);
- marketplace P2P (raíz `/app`, anuncios, detalle, crear, editar, mis anuncios, guardados, mapa, búsqueda);
- deseos (lista, crear, detalle, coincidencias, alerta);
- comunidad (lista, hilo, responder, mis publicaciones);
- chat;
- notificaciones;
- perfil y ajustes;
- Botanic Market como sección futura.

No añadir funcionalidades nuevas que no estén descritas en la documentación sin registrarlas primero como propuesta funcional.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
