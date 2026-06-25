-- Script: Agregar nuevos campos a tabla conversation_log
-- Tabla singular (conversation_log) no conversation_logs

-- ============================================================================
-- 1. AGREGAR CAMPOS FALTANTES A conversation_log
-- ============================================================================

ALTER TABLE IF EXISTS conversation_log
ADD COLUMN IF NOT EXISTS direccion VARCHAR(50),
ADD COLUMN IF NOT EXISTS tipo_media VARCHAR(50),
ADD COLUMN IF NOT EXISTS mensaje_preview TEXT,
ADD COLUMN IF NOT EXISTS lead_tipo VARCHAR(50),
ADD COLUMN IF NOT EXISTS intencion VARCHAR(100);

-- Agregar CHECK constraint para direccion (entrada/salida)
ALTER TABLE conversation_log
ADD CONSTRAINT IF NOT EXISTS check_direccion
CHECK (direccion IN ('entrada', 'salida') OR direccion IS NULL);

-- Agregar CHECK constraint para tipo_media
ALTER TABLE conversation_log
ADD CONSTRAINT IF NOT EXISTS check_tipo_media
CHECK (tipo_media IN ('texto', 'imagen', 'audio', 'video', 'documento') OR tipo_media IS NULL);

-- Agregar CHECK constraint para lead_tipo
ALTER TABLE conversation_log
ADD CONSTRAINT IF NOT EXISTS check_lead_tipo
CHECK (lead_tipo IN ('KIDS', 'AU_PAIR', 'ADULTOS', 'PERSONALIZADO', 'KIDS-ADOLESCENTES') OR lead_tipo IS NULL);

-- Agregar CHECK constraint para intencion
ALTER TABLE conversation_log
ADD CONSTRAINT IF NOT EXISTS check_intencion
CHECK (intencion IN ('consulta', 'venta', 'seguimiento', 'soporte', 'cierre', 'otro') OR intencion IS NULL);

-- Agregar índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_conversation_log_direccion ON conversation_log(direccion);
CREATE INDEX IF NOT EXISTS idx_conversation_log_tipo_media ON conversation_log(tipo_media);
CREATE INDEX IF NOT EXISTS idx_conversation_log_lead_tipo ON conversation_log(lead_tipo);
CREATE INDEX IF NOT EXISTS idx_conversation_log_intencion ON conversation_log(intencion);

-- ============================================================================
-- 2. VERIFICAR ESTRUCTURA ACTUALIZADA
-- ============================================================================
SELECT '✓ Tabla conversation_log actualizada' as status;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'conversation_log'
ORDER BY ordinal_position;

SELECT COUNT(*) as total_conversation_logs FROM conversation_log;
