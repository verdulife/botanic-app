# Botanic — Guías UX

> **REGLA PARA EL AGENTE — CONTEXTO CONDICIONAL**
>
> Lee este archivo **únicamente** cuando la tarea trate explícitamente sobre UX/UI de Botanic, navegación, jerarquía de información, diseño de interacción, composición del feed o experiencia de registro.
>
> No utilices este archivo como contexto general de implementación.

## 1. Principio UX principal

Botanic debe mostrar las **intenciones principales del usuario**, no todas las funcionalidades disponibles.

La interfaz móvil debe priorizar:

1. Descubrir plantas, semillas, tiestos y otros anuncios P2P.
2. Explorar la comunidad.
3. Acceder al Market de Botanic.

Las acciones secundarias y de gestión personal deben ser accesibles sin ocupar espacios permanentes de navegación principal.

### Jerarquía de información

```text
PRINCIPAL
├── Explorar / Inicio (P2P)
├── Comunidad
└── Market

SECUNDARIO / PERSONAL
├── Perfil
├── Notificaciones
├── Mis anuncios
├── Guardados
├── Conversaciones
├── Deseos / alertas
└── Ajustes

CONTEXTUAL
├── Crear anuncio
├── Crear deseo / alerta
└── Prompts de registro
```

---

## 2. Simplificación de la navegación móvil

El concepto inicial incluía cinco elementos en la navegación inferior:

```text
Inicio | Deseos | Anunciar | Comunidad | Market
```

La dirección preferida es reducir la navegación permanente a las secciones realmente principales, pero sin perder el acceso de un toque al área personal.

### Navegación inferior preferida

```text
Inicio | Comunidad | Market | Mi Botanic
```

`Deseos` y `Anunciar` **no** ocupan posición permanente en el bottom nav. Son accesibles desde:

- `Deseos / alertas` → dentro de `Mi Botanic` (cuando se implementen deseos, en Hito 4-5).
- `Anunciar` → dentro de `Mi Botanic` y desde momentos contextuales (tarjeta del feed, mis-anuncios).

Principio:

> **No des un espacio permanente de navegación a una funcionalidad simplemente porque exista.**
> Pero el área personal tampoco debe esconderse a dos taps si el usuario la usa a diario.

---

## 3. "Mi Botanic" / área personal

Las acciones personales y relacionadas con la cuenta deben agruparse en un único espacio contextual en lugar de repartirse por la interfaz.

`Mi Botanic` vive como **cuarto item del bottom nav**, no en el header.

Este espacio puede contener:

```text
Mi Botanic
├── Perfil
├── Notificaciones
├── Mis anuncios
├── Guardados
├── Conversaciones
├── Deseos / alertas
├── Ajustes
├── Anunciar
└── Cerrar sesión
```

### Comportamiento del encabezado

Usuario anónimo:

```text
Logo | Búsqueda | Entrar
```

Usuario autenticado:

```text
Logo | Búsqueda | 🔔
```

El 🔔 muestra un badge con notificaciones no leídas. **No** aparece avatar ni entrada a Mi Botanic en el header, porque Mi Botanic vive en el bottom nav y Notificaciones también es accesible desde ahí.

> Decisión deliberada: el bell+badge es el único elemento del header reservado a feedback en tiempo real (mensajes nuevos, matches de deseo, alertas). El resto del área personal vive en Mi Botanic.

---

## 4. Publicar / "Anunciar"

"Anunciar" no debería ocupar necesariamente una pestaña permanente en la navegación inferior.

Publicar es una **acción importante**, pero no es un destino principal de navegación.

Debe seguir siendo fácilmente accesible desde el área personal y desde momentos contextuales relevantes.

Ejemplos:

```text
Mi Botanic → Anunciar
```

```text
Tarjeta contextual del feed → Publicar una planta
```

```text
Perfil / Mis anuncios → Nuevo anuncio
```

Para usuarios anónimos, la acción debe comunicar directamente que requiere una cuenta.

Patrón preferido:

```text
Anunciar
   ↓
Regístrate para publicar
```

en lugar de abrir un modal genérico de registro después de que el usuario haya iniciado la acción.

---

## 5. Deseos / alertas inteligentes

Los Deseos se consideran **importantes pero secundarios**.

No deberían ocupar necesariamente un espacio permanente en la navegación principal porque funcionan sobre todo como una funcionalidad de automatización en segundo plano.

Concepto principal:

```text
Búsqueda
   ↓
No hay un resultado adecuado
   ↓
"¿Quieres recibir un aviso cuando aparezca?"
   ↓
Crear Deseo / alerta
```

El punto de entrada más potente es, por tanto, **contextual**, especialmente después de una búsqueda sin éxito.

### Acceso adicional

Los usuarios deben poder gestionar sus deseos existentes desde `Mi Botanic`.

```text
Mi Botanic
   └── Deseos / Alertas
```

Así la funcionalidad sigue siendo accesible sin darle el mismo peso visual que Inicio, Comunidad o Market.

---

## 6. Anuncios guardados

Los anuncios guardados son útiles, pero no necesitan permanecer visibles junto a todos los controles del marketplace.

Ubicación preferida:

```text
Mi Botanic
   └── Guardados
```

La acción de guardar sí debe permanecer próxima a cada anuncio/tarjeta.

---

## 7. Modos de vista del P2P

El marketplace P2P debe ofrecer tres formas complementarias de explorar el mismo conjunto de resultados:

```text
LISTA   → navegación clásica de marketplace
MAPA    → descubrimiento geográfico
MATCH   → descubrimento relajado, "enamorate de esa planta"
```

> **Por qué "Match"**: el nombre carga la idea de enamorarse de una planta concreta, no de compatibilizar con una persona. La interacción híbrida (full-screen vertical con botones Compartir/Guardar/Ver ahora, sin swipe L/R) hace honor a esa lectura.

Deben agruparse bajo un único control **Vista**, en lugar de presentar tres botones permanentes separados.

### Jerarquía sugerida

```text
[ Filtrar ] [ Vista ▾ ]

Vista
├── Lista
├── Mapa
└── Match
```

### Estado de búsqueda compartido

Cambiar de vista debe conservar la búsqueda y los filtros actuales. **Las tres vistas (Lista, Mapa, Match) muestran el mismo dataset** dado el mismo estado de filtros.

Ejemplo:

```text
Búsqueda: Monstera
Distancia: 20 km
Tipo: En venta
         ↓
Lista ↔ Mapa ↔ Match
```

El usuario no debería tener que configurar de nuevo la misma búsqueda al cambiar de modo.

---

## 8. Objetivo de cada vista

### Lista

Ideal para:

- comparar varios anuncios,
- revisar información rápidamente,
- comportamiento tradicional de marketplace.

### Mapa

Ideal para:

- descubrir anuncios cercanos,
- usuarios que priorizan la distancia,
- exploración espacial.

El mapa debe respetar las reglas de privacidad de ubicación que se definan en otra documentación.

**Ante saturación**: el mapa muestra markers de **vendedor** (avatar, nombre, nº de plantas según filtros y rating ★). Si hay más vendedores visibles de los que caben, se priorizan los **mejor valorados** con un máximo por nivel de zoom; el resto se agrupa en chips que se abren al acercar (refresco en zoom/pan, estilo Airbnb). Las chips nunca quedan apiladas entre sí ni sobre los markers: se separan por colisión en espacio de píxel al renderizar.

### Match

Ideal para:

- descubrimiento,
- navegación casual,
- decisiones rápidas,
- encontrar plantas inesperadas.

El modelo puede aprovechar la familiaridad de las interfaces de tarjetas deslizables, pero Botanic debe mantener su propio lenguaje y no convertirse en una copia directa de Tinder.

Concepto:

```text
Tarjeta del anuncio
   ├── Compartir
   ├── Guardar (corazón = favoritos)
   └── Ver ahora (detalle)
```

Interacción de la tarjeta:

- Cada anuncio lleva sus propios botones en la columna derecha, **en flujo** junto al texto (sin solapes): **Compartir** (Web Share), **Guardar** (corazón, misma funcionalidad que favoritos) y **Ver ahora** (abre el detalle).
- **Doble tap en la imagen** equivale a Guardar.
- La imagen de fondo **cambia cada 3 s con un fade suave** entre las fotos del anuncio, en bucle infinito (solo en la tarjeta activa).
- Bajo el precio se muestra la **información del vendedor**: ★ rating (1 decimal) y nombre.
- El contenido inferior de la tarjeta **respeta la nav inferior móvil** (padding inferior amplio en móvil, reducido en escritorio donde la nav no existe).

---

## 9. Búsqueda + filtros + jerarquía de vistas

Los controles de exploración P2P deben mantener una jerarquía clara:

```text
Búsqueda
   ↓
Filtros
   ↓
Vista
   ↓
Resultados
```

Los filtros modifican **qué** aparece.

La vista modifica **cómo** se exploran esos resultados.

Esta diferencia debe mantenerse clara tanto en el texto como en la interacción.

---

## 10. UX de registro

Botanic debe fomentar la creación de cuentas sin bloquear prematuramente la exploración.

### Los usuarios anónimos deberían poder:

- navegar por anuncios P2P,
- buscar,
- filtrar,
- explorar el mapa,
- navegar por el contenido de la comunidad cuando corresponda.

### La cuenta debe ser necesaria para acciones como:

- publicar,
- chatear/contactar con otro usuario,
- guardar favoritos de forma persistente,
- crear deseos/alertas,
- otras acciones claramente personales.

### Principio

> **Solicita el registro en el momento en que existe una intención demostrada.**

Ejemplos:

```text
Usuario pulsa Anunciar
      ↓
"Regístrate para publicar"
```

```text
Usuario pulsa Contactar con vendedor
      ↓
"Regístrate para chatear con el vendedor"
```

```text
No hay resultados
      ↓
"Crea una alerta y te avisaremos"
      ↓
Registro
```

El usuario debe entender **por qué** se necesita una cuenta.

---

## 11. El registro también puede aparecer de forma pasiva

Los prompts de registro pueden aparecer durante la navegación, pero no deberían interrumpir al usuario de forma arbitraria.

Patrones preferidos:

- tarjetas integradas en el feed,
- sugerencias contextuales después de acciones relevantes,
- módulos promocionales no bloqueantes,
- prompts después de cierta interacción.

Evitar:

- pop-ups basados simplemente en tiempo,
- modales de registro que aparecen sin una acción previa,
- interrupciones repetidas,
- bloquear el feed antes de que el usuario haya percibido valor.

Ejemplo:

```text
[Contenido del feed]

┌──────────────────────────────┐
│ ¿Te gustan estas plantas?   │
│ Crea una cuenta para guardar │
│ favoritos y recibir alertas. │
│ [Crear cuenta]               │
└──────────────────────────────┘
```

---

## 12. Preservar la intención original del usuario

Cuando el registro interrumpe una acción, la autenticación debe devolver al usuario a la acción que estaba intentando realizar.

Ejemplo:

```text
Anuncio
  ↓
Contactar con vendedor
  ↓
Registro / Login
  ↓
Volver al anuncio
  ↓
Abrir chat
```

De forma similar:

```text
Anunciar
  ↓
Registro / Login
  ↓
Continuar en Crear anuncio
```

No enviar al usuario a Inicio después de autenticarse si existe un contexto previo claro.

---

## 13. Filosofía del feed

El feed P2P no debería sentirse como un catálogo perfectamente repetitivo.

La presentación base puede mantener un grid estructurado de 2 columnas en móvil, pero el feed debe introducir periódicamente **módulos horizontales** o bloques contextuales.

Objetivo:

> Romper la repetición visual y, al mismo tiempo, aumentar el descubrimiento y las acciones útiles.

Estos módulos son herramientas de contenido/UX y no necesariamente publicidad.

---

## 14. Módulos horizontales del feed

Posibles tipos:

### Registro

```text
¿Te está gustando Botanic?
Crea una cuenta para guardar anuncios y recibir alertas.
```

### Descubrimiento

```text
Descubre
[ Plantas raras ] [ Plantas fáciles ] [ Plantas de temporada ]
```

### Filtros inteligentes

```text
¿Buscas una buena oportunidad?
[ En venta ] [ Intercambio ] [ Gratis ]
```

### Sugerencias basadas en comportamiento

```text
Has estado explorando plantas cercanas.
[ Ver anuncios a menos de 5 km ]
```

### Prompt para publicar

```text
¿Tienes una planta como esta?
Dale un nuevo hogar.
[ Publicar un anuncio ]
```

### Descubrimiento de comunidad

```text
¿Necesitas ayuda con una planta?
[ Explorar Comunidad ]
```

---

## 15. Lógica contextual de los módulos del feed

Ejemplos:

```text
Sin resultados
  → Crear Deseo / alerta

Navegación repetida
  → Prompt de registro

Uso frecuente del mapa
  → Filtro de distancia

Navegación repetida por una categoría
  → Categoría relacionada

Exploración por tipo de anuncio
  → Filtros inteligentes por tipo

Usuario sin anuncios propios
  → Sugerencia para publicar

Usuario necesita información sobre cuidados
  → Sugerencia de Comunidad
```

Principio:

> **Sugerir acciones útiles, no promociones arbitrarias.**

---

## 16. Ritmo del feed

La frecuencia exacta de inserción de módulos todavía no está definida.

Debe evitarse:

- demasiados bloques horizontales,
- dos módulos visualmente dominantes juntos,
- demasiados prompts de registro,
- convertir el feed en una colección de tarjetas promocionales.

El ritmo final deberá validarse con el wireframe y posteriormente con uso real.

---

## 17. Prioridades UX

Cuando haya decisiones de diseño futuras que entren en conflicto, utilizar este orden:

```text
1. Intención inmediata del usuario
2. Visibilidad del contenido principal
3. Claridad de la navegación
4. Acciones contextuales útiles
5. Conversión a cuenta
6. Visibilidad de funcionalidades secundarias
```

No sacrificar la experiencia de exploración simplemente para exponer más funcionalidades.

---

## 18. Decisiones deliberadamente abiertas

Las siguientes decisiones todavía no son definitivas y el agente no debe inventarlas:

- Número exacto de elementos de navegación inferior.
- Nombre final del área personal ("Mi Botanic" es un concepto de trabajo).
- Representación visual exacta del selector de Vista.
- Frecuencia exacta de módulos del feed.
- Detalles finales de interacción de Match.
- Copy definitivo de registro.
- Comportamiento definitivo del badge de notificaciones.
- Espaciado, tipografía y diseño visual móvil definitivos.

El agente puede proponer opciones cuando se le pida explícitamente, pero no debe tratarlas como decisiones cerradas.
