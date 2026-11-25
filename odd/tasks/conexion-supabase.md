# Conexión real con Supabase

Cerrar la etapa de demo: la aplicación en `/app` pasa a leer y escribir en la base de datos real. El mock desaparece del código igual que salió el wireframe.

## Specs

**S1.** «Lo que quiero es ya pasar a conectarme con la base de datos que esta tenga. Todos los esquemas y todo creado como debe ser, y todo el resto de pruebas, test, cambios, etcétera, tienen que chocar con la base de datos.»

**S2.** «Puede ser que en algún momento tengamos que hacer un drop de la base de datos porque hemos hecho un cambio, no pasa nada, son todo pruebas.»

**S3.** «Lo que quiero al final es que el código, igual que descartamos ya el wireframe, descartemos ya la demo. Y el tema de mock data. Aunque la base de datos la vamos a llenar con mock data, pero queremos que actúe como si fuera data real.»

**S4.** Bloque 1 tal y como se describió y se aprobó: «`AUTH_MODE` a `supabase`, borrar `src/lib/mock/auth-server.ts` y `.mock-auth/`, verificar registro, login y enlace mágico contra el Auth real, aplicar el seed de las 8 categorías y leer el listado de `listings` en vez de mock.»

**S5.** «Las migraciones entran en el repo antes de empezar con favoritos.»

**S6.** «cuando utilizaba los datos de MOC, sí que había bastantes y todos repartidos por España, que eso estaba bien, pero en las ciudades o ubicaciones donde estaban, en las calles estaban demasiado juntos. Me gustaría que estuvieran más separados para que cuando se haga zoom no se pisen tanto y además resulte más realista.»

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
| T6 | Migración: `types`, `species`, `size`, `public_id` y valoraciones del perfil | hecho | `12efaa4` |
| T7 | Seed con reparto orgánico entre anuncios de un mismo barrio | hecho | `59da934` |
| T8 | Capa de lectura de anuncios contra Supabase: fila, imágenes y vendedor | hecho | `12efaa4` |
| T8b | URL del detalle: slug legible más número público | hecho | `12efaa4` |
| T9 | Listado, mapa y scroll leen de la base de datos | hecho | `a6c1470` |
| T10 | Detalle, favoritos y perfil leen de la base de datos | pendiente | — |
| T11 | Publicar escribe en la base de datos | pendiente | — |
| T12 | `$lib/mock/listings` fuera del código | pendiente | — |

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

**L6 (humano, textual):** «antes de ponernos con esto, obviamente, como hemos hecho push en producción, Bersell se está quejando y no puede hacer deploy porque hemos cambiado algunos nombres de variables.» → Causa real: producción construía `master`, 47 commits por detrás. Resuelto con merge fast-forward a `main`, renombrado de la rama, variables reconfiguradas en Vercel y hook de deploy reapuntado.

**L7 (humano, textual):** «cuando utilizaba los datos de MOCK, sí que había bastantes y todos repartidos por España, que eso estaba bien, pero en las ciudades o ubicaciones donde estaban, en las calles estaban demasiado juntos. Me gustaría que estuvieran más separados para que cuando se haga zoom no se pisen tanto y además resulte más realista.» → Abre S6 y la tarea T7.

**L8.** Evidencia que cambia la forma de T6: el `listings` del esquema no tiene `type`, `species`, `size` ni `wish_id`, y el seed escribe `lat`/`lng` como el **centroide exacto** de la ciudad, sin variación: todos los anuncios de una ciudad comparten coordenada. Ningún ruta de `/app` tiene `+page.server.ts`; los datos se leen hoy dentro de los componentes.

**L9 (humano, textual):** «Creo que esto es algo que ya habíamos discutido, no contigo, sino en la creación del proyecto, en la que decíamos utilizar la misma técnica que usa Wallapop, que creo que es la segunda opción que me dabas, que era una mezcla entre algo legible con un sufijo. Pensemos esto como ya un resultado definitivo, aunque ahora mismo sea un mock-up, ya que tiene que ser la mejor opción para el SEO posible y rendimiento.» → URL definitiva del detalle: `/app/anuncio/<slug>-<public_id>`. El número manda y el slug decora, así que cambiar el título no rompe enlaces.

**L10.** Hito 1 cerrado sobre `feat/anuncios-supabase` (743 líneas de autoría en dos commits, por encima del corte de revisión de ~400: se entrega como rama propia, no como commit suelto). Evidencia: `pnpm test` 15/15, `pnpm check` 0 errores, `pnpm build` exit 0, migraciones aplicadas (`types`, `species`, `size`, `public_id`, `rating`, `review_count`). La base tiene 0 anuncios: la app sigue leyendo el mock hasta T9.

**Decisión abierta:** un slug legible solo rinde si la página se indexa, y `AGENTS.md` exige `noindex` en todo `/app*`. Si el SEO del anuncio es objetivo, el detalle tiene que salir a una ruta pública fuera de `/app`; la forma de la URL ya está preparada para ese día.

**L11.** Revisión del hito 1 aprobada (3 lentes, 768 líneas) con **siete hallazgos no bloqueantes** y autoridad quemada. Cerrados en el acto R3-001 (valoraciones del perfil), R3-002 (`public_id` en el select), R3-003 (formas canónicas de URL) y R3-005 (`regalar` exclusivo por restricción). Quedan para T9 R3-004 (nada de `(0,0)` en el mapa) y R4 (un error de base de datos no puede parecer un mercado vacío).

**L12.** Seed aplicado a la base: **142 anuncios, 18 vendedores, 284 imágenes**, 0 sin `public_id`, 0 sin coordenadas, 0 con `regalar` combinado. Separación real por barrio: Bilbao 166 m de pareja más cercana, Madrid Centro 127 m, Malasaña 231 m, Poblenou 58 m — el suelo duro de 50 m se cumple en toda España.

**L13.** El seed perdió dos usuarios sin avisar: `mockEmailFor` construía el correo con el acento del nombre (`inés-mock@botanic.test`) y Supabase Auth lo rechaza, arrastrando sus anuncios. Corregido a ASCII y con test que recorre los 20 usuarios del seed.

**L14.** Revisión del tramo 2 aprobada (lentes de riesgo y fiabilidad, 265 líneas; el proveedor pidió además un refutador por un hallazgo CRITICAL). Ese hallazgo —que la restricción nueva podría fallar sobre filas antiguas— fue **refutado**. Quedan dos avisos informativos: los correos del seed tenían que ser además **únicos**, no solo válidos (cerrado con test), y `getListingByPublicId` devuelve `null` ante error de base de datos, que es el mismo R4 pendiente para T9.

**Decisión del humano:** el desarrollo basado en recibos queda **desactivado** (`gentle-ai review mode disable`): no quiere el aviso de revisión pendiente en cada cambio pequeño. Las revisiones ya hechas y sus recibos siguen ahí; no se borra nada. Cuando llegue un tramo delicado (migraciones, permisos, entrega) se propone reactivarlo para ese tramo.

**L15.** T9 hecho y **verificado de extremo a extremo**, no solo por tipos: con el servidor de desarrollo arriba, `/app` devuelve 200 y su HTML contiene **142 enlaces a anuncio** con títulos, barrios del seed y rutas reales de Storage. Antes de eso, comprobado por SQL que el rol `anon` ve los 142 anuncios y las 284 imágenes, que es lo que necesita la lectura con RLS.

**Pendiente anotado para T10:** la tarjeta construye el enlace con el **uuid**, pero el detalle espera `<slug>-<public_id>`. Hoy pinchar un anuncio da una URL que el detalle no resuelve; se arregla al conectar el detalle.

## Siguiente sesión: empezar por aquí

1. **T6 a T12** — el listado pasa a leerse de la base. 13 ficheros consumen `$lib/mock/listings` (no 19: los demás módulos de `src/lib/mock/` son dependencias internas): 4 componentes de wireframe, 2 stores y 7 rutas.
2. Después, **favoritos** como primera migración de negocio, con el patrón que dejan las de `waitlist`.
3. Decisiones menores aparcadas: los **48 apuntados antiguos no pueden recuperar su tarjeta** (su número era lo que abría la puerta); si se quiere, se les manda el testigo por correo. Y la **neutralidad completa** de la respuesta del alta (hoy aún distingue alta de duplicado).
