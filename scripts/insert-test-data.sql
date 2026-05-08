-- Insertar datos sintéticos para testing del dashboard
-- Abril 2026 con diferentes estados y orígenes

INSERT INTO alumnos (
  nombre, whatsapp, email, origen, estado, lead_tipo,
  intencion, objetivo, nivel, disponibilidad,
  fecha_registro, primer_contacto, ultimo_contacto,
  created_at, updated_at
) VALUES

-- ORGÁNICO - NUEVOS
('Juan García', '+5491234567890', 'juan@example.com', 'Orgánico', 'NUEVO', 'ADULTOS', 'Aprender inglés', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-02 09:30:00+00:00', '2026-04-02 09:30:00+00:00', '2026-04-02 09:30:00+00:00', NOW(), NOW()),
('María López', '+5491234567891', 'maria@example.com', 'Orgánico', 'NUEVO', 'ADULTOS', 'Mejorar pronunciación', 'Conversación', 'Intermedio', 'Martes y jueves', '2026-04-05 14:20:00+00:00', '2026-04-05 14:20:00+00:00', '2026-04-05 14:20:00+00:00', NOW(), NOW()),
('Carlos Rodríguez', '+5491234567892', 'carlos@example.com', 'Orgánico', 'NUEVO', 'ADULTOS', 'Certificación', 'Examen', 'Avanzado', 'Viernes', '2026-04-08 10:15:00+00:00', '2026-04-08 10:15:00+00:00', '2026-04-08 10:15:00+00:00', NOW(), NOW()),
('Ana Martínez', '+5491234567893', 'ana@example.com', 'Orgánico', 'NUEVO', 'KIDS', 'Apoyo escolar', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-10 15:45:00+00:00', '2026-04-10 15:45:00+00:00', '2026-04-10 15:45:00+00:00', NOW(), NOW()),
('Diego Fernández', '+5491234567894', 'diego@example.com', 'Orgánico', 'NUEVO', 'ADULTOS', 'Trabajo', 'Laboral', 'Intermedio', 'Sábado', '2026-04-12 11:00:00+00:00', '2026-04-12 11:00:00+00:00', '2026-04-12 11:00:00+00:00', NOW(), NOW()),

-- ORGÁNICO - NUTRIENDO
('Laura Gómez', '+5491234567895', 'laura@example.com', 'Orgánico', 'CONSULTÓ', 'ADULTOS', 'Conversación fluida', 'Conversación', 'Intermedio', 'Lunes y miércoles', '2026-04-03 13:30:00+00:00', '2026-04-03 13:30:00+00:00', '2026-04-15 16:20:00+00:00', NOW(), NOW()),
('Roberto Silva', '+5491234567896', 'roberto@example.com', 'Orgánico', 'INTERESADO', 'ADULTOS', 'Viaje al extranjero', 'Viaje', 'Básico', 'Martes y jueves', '2026-04-06 09:00:00+00:00', '2026-04-06 09:00:00+00:00', '2026-04-18 10:30:00+00:00', NOW(), NOW()),
('Patricia Ruiz', '+5491234567897', 'patricia@example.com', 'Orgánico', 'NUTRIENDO', 'KIDS', 'Mejorar calificaciones', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-07 14:00:00+00:00', '2026-04-07 14:00:00+00:00', '2026-04-20 15:00:00+00:00', NOW(), NOW()),
('Fernando Díaz', '+5491234567898', 'fernando@example.com', 'Orgánico', 'INTERESADO', 'ADULTOS', 'Negociaciones', 'Laboral', 'Avanzado', 'Sábado', '2026-04-09 10:30:00+00:00', '2026-04-09 10:30:00+00:00', '2026-04-17 11:45:00+00:00', NOW(), NOW()),

-- ORGÁNICO - CONVERSIÓN
('Sofía Pérez', '+5491234567899', 'sofia@example.com', 'Orgánico', 'REGISTRADO', 'ADULTOS', 'Aprender inglés', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-04 08:45:00+00:00', '2026-04-04 08:45:00+00:00', '2026-04-22 09:00:00+00:00', '2026-04-04 08:45:00+00:00', NOW()),
('Andrés Cabrera', '+5491234567800', 'andres@example.com', 'Orgánico', 'ACTIVO', 'ADULTOS', 'Certificación', 'Examen', 'Intermedio', 'Martes y jueves', '2026-04-01 12:00:00+00:00', '2026-04-01 12:00:00+00:00', '2026-04-25 14:30:00+00:00', '2026-04-01 12:00:00+00:00', NOW()),
('Valentina López', '+5491234567801', 'valentina@example.com', 'Orgánico', 'REGISTRADO', 'KIDS', 'Apoyo escolar', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-11 15:30:00+00:00', '2026-04-11 15:30:00+00:00', '2026-04-23 16:00:00+00:00', '2026-04-11 15:30:00+00:00', NOW()),
('Marcelo Santos', '+5491234567802', 'marcelo@example.com', 'Orgánico', 'ACTIVO', 'ADULTOS', 'Trabajo', 'Laboral', 'Intermedio', 'Viernes', '2026-04-02 16:00:00+00:00', '2026-04-02 16:00:00+00:00', '2026-04-24 17:30:00+00:00', '2026-04-02 16:00:00+00:00', NOW()),

-- RECOMENDACIÓN - NUEVOS
('Lucía Mendez', '+5491234567803', 'lucia@example.com', 'RECOMENDACION', 'NUEVO', 'ADULTOS', 'Aprender inglés', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-14 10:00:00+00:00', '2026-04-14 10:00:00+00:00', '2026-04-14 10:00:00+00:00', NOW(), NOW()),
('Pedro Jiménez', '+5491234567804', 'pedro@example.com', 'RECOMENDACION', 'NUEVO', 'ADULTOS', 'Mejorar pronunciación', 'Conversación', 'Intermedio', 'Martes y jueves', '2026-04-16 13:15:00+00:00', '2026-04-16 13:15:00+00:00', '2026-04-16 13:15:00+00:00', NOW(), NOW()),
('Isabella Rossi', '+5491234567805', 'isabella@example.com', 'RECOMENDACION', 'NUEVO', 'AU_PAIR', 'Au pair', 'Conversación', 'Intermedio', 'Flexible', '2026-04-19 11:30:00+00:00', '2026-04-19 11:30:00+00:00', '2026-04-19 11:30:00+00:00', NOW(), NOW()),
('Gustavo Núñez', '+5491234567806', 'gustavo@example.com', 'RECOMENDACION', 'NUEVO', 'ADULTOS', 'Viaje', 'Viaje', 'Básico', 'Sábado', '2026-04-21 14:45:00+00:00', '2026-04-21 14:45:00+00:00', '2026-04-21 14:45:00+00:00', NOW(), NOW()),

-- RECOMENDACIÓN - NUTRIENDO
('Francesca Bernardi', '+5491234567807', 'francesca@example.com', 'RECOMENDACION', 'CONSULTÓ', 'AU_PAIR', 'Au pair', 'Conversación', 'Intermedio', 'Flexible', '2026-04-13 09:30:00+00:00', '2026-04-13 09:30:00+00:00', '2026-04-21 10:00:00+00:00', NOW(), NOW()),
('Mateo Torres', '+5491234567808', 'mateo@example.com', 'RECOMENDACION', 'NUTRIENDO', 'ADULTOS', 'Trabajo', 'Laboral', 'Avanzado', 'Viernes', '2026-04-15 15:00:00+00:00', '2026-04-15 15:00:00+00:00', '2026-04-22 16:30:00+00:00', NOW(), NOW()),
('Natalia Quiroga', '+5491234567809', 'natalia@example.com', 'RECOMENDACION', 'INTERESADO', 'KIDS', 'Apoyo escolar', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-17 14:20:00+00:00', '2026-04-17 14:20:00+00:00', '2026-04-24 15:00:00+00:00', NOW(), NOW()),

-- RECOMENDACIÓN - CONVERSIÓN
('Alejandro Suárez', '+5491234567810', 'alejandro@example.com', 'RECOMENDACION', 'REGISTRADO', 'ADULTOS', 'Certificación', 'Examen', 'Intermedio', 'Martes y jueves', '2026-04-08 11:00:00+00:00', '2026-04-08 11:00:00+00:00', '2026-04-23 12:30:00+00:00', '2026-04-08 11:00:00+00:00', NOW()),
('Camila Vargas', '+5491234567811', 'camila@example.com', 'RECOMENDACION', 'ACTIVO', 'ADULTOS', 'Conversación fluida', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-06 13:45:00+00:00', '2026-04-06 13:45:00+00:00', '2026-04-25 14:15:00+00:00', '2026-04-06 13:45:00+00:00', NOW()),
('Tomás García', '+5491234567812', 'tomas@example.com', 'RECOMENDACION', 'REGISTRADO', 'ADULTOS', 'Negociaciones', 'Laboral', 'Avanzado', 'Sábado', '2026-04-12 10:15:00+00:00', '2026-04-12 10:15:00+00:00', '2026-04-24 11:00:00+00:00', '2026-04-12 10:15:00+00:00', NOW()),
('Emma Rodríguez', '+5491234567813', 'emma@example.com', 'RECOMENDACION', 'ACTIVO', 'KIDS', 'Mejorar calificaciones', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-09 16:00:00+00:00', '2026-04-09 16:00:00+00:00', '2026-04-25 16:30:00+00:00', '2026-04-09 16:00:00+00:00', NOW());
