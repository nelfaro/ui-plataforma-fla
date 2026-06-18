-- ============================================
-- SCRIPT DE RECUPERACIÓN COMPLETO - BD FLA
-- Ejecutar en PostgreSQL para recrear toda la BD
-- ============================================

-- PASO 1: CREAR TABLA BASE ALUMNOS
CREATE TABLE IF NOT EXISTS alumnos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('REGISTRADO','ACTIVO','PAUSADO','BAJA','NUEVO','FRIO','TIBIO','CALIENTE')),
  estado_motivo TEXT,
  estado_fecha TIMESTAMPTZ,
  nivel TEXT,
  origen TEXT,
  lead_tipo TEXT CHECK (lead_tipo IN ('KIDS','ADULTO','ADOLESCENTE','AU_PAIR','PERSONALIZADO','ADULTOS','KIDS-ADOLESCENTES')),
  categoria TEXT CHECK (categoria IN ('KIDS','ADULTO','ADOLESCENTE','AU_PAIR','PERSONALIZADO','ADULTOS','KIDS-ADOLESCENTES')),
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

-- PASO 2: CREAR TABLA CONOCIMIENTO_ACADEMIA
CREATE TABLE IF NOT EXISTS conocimiento_academia (
  id SERIAL PRIMARY KEY,
  categoria TEXT NOT NULL CHECK (categoria IN ('PRECIOS','FAQ','METODOLOGIA','CLASES')),
  segmento TEXT NOT NULL CHECK (segmento IN ('KIDS','ADULTOS','AU_PAIR','PERSONALIZADO','GENERAL')),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 3: CREAR TABLA ACADEMIA_CONFIG
CREATE TABLE IF NOT EXISTS academia_config (
  id SERIAL PRIMARY KEY,
  clave TEXT NOT NULL UNIQUE,
  valor TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 4: CREAR TABLA LEADS (separada de ALUMNOS)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('NUEVO','FRIO','TIBIO','CALIENTE')),
  estado_motivo TEXT,
  estado_fecha TIMESTAMPTZ,
  nivel TEXT,
  origen TEXT,
  lead_tipo TEXT CHECK (lead_tipo IN ('KIDS','ADULTO','ADOLESCENTE','AU_PAIR','PERSONALIZADO','ADULTOS','KIDS-ADOLESCENTES')),
  categoria TEXT CHECK (categoria IN ('KIDS','ADULTO','ADOLESCENTE','AU_PAIR','PERSONALIZADO','ADULTOS','KIDS-ADOLESCENTES')),
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

-- PASO 5: CREAR TABLA CONVERSATION_LOG
CREATE TABLE IF NOT EXISTS conversation_log (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER,
  alumno_id INTEGER,
  mensaje TEXT,
  tipo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 6: CREAR TABLA HORARIOS
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

-- PASO 7: CREAR TABLA ALUMNOS_HORARIOS (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS alumnos_horarios (
  id SERIAL PRIMARY KEY,
  alumno_id INTEGER NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  horario_id INTEGER NOT NULL REFERENCES horarios(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE,
  UNIQUE(alumno_id, horario_id)
);

-- PASO 8: CREAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_alumnos_estado ON alumnos(estado);
CREATE INDEX IF NOT EXISTS idx_alumnos_origen ON alumnos(origen);
CREATE INDEX IF NOT EXISTS idx_alumnos_categoria ON alumnos(categoria);
CREATE INDEX IF NOT EXISTS idx_alumnos_ultimo_contacto ON alumnos(ultimo_contacto);

CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_origen ON leads(origen);
CREATE INDEX IF NOT EXISTS idx_leads_categoria ON leads(categoria);
CREATE INDEX IF NOT EXISTS idx_leads_ultimo_contacto ON leads(ultimo_contacto);

CREATE INDEX IF NOT EXISTS idx_conocimiento_categoria_segmento ON conocimiento_academia(categoria, segmento);
CREATE INDEX IF NOT EXISTS idx_conocimiento_activo ON conocimiento_academia(activo);

CREATE INDEX IF NOT EXISTS idx_horarios_activo ON horarios(activo);

-- PASO 9: ACTUALIZAR CONSTRAINT DE ESTADO EN ALUMNOS (solo post-venta)
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_estado_check;
ALTER TABLE alumnos ADD CONSTRAINT alumnos_estado_check
  CHECK (estado IN ('REGISTRADO','ACTIVO','PAUSADO','BAJA'));

-- PASO 10: VERIFICACIÓN FINAL
SELECT
  'Tablas creadas correctamente' as status,
  (SELECT COUNT(*) FROM alumnos) as total_alumnos,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM horarios) as total_horarios,
  (SELECT COUNT(*) FROM conocimiento_academia) as total_conocimiento;
