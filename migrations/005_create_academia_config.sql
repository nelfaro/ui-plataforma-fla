-- ============================================
-- Migración 005: Tabla academia_config
-- ============================================
-- Tabla para almacenar la configuración de la academia
-- ============================================

CREATE TABLE IF NOT EXISTS academia_config (
  id SERIAL PRIMARY KEY,
  nombre_academia TEXT,
  nombre_profe TEXT,
  email TEXT,
  telefono TEXT,
  ubicacion_direccion TEXT,
  ubicacion_localidad TEXT,
  horario_atencion TEXT,
  banco TEXT,
  cbu TEXT,
  alias TEXT,
  linktree_url TEXT,
  instagram TEXT,
  facebook TEXT,
  politica_cancelacion TEXT,
  politica_recuperacion TEXT,
  politica_reembolso TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración inicial si no existe
INSERT INTO academia_config (nombre_academia, nombre_profe, email)
SELECT 'Clases de Inglés con Fla', 'Flabia Diez', 'fla@academia.com'
WHERE NOT EXISTS (SELECT 1 FROM academia_config);
