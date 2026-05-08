-- ============================================
-- VALIDACIÓN DE DATOS DEL DASHBOARD
-- ============================================

-- 1. Contar total de alumnos por estado
SELECT 'Total por Estado' as "Validación", estado, COUNT(*) as cantidad
FROM alumnos
WHERE estado IN ('FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO')
GROUP BY estado
ORDER BY estado;

-- 2. Contar total por origen
SELECT 'Total por Origen' as "Validación", origen, COUNT(*) as cantidad
FROM alumnos
WHERE estado IN ('FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO')
GROUP BY origen
ORDER BY origen;

-- 3. Funnel por Origen (como retorna n8n)
SELECT 'Funnel Esperado' as "Validación",
  origen,
  COUNT(CASE WHEN estado = 'FRIO' THEN 1 END) as nuevos,
  COUNT(CASE WHEN estado = 'TIBIO' THEN 1 END) as nutriendo,
  COUNT(CASE WHEN estado = 'ACTIVO' THEN 1 END) as conversion,
  COUNT(*) as total_leads,
  CASE WHEN COUNT(CASE WHEN estado = 'FRIO' THEN 1 END) + COUNT(CASE WHEN estado = 'TIBIO' THEN 1 END) > 0
    THEN ROUND(100.0 * COUNT(CASE WHEN estado = 'ACTIVO' THEN 1 END) / (COUNT(CASE WHEN estado = 'FRIO' THEN 1 END) + COUNT(CASE WHEN estado = 'TIBIO' THEN 1 END)))
    ELSE 0
  END as tasa_conversion_pct
FROM alumnos
WHERE estado IN ('FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO')
GROUP BY origen
ORDER BY origen;

-- 4. Verificar que no hay duplicados
SELECT 'Validación Duplicados' as "Check", 
  COUNT(*) as total_registros,
  COUNT(DISTINCT email) as emails_unicos,
  COUNT(DISTINCT whatsapp) as whatsapp_unicos
FROM alumnos
WHERE estado IN ('FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO');

-- 5. Verificar campos requeridos no nulos
SELECT 'Campos Nulos' as "Check",
  COUNT(CASE WHEN nombre IS NULL THEN 1 END) as nombre_nulos,
  COUNT(CASE WHEN email IS NULL THEN 1 END) as email_nulos,
  COUNT(CASE WHEN origen IS NULL THEN 1 END) as origen_nulos,
  COUNT(CASE WHEN estado IS NULL THEN 1 END) as estado_nulos
FROM alumnos
WHERE estado IN ('FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO');
