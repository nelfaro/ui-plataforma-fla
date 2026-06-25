-- Crear tabla conversation_logs para registrar las conversaciones con alumnos
CREATE TABLE IF NOT EXISTS conversation_logs (
    id SERIAL PRIMARY KEY,
    whatsapp VARCHAR(20) NOT NULL,
    mensaje TEXT,
    tipo VARCHAR(50),
    remitente VARCHAR(50),
    estado VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (whatsapp) REFERENCES alumnos(whatsapp) ON DELETE CASCADE
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_conversation_logs_whatsapp ON conversation_logs(whatsapp);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_created_at ON conversation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_estado ON conversation_logs(estado);

-- Agregar datos de prueba (opcional, comentar si no quieres)
-- INSERT INTO conversation_logs (whatsapp, mensaje, tipo, remitente, estado) 
-- SELECT whatsapp, 'Conversación inicial', 'mensaje', 'alumno', 'abierto'
-- FROM alumnos LIMIT 5;

SELECT 'Tabla conversation_logs creada correctamente' as status;
SELECT COUNT(*) as total_conversations FROM conversation_logs;
