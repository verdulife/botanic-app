# Botanic · UX

Reglas de UX que condicionan cómo se construyen las pantallas. Solo lo que un lector **no** puede deducir del código: la jerarquía que sigue decidiendo, los gestos, el tono de los estados y el ritmo del feed.

- Sistema visual (tokens, tipografía, color, forma, movimiento) → [DESIGN.md](../../DESIGN.md).
- Stack, límites entre módulos y verificación → [ARCHITECTURE.md](../../ARCHITECTURE.md).
- Rutas y entidades de la webapp → [docs/app/AGENTS.md](../app/AGENTS.md).

## Índice

1. [Jerarquía y navegación](#1-jerarquía-y-navegación)
2. [Vista, filtros y gestos](#2-vista-filtros-y-gestos)
3. [Registro](#3-registro)
4. [Feed](#4-feed)
5. [Copy de estados](#5-copy-de-estados)
6. [Prioridades](#6-prioridades)

## 1. Jerarquía y navegación

Botanic muestra las **intenciones principales** del usuario, no todo lo que la app sabe hacer.

| Destino permanente | Para qué |
|---|---|
| **Inicio** | Descubrimiento del marketplace P2P: anuncios, búsqueda, filtros, vista |
| **Comunidad** | Preguntas, consejos y conversaciones entre usuarios |
| **Market** | Catálogo de profesionales y tiendas del sector |
| **Mi Botanic** | Cuenta y todo lo personal |

- Son cuatro destinos, ni uno más. **No se da espacio permanente de navegación a una funcionalidad solo porque exista.**
- Área personal = un único espacio, no acciones repartidas por la interfaz. `Mi Botanic` agrupa perfil, notificaciones, anuncios propios, favoritos, conversaciones, deseos/alertas, ajustes, anunciar y cerrar sesión.
- Pero tampoco se esconde a dos toques: `Mi Botanic` es el cuarto destino del bottom nav, nunca una entrada del header.
- `Anunciar` es una acción, no un destino: vive en `Mi Botanic` y en accesos contextuales (tarjeta del feed, anuncios propios).
- `Deseos / alertas` es automatización en segundo plano: su entrada fuerte es contextual (búsqueda sin resultados) y la gestión vive en `Mi Botanic`.
- Header: anónimo `Logo · Búsqueda · Entrar`; autenticado `Logo · Búsqueda · 🔔`. Sin avatar ni entrada a Mi Botanic.
- El 🔔 es el único elemento del header reservado a feedback en tiempo real y lleva badge de no leídas.
- Antipatrones: una pestaña por funcionalidad, el mismo destino en dos sitios sin motivo, el mismo peso visual para lo secundario que para lo principal, destinos no documentados.

## 2. Vista, filtros y gestos

El marketplace ofrece tres formas de explorar **el mismo** conjunto de resultados.

- Selector único `Vista ▾` —Lista, Mapa, Scroll— en vez de un botón permanente por modo.
- Los filtros deciden **qué** aparece; la vista decide **cómo** se explora. Orden de lectura: Búsqueda → Filtros → Vista → Resultados.
- Cambiar de vista conserva búsqueda y filtros. Nunca se reconfigura la búsqueda al cambiar de modo.
- Lista para comparar; Mapa para descubrir por cercanía; Scroll para descubrimiento relajado, "enamórate de esa planta".

### Scroll

- Cada tarjeta lleva sus propias acciones **en flujo** junto al texto, sin solaparse: **Compartir** (Web Share), **Guardar** (mismo favorito que el corazón) y **Ver ahora** (abre el detalle).
- **Avanza solo cada 3 s en bucle**, cambiando de tarjeta sin intervención del usuario.
- **Doble tap en la imagen equivale a Guardar.**
- Bajo el precio, el vendedor: valoración ★ con un decimal y nombre.
- Toma el lenguaje de las tarjetas deslizables, no el de Tinder: los botones sustituyen al swipe izquierda/derecha.

### Mapa saturado

- Cada marker es un **vendedor**: avatar, nombre, número de plantas según los filtros activos y ★.
- Si no caben todos, se priorizan los mejor valorados con un máximo por nivel de zoom; el resto se agrupa en chips que se abren al acercar.
- Las chips nunca quedan apiladas entre sí ni encima de un marker: se separan por colisión en píxeles al renderizar.

### Auto-hide del bottom nav

- Se oculta al bajar y reaparece al subir, para devolver altura al contenido.
- Antes del primer umbral (~80-100 px desde arriba) está siempre visible: nada de parpadeo al cargar.
- La histéresis de dirección (~8 px) evita el temblor; un tap **no** la reactiva, solo el scroll hacia arriba.
- Con `prefers-reduced-motion`, el cambio es instantáneo.

## 3. Registro

- Se explora sin cuenta: feed, búsqueda, filtros, mapa, detalle de anuncio y comunidad.
- La cuenta se pide para: publicar, contactar o chatear, guardar favoritos de forma persistente y crear deseos/alertas.
- Regla única: **pide el registro cuando la intención ya está demostrada**, nunca antes.
- El copy dice el beneficio y el motivo —"Regístrate para publicar", "Regístrate para chatear con el vendedor"—, no "Debes registrarte".
- Prohibido: modales por tiempo, registro sin acción previa, interrupciones repetidas y bloquear el feed antes de que haya aportado valor.
- Los prompts pasivos van integrados en el contenido, no bloquean y se pueden descartar cuando procede.
- Tras autenticar se vuelve al contexto y a la acción interrumpida (`next`), nunca a Inicio.

## 4. Feed

- Grid de dos columnas en móvil, interrumpido a propósito por módulos horizontales. Los anuncios P2P siguen siendo el contenido predominante.
- Un módulo solo se inserta si mejora el descubrimiento, mejora la navegación, da un atajo útil o ayuda a la conversión en el momento justo. Romper el grid no es motivo suficiente.
- Nunca dos módulos visualmente dominantes seguidos, ni un feed que acabe siendo una colección de tarjetas promocionales.
- Los módulos salen del contexto del usuario, no de un calendario:

| Contexto | Módulo |
|---|---|
| Búsqueda sin resultados adecuados | Crear deseo / alerta |
| Anónimo con navegación repetida | Prompt de registro |
| Uso repetido del mapa | Filtro de distancia |
| Navegación repetida por categoría | Categoría relacionada |
| Exploración por tipo de anuncio | Filtros inteligentes por tipo |
| Usuario sin anuncios propios | Sugerencia para publicar |
| Demanda de cuidados | Sugerencia de Comunidad |

- **Sugerir acciones útiles, no promociones arbitrarias.**

## 5. Copy de estados

- Sin resultados nunca es un callejón: se ofrece crear un deseo/alerta con su aviso.
- Un prompt de registro dentro de un estado vacío comunica el beneficio, no la obligación.
- El resto de convenciones de copy (estados vacíos, errores, cifras y fechas) está en [DESIGN.md](../../DESIGN.md).

## 6. Prioridades

Cuando dos decisiones chocan, gana la de arriba:

1. Intención inmediata del usuario.
2. Visibilidad del contenido principal.
3. Claridad de la navegación.
4. Acciones contextuales útiles.
5. Conversión a cuenta.
6. Visibilidad de funcionalidades secundarias.

No se sacrifica la exploración para exponer más funcionalidades.
