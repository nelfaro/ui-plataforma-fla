# Instrucciones de Implementación - Prompt v5 + Leads Pipeline

Este documento contiene las instrucciones que debes ejecutar para completar la implementación de:
1. Prompt v5 del Coordinador Academia
2. Nueva página de Pipeline de Leads en la plataforma
3. Captura de nivel de inglés
4. Cambios en n8n workflows

---

## PASO 1: Cambios en la Base de Datos

Ejecuta estas dos migraciones SQL en tu base de datos PostgreSQL:

```sql
-- Agregar columnas para tracking de estado y motivo
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS estado_motivo TEXT;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS estado_fecha TIMESTAMP;

-- Crear índice para queries más rápidas
CREATE INDEX IF NOT EXISTS idx_alumnos_estado_fecha ON alumnos(estado, estado_fecha DESC);
```

---

## PASO 2: Actualizar Workflow `etiquetar-alumno` en n8n

**Ubicación:** n8n dashboard → Workflows → etiquetar-alumno.json

**Cambios necesarios:**

### 2.1 Agregar parámetros opcionales al webhook

El workflow debe aceptar parámetros:
- `whatsapp` (requerido)
- `tags` (array, requerido)
- `estado_motivo` (opcional - texto exacto del mensaje del usuario)

### 2.2 Actualizar la query SQL de UPDATE

Reemplazar la query SQL UPDATE para incluir `estado_motivo` y `estado_fecha`:

```sql
UPDATE alumnos 
SET tags = $2::text[], 
    estado_motivo = COALESCE($3, estado_motivo),
    estado_fecha = CASE 
                     WHEN $3 IS NOT NULL THEN NOW() 
                     ELSE estado_fecha 
                   END,
    updated_at = NOW()
WHERE whatsapp = $1;
```

Parámetros:
- $1: `whatsapp`
- $2: `tags` (JSON array)
- $3: `estado_motivo` (opcional)

### 2.3 Probar el workflow

Hacer un test call al endpoint `/webhook/etiquetar-alumno`:
```
POST /webhook/etiquetar-alumno
Body: {
  "whatsapp": "+5491234567890",
  "tags": ["FRIO", "KIDS", "INSTAGRAM"],
  "estado_motivo": "Preguntó por horarios"
}
```

---

## PASO 3: Crear Nuevo Endpoint `get-leads-pipeline` en n8n

**Crear un nuevo workflow** con nombre: `get-leads-pipeline`

### 3.1 Nodo: Webhook (entrada HTTP)

- **Method:** GET
- **Path:** /webhook/get-leads-pipeline
- **Data Method:** URL Query Parameters
- **Respond immediately:** unchecked

### 3.2 Nodo: PostgreSQL (query)

**Query SQL:**

```sql
SELECT 
  id, 
  nombre, 
  whatsapp, 
  estado, 
  estado_motivo, 
  estado_fecha,
  nivel, 
  origen, 
  lead_tipo, 
  objetivo, 
  resumen, 
  tags,
  primera_consulta, 
  ultimo_contacto, 
  completitud
FROM alumnos
WHERE ($1::text IS NULL OR estado = $1)
  AND ($2::text IS NULL OR origen = $2)
  AND ($3::text IS NULL OR lead_tipo = $3)
ORDER BY ultimo_contacto DESC NULLS LAST
LIMIT 100
```

**Parámetros:**
- $1: `{{ $input.query.estado }}`
- $2: `{{ $input.query.origen }}`
- $3: `{{ $input.query.lead_tipo }}`

### 3.3 Nodo: Code (opcional, para formato)

```javascript
return {
  items: $input.all(),
  total: $input.all().length
};
```

### 3.4 Nodo: Respond to Webhook

Responder con el resultado del query.

### 3.5 Test del endpoint

```
GET /webhook/get-leads-pipeline?estado=FRIO&origen=INSTAGRAM
GET /webhook/get-leads-pipeline?lead_tipo=KIDS
GET /webhook/get-leads-pipeline
```

---

## PASO 4: Crear Nueva Tool `obtener-horarios` para el Agente

**En el workflow `Academia_Ingles_Cerebro_IA_V2.json` (el cerebro del agente):**

Agregar una nueva tool al conjunto de tools del agente con estos parámetros:

```json
{
  "name": "obtener-horarios",
  "description": "Obtiene los horarios disponibles de clases según la categoría (KIDS o ADULTO). Usar cuando el usuario pregunta por horarios o disponibilidad.",
  "parameters": {
    "type": "object",
    "properties": {
      "categoria": {
        "type": "string",
        "description": "Categoría de clases: KIDS, ADULTO, o dejar vacío para todas",
        "enum": ["KIDS", "ADULTO", ""]
      }
    },
    "required": []
  },
  "implementation": "HTTP GET to /webhook/get-horarios?categoria={{categoria}}"
}
```

**Instrucción en el prompt (v5) al agente:**

Cuando el usuario pregunta por horarios, el agente debe:
1. Llamar la tool `obtener-horarios` con `categoria` según el segmento (KIDS o ADULTO)
2. Presentar los horarios disponibles de forma clara
3. Permitir que el usuario seleccione uno

---

## PASO 5: Actualizar el Prompt del Coordinador Academia

En el nodo "Coordinador Academia" del workflow principal, reemplazar el prompt anterior con el contenido del archivo:

**Archivo:** `prompts/coordinador-academia-v5.md`

**Cómo hacerlo:**
1. Abrir `Academia_Ingles_Cerebro_IA_V2.json`
2. Buscar el nodo "Coordinador Academia" (o similar)
3. Copiar el contenido de `prompts/coordinador-academia-v5.md`
4. Reemplazar el system prompt del agente con este contenido
5. Guardar y publicar

**IMPORTANTE:**
- Este prompt incluye instrucciones para usar la tool `obtener-horarios`
- Incluye instrucciones para pasar `estado_motivo` al llamar `etiquetar-alumno`
- Incluye instrucciones para capturar `nivel` de inglés para todos los segmentos

---

## PASO 6: Cargar Contenido al RAG (Qdrant)

**Archivo para usar:** `Subir info a Qdrant.json` (ya existe en n8n)

### 6.1 Preparar el contenido de las páginas

El PDF `CLASES DE INGLES CON FLA KIDS.pdf` contiene el contenido. Necesitas:
1. Exportar el texto del PDF a un archivo de texto plano
2. Dividirlo en secciones con etiquetas de categoría:
   - `categoria: kids` - para info sobre clases kids
   - `categoria: precios` - para información de precios
   - `categoria: particulares` - para clases particulares
   - `categoria: metodologia` - para metodología de enseñanza

### 6.2 Formato recomendado para subir

Para cada sección, crear un documento en Google Drive con este formato:

```
TÍTULO: Clases de Inglés con Fla - Información General

CATEGORÍA: kids, precios, general

CONTENIDO:

[Aquí todo el contenido de la sección]

---

TÍTULO: Precios Clases Kids 2026

CATEGORÍA: precios, kids

CONTENIDO:

ARS $85.000 cuota mensual...
```

### 6.3 Ejecutar el workflow

1. En n8n, ir a `Subir info a Qdrant.json`
2. Cargar los documentos de Google Drive
3. Verificar en Qdrant que los documentos se indexaron

### 6.4 Verificar funcionamiento

Prueba haciendo que el agente responda a:
- "¿Cuánto cuestan las clases?"
- "¿Qué metodología usan?"
- "¿Hay clases particulares?"

---

## PASO 7: Push a GitHub (opcional si hay problemas con SSL)

Si el push automático no funciona por SSL, puedes hacer:

```bash
# Desde la carpeta del proyecto
git push origin main

# O si tienes error SSL, intenta:
git config --global http.sslVerify false
git push origin main
```

---

## VERIFICACIÓN FINAL

### En la Plataforma Frontend (React)

1. **Nueva página `/leads`:**
   - Navega a http://localhost:5173/leads
   - Debes ver: 4 KPI cards, filtros, tabla con leads
   - Prueba los filtros (Estado, Origen, Tipo)

2. **Prueba de datos:**
   - Los datos deben venir del endpoint `get-leads-pipeline`
   - Si la tabla está vacía, verifica que hay registros en la DB

### En el Agente (WhatsApp)

1. **Captura de Nivel:**
   - Conversa con el agente como si fueras un papá consultando por clases KIDS
   - El agente debe preguntar: "¿Cómo le va en inglés?"
   - El nivel debe guardarse en la DB en el campo `nivel`

2. **Horarios desde DB:**
   - Cuando preguntes por horarios, el agente debe llamar `obtener-horarios`
   - Debe mostrar horarios actuales de la DB (no hardcodeados)

3. **Estado con Motivo:**
   - Cuando el agente cambia tu estado a CALIENTE, debe guardar el fragmento de tu mensaje en `estado_motivo`
   - Verifica en la página `/leads` que el "Motivo del estado" aparece

4. **Clases Presenciales Y Online:**
   - El prompt debe mencionar "presenciales Y online" (no solo online)
   - El agente debe mencionar la dirección: Vargas Gómez 1667, Corrientes

---

## TROUBLESHOOTING

**Problema:** La página `/leads` no carga datos
- **Verificar:** ¿Existe el endpoint `/webhook/get-leads-pipeline` en n8n?
- **Verificar:** ¿Hay registros en la tabla `alumnos` en la DB?

**Problema:** El agente no pregunta por nivel de inglés
- **Verificar:** ¿Actualizaste el prompt v5 en n8n?
- **Verificar:** El prompt v5 debe estar en el nodo "Coordinador Academia"

**Problema:** Los horarios no salen de la DB
- **Verificar:** ¿Existe la tool `obtener-horarios`?
- **Verificar:** ¿El endpoint `/webhook/get-horarios` funciona?
- **Test:** GET /webhook/get-horarios en Postman

**Problema:** El `estado_motivo` no se guarda
- **Verificar:** ¿Actualizaste el workflow `etiquetar-alumno`?
- **Verificar:** El agente debe pasar el parámetro `estado_motivo`
- **Test:** POST /webhook/etiquetar-alumno con estado_motivo en Postman

---

## CONTACTO

Si tienes dudas sobre estos pasos o encuentras problemas, verifica:
1. El archivo `prompts/coordinador-academia-v5.md` para referencia del prompt
2. El archivo `src/pages/LeadsPage.jsx` para ver qué datos espera del backend
3. El archivo `src/services/leads.js` para ver la URL del endpoint

¡Éxito con la implementación! 🚀
