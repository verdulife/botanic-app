# Conexión real con Supabase

Cerrar la etapa de demo: la aplicación en `/app` pasa a leer y escribir en la base de datos real. El mock desaparece del código igual que salió el wireframe.

## Specs

**S1.** «Lo que quiero es ya pasar a conectarme con la base de datos que esta tenga. Todos los esquemas y todo creado como debe ser, y todo el resto de pruebas, test, cambios, etcétera, tienen que chocar con la base de datos.»

**S2.** «Puede ser que en algún momento tengamos que hacer un drop de la base de datos porque hemos hecho un cambio, no pasa nada, son todo pruebas.»

**S3.** «Lo que quiero al final es que el código, igual que descartamos ya el wireframe, descartemos ya la demo. Y el tema de mock data. Aunque la base de datos la vamos a llenar con mock data, pero queremos que actúe como si fuera data real.»

**S4.** Bloque 1 tal y como se describió y se aprobó: «`AUTH_MODE` a `supabase`, borrar `src/lib/mock/auth-server.ts` y `.mock-auth/`, verificar registro, login y enlace mágico contra el Auth real, aplicar el seed de las 8 categorías y leer el listado de `listings` en vez de mock.»

**S5.** «Las migraciones entran en el repo antes de empezar con favoritos. Sí, si las migraciones es un plan bueno para poder hacer drops con tranquilidad y poder movernos entre versiones, adelante.»

## Tasks

| # | Tarea | Specs | Ruta | Commit |
|---|---|---|---|---|
| T1 | Comprobar claves de Supabase en el entorno local | S1 | inline | — |
| T2 | Migraciones versionadas en el repo: baseline del esquema ya aplicado | S5, S2 | inline | `chore(db): versiona el esquema aplicado en supabase/migrations` |
| T3 | `AUTH_MODE` a `supabase`; fuera el módulo mock y `.mock-auth/` | S3, S4 | inline | `feat(auth): conecta con Supabase Auth y retira el modo mock` |
| T4 | Verificar registro, verificación, login y enlace mágico; perfil por trigger | S1, S4 | inline | (incluido en T3) |
| T5 | Aplicar el seed de las 8 categorías | S1, S4 | inline | `feat(db): siembra las categorías` |
| T6 | `listings` se lee de la base de datos, no de mock | S1, S3 | inline | `feat(app): el listado se lee de la base de datos` |

## Decisiones tomadas

- **El mock desaparece como capa, no como dato.** La base de datos se llena con datos de prueba, pero el código no tiene una rama «modo mock»: una sola ruta de lectura y escritura. Un script de seed es una herramienta y se documenta; «la app corre sobre mock» es un estado y no se documenta.
- **Ningún test ni cambio futuro se apoya en el mock.** Si un cambio exige `drop` y recreación, se hace: es data de pruebas (S2).
- **Las migraciones viven en el repo** desde T2, para que un `drop` tenga vuelta atrás reproducible. Hoy el esquema solo existe en el proyecto de Supabase: no hay `supabase/migrations`.
- **Lo que no existe no se finge.** Favoritos, deseos, chat, comunidad y notificaciones no tienen tablas. No entran en este bloque.

## Riesgos

- **Riesgo 1 (datos):** el `drop` y recreación de la base son irreversibles. Mitigación: migraciones versionadas antes de cualquier cambio de esquema, y `waitlist` tiene 48 filas reales que no se recrean.
- **Riesgo 2 (contratos):** cambiar el modo de autenticación afecta a todas las rutas de `/app`. Verificar las cuatro superficies de auth y que el perfil lo crea el trigger.

## Log

**L1 (humano, textual):** «Vale, te voy a comentar un par de cosas que ahora tengo más o menos seguras sobre el código que pueden afectar a la revisión y actualización de los docs. El código ahora está enfocado para tener un usuario demo y mock data en local. Lo que quiero es ya pasar a conectarme con la base de datos que esta tenga. Todos los esquemas y todo creado como debe ser, y todo el resto de pruebas, test, cambios, etcétera, tienen que chocar con la base de datos. Puede ser que en algún momento tengamos que hacer un drop de la base de datos porque hemos hecho un cambio, no pasa nada, son todo pruebas. Pero lo que quiero al final es que el código, igual que descartamos ya el wireframe, descartemos ya la demo. Y el tema de mock data. Aunque la base de datos la vamos a llenar con mock data, pero queremos que actúe como si fuera data real.»

**L2 (humano, textual):** «3. Las migraciones entran en el repo antes de empezar con favoritos. Sí, si las migraciones es un plan bueno para poder hacer drops con tranquilidad y poder movernos entre versiones, adelante. 4. Arranco por el bloque 1 tal y como lo he descrito. Si crees que es la mejor opción, adelante.»

**L3 (humano, textual):** «Vale, si te parece, corrige estas pequeñas cosas y entonces ya nos ponemos con el bloque 1 de conexión real.»
