# Instrucciones: Base de Conocimiento en PostgreSQL

Guía paso a paso para implementar el nuevo sistema de Base de Conocimiento que reemplaza al RAG con Qdrant.

---

## Qué cambió

- ❌ **ANTES:** El agente consultaba PDFs extraídos a Qdrant (frágil, sin contenido útil)
- ✅ **AHORA:** El agente consulta una tabla PostgreSQL estructurada que la profe gestiona desde la UI

---

## Paso 1: Crear la tabla en PostgreSQL

1. Abre tu cliente PostgreSQL (pgAdmin, DBeaver, o psql)
2. Conéctate a la base de datos `academia` (o tu BD principal)
3. Copia y ejecuta el contenido completo del archivo:
   ```
   migrations/001_create_conocimiento_academia.sql
   ```

**Resultado esperado:** Una nueva tabla `conocimiento_academia` con 45000 registros aprox (dependiendo de tu BD)

---

## Paso 2: Importar workflows n8n

### Workflow 1: CRUD (crear/leer/editar/eliminar)

1. Abre n8n
2. Click "New Workflow" → "Import from file"
3. Selecciona: `n8n-workflows/conocimiento-crud.json`
4. Configura credenciales:
   - PostgreSQL: usa tu conexión existente
5. **Guarda** el workflow
6. Copia el **ID del workflow** (aparece en la URL)

### Workflow 2: Para el Agente

1. Abre n8n → "New Workflow" → "Import from file"
2. Selecciona: `n8n-workflows/get-conocimiento-agente.json`
3. Configura credenciales:
   - PostgreSQL: tu conexión existente
   - OpenAI API Key: igual a la del agente
4. **Guarda** el workflow
5. Copia el **ID del workflow**

---

## Paso 3: Actualizar la tool "Informacion" del agente

En el workflow **Coordinador Academia**:

1. Abre el nodo **"Informacion"** (el `toolWorkflow`)
2. Ve a **"Workflow Inputs"**
3. Actualiza el campo `workflowId`:
   - Cambia el ID anterior al **ID del workflow `get-conocimiento-agente`** que acabas de copiar
4. Guarda

---

## Paso 4: Conectar la tool al agente

En el workflow **Coordinador Academia**:

1. Busca el nodo **"Coordinador Academia"** (el agente LLM)
2. Ve a la sección de **"Tools"** / **"ai_tool"**
3. Conecta el output del nodo **"Informacion"** al input `ai_tool` del agente

**Referencia visual:**
```
[Informacion] ──ai_tool──> [Coordinador Academia]
```

---

## Paso 5: Iniciar la plataforma React

Si no está corriendo:
```bash
cd fla-project
npm start
```

La nueva página estará en: **http://localhost:3000/conocimiento**

---

## Paso 6: Cargar datos iniciales

1. Abre `/conocimiento` en la plataforma
2. Click **"Agregar nuevo"**
3. Llena los campos:
   - **Categoría:** elige una de los 4 tabs (PRECIOS, FAQ, METODOLOGIA, CLASES)
   - **Segmento:** elige GENERAL, KIDS, ADULTOS, AU_PAIR, o PERSONALIZADO
   - **Título:** ej: "Precio clase grupal KIDS"
   - **Contenido:** descripción completa
   - **Activo:** sí (para que el agente lo vea)
4. Click **"Crear"**

**Datos recomendados para empezar:**
- 1 PRECIO para KIDS
- 1 PRECIO para ADULTOS
- 1 FAQ general
- 1 item de METODOLOGIA

---

## Paso 7: Probar el agente

1. Abre la sala de WhatsApp / chat del agente Fla
2. Pregunta: **"¿Cuánto cuesta una clase de KIDS?"**
3. El agente debe:
   - Llamar la tool "Informacion"
   - Consultar PostgreSQL
   - Responder con la información guardada

**Esperado:** Respuesta natural sobre precios, sin mencionar "base de datos" ni tecnicismos.

---

## Estructura de la tabla

```sql
CREATE TABLE conocimiento_academia (
  id          SERIAL PRIMARY KEY,
  categoria   TEXT CHECK (IN 'PRECIOS','FAQ','METODOLOGIA','CLASES'),
  segmento    TEXT CHECK (IN 'KIDS','ADULTOS','AU_PAIR','PERSONALIZADO','GENERAL'),
  titulo      TEXT NOT NULL,
  contenido   TEXT NOT NULL,
  activo      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Campos permitidos

### `categoria` (4 opciones):
- **PRECIOS** — Información de costos, modalidades, planes
- **FAQ** — Preguntas frecuentes y respuestas
- **METODOLOGIA** — Cómo trabaja Fla, enfoque pedagógico, diferenciadores
- **CLASES** — Información de grupos, edades, formatos

### `segmento` (5 opciones):
- **GENERAL** — Info aplicable a todos
- **KIDS** — Clases para niños (3-10 años)
- **ADULTOS** — Clases para adultos regulares
- **AU_PAIR** — Programa Au Pair (urgencia, visa, trabajo)
- **PERSONALIZADO** — Clases 1-a-1 especializadas

---

## Troubleshooting

### "Error al cargar items" en `/conocimiento`
- Verifica que el workflow CRUD esté activado en n8n
- Verifica que PostgreSQL está online
- Checkea credenciales en n8n

### Agente no usa la tool "Informacion"
- Verifica que el nodo está conectado (`ai_tool`)
- Verifica que el `workflowId` es el correcto
- Guarda y prueba de nuevo

### Pregunto precios pero el agente responde "no tengo esa información"
- Verifica que hay al menos 1 item PRECIOS guardado
- Verifica que `activo = true`
- Checkea que el `segmento` coincida con el `lead_tipo` del usuario

---

## Qué cambió en el código

### Frontend (React)
- ✅ **Nuevo:** `src/services/conocimiento.js` — CRUD service
- ✅ **Nuevo:** `src/pages/ConocimientoPage.jsx` — página de gestión
- ✅ **Actualizado:** `src/App.jsx` — ruta `/conocimiento`
- ✅ **Actualizado:** `src/components/Layout/Sidebar.jsx` — nav item

### Backend (n8n)
- ✅ **Nuevo:** `conocimiento-crud.json` — webhook CRUD
- ✅ **Nuevo:** `get-conocimiento-agente.json` — tool para agente (reemplaza RAG)

### Database (PostgreSQL)
- ✅ **Nuevo:** tabla `conocimiento_academia`
- ✅ **Nuevo:** índices en `categoria`, `segmento`, `activo`

---

## Soporte

Si algo falla:

1. Verifica los **logs de n8n** (sección de executions)
2. Abre la **consola del navegador** (F12) para errores de React
3. Checkea que todos los **IDs de workflow** están actualizados
4. Verifica que la **tabla PostgreSQL se creó** correctamente

---

**Última actualización:** Mayo 2026
