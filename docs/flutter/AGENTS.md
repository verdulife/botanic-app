# Flutter — Contexto del módulo (app nativa, Fase 2)

**Sin código todavía.** Fase 2 de [PLAN.md](../../PLAN.md) (Q1 2027, tras validación con 1.000 usuarios activos en la PWA). Este archivo es el único contexto necesario hasta que arranque — no hay más docs específicos que cargar.

## Decisiones ya tomadas

- **Framework**: Flutter (Dart).
- **Backend**: el mismo proyecto Supabase que la web (ver [../db/AGENTS.md](../db/AGENTS.md)) — sin duplicar schema ni lógica de negocio.
- **Diseño**: debe portar los tokens de [DESIGN.md](../../DESIGN.md) (paleta Still/Lino, tipografías Fraunces/Inter/JetBrains Mono) — autoridad global también para nativo.
- **Producto**: mismo alcance funcional que la web app (ver [PRODUCT.md](../../PRODUCT.md)), añadiendo capacidades nativas: notificaciones push, cámara.

## Pendiente de decidir (al arrancar la fase)

- Estructura del proyecto Flutter (monorepo vs repo separado).
- Gestión de estado (Riverpod/Bloc/otro).
- Estrategia de compartir tipos/contratos de API con el frontend SvelteKit.

Cuando arranque esta fase, crear aquí los `.md` específicos que se necesiten (arquitectura Flutter, convenciones de widgets, etc.) siguiendo el mismo patrón de tabla que el resto de módulos.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
