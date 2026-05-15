# Problemas Pendientes - 15 de Mayo 2026

## Status General
- ✅ **CORS Fixes Completadas**: Todos los servicios y componentes ahora usan proxy `/api/webhook`
- ✅ **Build**: Proyecto compila sin errores
- ⚠️ **Remaining**: 3 blockers críticos para entregar hoy

---

## 1. ❌ Leads/Pipeline - Sin datos

### Problema
La página `/leads` muestra "No hay leads que coincidan con los filtros" aunque hay 27 alumnos en la BD.

### Causa Raíz
El workflow `get-leads-pipeline` no existe en n8n o no está correctamente importado.

### Solución
1. **Archivo workflow creado**: `n8n-workflows/get-leads-pipeline.json`
2. **Pasos para activar en n8n**:
   - Ir a n8n: https://asistente-ia-fla-n8n.x5miqk.easypanel.host
   - Click en "Import"
   - Subir el archivo `n8n-workflows/get-leads-pipeline.json`
   - **IMPORTANTE**: Asegurarse de que el nodo PostgreSQL esté conectado a la BD de producción
   - Guardar y activar el workflow
   - Test: GET `http://localhost:5173/api/webhook/get-leads-pipeline`

### Query SQL
```sql
SELECT 
  id, nombre, whatsapp, estado, estado_motivo, estado_fecha,
  nivel, origen, lead_tipo, objetivo, resumen, tags,
  primera_consulta, ultimo_contacto, completitud
FROM alumnos
WHERE ($1::text IS NULL OR estado = $1)
  AND ($2::text IS NULL OR origen = $2)
  AND ($3::text IS NULL OR lead_tipo = $3)
ORDER BY ultimo_contacto DESC NULLS LAST
LIMIT 100
```

**Parámetros URL**: `?estado=FRIO&origen=INSTAGRAM&lead_tipo=KIDS`

---

## 2. ❌ Directorio - Error 500 al seleccionar "Corporativo"

### Problema
Al seleccionar la categoría "Corporativo" en el filtro de Directorio de Alumnos, la API retorna error 500.

### Causa Probable
- El workflow `get-alumnos-list` tiene un error de SQL al procesar `lead_tipo='CORPORATIVO'`
- Posible: campo `lead_tipo` no acepta este valor, o hay un constraint en la BD

### Solución
1. **Verificar en n8n**:
   - Abrir workflow `get-alumnos-list`
   - Revisar la query SQL en el nodo PostgreSQL
   - Buscar si hay un error de validación para CORPORATIVO
   - Test manualmente: `GET /webhook/get-alumnos-list?lead_tipo=CORPORATIVO`

2. **Verificar en PostgreSQL**:
   - Confirmar que la tabla `alumnos` tiene registros con `lead_tipo='CORPORATIVO'`
   - Revisar si el campo `lead_tipo` tiene un CHECK constraint que solo acepta ciertos valores

3. **Posible fix rápido**:
   - En DirectorioAlumnosPage.jsx, línea 32, se incluyó CORPORATIVO pero quizás la BD no lo acepta
   - Verificar cuáles son los valores válidos en la BD

---

## 3. ❌ WhatsApp - Iframe no carga

### Problema
La página `/whatsapp` muestra el componente pero el iframe no carga el servicio puentewhatsapp.

### URL
`https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host/`

### Pasos para Verificar
1. **¿El servicio está activo?**
   ```bash
   curl -I https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host/
   ```
   Debe retornar 200 OK

2. **¿CORS permite iframes?**
   - Abrir DevTools → Network → recargar página `/whatsapp`
   - Ver si el iframe retorna error 403, 404 o CORS

3. **¿La URL es correcta?**
   - Verificar en `src/config/constants.js`
   - Debe estar en VITE_WHATSAPP_URL o similar

4. **Posible solución**:
   - Si puentewhatsapp service no está corriendo en producción, contactar DevOps
   - Si es CORS, configurar en Easypanel los headers de CORS

---

## Resumen de Commits Realizados

```
ae816f8 fix: Usar proxy local en componentes de página (completa CORS)
fe35b92 fix: Usar proxy local para todos los servicios (completa CORS)
7501adb fix: Usar proxy local para dashboard y documents (evita CORS error)
```

**Total de servicios/componentes fixeados**: 7 archivos
- ✅ alumnos.js
- ✅ dashboard.js
- ✅ documents.js
- ✅ conocimiento.js
- ✅ academia.js (ya estaba)
- ✅ leads.js (ya estaba)
- ✅ AlumnoDetallePage.jsx
- ✅ GestionHorariosPage.jsx

---

## Próximos Pasos

### Inmediato (Hoy)
1. [ ] Importar `get-leads-pipeline.json` en n8n
2. [ ] Test Leads page → debe mostrar datos
3. [ ] Investigar error 500 en Corporativo
4. [ ] Verificar WhatsApp iframe

### Si todo funciona
- [ ] Test completo de los 13 features
- [ ] Forzar reload del navegador (Ctrl+Shift+R) para limpiar cache
- [ ] Deploy/Entrega

---

## Testing Checklist

Una vez todas las reparaciones estén hechas:

```
Directorio (DirectorioAlumnosPage) - Verificar que filtra correctamente
- [ ] Filter por NUEVO, FRIO, TIBIO, CALIENTE, etc. (sin Corporativo si no existe)
- [ ] Ver ficha individual del alumno
- [ ] Paginación funciona

Leads (LeadsPage) - Nuevo test
- [ ] Carga inicial muestra alumnos con estado FRIO/TIBIO/CALIENTE/ACTIVO
- [ ] KPI cards (total, frio, seguimiento, activo) actualizan
- [ ] Filtros funcionan: estado, origen, tipo
- [ ] Tabla muestra datos correctos

WhatsApp
- [ ] Página `/whatsapp` carga sin error console
- [ ] Iframe intenta cargar (Network tab debe mostrar request)
- [ ] Si CORS ok, muestra QR o interfaz

Configuración (SettingsPage)
- [ ] Carga la config sin error
- [ ] Puedo guardar cambios
- [ ] Confirmación toast aparece
```

