CREATE TABLE IF NOT EXISTS alumnos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  estado TEXT NOT NULL,
  estado_motivo TEXT,
  estado_fecha TIMESTAMPTZ,
  nivel TEXT,
  origen TEXT,
  lead_tipo TEXT,
  categoria TEXT,
  objetivo TEXT,
  resumen TEXT,
  tags TEXT,
  disponibilidad TEXT,
  completitud TEXT,
  intencion TEXT,
  primera_consulta TIMESTAMPTZ,
  primer_contacto TIMESTAMPTZ,
  ultimo_contacto TIMESTAMPTZ,
  fecha_registro TIMESTAMPTZ,
  fecha_nacimiento TEXT,
  tutor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  estado TEXT NOT NULL,
  estado_motivo TEXT,
  estado_fecha TIMESTAMPTZ,
  nivel TEXT,
  origen TEXT,
  lead_tipo TEXT,
  categoria TEXT,
  objetivo TEXT,
  resumen TEXT,
  tags TEXT,
  disponibilidad TEXT,
  completitud TEXT,
  intencion TEXT,
  primera_consulta TIMESTAMPTZ,
  primer_contacto TIMESTAMPTZ,
  ultimo_contacto TIMESTAMPTZ,
  fecha_registro TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conocimiento_academia (
  id SERIAL PRIMARY KEY,
  categoria TEXT NOT NULL,
  segmento TEXT NOT NULL,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academia_config (
  id SERIAL PRIMARY KEY,
  clave TEXT NOT NULL UNIQUE,
  valor TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_log (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER,
  alumno_id INTEGER,
  mensaje TEXT,
  tipo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios (
  id SERIAL PRIMARY KEY,
  dia_semana TEXT NOT NULL,
  hora_inicio TEXT NOT NULL,
  hora_fin TEXT NOT NULL,
  profesor TEXT,
  nivel TEXT,
  categoria TEXT,
  cupo_maximo INTEGER DEFAULT 1,
  cupo_actual INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alumnos_horarios (
  id SERIAL PRIMARY KEY,
  alumno_id INTEGER NOT NULL,
  horario_id INTEGER NOT NULL,
  fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(alumno_id, horario_id)
);

CREATE INDEX IF NOT EXISTS idx_alumnos_estado ON alumnos(estado);
CREATE INDEX IF NOT EXISTS idx_alumnos_origen ON alumnos(origen);
CREATE INDEX IF NOT EXISTS idx_alumnos_categoria ON alumnos(categoria);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_origen ON leads(origen);
CREATE INDEX IF NOT EXISTS idx_horarios_activo ON horarios(activo);

SELECT COUNT(*) as alumnos FROM alumnos;
SELECT COUNT(*) as leads FROM leads;
SELECT COUNT(*) as horarios FROM horarios;
