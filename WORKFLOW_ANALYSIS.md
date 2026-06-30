# Análisis: Academia_Ingles_Cerebro_IA Workflow

## RESUMEN EJECUTIVO

**Workflow**: Academia_Ingles_Cerebro_IA
**Total de nodos**: 57
**Estado**: Activo en producción
**Problema**: 4 webhooks críticos faltantes para integración con backend

---

## 1. ARQUITECTURA ACTUAL

### Flujo Principal de Mensajes

```
WhatsApp Message
    ↓
Webhook(recibir whasaap)
    ↓
Code (JavaScript) - Filtrado
    ↓
Buscar contacto (Chatwoot)
    ↓
IF: existe contacto
    ├─ TRUE  → Buscar conversacion
    └─ FALSE → Crea contacto ← [FALTA: /webhook/create-lead]
    ↓
IF: existe conversacion
    ├─ TRUE  → Use existing
    └─ FALSE → Crear conversacion
    ↓
Merge (context)
    ↓
Media Processing (audio/image/file)
    ↓
Clasificador (Intent - LLM GPT-4o)
    ↓
Switch (route by intent)
    ↓
Coordinador Academia (Main Agent)
    ├─ registrar_alumno ← [FALTA: /webhook/create-alumno]
    ├─ etiquetar-alumno ← [FALTA: /webhook/update-lead]
    ├─ obtener-alumno-por-whatsapp
    ├─ validar-comprobante-pago
    ├─ registrar-pago
    └─ Informacion/Horarios
    ↓
Enviar mensaje texto (Chatwoot)
    ↓
Enviar a WhatsApp (bridge)
    ↓
conversation_log (Postgres INSERT) ← [OPCIONAL: /webhook/save-conversation-log]
    ↓
Delete Buffer (Redis cleanup)
```

### Nodos Clave por Categoría

**Entrada & Filtrado (4)**:
- Webhook(recibir whasaap) [webhook]
- Code in JavaScript [code]
- es incoming1, es outgoing1, ¿es broadcast? [if]

**Gestión Chatwoot (6)**:
- Buscar contacto [httpRequest]
- existe contacto [if]
- Crea contacto [httpRequest] ← CREATE-LEAD TRIGGER
- Buscar conversacion [httpRequest]
- existe conversacion [if]
- Crear conversacion [httpRequest]

**Procesamiento Media (3)**:
- Transcribe audio [openAi]
- Extract from File [extractFromFile]
- Analyze image [openAi]

**Clasificación (2)**:
- OpenAI Chat Model1 [lmChatOpenAi - GPT-4o]
- Clasificador [agent]

**Agent Principal (1)**:
- Coordinador Academia [agent] ← MAIN DECISION POINT

**Herramientas del Agent (9)**:
- registrar_alumno [toolWorkflow] ← CREATE-ALUMNO TRIGGER
- obtener-alumno-por-whatsapp [toolWorkflow]
- validar-comprobante-pago [toolWorkflow]
- registrar-pago [toolWorkflow]
- etiquetar-alumno [toolWorkflow] ← UPDATE-LEAD TRIGGER
- Informacion [toolWorkflow]
- Informacion_2 [toolWorkflow]
- obtener horarios [toolWorkflow]
- obtener horarios-V1 [toolWorkflow]

**Memoria/Integraciones (3)**:
- Postgres Chat Memory [memoryPostgresChat]
- RepoMemory Recall [httpRequest]
- RepoMemory Save Memory [httpRequest]

**Almacenamiento (1)**:
- conversation_log [postgres]

**Respuesta (2)**:
- Enviar mensaje texto [httpRequest]
- Enviar a WhatsApp [httpRequest]

**Redis/Buffer/Wait (11)**:
- Redis nodes (4)
- Delete Buffer nodes (2)
- Wait nodes (2)
- Set/Edit Fields (3+)

---

## 2. ALMACENAMIENTO DE DATOS

### Sistema Actual

**Chatwoot API**: 
- Contacts: buscar/crear contactos
- Conversations: buscar/crear conversaciones
- Messages: enviar mensajes de respuesta

**PostgreSQL conversation_log**:
```sql
INSERT INTO conversation_log (
  whatsapp,           -- phone number
  direccion,          -- ENTRANTE | SALIENTE
  tipo_media,         -- TEXTO | AUDIO | IMAGEN | PDF
  mensaje_preview,    -- message content
  lead_tipo,          -- user type classification
  intencion,          -- intent from Clasificador
  created_at          -- timestamp
) VALUES (...)
```

**PostgreSQL Chat Memory**:
- Stores conversation history for LLM context
- Managed by memoryPostgresChat node

**RepoMemory** (External):
- Stores user-specific info/preferences
- Recall and Save operations via HTTP

---

## 3. WEBHOOKS FALTANTES

### WEBHOOK 1: /webhook/create-lead

**Propósito**: Crear registro de lead cuando nuevo contacto WhatsApp se comunica

**Trigger Node**: "Crea contacto"
- Type: httpRequest
- Node ID: 80492740-782b-487b-8f8d-edfc771b0495
- Position: X=1840, Y=1024
- URL actual: POST http://chatwoot:3000/api/v1/accounts/1/contacts

**Cuándo Ocurre**:
1. Usuario envía mensaje por WhatsApp
2. Workflow busca contacto en Chatwoot
3. NO encuentra (existe contacto = FALSE)
4. Crea contacto en Chatwoot
5. **[FALTA]** Llamar webhook create-lead

**Acción Requerida**:
- Add HTTP Request node after "Crea contacto"
- Method: POST
- URL: http://localhost:3000/webhook/create-lead
- Payload:
```json
{
  "whatsapp": "{{ $node['Webhook(recibir whasaap)'].json.body.sender }}",
  "nombre": "{{ $node['Webhook(recibir whasaap)'].json.body.nombre }}",
  "phone": "{{ $node['Webhook(recibir whasaap)'].json.body.sender }}",
  "contact_id_chatwoot": "{{ $node['Crea contacto'].json.payload.contact.id }}",
  "inbox_id": 1,
  "timestamp": "{{ new Date().toISOString() }}"
}
```

**Acción en Backend**:
- INSERT into leads table
- estado = "NUEVO"
- estado_motivo = null
- fecha_creacion = timestamp
- source = "whatsapp"

---

### WEBHOOK 2: /webhook/create-alumno

**Propósito**: Crear registro de alumno cuando usuario completa registro académico

**Trigger Node**: "registrar_alumno"
- Type: toolWorkflow
- Node ID: 5d16b260-08bf-4fc5-8f48-92c006075725
- Position: X=4448, Y=1568

**Cuándo Ocurre**:
1. Usuario selecciona opción de registro
2. Coordinador Academia llama registrar_alumno
3. Completa registro académico
4. **[FALTA]** Llamar webhook create-alumno

**Acción Requerida**:
- Add HTTP Request node after "registrar_alumno"
- Method: POST
- URL: http://localhost:3000/webhook/create-alumno
- Payload:
```json
{
  "whatsapp": "{{ $node['Webhook(recibir whasaap)'].json.body.sender }}",
  "nombre": "{{ $node['registrar_alumno'].json.nombre }}",
  "email": "{{ $node['registrar_alumno'].json.email }}",
  "lead_id": "{{ lead_id from context }}",
  "tipo_clase": "{{ $node['registrar_alumno'].json.tipo_clase }}",
  "nivel": "{{ $node['registrar_alumno'].json.nivel }}",
  "edad": "{{ $node['registrar_alumno'].json.edad }}",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

**Acción en Backend**:
- INSERT into alumnos table
- UPDATE leads: estado = "ACTIVO", alumno_id = new_id
- Initialize progress tracking
- Send confirmation email

---

### WEBHOOK 3: /webhook/update-lead

**Propósito**: Actualizar estado del lead cuando cambia de clasificación

**Trigger Node**: "etiquetar-alumno"
- Type: toolWorkflow
- Node ID: f694fb58-402d-4947-b314-a3254d915cb1
- Position: X=4256, Y=1568

**Cuándo Ocurre**:
1. Coordinador Academia evalúa calificación del lead
2. etiquetar-alumno ejecuta y actualiza etiquetas/estado
3. **[FALTA]** Llamar webhook update-lead

**Estados de Lead**:
- NUEVO → FRIO → TIBIO → CALIENTE → ACTIVO
- PAUSADO (anytime)
- BAJA (anytime)

**Acción Requerida**:
- Add HTTP Request node after "etiquetar-alumno"
- Method: POST
- URL: http://localhost:3000/webhook/update-lead
- Payload:
```json
{
  "whatsapp": "{{ $node['Webhook(recibir whasaap)'].json.body.sender }}",
  "estado_anterior": "{{ lead current estado }}",
  "estado_nuevo": "{{ $node['etiquetar-alumno'].json.nuevo_estado }}",
  "etiquetas": "{{ $node['etiquetar-alumno'].json.etiquetas }}",
  "tags_array": ["KIDS", "ADULTOS", "AU_PAIR", "PERSONALIZADO"],
  "razon": "{{ agent reasoning }}",
  "puntuacion": "{{ lead score }}",
  "timestamp": "{{ new Date().toISOString() }}"
}
```

**Acción en Backend**:
- UPDATE leads: estado = estado_nuevo
- Update tags array
- Log audit trail
- Trigger CRM actions if needed
- Send notifications to sales team (if qualified)

---

### WEBHOOK 4: /webhook/save-conversation-log (OPCIONAL)

**Propósito**: Guardar log de conversación en backend (redundancia con Postgres directo)

**Trigger Node**: "conversation_log"
- Type: postgres
- Node ID: e1202e55-38ee-41ea-be4d-5a56f27117d8
- Position: X=3424, Y=880

**Estado Actual**:
- El workflow YA hace INSERT directo a PostgreSQL
- No hay llamada HTTP a backend

**Opción A - MANTENER COMO ESTÁ (RECOMENDADO)**:
- Direct Postgres insert es más rápido
- No agregar webhook call
- Skip this integration

**Opción B - AGREGAR WEBHOOK ASYNC (OPCIONAL)**:
- Add HTTP Request node after "conversation_log"
- Method: POST
- URL: http://localhost:3000/webhook/save-conversation-log
- Async execution (fire and forget)
- Error handling: Continue on error

**Nota**: Solo útil para external logging, third-party analytics, audit trails.

---

## 4. PUNTOS DE MODIFICACIÓN ESPECÍFICOS

### Modificación 1: Después de "Crea contacto"

**Node ID**: 80492740-782b-487b-8f8d-edfc771b0495

Current connections:
```json
connections["Crea contacto"] = {
  "main": [
    { "node": "Buscar conversacion", "index": 1 }
  ]
}
```

New connections:
```json
connections["Crea contacto"] = {
  "main": [
    { "node": "[NEW HTTP NODE ID]", "index": 0 },
    { "node": "Buscar conversacion", "index": 1 }
  ]
}

connections["[NEW HTTP NODE]"] = {
  "main": [
    { "node": "Buscar conversacion", "index": 0 }
  ]
}
```

---

### Modificación 2: Después de "registrar_alumno"

**Node ID**: 5d16b260-08bf-4fc5-8f48-92c006075725

Current connections:
```json
connections["registrar_alumno"] = {
  "ai_tool": [
    { "node": "next_node", "index": 0 }
  ]
}
```

New connections:
```json
connections["registrar_alumno"] = {
  "ai_tool": [
    { "node": "[NEW HTTP NODE ID]", "index": 0 }
  ]
}

connections["[NEW HTTP NODE]"] = {
  "main": [
    { "node": "next_node", "index": 0 }
  ]
}
```

---

### Modificación 3: Después de "etiquetar-alumno"

**Node ID**: f694fb58-402d-4947-b314-a3254d915cb1

Current connections:
```json
connections["etiquetar-alumno"] = {
  "ai_tool": [
    { "node": "next_node", "index": 0 }
  ]
}
```

New connections:
```json
connections["etiquetar-alumno"] = {
  "ai_tool": [
    { "node": "[NEW HTTP NODE ID]", "index": 0 }
  ]
}

connections["[NEW HTTP NODE]"] = {
  "main": [
    { "node": "next_node", "index": 0 }
  ]
}
```

---

## 5. RESUMEN DE CAMBIOS

### Critical (Must Add)

- [ ] HTTP Request node: `/webhook/create-lead`
  - Position: X=1960, Y=1024 (after Crea contacto)
  - Trigger: New contact creation in Chatwoot
  
- [ ] HTTP Request node: `/webhook/create-alumno`
  - Position: X=4568, Y=1568 (after registrar_alumno)
  - Trigger: Student registration completion
  
- [ ] HTTP Request node: `/webhook/update-lead`
  - Position: X=4376, Y=1568 (after etiquetar-alumno)
  - Trigger: Lead status/classification change

### Optional (Can Skip)

- [ ] HTTP Request node: `/webhook/save-conversation-log`
  - (Only if async logging needed beyond Postgres direct insert)

**Total new nodes**: 3 critical + 1 optional = 4 HTTP Request nodes

---

## 6. PRÓXIMAS ACCIONES

1. Export workflow JSON from n8n
2. Add 4 new HTTP Request nodes with correct configuration
3. Update connections in workflow JSON
4. Import modified workflow back to n8n
5. Test in staging environment:
   - Send test WhatsApp message → verify /create-lead webhook called
   - Complete registration flow → verify /create-alumno webhook called
   - Change lead status → verify /update-lead webhook called
6. Deploy to production

---

## 7. ARCHIVOS RELEVANTES

Original workflow JSON file (172KB):
- `C:\Users\REMOTEC PC1\.claude\projects\c--Proyectos-Scal-IA--Startup--Ingles-con-Fla-fla-project\a492472e-a677-47c0-b2e0-e3ebb4d40387\tool-results\b04w1pk1a.txt`

Workflow name in n8n: `Academia_Ingles_Cerebro_IA`
Workflow ID: `pBYf6cv9kCeTwEWU`

---

**Análisis completado**: 2026-06-29
**Analizador**: Claude Code Agent
