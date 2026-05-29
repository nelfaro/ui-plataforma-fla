-- ============================================
-- Migración 007: Agregar fecha_nacimiento a tabla alumnos
-- ============================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'alumnos' AND column_name = 'fecha_nacimiento'
  ) THEN
    ALTER TABLE alumnos ADD COLUMN fecha_nacimiento TEXT;
    COMMENT ON COLUMN alumnos.fecha_nacimiento IS 'Fecha de nacimiento del alumno en formato MM-DD o MM-DD-YYYY';
  END IF;
END $$;
