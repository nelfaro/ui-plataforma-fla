CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  alumno_id INTEGER,
  monto DECIMAL(10,2),
  fecha_pago DATE,
  tipo_pago TEXT,
  metodo TEXT,
  nota TEXT,
  registrado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS estado_pago TEXT;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS fecha_pago_ultimo DATE;
