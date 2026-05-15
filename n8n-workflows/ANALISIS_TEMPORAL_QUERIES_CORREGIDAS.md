# Corrección: Queries del Análisis Temporal

## Problemas identificados

1. **`nuevos_por_semana`**: Devuelve array vacío
2. **`conversion_por_semana`**: Devuelve null en la mayoría de registros
3. **`ingresos_acumulados`**: Devuelve objeto vacío `{}`

## Causa

1. El formato `YYYY-IW` no funciona correctamente en PostgreSQL
2. Las queries no manejan bien los datos NULL
3. La tabla `pagos_manuales` está vacía o las queries no acceden correctamente

## Solución: Nuevas Queries Simplificadas

Reemplaza el código JavaScript del nodo **"arma query"** con este:

```javascript
const input = $input.first().json;
const query = input.query || {};
const { startDate, endDate } = query;

const start = startDate || '2026-01-01';
const end = endDate || '2026-12-31';

// Query 1: Nuevos alumnos por semana
const queryNuevos = `
WITH semanas AS (
  SELECT 
    DATE_TRUNC('week', a.fecha_registro)::date as semana_inicio,
    COUNT(a.id)::integer as nuevos
  FROM alumnos a
  WHERE a.fecha_registro::date BETWEEN '${start}'::date AND '${end}'::date
  GROUP BY DATE_TRUNC('week', a.fecha_registro)
)
SELECT 
  TO_CHAR(semana_inicio, 'YYYY-"W"IW') as semana,
  COALESCE(nuevos, 0)::integer as nuevos
FROM semanas
ORDER BY semana_inicio ASC;
`;

// Query 2: Tasa de conversión por semana
const queryConversion = `
WITH nuevos_por_semana AS (
  SELECT 
    DATE_TRUNC('week', a.fecha_registro)::date as semana,
    COUNT(a.id)::integer as total_nuevos
  FROM alumnos a
  WHERE a.fecha_registro::date BETWEEN '${start}'::date AND '${end}'::date
  GROUP BY DATE_TRUNC('week', a.fecha_registro)
),
convertidos_por_semana AS (
  SELECT 
    DATE_TRUNC('week', a.fecha_activacion)::date as semana,
    COUNT(a.id)::integer as total_convertidos
  FROM alumnos a
  WHERE a.fecha_activacion IS NOT NULL 
    AND a.estado = 'ACTIVO'
    AND a.fecha_activacion::date BETWEEN '${start}'::date AND '${end}'::date
  GROUP BY DATE_TRUNC('week', a.fecha_activacion)
)
SELECT 
  TO_CHAR(COALESCE(n.semana, c.semana), 'YYYY-"W"IW') as semana,
  CASE 
    WHEN n.total_nuevos = 0 OR n.total_nuevos IS NULL THEN 0
    ELSE ROUND(100.0 * COALESCE(c.total_convertidos, 0) / n.total_nuevos, 1)::integer
  END as conversion
FROM nuevos_por_semana n
FULL OUTER JOIN convertidos_por_semana c ON n.semana = c.semana
ORDER BY COALESCE(n.semana, c.semana) ASC;
`;

// Query 3: Ingresos por mes (suma de ambas tablas)
const queryIngresos = `
SELECT 
  TO_CHAR(fecha_mes, 'YYYY-MM') as mes,
  SUM(monto)::decimal as ingresos
FROM (
  SELECT 
    DATE_TRUNC('month', p.fecha_pago)::date as fecha_mes,
    p.monto
  FROM pagos_manuales p
  WHERE p.fecha_pago BETWEEN '${start}'::date AND '${end}'::date
    AND p.monto > 0
  
  UNION ALL
  
  SELECT 
    DATE_TRUNC('month', p.created_at)::date as fecha_mes,
    p.monto
  FROM pagos p
  WHERE p.created_at::date BETWEEN '${start}'::date AND '${end}'::date
    AND p.estado = 'VERIFICADO'
    AND p.monto > 0
) pagos_combinados
GROUP BY fecha_mes
ORDER BY fecha_mes ASC;
`;

return [{
  json: {
    queryNuevos,
    queryConversion,
    queryIngresos
  }
}];
```

## Cambios principales

### 1. **Nuevos por Semana**
- Agrupa DIRECTAMENTE los alumnos por `fecha_registro`
- Usa `TO_CHAR(semana_inicio, 'YYYY-"W"IW')` para formato correcto
- Maneja NULL con `COALESCE(nuevos, 0)`

### 2. **Tasa de Conversión**
- Crea dos CTEs separados: nuevos vs convertidos
- Usa FULL OUTER JOIN para combinarlos (incluye ambas semanas)
- Calcula: (convertidos / nuevos) × 100% solo si hay nuevos
- Retorna 0 si no hay nuevos esa semana

### 3. **Ingresos por Mes**
- **Combina dos tablas**: `pagos_manuales` + `pagos`
- `pagos_manuales`: usa `fecha_pago`
- `pagos`: usa `created_at` y filtra por `estado = 'VERIFICADO'`
- Suma ambas con UNION ALL
- Retorna mes + ingresos totales

## Notas importantes

1. **Formato de semana**: `YYYY-"W"IW` genera "2026-W05", "2026-W18", etc.
2. **Pagos verificados**: Solo suma pagos con estado VERIFICADO de la tabla `pagos`
3. **Manejo de NULL**: Todos los valores NULL se convierten a 0
4. **Rango de fechas**: Usa `fecha_pago` para `pagos_manuales` y `created_at` para `pagos`

## 🔄 Pasos en n8n

1. Abre `get-analisis-temporal`
2. Edita el nodo **"arma query"**
3. Reemplaza el código JavaScript completo con el anterior
4. Guarda y prueba
5. Recarga la página del navegador (Ctrl+Shift+R)
