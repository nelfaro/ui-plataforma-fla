-- Crear tabla PAGOS
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  alumno_id INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATE NOT NULL,
  tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('MANUAL', 'MERCADO_PAGO')),
  metodo TEXT CHECK (metodo IN ('EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'TARJETA', NULL)),
  nota TEXT,
  registrado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar campos de pago a la tabla alumnos si no existen
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS estado_pago TEXT DEFAULT 'PENDIENTE';
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS fecha_pago_ultimo DATE;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_pagos_alumno_id ON pagos(alumno_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_alumnos_estado_pago ON alumnos(estado_pago);
