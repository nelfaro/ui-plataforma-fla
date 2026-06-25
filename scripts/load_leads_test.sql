-- Script para cargar datos de prueba en la tabla leads
-- Estados: NUEVO, FRIO, TIBIO, CALIENTE
-- Para visualizar el pipeline en el UI

INSERT INTO leads (nombre, whatsapp, email, estado, nivel, origen, lead_tipo, objetivo, resumen, tags, primera_consulta, ultimo_contacto) VALUES

-- NUEVOS
('Juan García', '+5491123456789', 'juan.garcia@email.com', 'NUEVO', 'A1', 'WhatsApp', 'ADULTO', 'Clases de inglés para viajes', 'Interesado en conversación básica', 'VIAJES', NOW(), NOW()),
('María López', '+5491234567890', 'maria.lopez@email.com', 'NUEVO', 'B1', 'Google', 'ADULTO', 'Inglés para trabajo', 'Necesita mejorar pronunciación', 'NEGOCIO', NOW() - interval '1 day', NOW() - interval '1 day'),
('Carlos Rodríguez', '+5491345678901', 'carlos.r@email.com', 'NUEVO', 'A2', 'Facebook', 'KIDS', 'Clases para su hijo', 'Niño de 8 años, primeras clases', 'EDUCACION', NOW() - interval '3 days', NOW() - interval '3 days'),

-- FRIOS
('Ana Martínez', '+5491456789012', 'ana.martinez@email.com', 'FRIO', 'Desconocido', 'Referencia', 'ADULTO', 'Conversación avanzada', 'Se contactó hace 2 semanas, sin respuesta', 'CONVERSACION', NOW() - interval '14 days', NOW() - interval '10 days'),
('Diego Fernández', '+5491567890123', 'diego.f@email.com', 'FRIO', 'B2', 'Evento', 'ADULTO', 'Preparación para viaje', 'Expresó interés en evento, no respondió follow-up', 'VIAJES', NOW() - interval '20 days', NOW() - interval '8 days'),

-- TIBIOS
('Sofía Gómez', '+5491678901234', 'sofia.gomez@email.com', 'TIBIO', 'A1', 'WhatsApp', 'AU_PAIR', 'Au Pair en preparación', 'Viaja a Europa en 3 meses, muy interesada', 'VIAJAR', NOW() - interval '7 days', NOW() - interval '2 days'),
('Lucas Pérez', '+5491789012345', 'lucas.perez@email.com', 'TIBIO', 'B1', 'Instagram', 'ADULTO', 'Inglés de negocios', 'CEO startup, quiere mejorar para negociaciones', 'EJECUTIVO', NOW() - interval '5 days', NOW() - interval '1 day'),
('Valentina Torres', '+5491890123456', 'valentina.t@email.com', 'TIBIO', 'Inicial', 'Referencia', 'KIDS', 'Clases grupales para niños', 'Madre de 2 niños, consultando horarios', 'GRUPOS', NOW() - interval '3 days', NOW() - interval '12 hours'),

-- CALIENTES
('Roberto Silva', '+5491901234567', 'roberto.silva@email.com', 'CALIENTE', 'A2', 'Google', 'ADULTO', 'Conversación diaria', 'Listo para empezar la próxima semana, eligiendo horario', 'INMEDIATO', NOW() - interval '1 day', NOW() - interval '2 hours'),
('Catalina Ruiz', '+5492001234567', 'catalina.ruiz@email.com', 'CALIENTE', 'B2', 'Referencia', 'ADULTO', 'Preparación Cambridge', 'Pagó primer mes, comenzando clases el lunes', 'EXAMENES', NOW() - interval '2 days', NOW() - interval '30 minutes'),
('Pablo Mendoza', '+5492101234567', 'pablo.mendoza@email.com', 'CALIENTE', 'B1', 'WhatsApp', 'ADULTO', 'Clases one-to-one', 'Confirmó 2 clases de prueba, muy motivado', 'PRIVADAS', NOW() - interval '4 days', NOW() - interval '15 minutes')

ON CONFLICT DO NOTHING;

SELECT 'Datos de leads cargados correctamente' as status;
SELECT COUNT(*) as total_leads FROM leads;
SELECT estado, COUNT(*) as cantidad FROM leads GROUP BY estado ORDER BY estado;
