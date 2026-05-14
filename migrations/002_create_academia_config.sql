-- Tabla de configuración de la academia
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración inicial por defecto
INSERT INTO academia_config (nombre_academia, nombre_profe)
VALUES ('Clases de Inglés con Fla', 'Flabia Diez')
ON CONFLICT DO NOTHING;
