-- ============================================
-- Migración 004: Tabla conversation_logs
-- ============================================
-- Esta tabla ya existe y registra todas las conversaciones
-- del agente (ENTRANTE = usuario, SALIENTE = agente)
-- ============================================

-- Verificar estructura de conversation_logs
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'conversation_logs'
ORDER BY ordinal_position;

-- Ver últimas conversaciones registradas
SELECT * FROM conversation_logs ORDER BY created_at DESC LIMIT 10;
