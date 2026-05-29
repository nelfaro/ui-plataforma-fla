-- ============================================
-- Migración 009: Hacer whatsapp nullable
-- ============================================

ALTER TABLE alumnos ALTER COLUMN whatsapp DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN whatsapp DROP NOT NULL;

COMMENT ON COLUMN alumnos.whatsapp IS 'Número de WhatsApp del alumno (opcional)';
COMMENT ON COLUMN leads.whatsapp IS 'Número de WhatsApp del lead (opcional)';
