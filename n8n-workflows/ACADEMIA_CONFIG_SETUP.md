# Configuración del Workflow: academia-config-crud

## 📋 Descripción General

Este workflow maneja dos operaciones:
1. **GET** - Obtener la configuración actual de la academia
2. **POST/PUT** - Actualizar la configuración de la academia

---

## 🔵 FLUJO 1: OBTENER CONFIGURACIÓN (GET)

### Nodos del flujo GET:
```
Webhook (GET) → Get Config (Code) → Postgres (Query) → Format Response (Code)
```

### **Nodo 1: Webhook**
- **Tipo:** Webhook
- **Método:** GET
- **Ruta:** `/academia-config`
- **Descripción:** Punto de entrada para solicitar la configuración

**Configuración:**
```
- HTTP Method: GET
- Path: academia-config
```

---

### **Nodo 2: Get Config (Opcional - solo si necesitas código previo)**
- **Tipo:** Code
- **Código:**
```javascript
return [{ json: {} }];
```
- **Descripción:** Simplemente pasa la solicitud al siguiente nodo

---

### **Nodo 3: Postgres (Ejecutar Query)**
- **Tipo:** Postgres
- **Operación:** Execute Query
- **Query:**
```sql
SELECT * FROM academia_config ORDER BY id DESC LIMIT 1;
```

**Configuración:**
- Credencial: `postgres` (tu conexión PostgreSQL)
- Query: La SQL anterior
- Retorna un objeto con todos los campos de academia_config

---

### **Nodo 4: Format Response (Code)**
- **Tipo:** Code
- **Código:**
```javascript
return [{
  json: {
    config: $input.first().json
  }
}];
```

**Descripción:** Envuelve la respuesta en un objeto `{ config: {...} }`

**Respuesta al usuario:**
```json
{
  "config": {
    "id": 1,
    "nombre_academia": "Clases de Inglés con Fla",
    "nombre_profe": "Flabia Diez",
    "email": "...",
    ...
  }
}
```

---

## 🟣 FLUJO 2: ACTUALIZAR CONFIGURACIÓN (POST)

### Nodos del flujo POST:
```
Webhook (POST) → Build Update Query (Code) → Execute Update (Postgres) → Format Update Response (Code)
```

### **Nodo 1: Webhook Update**
- **Tipo:** Webhook
- **Método:** POST
- **Ruta:** `/academia-config`
- **Descripción:** Recibe los datos actualizados

**Configuración:**
```
- HTTP Method: POST
- Path: academia-config
```

**Esperado:**
```json
{
  "nombre_academia": "Clases de Inglés con Fla",
  "nombre_profe": "Flabia Diez",
  "email": "fla@email.com",
  "telefono": "+54 9 376 ...",
  "ubicacion_direccion": "Vargas Gómez 1667",
  "ubicacion_localidad": "Corrientes, Argentina",
  "horario_atencion": "Lun-Vie 9-20hs",
  "banco": "Banco de Corrientes",
  "cbu": "0940099366005413330032",
  "alias": "flabia.diez",
  "linktree_url": "https://...",
  "instagram": "@flabiadiez",
  "facebook": "Fla Inglés",
  "politica_cancelacion": "48 horas",
  "politica_recuperacion": "En otros grupos",
  "politica_reembolso": "..."
}
```

---

### **Nodo 2: Build Update Query (Code)**
- **Tipo:** Code
- **Código:**
```javascript
const body = $input.first().json.body;

const query = `
  UPDATE academia_config SET 
    nombre_academia = $1,
    nombre_profe = $2,
    email = $3,
    telefono = $4,
    ubicacion_direccion = $5,
    ubicacion_localidad = $6,
    horario_atencion = $7,
    banco = $8,
    cbu = $9,
    alias = $10,
    linktree_url = $11,
    instagram = $12,
    facebook = $13,
    politica_cancelacion = $14,
    politica_recuperacion = $15,
    politica_reembolso = $16,
    updated_at = NOW()
  WHERE id = 1
  RETURNING *;
`;

return [{
  json: {
    query: query,
    values: [
      body.nombre_academia,
      body.nombre_profe,
      body.email,
      body.telefono,
      body.ubicacion_direccion,
      body.ubicacion_localidad,
      body.horario_atencion,
      body.banco,
      body.cbu,
      body.alias,
      body.linktree_url,
      body.instagram,
      body.facebook,
      body.politica_cancelacion,
      body.politica_recuperacion,
      body.politica_reembolso
    ]
  }
}];
```

**Descripción:** 
- Extrae el body del webhook
- Construye la query UPDATE con placeholders ($1, $2, etc.)
- Pasa la query y los valores al siguiente nodo

---

### **Nodo 3: Execute Update (Postgres)**
- **Tipo:** Postgres
- **Operación:** Execute Query
- **Query:** `{{ $input.first().json.query }}`
- **Values:** `{{ $input.first().json.values }}`

**Configuración:**
- Credencial: `postgres`
- Query: Usa la query del nodo anterior
- Query Parameters: Usa los values del nodo anterior

**Descripción:** Ejecuta el UPDATE con los parámetros seguros

---

### **Nodo 4: Format Update Response (Code)**
- **Tipo:** Code
- **Código:**
```javascript
return [{
  json: {
    success: true,
    config: $input.first().json
  }
}];
```

**Descripción:** Envuelve la respuesta con un flag de éxito

**Respuesta al usuario:**
```json
{
  "success": true,
  "config": {
    "id": 1,
    "nombre_academia": "Clases de Inglés con Fla",
    ...
    "updated_at": "2026-05-14T10:30:45.123Z"
  }
}
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### General
- [ ] Workflow creado en n8n
- [ ] Dos webhooks configurados (GET y POST)
- [ ] Credencial PostgreSQL conectada

### Flujo GET
- [ ] Webhook GET en path `/academia-config`
- [ ] Nodo Postgres ejecuta: `SELECT * FROM academia_config ORDER BY id DESC LIMIT 1`
- [ ] Format Response envuelve en `{ config: {...} }`

### Flujo POST
- [ ] Webhook POST en path `/academia-config`
- [ ] Build Update Query construye la query UPDATE con 16 parámetros
- [ ] Execute Update usa query y values del nodo anterior
- [ ] Format Update Response retorna `{ success: true, config: {...} }`

---

## 🧪 TESTING

### Test GET
```bash
curl -X GET "https://tu-n8n.com/webhook/academia-config"
```

Esperado:
```json
{
  "config": {
    "id": 1,
    "nombre_academia": "Clases de Inglés con Fla",
    ...
  }
}
```

### Test POST
```bash
curl -X POST "https://tu-n8n.com/webhook/academia-config" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_academia": "Clases de Inglés con Fla",
    "nombre_profe": "Flabia Diez",
    ...
  }'
```

Esperado:
```json
{
  "success": true,
  "config": {
    "id": 1,
    ...
  }
}
```

---

## 🔗 Integración con la App

### Desde React (SettingsPage):
```javascript
// GET - Cargar configuración
const response = await axios.get(
  'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/academia-config'
);
const config = response.data.config;

// POST - Guardar configuración
const response = await axios.post(
  'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/academia-config',
  {
    nombre_academia: "...",
    nombre_profe: "...",
    ...
  }
);
```

### Desde Agente Fla:
```
Tool: obtener-info-academia
→ Llamada GET a /academia-config
→ Retorna config
→ Agente responde naturalmente
```

---

## ⚠️ Notas Importantes

1. **ID fijo:** El UPDATE siempre actualiza `WHERE id = 1` (configuración principal)
2. **Seguridad:** Los parámetros usan placeholders ($1, $2...) para evitar SQL injection
3. **Timestamp:** Se actualiza automáticamente `updated_at = NOW()`
4. **Respuesta:** El RETURNING * retorna todos los campos actualizados
