# Módulo — Autenticación

## Vistas

- `/app/login` — iniciar sesión.
- `/app/registro` — registro.
- `/app/recuperar-contrasena` — recuperación de contraseña.
- `/app/verificar-cuenta` — verificación de cuenta (MVP).
- `/app/bienvenida` — onboarding inicial (MVP).

Inventario completo en [ROUTES.md](ROUTES.md).

## Flujos

- Registro → verificación → bienvenida → marketplace.
- Login → marketplace.
- Recuperación → email → cambio de contraseña.

## Comportamiento en el wireframe

Representar formularios y botones con navegación entre estados. No implementar autenticación real dentro del wireframe.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Formularios centrados y con tamaño cómodo en escritorio; full-width en móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
