# Corrección: Tasa de Conversión por Semana

## Problema
La gráfica mostraba valores incorrectos (0%, 50%, 100%) y fechas mal formateadas ("2026-07", "2026-13", "2026-19").

## Causa
1. **Formato de fecha incorrecto**: `YYYY-WW` no genera semanas ISO válidas
2. **Lógica de conversión incorrecta**: Usaba `fecha_registro` para contar conversiones, cuando debería usar `fecha_activacion`
3. **Cálculo erróneo**: No diferenciaba entre nuevos leads y alumnos convertidos

## Solución
Actualizar el nodo **"arma query"** del workflow `get-analisis-temporal` en n8n.

---

## 🔧 Cambios en la Query de Conversión

### ANTES (Incorrecto):
```sql
SELECT 
  TO_CHAR(s.semana_inicio, 'YYYY-WW') as semana,
  ROUND(100.0 * COUNT(CASE WHEN a.estado IN ('REGISTRADO', 'ACTIVO') THEN 1 END) / 
    NULLIF(COUNT(a.id), 0), 1)::integer as conversion
FROM semanas s
LEFT JOIN alumnos a ON DATE_TRUNC('week', a.fecha_registro) = s.semana_inicio
GROUP BY s.semana_inicio
```

### DESPUÉS (Correcto):
```sql
WITH semanas AS (
  SELECT generate_series(
    DATE_TRUNC('week', '${start}'::date),
    DATE_TRUNC('week', '${end}'::date),
    '1 week'::interval
  )::date as semana_inicio
),
nuevos_por_semana AS (
  SELECT 
    DATE_TRUNC('week', a.fecha_registro)::date as semana_inicio,
    COUNT(a.id)::integer as total_nuevos
  FROM alumnos a
  WHERE a.fecha_registro IS NOT NULL
  GROUP BY DATE_TRUNC('week', a.fecha_registro)
),
convertidos_por_semana AS (
  SELECT 
    DATE_TRUNC('week', a.fecha_activacion)::date as semana_inicio,
    COUNT(a.id)::integer as total_convertidos
  FROM alumnos a
  WHERE a.fecha_activacion IS NOT NULL AND a.estado = 'ACTIVO'
  GROUP BY DATE_TRUNC('week', a.fecha_activacion)
)
SELECT 
  TO_CHAR(s.semana_inicio, 'YYYY-IW') as semana,
  ROUND(
    100.0 * COALESCE(c.total_convertidos, 0) / NULLIF(COALESCE(n.total_nuevos, 0), 0),
    1
  )::integer as conversion
FROM semanas s
LEFT JOIN nuevos_por_semana n ON n.semana_inicio = s.semana_inicio
LEFT JOIN convertidos_por_semana c ON c.semana_inicio = s.semana_inicio
GROUP BY s.semana_inicio, n.total_nuevos, c.total_convertidos
ORDER BY s.semana_inicio ASC;
```

---

## 📝 Cambios Principales

### 1. **Formato de Fecha** (ISO Week)
- **Antes**: `TO_CHAR(s.semana_inicio, 'YYYY-WW')` → Genera "2026-07", "2026-13", etc. (INVÁLIDO)
- **Después**: `TO_CHAR(s.semana_inicio, 'YYYY-IW')` → Genera "2026-W01", "2026-W18", etc. (CORRECTO)

### 2. **Lógica de Nuevos Leads**
- **Antes**: Contaba sobre la misma semana que conversiones
- **Después**: CTE `nuevos_por_semana` cuenta alumnos con `fecha_registro` en esa semana

### 3. **Lógica de Conversiones**
- **Antes**: Contaba alumnos con estado IN ('REGISTRADO', 'ACTIVO') usando `fecha_registro`
- **Después**: CTE `convertidos_por_semana` cuenta alumnos con:
  - `fecha_activacion` en esa semana (cuándo pasó a ACTIVO)
  - `estado = 'ACTIVO'` (confirma que es alumno activo)

### 4. **Cálculo de Tasa**
- **Antes**: (Alumnos activos en la semana) / (Total en esa semana) × 100%
- **Después**: (Alumnos que se activaron esa semana) / (Nuevos leads esa semana) × 100%

---

## 🔄 Pasos a Seguir en n8n

1. Abre el workflow `get-analisis-temporal` en n8n
2. Haz click en el nodo **"arma query"** (el nodo Code que construye las queries)
3. Reemplaza el código JavaScript completo con el código del nodo corregido en `get-analisis-temporal-CORREGIDO.json`
4. **Importante**: Solo cambia el nodo "arma query", el resto del workflow permanece igual
5. Guarda y prueba

---

## 📊 Resultado Esperado

Después de la corrección, la gráfica mostrará:
- **Fechas correctas**: "2026-W01", "2026-W02", "2026-W18", etc.
- **Valores realistas**: Tasas de conversión distribuidas (5%, 12%, 25%, 35%, etc.)
- **Lógica correcta**: Representa (Alumnos nuevos que se convirtieron / Total de nuevos) por semana

---

## 💡 Notas Técnicas

- Si una semana no tiene nuevos leads, la tasa será NULL/0 (división por cero)
- Si una semana tiene nuevos leads pero sin conversiones esa semana, mostrará 0%
- Las conversiones pueden suceder semanas después del registro, esto es correcto
