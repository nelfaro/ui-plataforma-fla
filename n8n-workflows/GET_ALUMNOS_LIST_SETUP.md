# Configuración del Workflow: get-alumnos-list

## 📋 Descripción General

Este workflow obtiene la lista de alumnos desde PostgreSQL con soporte para búsqueda, filtrado y paginación. Es usado por la página de Gestión de Alumnos en la UI.

---

## 🔵 FLUJO: OBTENER LISTA DE ALUMNOS (GET)

### Nodos del flujo:
```
Webhook (GET) → arma query (Code) → Select Alumnos (Postgres) → respuesta (Code)
                                 ↓
                         Count Total (Postgres)
```

---

### **Nodo 1: Webhook**
- **Tipo:** Webhook
- **Método:** GET
- **Ruta:** `/get-alumnos-list`
- **Descripción:** Punto de entrada para solicitar la lista de alumnos

**Parámetros de Query soportados:**
- `search` (opcional): Busca en nombre, whatsapp, email
- `estado` (opcional): Filtra por estado del alumno
- `lead_tipo` (opcional): Filtra por categoría/tipo de lead
- `limit` (opcional, default=50): Cantidad de registros por página
- `offset` (opcional, default=0): Desplazamiento para paginación

**Ejemplos:**
```
GET /get-alumnos-list
GET /get-alumnos-list?search=Juan
GET /get-alumnos-list?estado=ACTIVO&lead_tipo=KIDS
GET /get-alumnos-list?limit=20&offset=0
```

---

### **Nodo 2: arma query (Code)**
- **Tipo:** Code
- **Descripción:** Construye dinámicamente las queries SQL con los filtros recibidos

**Código:**
```javascript
const input = $input.first().json;
const query = input.query || {};
const { search, estado, lead_tipo, limit = 50, offset = 0 } = query;

const searchPattern = search ? `%${search}%` : '%';

const queryList = `SELECT id, nombre, whatsapp, email, estado, lead_tipo, 
       horario_clase, foto_url, fecha_registro, ultimo_contacto
FROM alumnos
WHERE (nombre ILIKE '${searchPattern}' OR whatsapp ILIKE '${searchPattern}' OR email ILIKE '${searchPattern}')
AND (${estado ? `estado = '${estado}'` : 'true'})
AND (${lead_tipo ? `lead_tipo = '${lead_tipo}'` : 'true'})
ORDER BY fecha_registro DESC
LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)};`;

const queryCount = `SELECT COUNT(*) as total
FROM alumnos
WHERE (nombre ILIKE '${searchPattern}' OR whatsapp ILIKE '${searchPattern}' OR email ILIKE '${searchPattern}')
AND (${estado ? `estado = '${estado}'` : 'true'})
AND (${lead_tipo ? `lead_tipo = '${lead_tipo}'` : 'true'});`;

return [{
  json: {
    queryList,
    queryCount,
    limit,
    offset
  }
}];
```

**Salida:** Objeto con las dos queries construidas y los parámetros de paginación.

---

### **Nodo 3: Select Alumnos (Postgres)**
- **Tipo:** Postgres
- **Operación:** Execute Query
- **Query:** `{{ $('arma query').first().json.queryList }}`

**Retorna:** Array de alumnos con los campos:
- `id`: ID del alumno
- `nombre`: Nombre completo
- `whatsapp`: Número de WhatsApp
- `email`: Email
- `estado`: Estado (NUEVO, ACTIVO, BAJA, etc.)
- `lead_tipo`: Categoría (KIDS, ADULTOS, AU_PAIR, etc.)
- `horario_clase`: Horario asignado
- `foto_url`: URL de foto de perfil
- `fecha_registro`: Fecha de registro
- `ultimo_contacto`: Último contacto

---

### **Nodo 4: Count Total (Postgres)**
- **Tipo:** Postgres
- **Operación:** Execute Query
- **Query:** `{{ $('arma query').first().json.queryCount }}`

**Retorna:** Un objeto con `total` (cantidad total de registros que coinciden con los filtros)

---

### **Nodo 5: respuesta (Code)**
- **Tipo:** Code
- **Descripción:** Formatea la respuesta final

**Código:**
```javascript
const items = $('Select Alumnos').all().map(row => row.json);
const totalData = $('Count Total').first().json;
const total = totalData.total;
const limit = $input.first().json.limit;
const offset = $input.first().json.offset;

return [{
  json: {
    items,
    total,
    limit,
    offset
  }
}];
```

**Respuesta al usuario:**
```json
{
  "items": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "whatsapp": "+54 9 376 123456",
      "email": "juan@email.com",
      "estado": "ACTIVO",
      "lead_tipo": "KIDS",
      "horario_clase": "Miércoles 16:00",
      "foto_url": "https://...",
      "fecha_registro": "2026-05-14T10:30:45.123Z",
      "ultimo_contacto": "2026-05-14T15:00:00.000Z"
    }
  ],
  "total": 45,
  "limit": 50,
  "offset": 0
}
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [x] Workflow creado en n8n (en backup del 28-04-26)
- [x] Webhook GET configurado en path `/get-alumnos-list`
- [x] Credencial PostgreSQL conectada
- [x] Nodos Postgres ejecutan queries dinámicas
- [x] Soporte para búsqueda, filtrado y paginación
- [x] Workflow está activo
- [x] Servicio React convertido a estructura correcta: `alumnos` en lugar de `items`

---

## 🧪 TESTING

### Test GET sin filtros
```bash
curl -X GET "https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-alumnos-list"
```

### Test con búsqueda
```bash
curl -X GET "https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-alumnos-list?search=Juan"
```

### Test con filtros
```bash
curl -X GET "https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-alumnos-list?estado=ACTIVO&lead_tipo=KIDS&limit=20"
```

---

## 🔗 Integración con la App

### Desde React (AlumnosPage):
```javascript
// El servicio convierte la respuesta a:
// { alumnos: [...], total, limit, offset }
const response = await getAlumnosList();
const alumnosList = response.alumnos || [];

// Con filtros y paginación:
const response = await getAlumnosList({
  search: 'Juan',
  estado: 'ACTIVO',
  lead_tipo: 'KIDS',
  limit: 20,
  offset: 0
});
```

---

## ⚠️ Notas Importantes

1. **Búsqueda:** Usa ILIKE para búsqueda case-insensitive en nombre, whatsapp y email
2. **Filtros:** Son opcionales, si no se especifican trae todos los registros
3. **Paginación:** Importante para grandes volúmenes de datos
4. **Performance:** Los índices en BD deben estar optimizados para fields: nombre, whatsapp, email, estado, lead_tipo
