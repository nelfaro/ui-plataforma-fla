# Configuración del Workflow: get-alumnos-list

## 📋 Descripción General

Este workflow obtiene la lista completa de alumnos desde la tabla PostgreSQL `alumnos` para que la UI pueda mostrar la gestión de alumnos con todos los datos reales.

---

## 🔵 FLUJO: OBTENER LISTA DE ALUMNOS (GET)

### Nodos del flujo:
```
Webhook (GET) → Postgres (Query) → Format Response (Code)
```

### **Nodo 1: Webhook**
- **Tipo:** Webhook
- **Método:** GET
- **Ruta:** `/get-alumnos-list`
- **Descripción:** Punto de entrada para solicitar la lista de alumnos

**Configuración:**
```
- HTTP Method: GET
- Path: get-alumnos-list
```

---

### **Nodo 2: Execute a SQL query (Postgres)**
- **Tipo:** Postgres
- **Operación:** Execute Query
- **Query:**
```sql
SELECT id, nombre, nombre_contacto, email, telefono, categoria, lead_tipo, estado, created_at, updated_at, horario_clase, pago_estado, ultimo_pago FROM alumnos ORDER BY created_at DESC;
```

**Configuración:**
- Credencial: `postgres` (tu conexión PostgreSQL)
- Query: La SQL anterior
- Retorna un array con todos los alumnos

---

### **Nodo 3: Format Response (Code)**
- **Tipo:** Code
- **Código:**
```javascript
const alumnos = $input.all().map(item => item.json);

return [{
  json: {
    alumnos: alumnos
  }
}];
```

**Descripción:** Envuelve la respuesta en un objeto `{ alumnos: [...] }`

**Respuesta al usuario:**
```json
{
  "alumnos": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "nombre_contacto": "Carlos Pérez",
      "email": "juan@email.com",
      "telefono": "+54 9 376 ...",
      "categoria": "KIDS",
      "lead_tipo": "KIDS",
      "estado": "ACTIVO",
      "created_at": "2026-05-14T10:30:45.123Z",
      "updated_at": "2026-05-14T10:30:45.123Z",
      "horario_clase": "Miércoles 16:00",
      "pago_estado": "PAGADO",
      "ultimo_pago": "2026-05-10"
    },
    ...
  ]
}
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] Workflow creado en n8n
- [ ] Webhook GET configurado en path `/get-alumnos-list`
- [ ] Credencial PostgreSQL conectada
- [ ] Nodo Postgres ejecuta la query SELECT correcta
- [ ] Format Response envuelve en `{ alumnos: [...] }`
- [ ] Workflow está activo (Active: true)

---

## 🧪 TESTING

### Test GET
```bash
curl -X GET "https://tu-n8n.com/webhook/get-alumnos-list"
```

Esperado:
```json
{
  "alumnos": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      ...
    },
    ...
  ]
}
```

---

## 🔗 Integración con la App

### Desde React (AlumnosPage):
```javascript
// GET - Cargar lista de alumnos
const response = await getAlumnosList();
const alumnos = response.alumnos;

// Los alumnos se muestran en:
// - Tab "Por Categoría": agrupa por categoria/lead_tipo
// - Tab "Por Horario": agrupa por horario_clase
// - Tab "Funnel por Categoría": cuenta por estado
// - Tab "Estado de Pagos": filtra por estado = 'ACTIVO' y muestra pago_estado
// - Tab "Análisis Temporal": filtra por fecha created_at
```

---

## ⚠️ Notas Importantes

1. **Campos devueltos:** La query retorna los principales campos de la tabla alumnos
2. **Ordenamiento:** Los alumnos se ordenan por fecha de creación descendente (más nuevos primero)
3. **Sin filtros:** Este endpoint devuelve TODOS los alumnos sin filtros. Los filtros se aplican en React.
4. **Performance:** Si hay muchos alumnos, considera agregar paginación en el futuro
