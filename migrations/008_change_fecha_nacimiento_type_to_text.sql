-- ============================================
-- Migración 008: Cambiar fecha_nacimiento de DATE a TEXT
-- ============================================

-- Cambiar el tipo de la columna de DATE a TEXT
ALTER TABLE alumnos ALTER COLUMN fecha_nacimiento TYPE TEXT;

-- Actualizar el comentario
COMMENT ON COLUMN alumnos.fecha_nacimiento IS 'Fecha de nacimiento del alumno en formato MM-DD o MM-DD-YYYY';
