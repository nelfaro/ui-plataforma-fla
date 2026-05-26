-- ============================================
-- Migración 006: Renombrar lead_tipo a categoria y agregar tutor
-- ============================================

-- Renombrar columna lead_tipo a categoria
ALTER TABLE alumnos RENAME COLUMN lead_tipo TO categoria;

-- Agregar columna tutor para contacto en clases KIDS
ALTER TABLE alumnos ADD COLUMN tutor TEXT;

-- Actualizar comentarios si es necesario
COMMENT ON COLUMN alumnos.categoria IS 'Tipo de alumno: KIDS, ADULTOS, AU_PAIR, PERSONALIZADO';
COMMENT ON COLUMN alumnos.tutor IS 'Nombre del tutor/apoderado para alumnos KIDS';
