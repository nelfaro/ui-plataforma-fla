-- ============================================
-- Migración 007: Agregar fecha_nacimiento a tabla alumnos
-- ============================================

ALTER TABLE alumnos ADD COLUMN fecha_nacimiento TEXT;

COMMENT ON COLUMN alumnos.fecha_nacimiento IS 'Fecha de nacimiento del alumno en formato MM-DD o MM-DD-YYYY';
