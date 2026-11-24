# Email — contrato del módulo

Envío transaccional y de campaña con Resend, siempre desde el servidor: nunca desde el cliente. Marca y copy siguen [DESIGN.md](../../DESIGN.md) y [PRODUCT.md](../../PRODUCT.md).

Qué se envía, a quién y con qué plantilla está en el código. Aquí queda lo que una lectura no revela y lo que no se puede romper sin aviso.

## Entregabilidad

- Remitente `hola@botanicapp.es` con `replyTo`; nunca `no-reply@`. Pie con información físico-legal (RGPD y LSSI).
- Todo envío lleva `List-Unsubscribe` y `List-Unsubscribe-Post: One-Click`.
- Imágenes con `max-width` de 480 px y texto alternativo descriptivo.
- DKIM, SPF y DMARC configurados en `botanicapp.es`.
- Una entrega en spam a un proveedor nuevo se atribuye a la reputación del dominio, no a la configuración: se comprueba con volumen real.

## Reglas

- Toda plantilla nueva reutiliza `layout.ts`: el header, el pie legal y el `text` de respaldo ya están resueltos ahí.
- Las campañas usan el Audience «waitlist» existente; no se crea otro.
- Un alta duplicada (`23505`) no reenvía emails: responde `alreadyRegistered` con la posición y el formulario voltea la tarjeta, para no llenar el buzón del admin.
- Antes de tocar DNS o cabeceras de entrega, se revisa el historial del vault para no repetir un arreglo ya aplicado.

## Fuera del repo

El plan del proyecto, la auditoría de entregabilidad y su historial fechado viven en el vault de Obsidian, no aquí. Esquema de la lista de espera → [../db/schema-waitlist.md](../db/schema-waitlist.md).
