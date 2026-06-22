CREATE TABLE IF NOT EXISTS pagos_manuales (
  id SERIAL PRIMARY KEY,
  alumno_id INTEGER,
  monto DECIMAL(10,2),
  fecha_pago DATE NOT NULL,
  tipo_pago TEXT,
  metodo TEXT,
  nota TEXT,
  registrado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
