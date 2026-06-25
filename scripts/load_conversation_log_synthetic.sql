-- Script: Cargar datos sintéticos en conversation_log
-- Simula conversaciones reales entre leads/alumnos y el sistema

-- ============================================================================
-- 1. OBTENER WHATSAPP EXISTENTES DE LEADS
-- ============================================================================
-- Vamos a crear datos sintéticos usando leads y alumnos existentes

-- ============================================================================
-- 2. CARGAR DATOS SINTÉTICOS DE CONVERSACIONES
-- ============================================================================
INSERT INTO conversation_log (
    lead_id,
    alumno_id,
    mensaje,
    tipo,
    direccion,
    tipo_media,
    mensaje_preview,
    lead_tipo,
    intencion,
    created_at
)
WITH leads_data AS (
    SELECT
        l.id as lead_id,
        l.whatsapp,
        l.nombre,
        l.lead_tipo,
        l.estado,
        NULL::integer as alumno_id,
        CURRENT_TIMESTAMP - (random() * interval '30 days') as msg_time,
        row_number() OVER (ORDER BY l.id) as rn
    FROM leads l
    WHERE l.whatsapp IS NOT NULL
    LIMIT 20
)
SELECT
    ld.lead_id,
    ld.alumno_id,
    CASE
        WHEN ld.rn % 4 = 1 THEN 'Hola, me gustaría consultar sobre clases de inglés'
        WHEN ld.rn % 4 = 2 THEN 'Tengo interés en clases para mi hijo'
        WHEN ld.rn % 4 = 3 THEN 'Cuál es el horario disponible?'
        ELSE 'Me gustaría empezar la próxima semana'
    END as mensaje,
    'mensaje' as tipo,
    'entrada' as direccion,
    'texto' as tipo_media,
    SUBSTRING(
        CASE
            WHEN ld.rn % 4 = 1 THEN 'Hola, me gustaría consultar sobre clases de inglés'
            WHEN ld.rn % 4 = 2 THEN 'Tengo interés en clases para mi hijo'
            WHEN ld.rn % 4 = 3 THEN 'Cuál es el horario disponible?'
            ELSE 'Me gustaría empezar la próxima semana'
        END,
        1,
        50
    ) as mensaje_preview,
    ld.lead_tipo,
    CASE
        WHEN ld.rn % 5 = 1 THEN 'consulta'
        WHEN ld.rn % 5 = 2 THEN 'venta'
        WHEN ld.rn % 5 = 3 THEN 'seguimiento'
        WHEN ld.rn % 5 = 4 THEN 'cierre'
        ELSE 'otro'
    END as intencion,
    ld.msg_time
FROM leads_data ld
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. AGREGAR MENSAJES DE RESPUESTA (salida)
-- ============================================================================
INSERT INTO conversation_log (
    lead_id,
    alumno_id,
    mensaje,
    tipo,
    direccion,
    tipo_media,
    mensaje_preview,
    lead_tipo,
    intencion,
    created_at
)
SELECT
    cl.lead_id,
    cl.alumno_id,
    CASE
        WHEN cl.id % 3 = 1 THEN '¡Hola! Nos encantaría ayudarte. Contamos con clases personalizadas para todos los niveles.'
        WHEN cl.id % 3 = 2 THEN 'Tenemos excelentes programas para niños. ¿Cuál es la edad? ¿Nivel de inglés actual?'
        ELSE '¡Perfecto! Tenemos horarios disponibles. ¿Prefieres mañana, tarde o noche?'
    END as mensaje,
    'mensaje' as tipo,
    'salida' as direccion,
    'texto' as tipo_media,
    SUBSTRING(
        CASE
            WHEN cl.id % 3 = 1 THEN '¡Hola! Nos encantaría ayudarte. Contamos con clases personalizadas para todos los niveles.'
            WHEN cl.id % 3 = 2 THEN 'Tenemos excelentes programas para niños. ¿Cuál es la edad? ¿Nivel de inglés actual?'
            ELSE '¡Perfecto! Tenemos horarios disponibles. ¿Prefieres mañana, tarde o noche?'
        END,
        1,
        50
    ) as mensaje_preview,
    cl.lead_tipo,
    'soporte' as intencion,
    cl.created_at + interval '5 minutes'
FROM conversation_log cl
WHERE cl.direccion = 'entrada'
AND cl.id NOT IN (
    SELECT cl2.id FROM conversation_log cl2 WHERE cl2.direccion = 'salida'
)
LIMIT 20
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. VERIFICAR DATOS CARGADOS
-- ============================================================================
SELECT '✓ Datos sintéticos de conversation_log cargados' as status;
SELECT COUNT(*) as total_messages FROM conversation_log;
SELECT direccion, COUNT(*) as count FROM conversation_log GROUP BY direccion;
SELECT tipo_media, COUNT(*) as count FROM conversation_log GROUP BY tipo_media;
SELECT lead_tipo, COUNT(*) as count FROM conversation_log GROUP BY lead_tipo WHERE lead_tipo IS NOT NULL;
SELECT intencion, COUNT(*) as count FROM conversation_log GROUP BY intencion;
