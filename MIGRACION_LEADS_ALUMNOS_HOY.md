# 🚀 Migración: Separar Leads de Alumnos
**Tiempo estimado: 2 horas**  
**Riesgo: Bajo (backup recomendado)**

---

## PASO 1: Backup de Base de Datos (5 min)

```bash
# En tu terminal, conectate a la BD y haz backup
pg_dump -h [HOST] -U [USER] -d fla_db > backup_leads_alumnos_$(date +%Y%m%d_%H%M%S).sql
```

**Importante**: Guarda ese archivo en un lugar seguro.

---

## PASO 2: Ejecutar Migración SQL (5 min)

**Opción A: Desde DBeaver o PgAdmin**
1. Abrir herramienta de BD
2. Conectarse a la BD `fla_db`
3. Copiar y pegar todo el contenido de:  
   `migrations/003_separate_leads_from_alumnos.sql`
4. Ejecutar (Ctrl+Enter o botón Run)
5. Verificar que muestre: "total_leads: XX", "total_alumnos: YY"

**Opción B: Desde terminal psql**
```bash
psql -h [HOST] -U [USER] -d fla_db -f migrations/003_separate_leads_from_alumnos.sql
```

**Output esperado:**
```
CREATE TABLE
INSERT 0 [número]
DELETE [número]
ALTER TABLE
CREATE INDEX [múltiples]
 total_leads | total_alumnos | distinct_lead_estados | distinct_alumno_estados
-----------+---------------+-----------------------+------------------------
    XX      |      YY        |           4           |            4
```

---

## PASO 3: Actualizar Workflows n8n (60 min)

### 3.1 Workflow `get-leads-pipeline` (NUEVO - ya creado en JSON)

**Import en n8n**:
1. Ir a https://asistente-ia-fla-n8n.x5miqk.easypanel.host
2. Click "Import" → Select file  
3. Subir: `n8n-workflows/get-leads-pipeline.json`
4. **Importante**: Asegurar que el nodo PostgreSQL apunta a la BD correcta
5. Guardar y activar

**Query SQL (ya incluida)**:
```sql
SELECT 
  id, nombre, whatsapp, estado, nivel, origen, lead_tipo,
  objetivo, resumen, tags, disponibilidad, completitud,
  primera_consulta, ultimo_contacto
FROM leads
WHERE ($1::text IS NULL OR estado = $1)
  AND ($2::text IS NULL OR origen = $2)
  AND ($3::text IS NULL OR lead_tipo = $3)
ORDER BY ultimo_contacto DESC NULLS LAST
LIMIT 100
```

---

### 3.2 Workflow `get-alumnos-list` (ACTUALIZAR EXISTENTE)

**Cambios necesarios**:

**Query ANTERIOR**:
```sql
SELECT * FROM alumnos
WHERE ($1::text IS NULL OR estado = $1)
  AND ($2::text IS NULL OR origen = $2)
  AND ($3::text IS NULL OR lead_tipo = $3)
```

**Query NUEVA**:
```sql
SELECT 
  id, nombre, whatsapp, email, estado, lead_tipo,
  nivel, objetivo, resumen, tags,
  disponibilidad, completitud,
  fecha_registro, fecha_activacion, ultimo_contacto, created_at, updated_at
FROM alumnos
WHERE ($1::text IS NULL OR estado = $1)
  AND ($2::text IS NULL OR origen = $2)
  AND ($3::text IS NULL OR lead_tipo = $3)
  AND estado IN ('REGISTRADO','ACTIVO','PAUSADO','BAJA')
ORDER BY fecha_activacion DESC NULLS LAST
LIMIT 100
```

**Pasos en n8n**:
1. Abrir workflow `get-alumnos-list`
2. Click en nodo PostgreSQL
3. Reemplazar query con la nueva
4. Guardar
5. Test: GET `/webhook/get-alumnos-list` → debe retornar solo alumnos (no leads)

---

### 3.3 Crear Workflow `convert-lead-to-alumno` (NUEVO - crear en n8n)

**Propósito**: Cuando un lead se convierte (paga), moverlo a alumnos

**Nodo 1: Webhook**
- Method: POST
- Path: `/convert-lead-to-alumno`

**Nodo 2: JavaScript**
```javascript
const input = $input.first().json;
const leadId = input.lead_id;
const alumnoData = input;

return [{
  json: {
    leadId,
    alumnoData,
    queryInsert: `
      INSERT INTO alumnos (
        nombre, whatsapp, email, estado, lead_tipo,
        nivel, objetivo, resumen, tags, disponibilidad,
        fecha_registro, fecha_activacion, primer_contacto, ultimo_contacto
      )
      SELECT
        nombre, whatsapp, email, 'REGISTRADO', lead_tipo,
        nivel, objetivo, resumen, tags, disponibilidad,
        NOW(), NOW(), primera_consulta, ultimo_contacto
      FROM leads
      WHERE id = '${leadId}'
      RETURNING *;
    `,
    queryDelete: `DELETE FROM leads WHERE id = '${leadId}';`
  }
}];
```

**Nodo 3: PostgreSQL (INSERT)**
- Ejecutar: `{{ $2.json.queryInsert }}`

**Nodo 4: PostgreSQL (DELETE)**
- Ejecutar: `{{ $2.json.queryDelete }}`

**Nodo 5: Response**
- Retornar resultado del INSERT

---

### 3.4 Actualizar Workflow `etiquetar-alumno` (INVESTIGAR)

Este workflow probablemente actualiza el estado de un alumno. Necesita:

**Si actualiza a estado REGISTRADO**:
```javascript
// Primero verificar si es un LEAD (estado NUEVO/FRIO/TIBIO/CALIENTE)
// Si es LEAD y cambia a REGISTRADO → llamar convert-lead-to-alumno
// Si es ALUMNO y cambia de estado → actualizar en tabla alumnos
```

---

## PASO 4: Actualizar Frontend (20 min)

### 4.1 DirectorioAlumnosPage.jsx

**Cambio 1** - Remover estados de LEADS (línea ~21):
```javascript
// ANTES
const estados = [
  'NUEVO',
  'FRIO',
  'TIBIO',
  'CALIENTE',
  'REGISTRADO',
  'ACTIVO',
  'PAUSADO',
  'BAJA'
];

// DESPUÉS
const estados = [
  'REGISTRADO',
  'ACTIVO',
  'PAUSADO',
  'BAJA'
];
```

**Cambio 2** - El filtro de categoría ahora es solo `lead_tipo` (sin cambios reales, ya está así)

---

### 4.2 AlumnosPage.jsx

**No requiere cambios** (ya consulta alumnos, solo alumnos registrados)

---

### 4.3 LeadsPage.jsx

**No requiere cambios** (ahora consulta tabla leads, que es correcta)

---

## PASO 5: Rebuild y Deploy (10 min)

```bash
cd fla-project
npm run build
```

Verificar que build sea exitoso sin errores.

---

## PASO 6: Testing Completo (20 min)

### Test 1: Tabla Leads
```bash
# En PostgreSQL
SELECT COUNT(*) FROM leads;  -- Debe tener datos
SELECT DISTINCT estado FROM leads;  -- Debe mostrar: NUEVO, FRIO, TIBIO, CALIENTE
```

### Test 2: Tabla Alumnos
```bash
# En PostgreSQL
SELECT COUNT(*) FROM alumnos;  -- Menos que antes
SELECT DISTINCT estado FROM alumnos;  -- Debe mostrar: REGISTRADO, ACTIVO, PAUSADO, BAJA
-- NO debe haber NUEVO, FRIO, TIBIO, CALIENTE
```

### Test 3: Frontend - Leads Page
1. Navegar a http://localhost:5173/leads
2. Verificar:
   - [ ] Carga datos de tabla LEADS (deberían ser todos los FRIO/TIBIO/CALIENTE que antes estaban)
   - [ ] KPI cards se actualizan
   - [ ] Filtros por estado (solo FRIO, TIBIO, CALIENTE, NUEVO)
   - [ ] Filtros por origen
   - [ ] Filtros por tipo

### Test 4: Frontend - Directorio Alumnos
1. Navegar a http://localhost:5173/directorio-alumnos
2. Verificar:
   - [ ] Los filtros de estado ahora solo muestran: REGISTRADO, ACTIVO, PAUSADO, BAJA
   - [ ] No aparece NUEVO, FRIO, TIBIO, CALIENTE
   - [ ] Los datos mostrados son solo alumnos (no leads)

### Test 5: API Endpoints
```bash
# Terminal - Test leads endpoint
curl "http://localhost:5173/api/webhook/get-leads-pipeline?estado=FRIO"
# Debe retornar leads con estado FRIO

# Test alumnos endpoint
curl "http://localhost:5173/api/webhook/get-alumnos-list?estado=ACTIVO"
# Debe retornar alumnos con estado ACTIVO (no debe incluir FRIO/TIBIO/etc)
```

---

## PASO 7: Rollback (Si algo falla)

Si necesitas revertir:

```bash
# 1. Restaurar BD desde backup
psql -h [HOST] -U [USER] -d fla_db < backup_leads_alumnos_FECHA.sql

# 2. Revertir cambios en n8n (reimportar workflows viejos)

# 3. Revertir cambios en frontend (git checkout)
cd fla-project
git checkout HEAD -- src/pages/DirectorioAlumnosPage.jsx
npm run build
```

---

## Checklist Final

- [ ] Backup BD creado
- [ ] Script SQL ejecutado sin errores
- [ ] Datos migrados: leads table tiene X registros, alumnos table tiene Y
- [ ] Workflow `get-leads-pipeline` importado y activo
- [ ] Workflow `get-alumnos-list` actualizado
- [ ] Workflow `convert-lead-to-alumno` creado (si es necesario)
- [ ] DirectorioAlumnosPage.jsx actualizado
- [ ] Frontend build exitoso
- [ ] Test de Leads page: datos cargan ✓
- [ ] Test de Directorio alumnos: datos cargan ✓
- [ ] API endpoints responden correctamente ✓

---

## Soporte

Si algo falla:
1. Revisar logs de n8n: https://asistente-ia-fla-n8n.x5miqk.easypanel.host
2. Revisar logs de BD en PgAdmin
3. Revisar console del navegador (F12)
4. Ver archivo ISSUES_PENDIENTES_15MAY.md para troubleshooting

