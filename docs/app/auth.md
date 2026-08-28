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

El wireframe usa **autenticación mock** (sin Supabase): sesión local por cookie
`botanic_mock_session`, registros persistidos en `.mock-auth/users.json`
(gitignored). El modo se conmuta con el flag `AUTH_MODE` en
[`src/lib/auth-mode.ts`](../../src/lib/auth-mode.ts) (`'mock'` | `'supabase'`).

### Modo mock

- **Login** (`/app/login`): botón "Entrar con cuenta demo" (entra como Ana Ruiz,
  del seed `USERS`), email+contraseña contra el store mock, y enlace mágico con
  auto-login simulado (si la cuenta existe entra directo; si no, muestra "revisa
  tu bandeja" sin efecto).
- **Registro** (`/app/registro`): crea la cuenta (auto-confirmada, sin email),
  inicia sesión y redirige a `/app/bienvenida` (onboarding funcional).
- **Recuperar contraseña** (`/app/recuperar-contrasena`): no implementada en el
  mock — el formulario simula el envío sin hacer nada.
- El resto de rutas y acciones protegidas (publicar, guardar, chat, crear deseo…)
  funcionan igual: redirigen a `/app/login?next=...` cuando no hay sesión.

### Al conectar Supabase

Cambiar `AUTH_MODE` a `'supabase'`. Los server files ramifican con
`isMockAuth()`, así que cada rama mock se puede borrar cuando se retire el
módulo `src/lib/mock/auth-server.ts`.

## Responsive

Aplica [cross-cutting.md § Responsive](cross-cutting.md#responsive). Formularios centrados y con tamaño cómodo en escritorio; full-width en móvil.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
