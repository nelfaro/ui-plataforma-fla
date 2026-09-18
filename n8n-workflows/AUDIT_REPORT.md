# Auditoría de coherencia — n8n producción (2026-09-17)

## ✅ ESTADO: fixes aplicados en producción (2026-09-17, misma sesión)

Confirmado por el usuario: el webhook real es `whatsapp-entrada` (o sea **Cerebro v2**, `LbIjKIvn5Uqfyxa0`, es el cerebro real — `Academia_Ingles_Cerebro_IA` queda descartado, ver sección 0).

Cambios aplicados en n8n (todos vía API, verificados con re-lectura post-cambio):

1. **Creado `procesar-comprobante-pago`** (`CGfkwm2t4B6I0JA2`, activo) — fusiona `convertir-lead-a-alumno` + `registrar-pago` en un solo paso atómico: upsert de alumno (usa `ON CONFLICT ON CONSTRAINT unique_whatsapp`, ya no rompe con duplicate key), vincula a `alumnos_horarios`, e inserta el pago. Enums de `tipo`/`canal` corregidos para que coincidan con los CHECK constraints reales de `pagos` (antes: `'mensualidad'`/`'whatsapp_comprobante'`, ninguno válido → violación garantizada). `tipo_pago` se infiere solo: `INSCRIPCION` si es el primer pago del lead, `CUOTA_MENSUAL` si ya era alumno.
2. **Cerebro v2 actualizado**: se sacaron las tools `convertir-lead-a-alumno`, `registrar-pago` y `registrar_alumno` (esta última resolvía el conflicto de 3 caminos para crear alumno — ahora hay uno solo). Se agregó la tool `procesar-comprobante-pago`.
3. **Prompt del agente actualizado** (en el nodo `Coordinador Academia` en vivo, y en `prompts/coordinador-academia-v6.md` en el repo — quedaron sincronizados): el lead ya NO se convierte a alumno al elegir horario, se mantiene CALIENTE hasta que llega el comprobante; la única forma de pasar a alumno es `procesar-comprobante-pago`.
4. **Fix `registrar-derivacion-a-fla`**: el input del trigger tenía un typo (`alumn_id` en vez de `alumno_id`) y el Cerebro no mandaba ningún mapping — la tool probablemente fallaba siempre. Corregido en ambos lados.
5. **Desactivado `Academia_Ingles_Cerebro_IA`** (`pBYf6cv9kCeTwEWU`, path `whatsapp-entrada-v1`) — confirmado por el usuario que el webhook real es `whatsapp-entrada` (Cerebro v2). Queda inactivo pero no borrado, por si hace falta algo de ahí.

### ⚠️ Pendiente — requiere una acción manual tuya (no lo puedo hacer yo)

**No existe ninguna credencial de Google Drive en esta instancia de n8n** (confirmado consultando `/credentials` — solo hay Telegram, Google Gemini, Odoo, Chatwoot, Postgres, OpenAI). Por eso, aunque el prompt siempre dijo "el comprobante se guarda en Drive", **nunca se guardó nada** — el nodo `Analyze image` del Cerebro solo analiza la imagen con GPT-4o-mini y no sube nada a ningún lado. `comprobante_url` nunca existió de verdad.

Para que `procesar-comprobante-pago` funcione de punta a punta necesito que:
1. En n8n → Credentials → New → busques "Google Drive OAuth2 API" → conectes con la cuenta de Google donde querés guardar los comprobantes (ej. `iaclasesdeinglesconfla@gmail.com`) → guardar.
2. Me avises (o me pases el nombre de la credencial) para que yo agregue el nodo de subida a Drive en el pipeline de imágenes de Cerebro v2 y lo conecte para que `comprobante_url` viaje realmente en el JSON `[IMAGEN PROCESADA]:`.

Hasta que esto esté, `procesar-comprobante-pago` va a fallar con "Falta comprobante_url" en la práctica — igual que fallaba antes, así que no es una regresión, pero sigue bloqueado.

### ✅ Pantalla de verificación de pagos — construida (2026-09-17)

- Backend nuevo: `get-pagos-pendientes` (`48EtLxbiQQGE4Snd`, GET, activo) lista pagos con `estado='PENDIENTE_VERIFICACION'` con el alumno y horario ya joineados. `verificar-pago` (`vG5um4WhzKMrYMCX`, POST, activo) aprueba/rechaza: en `VERIFICADO` pasa el alumno de `REGISTRADO` a `ACTIVO`; en `RECHAZADO` solo marca el pago, no toca al alumno. Ambos probados de punta a punta con datos de prueba (creados y borrados en la misma sesión, no queda nada en la DB).
- Frontend nuevo: página `/pagos-pendientes` (`src/pages/PagosPendientesPage.jsx`) con tabla de pagos pendientes, link directo al comprobante (`comprobante_url`), y botones Aprobar/Rechazar con modal de confirmación + nota opcional. Agregada al menú lateral ("Pagos Pendientes"). Servicio nuevo `src/services/pagos.js`.
- `npm run build` corre sin errores. No pude verificar visualmente en navegador (sin herramienta de browser en este entorno) — falta un click-through manual del usuario antes de dar por 100% probado el UI.

### ✅ Google Drive conectado (2026-09-18)

Con la credencial `Google Drive account` (`yhmvlL3xo1slhazP`) ya creada por el usuario:

1. Creada la carpeta **"Comprobantes de Pago - Clases con Fla"** en el Drive de la cuenta (`iaclasesdeinglesconfla@gmail.com`), id `1AsYsQRTnfbnWC2kTT0DHs1EQyrWrxnit`.
2. Cerebro v2 modificado: cuando llega una imagen, ahora corre en paralelo "Analyze image" (GPT-4o-mini) y "Subir Comprobante a Drive" (sube el archivo a esa carpeta), se combinan con un nodo `Merge` + un `Code` que inyecta `comprobante_url` (el `webViewLink` de Drive) dentro del JSON que arma GPT. `Set Imagen` ahora arma el mensaje `[IMAGEN PROCESADA]: {...}` con ese JSON ya completo, incluyendo `comprobante_url` real.
3. Probado en aislado (nodo Merge + Code con datos simulados) antes de tocar el pipeline en vivo — el JSON final queda con todos los campos de GPT más `comprobante_url`, tal como espera `procesar-comprobante-pago`.
4. Los archivos quedan privados (solo accesibles por la cuenta dueña del Drive) — no se comparten públicamente, dado que son comprobantes bancarios.

**Con esto el circuito completo queda cerrado**: lead → CALIENTE → comprobante → sube a Drive → `procesar-comprobante-pago` (crea alumno REGISTRADO + pago PENDIENTE_VERIFICACION) → aparece en `/pagos-pendientes` con el link real → Fla aprueba/rechaza → alumno pasa a ACTIVO.

### ✅ Probado con un mensaje real de WhatsApp (2026-09-18) — se encontraron y corrigieron 2 bugs más

El usuario probó con un comprobante real. Aparecieron dos problemas reales, ambos corregidos y verificados contra datos de producción:

1. **El pipeline nunca descargaba el archivo multimedia.** El webhook de WhatsApp (proveedor ycloud) manda solo un JSON con un link de descarga (`whatsappInboundMessage.image.link`), nunca un binario. El `Switch` que decide audio/imagen/PDF depende de `$binary.file.mimeType`, que nunca existía — todo mensaje con imagen/audio/PDF caía silenciosamente a la rama de texto plano (por eso el bot "respondía cualquier cosa" en vez de procesar el comprobante). Esto es un bug preexistente a esta sesión, no algo introducido por los cambios de pago.
   - **Fix:** agregado un nodo IF ("Es Media") + HTTP Request ("Descargar Media") entre el filtro de broadcast y el `Switch`, que descarga el archivo desde el link (con el header `X-API-Key` de ycloud) y lo deja en `$binary.file` antes de que el `Switch` evalúe el tipo. Probado con el link real que había mandado el usuario — descarga 74KB, `image/jpeg`, correcto.

2. **La búsqueda de lead por `person_identifier` era demasiado estricta.** El agente pasó `person_identifier: "Nelson"` pero el lead en la base tenía guardado `"Nelson Rodriguez"` (nombre completo capturado en `create-lead`) — el match exacto fallaba y la tool tiraba "No existe un lead ni un alumno con ese whatsapp" a pesar de que el lead sí existía.
   - **Fix:** la búsqueda ahora usa el `person_identifier` solo para desambiguar cuando hay **más de un** lead con el mismo whatsapp (caso real: familia con varios hijos usando el WhatsApp de un padre). Si hay un solo lead para ese whatsapp, lo toma directo sin exigir que el nombre coincida exactamente. Verificado contra el registro real de Nelson en la base — ahora lo encuentra correctamente.

**Confirmado (2026-09-18):** Nelson reenvió el comprobante y el circuito de backend funcionó completo — lead encontrado, alumno creado (`REGISTRADO`), pago insertado (`PENDIENTE_VERIFICACION`, con `comprobante_url` real de Drive), y el usuario lo aprobó desde `/pagos-pendientes` (alumno pasó a `ACTIVO`, pago a `VERIFICADO`).

### ✅ Bug adicional: la Ficha del Alumno no mostraba los datos (2026-09-18)

A pesar de que los datos estaban bien guardados en la DB, la página `/alumno/:id` los mostraba vacíos: "Estado de Pago" en blanco, "Horario: Sin asignar", "Nivel"/"Origen"/"Intención" vacíos.

**Causa:** `get-alumno-by-id` (`TarOZNsZZ4q1KlbF`) tenía un `SELECT` que solo traía `id, nombre, apellido, email, whatsapp, fecha_nacimiento, categoria, tutor, horario_clase, estado, activo, created_at, updated_at` — nunca seleccionaba `nivel`, `objetivo`, `origen`, `intencion`, `estado_pago`, `fecha_pago_ultimo`, `disponibilidad`, `resumen`, `notas`, `tags`, `lead_tipo`, `completitud`, `foto_url`, aunque todas esas columnas existen y tenían datos. Esto es un bug preexistente, no algo introducido por el flujo de pagos — recién se hizo visible ahora que hay datos reales para mostrar.

Además, `procesar-comprobante-pago` vinculaba el horario solo en la tabla relacional `alumnos_horarios`, pero el dashboard lee el horario desde `alumnos.horario_clase` (texto plano, comparado por nombre) — ese campo nunca se completaba.

**Fix:**
1. `get-alumno-by-id`: se amplió el `SELECT` para incluir todas las columnas que el frontend ya esperaba.
2. `procesar-comprobante-pago`: el upsert de alumno ahora también setea `horario_clase = <nombre del horario>` (ej: "KIDS Lu-Mi"), tanto al crear como al actualizar.
3. Backfill puntual: se corrigió el registro ya existente de Nelson (`alumno.id = 2`) para que refleje el horario sin necesidad de reenviar el comprobante.

Verificado contra el endpoint real (`get-alumno-by-id?id=2`) — ahora devuelve todos los campos poblados.

---


Fuente de verdad: la instancia n8n real (`agente-fla-n8n.x5miqk.easypanel.host`), consultada vía API. Los 15 workflows realmente usados por el Cerebro activo están replicados en esta carpeta (`n8n-workflows-live/`). Los archivos sueltos en `n8n-workflows/` (raíz) están desactualizados y **no deben editarse más** — ver sección final.

## 0. Cuál Cerebro es el real

Hay dos workflows "Cerebro" activos en n8n, ambos escuchando en el mismo `webhookId` pero con paths distintos:

| Workflow | id | path webhook | tools | actualizado |
|---|---|---|---|---|
| **Cerebro v2** | `LbIjKIvn5Uqfyxa0` | `whatsapp-entrada` | 14 | 2026-09-14 (reciente) |
| Academia_Ingles_Cerebro_IA | `pBYf6cv9kCeTwEWU` | `whatsapp-entrada-v1` | 11 | 2026-09-07 (viejo) |

**"Cerebro v2" es el que está en desarrollo activo** — tiene las 4 tools más nuevas (`convertir-lead-a-alumno`, `obtener-alumno-por-nombre`, `obtener-tutor-por-nombre`, `registrar-derivacion-a-fla`) que `Academia_Ingles_Cerebro_IA` no tiene. Este último además tiene una referencia rota: la tool `obtener horarios-V1` apunta a `workflowId: "=YYfCvvBhKi16kUwV"` (con un `=` de más, típico resto de una expresión mal pegada).

⚠️ **Falta confirmar cuál de los dos paths (`whatsapp-entrada` vs `whatsapp-entrada-v1`) es el que realmente tiene configurado el puente de WhatsApp.** Si es `whatsapp-entrada` (Cerebro v2), el otro workflow debería desactivarse para evitar que alguien lo siga editando pensando que es el real.

## 1. Bugs críticos activos (rompen ejecuciones reales)

### 1.1 `registrar-pago` (`WDpCWOxaQyrKZKJZ`) — valores default violan los CHECK constraints de la tabla `pagos`

La DB real tiene estos constraints:
```
pagos_tipo_check  → tipo IN ('CUOTA_MENSUAL','PACK_4','PACK_8','INSCRIPCION','OTRO')
pagos_canal_check → canal IN ('MERCADOPAGO','TRANSFERENCIA_BCO','EFECTIVO','OTRO')
```
Pero el código del workflow usa estos defaults cuando el agente no los manda (y el prompt v6 le dice al agente que `tipo_pago` es "opcional, default mensualidad"):
```js
const tipo = tipo_pago ? ... : 'mensualidad';        // NO es un valor válido
const can = canal ? ... : 'whatsapp_comprobante';     // NO es un valor válido
```
**Resultado:** cualquier registro de pago que no mande explícitamente `tipo_pago` y `canal` con uno de los valores permitidos falla con un error de constraint de Postgres. Esto es casi seguro la causa de fallas silenciosas al registrar comprobantes.

**Fix:** cambiar los defaults a `'OTRO'` (o mapear `whatsapp_comprobante`→`TRANSFERENCIA_BCO` como default razonable ya que así llegan la mayoría de los comprobantes) y `'CUOTA_MENSUAL'` en vez de `'mensualidad'`.

### 1.2 `registrar_alumno` (`7sqOI8QKnDuVkNVN`) — tres bugs simultáneos

Esta tool (activa, wireada en Cerebro v2) hace un INSERT directo a `alumnos` sin pasar por `leads`:

- **`categoria` queda hardcodeada a `'ADULTOS'`** sin importar el input, aunque la descripción de la tool explícitamente dice que sirve para KIDS ("nombre del niño... edad... colegio..."). Cualquier lead KIDS/AU_PAIR/PERSONALIZADO registrado por acá queda mal categorizado.
- **Sin escapar comillas simples**: usa interpolación directa `'{{ $json.nombre }}'` en vez de un Code node que escape `'` → se rompe con cualquier nombre/resumen/objetivo que tenga un apóstrofo, y es un vector de SQL injection.
- **Descripción de la tool obsoleta**: dice "registrar el lead en la Google Sheet" — resto de la arquitectura pre-Postgres.

### 1.3 Conflicto arquitectónico: 3 caminos distintos para crear un alumno

Actualmente conviven, todos ejecutables por el agente:

| Tool | Gatea por pago? | Estado | Problema |
|---|---|---|---|
| `convertir-lead-a-alumno` | Se llama al elegir horario (antes del pago, según prompt v6 actual) | activa | Es la que veníamos arreglando |
| `registrar_alumno` | **No** — crea alumno con solo "confirmar que quiere anotarse" | activa | Ver 1.2, contradice la regla de negocio que definiste (alumno solo después del comprobante) |
| `registrar-alumno-existente` | No aplica (para altas manuales de alumno/tutor ya existente) | **desactivada** en Cerebro v2 | Escribe también en `alumnos_horarios` (tabla que las otras dos ignoran) |

El LLM puede elegir cualquiera de las dos activas según cómo interprete la charla — esto es probablemente la causa de comportamiento inconsistente entre conversaciones.

## 2. Hallazgo de esquema no documentado

La tabla `leads` **sí tiene** `alumno_id` y `fecha_conversion` (migración aplicada directo en prod, no está en `migrations/`). El paso "Update Lead with Alumno" de `convertir-lead-a-alumno` (que actualiza esas columnas) **no está roto** — mi sospecha inicial era incorrecta.

También existe `alumnos_horarios` (tabla puente alumno↔horario) que ni `convertir-lead-a-alumno` ni el diseño que te había propuesto (`procesar-comprobante-pago`) usan — el único vínculo alumno↔horario que dejan es `pagos.horario_id`, que es frágil (si el pago se borra/rechaza, se pierde el vínculo).

## 3. Problemas menores

- `registrar-derivacion-a-fla`: el input del sub-workflow se llama `alumn_id` (typo, falta la "o") y el nodo tool en el Cerebro tiene el mapping vacío (`value: {}`) — probablemente el parámetro nunca llega bien.
- 3 tools activas con **descripción vacía** en el Cerebro (sin guía para el LLM sobre cuándo usarlas): `obtener-alumno-por-nombre`, `obtener-tutor-por-nombre`, `registrar-derivacion-a-fla`.
- `register-pago` (`OptI5tQlHynoPvZi`, distinto de `registrar-pago`) **no es un bug** — es un webhook aparte que usa el dashboard React (`src/services/alumnos.js`) para que Fla registre pagos a mano. No está wireado al agente.
- Workflows huérfanos/duplicados en la instancia (no afectan al agente pero generan ruido): `get-conversation-logs` x2, `get-analisis-temporal` x2 (una inactiva), `obtener-alumno-por-whatsapp` x2 (una inactiva), `registrar-pago` inactiva vieja (`b7K0ZXAsKj6v8B0L`), `My workflow` / `My workflow 2`, `Tool buscar en Odoo` (inactiva), `auth-webhook-validation` (inactiva), `Academia_Ingles_Cerebro_IA` inactiva (`qygPcdsi9Xn8ulN5`).

## 4. Sobre los archivos locales del repo

`n8n-workflows/*.json` en la raíz del proyecto (incluyendo `convertir-lead-a-alumno.json` y `Academia_Ingles_Cerebro_IA.json`) están desactualizados respecto a producción — quedaron congelados en versiones previas mientras el trabajo real siguió directo en la UI de n8n. Esta carpeta (`n8n-workflows-live/`) es ahora la única que refleja el estado real; conviene tratarla como punto de partida y, más adelante, decidir si se borran o reemplazan los archivos viejos.
