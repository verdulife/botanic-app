# Botanic — UX de Navegación Móvil

> **REGLA PARA EL AGENTE — CONTEXTO CONDICIONAL**
>
> Lee este archivo únicamente para tareas relacionadas explícitamente con navegación móvil, acciones del encabezado, navegación inferior, menú personal o UX de navegación.

## 1. Estructura actual preferida

### Encabezado

Usuario anónimo:

```text
[Botanic] [Búsqueda........................] [Entrar]
```

Usuario autenticado:

```text
[Botanic] [Búsqueda........................] [🔔]
```

El logo de Botanic devuelve a Inicio.

La búsqueda está asociada principalmente a la exploración del marketplace P2P.

El 🔔 muestra badge de notificaciones no leídas. **No** hay avatar ni entrada a Mi Botanic en el header: Mi Botanic vive en el bottom nav y Notificaciones también es accesible desde ahí.

---

## 2. Controles secundarios del P2P

Debajo del encabezado:

```text
[ Filtrar ] [ Vista ▾ ]
```

`Vista` abre:

```text
Lista
Mapa
Match
```

Esto sustituye al concepto anterior de mostrar un botón permanente separado para cada vista.

Los anuncios guardados pueden consultarse desde `Mi Botanic`.

---

## 3. Navegación inferior

```text
Inicio | Comunidad | Market | Mi Botanic
```

El objetivo es centrar la navegación permanente en las áreas principales + el área personal.

### Motivo de cada item

```text
Inicio     → descubrimiento principal / P2P
Comunidad  → capa social y de conocimiento
Market     → marketplace profesional/comercial futuro de Botanic
Mi Botanic → área personal (perfil, notifs, mis anuncios, guardados, chat, deseos, ajustes, anunciar)
```

### Excluido del bottom nav

- `Deseos / alertas` — vive dentro de Mi Botanic.
- `Anunciar` — acción, no destino de navegación. Vive dentro de Mi Botanic y aparece de forma contextual.

---

## 4. Navegación personal

`Mi Botanic` actúa como contenedor de las acciones personales.

Estructura sugerida:

```text
Mi Botanic
├── Perfil
├── Notificaciones
├── Mis anuncios
├── Guardados
├── Conversaciones
├── Deseos / Alertas
├── Ajustes
├── Anunciar
└── Cerrar sesión
```

`Anunciar` está aquí como acción importante:

```text
Mi Botanic
└── Anunciar
```

También puede aparecer de forma contextual en otros lugares (feed, mis-anuncios).

---

## 5. Comportamiento según autenticación

### Usuario anónimo

```text
Encabezado → Entrar

Navegación inferior:
Inicio | Comunidad | Market | Mi Botanic
```

Las acciones personales dentro de Mi Botanic que requieren cuenta deben activar el flujo correspondiente de registro/login.

### Usuario autenticado

```text
Encabezado → 🔔 (badge de notificaciones)
Navegación inferior:
Inicio | Comunidad | Market | Mi Botanic
```

---

## 6. Auto-hide de la navegación inferior en scroll

La barra de navegación inferior se oculta cuando el usuario hace scroll hacia abajo y reaparece cuando hace scroll hacia arriba. Patrón estándar en apps móviles de descubrimiento (Instagram, X, Reddit).

### Reglas

- **Threshold inicial**: ~80-100px desde arriba. Antes de eso, la barra siempre visible (no flicker al cargar).
- **Detección de dirección**: delta Y > umbral (e.g., 8px) → hide; delta Y < -umbral → show.
- **Animación**: `transform: translateY(100%)` con `transition: 200ms ease-out`. Sin animar `top/bottom` (más costoso).
- **`prefers-reduced-motion`**: snap directo, sin transición.
- **No se reactiva por tap**: solo por scroll up explícito.

### Por qué siempre activo (al inicio)

Se implementa sin flag porque el patrón está validado en otras apps y el coste de cambio es bajo. Si tras uso real resulta molesto, se apaga fácilmente (un boolean en el componente).

---

## 7. Principio de transición

Cuando una acción se ve interrumpida por autenticación:

```text
Contexto actual
   ↓
Autenticación
   ↓
Contexto original
   ↓
Acción que el usuario quería realizar
```

Ejemplo:

```text
Anuncio → Contactar → Login → Chat
```

No:

```text
Anuncio → Contactar → Login → Inicio
```

---

## 8. Antipatrones

Evitar:

- mostrar cada funcionalidad como una pestaña permanente,
- duplicar un mismo destino en varios lugares sin motivo,
- dar el mismo peso visual a las funcionalidades secundarias que a las principales,
- interrumpir la exploración con prompts de registro,
- inventar nuevos destinos de navegación no documentados.

---

## 9. Terminología de trabajo

Hasta realizar la revisión final de textos de UI:

- `Inicio` = descubrimiento del marketplace P2P.
- `Comunidad` = preguntas y conversaciones de la comunidad.
- `Market` = marketplace profesional/comercial de Botanic.
- `Mi Botanic` = área personal/cuenta.
- `Vista` = selector Lista / Mapa / Match.
- `Deseos / Alertas` = búsquedas guardadas y avisos de futuras coincidencias.
- `Match` = vista relajada full-screen vertical, "enamorate de esa planta".