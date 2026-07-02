-- ============================================================================
-- SCRIPT DE LIMPIEZA DE BASE DE DATOS
-- Elimina todos los datos EXCEPTO la tabla de ALUMNOS
-- ============================================================================

-- PASO 1: Limpiar tabla LEADS (Pre-venta)
TRUNCATE TABLE leads CASCADE;
ALTER SEQUENCE leads_id_seq RESTART WITH 1;

-- PASO 2: Limpiar tabla conversation_log (Historial de conversaciones)
TRUNCATE TABLE conversation_log CASCADE;
ALTER SEQUENCE conversation_log_id_seq RESTART WITH 1;

-- PASO 3: Limpiar tabla pagos (Pagos registrados)
TRUNCATE TABLE pagos CASCADE;
ALTER SEQUENCE pagos_id_seq RESTART WITH 1;

-- PASO 4: Limpiar tabla horarios (Horarios de clases)
TRUNCATE TABLE horarios CASCADE;
ALTER SEQUENCE horarios_id_seq RESTART WITH 1;

-- PASO 5: Mantener alumnos pero resetear secuencia si está vacía
-- (comentar si quieres mantener alumnos existentes)
-- TRUNCATE TABLE alumnos CASCADE;
-- ALTER SEQUENCE alumnos_id_seq RESTART WITH 1;

-- Verificación final
SELECT
    (SELECT COUNT(*) FROM alumnos) as total_alumnos,
    (SELECT COUNT(*) FROM leads) as total_leads,
    (SELECT COUNT(*) FROM conversation_log) as total_conversations,
    (SELECT COUNT(*) FROM pagos) as total_pagos,
    (SELECT COUNT(*) FROM horarios) as total_horarios;
