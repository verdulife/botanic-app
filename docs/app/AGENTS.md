# App — contrato y reglas del módulo

Webapp de Botanic bajo `/app`: marketplace P2P de plantas entre particulares —vender, cambiar, regalar— con deseos, comunidad, chat, perfil y ajustes.

Producto y voz → [PRODUCT.md](../../PRODUCT.md) · autoridad visual y movimiento → [DESIGN.md](../../DESIGN.md) · jerarquía, gestos, registro y pantallas → [UX.md](../ux/UX.md) · stack y verificación → [ARCHITECTURE.md](../../ARCHITECTURE.md) · acceso y seguridad → [AGENTS.md § Seguridad](../../AGENTS.md#seguridad) · PWA → [PWA.md](PWA.md).

Aquí solo vive lo que el código no revela: las ausencias —lo que nunca debe ocurrir—, los umbrales y órdenes que parecen arbitrarios, y lo que está tan repartido que leerlo cuesta más que esta página. El comportamiento de cada área —auth, chat, notificaciones, perfil y ajustes— lo expresa el código y no tiene sección aquí.

## Marketplace P2P

- Publicar no muestra indicador de progreso.
- La identificación por foto rellena el título solo si está vacío, la categoría plantas solo si no había otra, y la especie. Todo es editable; la descripción nunca se autocompleta.
- Con especie identificada, la caja de cuidados se coloca entre la ubicación y el vendedor; sin datos de esa especie, no aparece.
- «¿Dudas?» ofrece dos acciones visualmente neutras, la comunidad primero y después preguntar a la IA.
- «Está buscando» lista los deseos del vendedor y coloca primero el que se ofrece como cambio.
- El trato se sigue, no se cobra: el P2P no integra pagos.

## Deseos

- La ubicación vacía equivale a todo el país.
- Todo deseo nace activo y con aviso encendido; el estado no se elige al crearlo y se pausa desde la lista.
- Al crear, el deseo se coloca el primero de la lista y se vuelve a la lista.

## Comunidad

- Cada publicación es la raíz de un hilo con sus respuestas, sin anidar.
- Votos, moderación avanzada y comunidades temáticas quedan fuera del alcance.
