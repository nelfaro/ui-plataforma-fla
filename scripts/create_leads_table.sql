-- Script: Crear tabla LEADS separada de ALUMNOS
-- Leads: personas que se comunicaron para consulta/registro (NUEVO, FRIO, TIBIO, CALIENTE)
-- Alumnos: estudiantes registrados con pago/asistencia (PRE-REGISTRADO, REGISTRADO, ACTIVO, PAGO-PENDIENTE, BAJA)

-- ============================================================================
-- 1. CREAR TABLA LEADS
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,

    -- Información personal
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    whatsapp VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(20),

    -- Clasificación
    lead_tipo VARCHAR(50) CHECK (lead_tipo IN ('KIDS', 'AU_PAIR', 'ADULTOS', 'PERSONALIZADO', 'KIDS-ADOLESCENTES')),
    origen VARCHAR(100), -- WhatsApp, Google, Referencia, Facebook, Instagram, Evento, etc.
    categoria VARCHAR(100),

    -- Estado del lead
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('NUEVO', 'FRIO', 'TIBIO', 'CALIENTE')),
    estado_motivo VARCHAR(255), -- Razón del estado actual
    estado_fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Información de nivel y objetivo
    nivel VARCHAR(50), -- A1, A2, B1, B2, C1, C2, Desconocido, Inicial
    objetivo TEXT, -- Descripción del objetivo del lead
    resumen TEXT, -- Resumen relevante del lead

    -- Información de seguimiento
    disponibilidad TEXT, -- Horarios disponibles
    tags TEXT, -- Tags de clasificación (VIAJES, NEGOCIO, EDUCACION, etc)

    -- Fechas de contacto
    primer_contacto TIMESTAMP WITH TIME ZONE,
    ultimo_contacto TIMESTAMP WITH TIME ZONE,
    proxima_cita TIMESTAMP WITH TIME ZONE,

    -- Conversión a alumno
    alumno_id INTEGER, -- Referencia al alumno si se convierte
    fecha_conversion TIMESTAMP WITH TIME ZONE, -- Fecha en que se convirtió a alumno

    -- Metadata
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE SET NULL
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
CREATE INDEX IF NOT EXISTS idx_leads_lead_tipo ON leads(lead_tipo);
CREATE INDEX IF NOT EXISTS idx_leads_origen ON leads(origen);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_ultimo_contacto ON leads(ultimo_contacto);
CREATE INDEX IF NOT EXISTS idx_leads_alumno_id ON leads(alumno_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- ============================================================================
-- 2. ACTUALIZAR TABLA ALUMNOS - Mejorar gestión de estado y pago
-- ============================================================================

-- Agregar CHECK constraint al campo estado para alumnos (si no existe)
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS check_estado_alumno;
ALTER TABLE alumnos ADD CONSTRAINT check_estado_alumno
    CHECK (estado IN ('PRE-REGISTRADO', 'REGISTRADO', 'ACTIVO', 'PAGO-PENDIENTE', 'BAJA'));

-- Agregar CHECK constraint al campo estado_pago (si no existe)
ALTER TABLE alumnos DROP CONSTRAINT IF EXISTS check_estado_pago;
ALTER TABLE alumnos ADD CONSTRAINT check_estado_pago
    CHECK (estado_pago IN ('ACTIVO', 'PAGO-PENDIENTE', 'BAJA', NULL));

-- Crear índices en alumnos si no existen
CREATE INDEX IF NOT EXISTS idx_alumnos_estado ON alumnos(estado);
CREATE INDEX IF NOT EXISTS idx_alumnos_estado_pago ON alumnos(estado_pago);
CREATE INDEX IF NOT EXISTS idx_alumnos_fecha_registro ON alumnos(fecha_registro);

-- ============================================================================
-- 3. VERIFICAR DATOS CARGADOS
-- ============================================================================
SELECT '✓ Tabla leads creada correctamente' as status;
SELECT COUNT(*) as total_leads FROM leads;

SELECT '✓ Estructura de alumnos actualizada' as status;
SELECT estado, COUNT(*) FROM alumnos GROUP BY estado ORDER BY estado;

-- ============================================================================
-- 4. SCRIPTS DE EJEMPLO PARA INSERTAR LEADS
-- ============================================================================
-- INSERT INTO leads (nombre, apellido, whatsapp, email, lead_tipo, origen, estado, nivel, objetivo, resumen, primer_contacto, ultimo_contacto)
-- VALUES
-- ('Juan', 'García', '+5491123456789', 'juan@email.com', 'ADULTOS', 'WhatsApp', 'NUEVO', 'A1', 'Aprender inglés para viajes', 'Muy interesado, disponible por las noches', NOW(), NOW()),
-- ('María', 'López', '+5491234567890', 'maria@email.com', 'KIDS', 'Referencia', 'TIBIO', 'Desconocido', 'Clases para su hijo', 'Consultó hace 1 semana, está considerando', NOW() - INTERVAL '7 days', NOW());
