-- Script para cargar datos de prueba en las tablas del dashboard

-- 1. Actualizar alumnos con origen (si es NULL)
UPDATE alumnos
SET origen = CASE
    WHEN id % 3 = 0 THEN 'WhatsApp'
    WHEN id % 3 = 1 THEN 'Google'
    ELSE 'Referencia'
END
WHERE origen IS NULL;

-- 2. Insertar datos de prueba en conversation_log (últimos 7 días)
-- La tabla ya existe con estructura: id, lead_id, alumno_id, mensaje, tipo, created_at
INSERT INTO conversation_log (alumno_id, lead_id, mensaje, tipo, created_at)
SELECT
    a.id,
    a.id as lead_id,
    'Conversación de prueba ' || a.id,
    'mensaje',
    CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '7 days')
FROM alumnos a
WHERE NOT EXISTS (
    SELECT 1 FROM conversation_log cl WHERE cl.alumno_id = a.id
)
LIMIT 20;

-- 3. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_conversation_log_alumno_id ON conversation_log(alumno_id);
CREATE INDEX IF NOT EXISTS idx_conversation_log_lead_id ON conversation_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversation_log_created_at ON conversation_log(created_at);

-- 5. Crear tabla pagos si no existe
CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    monto DECIMAL(10, 2),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'completado',
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pagos_alumno_id ON pagos(alumno_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha_pago ON pagos(fecha_pago);

-- 6. Crear tabla pagos_manuales si no existe
CREATE TABLE IF NOT EXISTS pagos_manuales (
    id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    monto DECIMAL(10, 2),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comprobante_url VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'pendiente',
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pagos_manuales_alumno_id ON pagos_manuales(alumno_id);
CREATE INDEX IF NOT EXISTS idx_pagos_manuales_estado ON pagos_manuales(estado);

-- 7. Insertar datos de prueba en pagos
INSERT INTO pagos (alumno_id, monto, fecha_pago, metodo_pago, estado)
SELECT
    a.id,
    ROUND((RANDOM() * 500 + 100)::NUMERIC, 2),
    CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '30 days'),
    CASE WHEN RANDOM() > 0.5 THEN 'transferencia' ELSE 'efectivo' END,
    'completado'
FROM alumnos a
WHERE estado IN ('ACTIVO', 'REGISTRADO')
LIMIT 10;

-- 8. Insertar datos de prueba en pagos_manuales
INSERT INTO pagos_manuales (alumno_id, monto, fecha_pago, estado)
SELECT
    a.id,
    ROUND((RANDOM() * 500 + 100)::NUMERIC, 2),
    CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '15 days'),
    CASE WHEN RANDOM() > 0.5 THEN 'aprobado' ELSE 'pendiente' END
FROM alumnos a
WHERE estado IN ('ACTIVO', 'REGISTRADO')
LIMIT 5;

-- Verificar datos cargados
SELECT '✓ Alumnos con origen:' as info;
SELECT origen, COUNT(*) FROM alumnos WHERE origen IS NOT NULL GROUP BY origen;

SELECT '✓ Conversaciones cargadas:' as info;
SELECT COUNT(*) as total_conversations FROM conversation_log;

SELECT '✓ Última conversación:' as info;
SELECT MAX(created_at) as ultima_fecha FROM conversation_log;

SELECT '✓ Pagos cargados:' as info;
SELECT COUNT(*) as total_pagos FROM pagos;

SELECT '✓ Datos cargados correctamente' as status;
