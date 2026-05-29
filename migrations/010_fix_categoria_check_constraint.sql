-- ============================================
-- Migración 010: Corregir constraint de categoria
-- ============================================

-- Eliminar el constraint antiguo basado en lead_tipo
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_lead_tipo_check;

-- Crear nuevo constraint para categoria
ALTER TABLE alumnos ADD CONSTRAINT alumnos_categoria_check
  CHECK (categoria IN ('KIDS', 'ADULTOS', 'AU_PAIR', 'PERSONALIZADO'));
