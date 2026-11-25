# Conexión real con Supabase

Cerrar la etapa de demo: la aplicación en `/app` pasa a leer y escribir en la base de datos real. El mock desaparece del código igual que salió el wireframe.

## Specs

**S1.** «Lo que quiero es ya pasar a conectarme con la base de datos que esta tenga. Todos los esquemas y todo creado como debe ser, y todo el resto de pruebas, test, cambios, etcétera, tienen que chocar con la base de datos.»

**S2.** «Puede ser que en algún momento tengamos que hacer un drop de la base de datos porque hemos hecho un cambio, no pasa nada, son todo pruebas.»

**S3.** «Lo que quiero al final es que el código, igual que descartamos ya el wireframe, descartemos ya la demo. Y el tema de mock data. Aunque la base de datos la vamos a llenar con mock data, pero queremos que actúe como si fuera data real.»

**S4.** Bloque 1 tal y como se describió y se aprobó: «`AUTH_MODE` a `supabase`, borrar `src/lib/mock/auth-server.ts` y `.mock-auth/`, verificar registro, login y enlace mágico contra el Auth real, aplicar el seed de las 8 categorías y leer el listado de `listings` en vez de mock.»

**S5.** «Las migraciones entran en el repo antes de empezar con favoritos.»

## Tasks

| # | Tarea | Estado | Commit |
|---|---|---|---|
| T1 | Claves de Supabase en el entorno local | hecho | — |
| T2 | Baseline del esquema en `supabase/migrations` | hecho | `ea83ee0` |
| T3 | `AUTH_MODE` fuera; auth real contra Supabase | hecho | `7ebc318` |
| T4 | Registro, confirmación, login y enlace mágico verificados | hecho | — |
| T5 | Seed de las 8 categorías | hecho | `53d9b5b` |
| O1 | Lista de espera: testigo por fila, RPC por correo eliminada | hecho | `bad6b7d` |
| O2 | Endpoint del alta con `join_waitlist` (SECURITY DEFINER) | hecho | `bad6b7d` |
| O3 | Turnstile: widget y `siteverify` con acción y hostname | hecho | `ca768ce`, `4f4d55c`, `53af8a9` |
| O4 | Límite de intentos por IP en Postgres, IP hasheada | hecho | `92a9afa`, `d8a3ddc` |
| O5 | `src/env.ts` declara todas las variables; imports a `$app/env` | hecho | `01b09f7` |
| O6 | Alta completa verificada: dos correos y contacto en el segmento | hecho | — |
| T6 | **El listado de anuncios se lee de la base de datos** | **pendiente** | — |

## Decisiones tomadas

- **El mock desaparece como capa, no como dato.** La base se llena con datos de prueba, pero el código tiene una sola ruta de lectura y escritura. Un script de seed es una herramienta; «la app corre sobre mock» es un estado y no se documenta.
- **Las migraciones viven en el repo** desde T2, para que un `drop` tenga vuelta atrás reproducible.
- **La lista de espera no es lo mismo que los usuarios.** Tablas distintas (`public.waitlist` frente a `auth.users`), código distinto y ningún cruce. Un alta en la lista no crea cuenta ni da acceso. Cuando se quiera facilitar el registro a quien está en la lista, será **una consulta por correo en el registro**, un enlace y no una fusión.
- **La sesión se resuelve solo con `getUser()`.** `getSession()` en servidor dispara el refresco automático del token y con él escrituras de cookie cuando la respuesta ya está generada; eso tumbaba el proceso.
- **Contra la enumeración de correos se encarece el intento, no se falsea la respuesta.** El número de la tarjeta se entrega solo al crear la fila; la pertenencia a la lista se protege con Turnstile y con cinco intentos por hora.

## Riesgos

- **Riesgo 1 (datos):** un `drop` es irreversible. Mitigado con migraciones versionadas; `waitlist` tiene 48 filas reales que no se recrean.
- **Riesgo 2 (configuración silenciosa):** una variable no declarada en `src/env.ts` no existe para la app y las funciones se apagan sin fallar. Ya provocó que el alta no enviara correos durante días. Mitigado con avisos en el log cuando se omite un envío.

## Log

**L1 (humano, textual):** «El código ahora está enfocado para tener un usuario demo y mock data en local. Lo que quiero es ya pasar a conectarme con la base de datos que esta tenga. […] Puede ser que en algún momento tengamos que hacer un drop de la base de datos porque hemos hecho un cambio, no pasa nada, son todo pruebas. […] igual que descartamos ya el wireframe, descartemos ya la demo. […] Aunque la base de datos la vamos a llenar con mock data, pero queremos que actúe como si fuera data real.»

**L2 (humano, textual):** «Las migraciones entran en el repo antes de empezar con favoritos. […] Arranco por el bloque 1 tal y como lo he descrito.»

**L3 (humano, textual):** «Que una persona se dé de alta en la waitlist no significa que ya esté registrado como para iniciar sesión. […] la waitlist y los usuarios de la waitlist son sólo para la waitlist y los usuarios de inicio de sesión son otros. […] Si son lo mismo, lo separamos. Si no son lo mismo, lo dejamos como está.» → Comprobado: ya estaban separados; no se tocó nada.

**L4.** Bloque 1 cerrado salvo T6. La lista de espera se endureció de paso porque el hallazgo de la revisión destapó que la función de posición era un oráculo de enumeración.

**L5.** Verificación final del alta (O6) hecha por el humano: «me han llegado los correos a todos los lugares que eran necesarios».

## Siguiente sesión: empezar por aquí

1. **T6** — 19 ficheros consumen `$lib/mock/listings`: listado, mapa, scroll, detalle, favoritos, perfil, publicar y los componentes de tarjeta. Es lo último del bloque 1.
2. Después, **favoritos** como primera migración de negocio, con el patrón que dejan las de `waitlist`.
3. Decisiones menores aparcadas: los **48 apuntados antiguos no pueden recuperar su tarjeta** (su número era lo que abría la puerta); si se quiere, se les manda el testigo por correo. Y la **neutralidad completa** de la respuesta del alta (hoy aún distingue alta de duplicado).
