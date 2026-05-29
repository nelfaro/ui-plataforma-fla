-- ============================================
-- Migración 011: Eliminar todos los constraints de categoria/lead_tipo
-- ============================================

-- Eliminar todos los constraints relacionados
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_lead_tipo_check CASCADE;
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_categoria_check CASCADE;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_lead_tipo_check CASCADE;
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_categoria_check CASCADE;

-- Crear nuevo constraint para alumnos
ALTER TABLE alumnos ADD CONSTRAINT alumnos_categoria_check
  CHECK (categoria IN ('KIDS', 'ADULTOS', 'AU_PAIR', 'PERSONALIZADO'));

-- Crear nuevo constraint para leads
ALTER TABLE leads ADD CONSTRAINT leads_estado_check
  CHECK (estado IN ('NUEVO', 'FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO'));
