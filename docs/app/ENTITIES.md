# Botanic — Entidades funcionales

## Usuario

Cuenta que participa en el marketplace P2P, deseos, comunidad y chat. Identidad transversal para autenticación, perfil, ubicación y notificaciones.

## Anuncio P2P

Publicación de un usuario para vender, intercambiar o regalar una planta o producto relacionado. Campos principales: título, descripción, imágenes, precio (opcional), categoría, ubicación.

## Deseo

Búsqueda activa creada por un usuario. Contiene criterios (ver más abajo) y puede activar una alerta. Cuando un anuncio nuevo encaja con un deseo existente, se genera una coincidencia.

### Criterios del deseo

- **Palabras clave** (texto libre, único obligatorio).
- **Categoría** (opcional, "Cualquiera" por defecto).
- **Presupuesto** ("hasta X €", opcional).
- **Ubicación** por alcance jerárquico: `pais` / `comunidad` / `provincia` / `ciudad`.
- **Estado** (activo / en pausa) — todo deseo nuevo nace activo; se pausa desde la lista.

## Coincidencia

Relación entre un deseo y un anuncio P2P que encaja con sus criterios. Sirve para notificar al usuario y para alimentar el listado de coincidencias.

## Publicación de comunidad

Aportación de un usuario en la sección de comunidad. Puede ser una pregunta, un consejo o una experiencia. Tiene respuestas (ver hilo).

## Hilo

Vista agrupada de una publicación de comunidad y todas sus respuestas. Formato estilo Reddit: publicación raíz + respuestas (anidadas o lineales en MVP).

## Conversación

Conversación entre dos usuarios. En el MVP se enfoca en comunicación relacionada con el P2P (interés sobre un anuncio). Puede incluir referencias compartidas a anuncios.

## Notificación

Evento mostrado al usuario: coincidencia de deseo, mensaje nuevo, actividad de comunidad, alerta del sistema. Debe poder abrir el recurso asociado cuando exista.

## Producto profesional

Producto del futuro Botanic Market. Se documenta para preparar la navegación, pero no pertenece al MVP.

---

> **Actualización**: ver [AGENTS.md § Cómo mantener los docs](../../AGENTS.md#cómo-mantener-los-docs).
