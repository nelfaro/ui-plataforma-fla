-- ============================================
-- Migración 012: Crear tabla horarios
-- ============================================

CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('GRUPAL', 'INDIVIDUAL')),
  nivel TEXT NOT NULL CHECK (nivel IN ('inicial', 'intermedio', 'avanzado')),
  categoria TEXT NOT NULL CHECK (categoria IN ('KIDS', 'ADULTOS', 'AU_PAIR', 'PERSONALIZADO')),
  dia_1 TEXT NOT NULL,
  dia_2 TEXT,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT NOT NULL,
  cupo_max INTEGER,
  precio_mensual DECIMAL(10, 2),
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_horarios_categoria ON horarios(categoria);
CREATE INDEX idx_horarios_tipo ON horarios(tipo);
