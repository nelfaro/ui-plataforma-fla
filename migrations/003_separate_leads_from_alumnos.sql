-- ============================================
-- Migración 003: Separar Leads de Alumnos
-- ============================================
-- Esta migración separa la tabla alumnos en dos:
-- - leads: Estados NUEVO, FRIO, TIBIO, CALIENTE (pre-venta)
-- - alumnos: Estados REGISTRADO, ACTIVO, PAUSADO, BAJA (post-venta)
-- ============================================

-- PASO 1: Crear tabla LEADS
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
  lead_tipo TEXT CHECK (lead_tipo IN ('KIDS','ADULTO','ADOLESCENTE','AU_PAIR','PERSONALIZADO')),
  objetivo TEXT,
  resumen TEXT,
  tags TEXT,
  disponibilidad TEXT,
  completitud TEXT,
  primera_consulta TIMESTAMPTZ,
  ultimo_contacto TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASO 2: Copiar datos FRIO/TIBIO/CALIENTE/NUEVO a tabla LEADS
-- (Si hay registros con estado NUEVO en alumnos, se copian también)
INSERT INTO leads (
  nombre, whatsapp, email, estado, nivel, origen, lead_tipo,
  objetivo, resumen, tags, disponibilidad, completitud,
  primera_consulta, ultimo_contacto, created_at, updated_at
)
SELECT
  nombre, whatsapp, email, estado, nivel, origen, lead_tipo,
  objetivo, resumen, tags, disponibilidad, completitud,
  primera_consulta, ultimo_contacto, created_at, updated_at
FROM alumnos
WHERE estado IN ('NUEVO','FRIO','TIBIO','CALIENTE');

-- PASO 3: Eliminar registros de LEADS de la tabla alumnos
DELETE FROM alumnos
WHERE estado IN ('NUEVO','FRIO','TIBIO','CALIENTE');

-- PASO 4: Actualizar constraint de estado en alumnos
-- Primero, eliminar el constraint anterior
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS alumnos_estado_check;

-- Crear nuevo constraint solo con estados de alumnos (post-venta)
ALTER TABLE alumnos ADD CONSTRAINT alumnos_estado_check
  CHECK (estado IN ('REGISTRADO','ACTIVO','PAUSADO','BAJA'));

-- PASO 5: Renombrar campo fecha_registro a fecha_registro si no existe
-- (Asumiendo que alumnos ya tiene este campo, sino crear)

-- PASO 6: Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_origen ON leads(origen);
CREATE INDEX IF NOT EXISTS idx_leads_lead_tipo ON leads(lead_tipo);
CREATE INDEX IF NOT EXISTS idx_leads_ultimo_contacto ON leads(ultimo_contacto);

CREATE INDEX IF NOT EXISTS idx_alumnos_estado ON alumnos(estado);
CREATE INDEX IF NOT EXISTS idx_alumnos_lead_tipo ON alumnos(lead_tipo);

-- PASO 7: Verificación
SELECT
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM alumnos) as total_alumnos,
  (SELECT COUNT(DISTINCT estado) FROM leads) as distinct_lead_estados,
  (SELECT COUNT(DISTINCT estado) FROM alumnos) as distinct_alumno_estados;

-- PASO 8: Mostrar distribución
SELECT 'LEADS' as tabla, estado, COUNT(*) as cantidad
FROM leads
GROUP BY estado
UNION ALL
SELECT 'ALUMNOS' as tabla, estado, COUNT(*) as cantidad
FROM alumnos
GROUP BY estado
ORDER BY tabla, cantidad DESC;
