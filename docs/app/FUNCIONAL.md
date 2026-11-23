# App — reglas funcionales

Reglas por área que el código no expresa por sí solo. Rutas: `src/routes/app/`. Entidades y esquema: [docs/db/schema-app.md](../db/schema-app.md). Contrato del módulo: [AGENTS.md](AGENTS.md).

## Auth

- Flujos: registro → verificación de cuenta → bienvenida → marketplace; login → marketplace; recuperación → email → cambio de contraseña. El registro desemboca siempre en el onboarding, nunca directamente en el marketplace.
- Dos vías de acceso: email con contraseña y enlace mágico.
- Formularios centrados y con ancho cómodo en escritorio; a ancho completo en móvil.

## Marketplace P2P

- Un anuncio se ofrece para vender, cambiar o regalar. Vender y cambiar son combinables; regalar es excluyente. El precio queda oculto al regalar y es opcional al cambiar.
- De 1 a 5 imágenes por anuncio; la primera es la portada.
- Publicar va en cuatro fases con Continuar/Volver y sin indicador de progreso: categoría → fotos → análisis → detalles. El análisis solo aparece en plantas y esquejes.
- La identificación por foto rellena el título (solo si está vacío), la categoría plantas (solo si no había otra) y la especie. Todo es editable; la descripción nunca se autocompleta.
- Se admiten varios borradores a la vez. "Guardar borrador" guarda y lleva a la lista de borradores; salir con datos sin guardar abre un diálogo con guardar y salir, salir sin guardar o seguir editando, y recargar avisa igual. Al publicar se elimina el borrador activo.
- Tres modos de vista sobre el mismo dataset filtrado: Lista (por defecto), Mapa y Scroll (relajado, vertical, a pantalla completa, con avance automático cada 3 s). Hay un selector único y cambiar de vista conserva búsqueda y filtros.
- El mapa agrupa por vendedor, no por anuncio. Cada marca lleva iniciales, nombre, número de plantas según los filtros activos y valoración (1–5 con un decimal, estilo reseñas de Google); los vendedores se ordenan por valoración descendente, con desempate por número de valoraciones.
- Si no caben todos los vendedores se muestra un tope por nivel de zoom (los mejor valorados) y el resto se agrupa en chips de ocultos, con tope propio; al hacer zoom se revelan más. Clic en vendedor → perfil público; clic en chip → zoom al grupo. Marcas y chips nunca se apilan.
- Detalle: galería deslizable 4:5 con dots que solo indican posición y, fijos sobre ella, Guardar (exige sesión) y Compartir (Web Share API, con fallback a portapapeles).
- El detalle emite metadatos para compartir: título con precio, descripción truncada a ~160 caracteres, portada en URL absoluta, `canonical`, `noindex, nofollow, max-image-preview:large` y `summary_large_image`.
- Con especie identificada, el detalle muestra la caja de cuidados entre ubicación y vendedor: riego y luz en 1–3 niveles y toxicidad como texto neutro (`No`, `Sí`, `Mascotas`). Sin datos de esa especie, la caja se oculta.
- Bajo la descripción, "¿Dudas?" ofrece dos acciones visualmente neutras, comunidad primero: ir a la comunidad o preguntar a la IA con un prompt contextual (tipo de precio, ubicación y categoría) que pide evaluar la compra y, en plantas, una guía de cuidados.
- En anuncios de cambio, el bloque "Está buscando" lista los deseos del vendedor en scroll horizontal: cards solo texto, sin imagen, que llevan a su perfil. El deseo ofrecido como cambio va primero con la marca "Deseado".
- Favoritos incluye búsqueda en vivo por título, ubicación, categoría y vendedor.
- La ubicación del anuncio se prellena desde el perfil y es editable por anuncio; el GPS es un atajo, nunca el mecanismo obligatorio.
- No hay pagos integrados en el P2P: compras y ventas son seguimiento del trato, no un checkout.
- Botanic Market es un destino propio bajo `/app/market`, independiente del P2P, y comparte con él el anuncio como unidad de catálogo (particulares frente a tiendas). Su catálogo puede arrancar como catálogo afiliado curado, con comisión y sin stock, logística ni pagos → el catálogo afiliado.

## Deseos

- Un deseo es una búsqueda activa. Las palabras clave son el único criterio obligatorio; categoría, presupuesto y ubicación son opcionales y se pliegan en "Más opciones".
- La ubicación es jerárquica en un único autocompletar: todo el país, comunidad, provincia o ciudad. Vacío equivale a todo el país.
- "Avisarme" viene activado por defecto: el fin del deseo es notificar.
- Todo deseo nace activo y el estado no se elige al crearlo; se pausa desde la lista.
- Los autocompletars son flotantes (no empujan el contenido) y excluyen la opción ya elegida.
- Al crear, el deseo se coloca el primero de la lista y se vuelve a la lista.
- Una coincidencia es un anuncio que cumple los criterios. Se listan en el deseo y, con la alerta activa, generan notificación.
- La lista de deseos es la única fuente de verdad, tiene búsqueda en vivo por término y también se alcanza desde Favoritos.
- La alerta se configura en el propio deseo: on/off y canales.

## Comunidad

- Formato pregunta y respuesta: cada publicación es la raíz de un hilo con sus respuestas. La URL canónica del hilo es `/app/hilo/:id`.
- Leer es público; publicar y responder exigen sesión.
- Una publicación debe poder abrirse desde una notificación o un enlace compartido y volver al listado.
- El core es texto y estructura de pregunta y respuesta: sin votos, sin moderación avanzada y sin comunidades temáticas.

## Chat

- El chat nace del marketplace: detalle de anuncio → Contactar → conversación. Iniciar conversación exige sesión.
- Una conversación puede llevar anuncios compartidos, y desde ellos se vuelve al detalle del anuncio.
- En escritorio, dos paneles (lista a la izquierda, conversación a la derecha); en móvil, una vista por vez.

## Notificaciones

- Fuentes: coincidencia con un deseo, mensaje nuevo y respuesta a una publicación propia.
- Toda notificación abre el recurso asociado cuando existe: deseo → coincidencia → anuncio; chat → conversación; comunidad → hilo.
- Es un centro independiente, accesible desde cualquier área y solo con sesión.
- El acceso del header muestra el número de no leídas.

## Perfil

- Perfil propio y edición exigen sesión; el perfil público se lee sin cuenta.
- El perfil público se abre desde el anuncio (nombre del vendedor), desde el mapa y desde una conversación.
- Identidad mínima: avatar, nombre, ubicación aproximada, anuncios activos y deseos.
- "Sus deseos" solo aparece si ese usuario tiene deseos publicados; en el perfil propio hay acceso para gestionarlos.

## Ajustes

- No ocupan posición en la navegación principal: se llega desde el perfil o desde una acción global.
- La configuración de ubicación vive aquí y cubre los tres estados: concedido, rechazado y no configurado.
- Columnas en escritorio y lista en móvil.
