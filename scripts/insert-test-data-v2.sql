-- Insertar datos de prueba para testing con el nuevo sistema de estados
-- Mayo 2026 con estados FRIO/TIBIO/CALIENTE/ACTIVO y orígenes del nuevo prompt

INSERT INTO alumnos (
  nombre, whatsapp, email, origen, estado, lead_tipo,
  objetivo, nivel, disponibilidad,
  fecha_registro, primera_consulta, ultimo_contacto,
  fecha_activacion, completitud
) VALUES

-- RECOMENDACIÓN - FRIO
('Juan García', '+5491234567890', 'juan@example.com', 'RECOMENDACION', 'FRIO', 'ADULTO', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-05-01 09:30:00+00:00', '2026-05-01 09:30:00+00:00', '2026-05-01 09:30:00+00:00', NULL, 'BAJA'),
('María López', '+5491234567891', 'maria@example.com', 'RECOMENDACION', 'FRIO', 'ADULTO', 'Conversación', 'Intermedio', 'Martes y jueves', '2026-05-02 14:20:00+00:00', '2026-05-02 14:20:00+00:00', '2026-05-02 14:20:00+00:00', NULL, 'BAJA'),

-- RECOMENDACIÓN - TIBIO
('Carlos Rodríguez', '+5491234567892', 'carlos@example.com', 'RECOMENDACION', 'TIBIO', 'ADULTO', 'Examen', 'Avanzado', 'Viernes', '2026-04-28 10:15:00+00:00', '2026-04-28 10:15:00+00:00', '2026-05-03 15:45:00+00:00', NULL, 'MEDIA'),
('Ana Martínez', '+5491234567893', 'ana@example.com', 'RECOMENDACION', 'TIBIO', 'KIDS', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-25 15:45:00+00:00', '2026-04-25 15:45:00+00:00', '2026-05-02 10:30:00+00:00', NULL, 'MEDIA'),
('Diego Fernández', '+5491234567894', 'diego@example.com', 'RECOMENDACION', 'TIBIO', 'ADULTO', 'Laboral', 'Intermedio', 'Sábado', '2026-04-30 11:00:00+00:00', '2026-04-30 11:00:00+00:00', '2026-05-04 16:20:00+00:00', NULL, 'MEDIA'),

-- RECOMENDACIÓN - CALIENTE
('Laura Gómez', '+5491234567895', 'laura@example.com', 'RECOMENDACION', 'CALIENTE', 'ADULTO', 'Conversación', 'Intermedio', 'Lunes y miércoles', '2026-04-20 13:30:00+00:00', '2026-04-20 13:30:00+00:00', '2026-05-05 11:15:00+00:00', NULL, 'ALTA'),
('Roberto Silva', '+5491234567896', 'roberto@example.com', 'RECOMENDACION', 'CALIENTE', 'ADULTO', 'Viaje', 'Básico', 'Martes y jueves', '2026-04-18 09:00:00+00:00', '2026-04-18 09:00:00+00:00', '2026-05-04 14:30:00+00:00', NULL, 'ALTA'),
('Patricia Ruiz', '+5491234567897', 'patricia@example.com', 'RECOMENDACION', 'CALIENTE', 'KIDS', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-15 14:00:00+00:00', '2026-04-15 14:00:00+00:00', '2026-05-03 15:00:00+00:00', NULL, 'ALTA'),

-- RECOMENDACIÓN - ACTIVO
('Fernando Díaz', '+5491234567898', 'fernando@example.com', 'RECOMENDACION', 'ACTIVO', 'ADULTO', 'Laboral', 'Avanzado', 'Sábado', '2026-04-10 10:30:00+00:00', '2026-04-10 10:30:00+00:00', '2026-05-02 11:45:00+00:00', '2026-04-10 10:30:00+00:00', 'ALTA'),
('Sofía Pérez', '+5491234567899', 'sofia@example.com', 'RECOMENDACION', 'ACTIVO', 'ADULTO', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-05 08:45:00+00:00', '2026-04-05 08:45:00+00:00', '2026-05-01 09:00:00+00:00', '2026-04-05 08:45:00+00:00', 'ALTA'),

-- INSTAGRAM - FRIO
('Lucía Mendez', '+5491234567803', 'lucia@example.com', 'INSTAGRAM', 'FRIO', 'ADULTO', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-05-03 10:00:00+00:00', '2026-05-03 10:00:00+00:00', '2026-05-03 10:00:00+00:00', NULL, 'BAJA'),
('Pedro Jiménez', '+5491234567804', 'pedro@example.com', 'INSTAGRAM', 'FRIO', 'ADULTO', 'Conversación', 'Intermedio', 'Martes y jueves', '2026-05-04 13:15:00+00:00', '2026-05-04 13:15:00+00:00', '2026-05-04 13:15:00+00:00', NULL, 'BAJA'),

-- INSTAGRAM - TIBIO
('Isabella Rossi', '+5491234567805', 'isabella@example.com', 'INSTAGRAM', 'TIBIO', 'AU_PAIR', 'Conversación', 'Intermedio', 'Flexible', '2026-04-22 11:30:00+00:00', '2026-04-22 11:30:00+00:00', '2026-05-02 17:00:00+00:00', NULL, 'MEDIA'),
('Gustavo Núñez', '+5491234567806', 'gustavo@example.com', 'INSTAGRAM', 'TIBIO', 'ADULTO', 'Viaje', 'Básico', 'Sábado', '2026-04-20 14:45:00+00:00', '2026-04-20 14:45:00+00:00', '2026-05-04 18:00:00+00:00', NULL, 'MEDIA'),

-- INSTAGRAM - CALIENTE
('Francesca Bernardi', '+5491234567807', 'francesca@example.com', 'INSTAGRAM', 'CALIENTE', 'AU_PAIR', 'Conversación', 'Intermedio', 'Flexible', '2026-04-10 09:30:00+00:00', '2026-04-10 09:30:00+00:00', '2026-05-05 14:00:00+00:00', NULL, 'ALTA'),

-- INSTAGRAM - ACTIVO
('Mateo Torres', '+5491234567808', 'mateo@example.com', 'INSTAGRAM', 'ACTIVO', 'ADULTO', 'Laboral', 'Avanzado', 'Viernes', '2026-04-08 15:00:00+00:00', '2026-04-08 15:00:00+00:00', '2026-05-01 16:30:00+00:00', '2026-04-08 15:00:00+00:00', 'ALTA'),
('Natalia Quiroga', '+5491234567809', 'natalia@example.com', 'INSTAGRAM', 'ACTIVO', 'KIDS', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-03 14:20:00+00:00', '2026-04-03 14:20:00+00:00', '2026-04-30 15:00:00+00:00', '2026-04-03 14:20:00+00:00', 'ALTA'),

-- FACEBOOK - FRIO
('Alejandro Suárez', '+5491234567810', 'alejandro@example.com', 'FACEBOOK', 'FRIO', 'ADULTO', 'Examen', 'Intermedio', 'Martes y jueves', '2026-05-02 11:00:00+00:00', '2026-05-02 11:00:00+00:00', '2026-05-02 11:00:00+00:00', NULL, 'BAJA'),

-- FACEBOOK - TIBIO
('Camila Vargas', '+5491234567811', 'camila@example.com', 'FACEBOOK', 'TIBIO', 'ADULTO', 'Conversación', 'Básico', 'Lunes y miércoles', '2026-04-25 13:45:00+00:00', '2026-04-25 13:45:00+00:00', '2026-05-03 14:15:00+00:00', NULL, 'MEDIA'),

-- FACEBOOK - CALIENTE
('Tomás García', '+5491234567812', 'tomas@example.com', 'FACEBOOK', 'CALIENTE', 'ADULTO', 'Laboral', 'Avanzado', 'Sábado', '2026-04-12 10:15:00+00:00', '2026-04-12 10:15:00+00:00', '2026-05-05 11:00:00+00:00', NULL, 'ALTA'),

-- FACEBOOK - ACTIVO
('Emma Rodríguez', '+5491234567813', 'emma@example.com', 'FACEBOOK', 'ACTIVO', 'KIDS', 'Escuela', 'Básico', 'Lunes a viernes', '2026-04-01 16:00:00+00:00', '2026-04-01 16:00:00+00:00', '2026-04-28 16:30:00+00:00', '2026-04-01 16:00:00+00:00', 'ALTA'),

-- TIKTOK - FRIO
('Valentina López', '+5491234567814', 'valentina@example.com', 'TIKTOK', 'FRIO', 'ADOLESCENTE', 'Viaje', 'Básico', 'Flexible', '2026-05-05 12:30:00+00:00', '2026-05-05 12:30:00+00:00', '2026-05-05 12:30:00+00:00', NULL, 'BAJA'),

-- TIKTOK - TIBIO
('Marcelo Santos', '+5491234567815', 'marcelo@example.com', 'TIKTOK', 'TIBIO', 'ADULTO', 'Laboral', 'Intermedio', 'Viernes', '2026-04-28 16:00:00+00:00', '2026-04-28 16:00:00+00:00', '2026-05-04 17:30:00+00:00', NULL, 'MEDIA'),

-- TIKTOK - ACTIVO
('Anto Gómez', '+5491234567816', 'anto@example.com', 'TIKTOK', 'ACTIVO', 'KIDS', 'Escuela', 'Básico', 'Lunes a viernes', '2026-03-25 10:00:00+00:00', '2026-03-25 10:00:00+00:00', '2026-05-01 11:00:00+00:00', '2026-03-25 10:00:00+00:00', 'ALTA'),

-- ORGÁNICO - FRIO
('Roxana Martín', '+5491234567817', 'roxana@example.com', 'ORGANICO', 'FRIO', 'ADOLESCENTE', 'Viaje', 'Básico', 'Flexible', '2026-05-04 09:15:00+00:00', '2026-05-04 09:15:00+00:00', '2026-05-04 09:15:00+00:00', NULL, 'BAJA'),

-- ORGÁNICO - CALIENTE
('Belén Ruiz', '+5491234567818', 'belen@example.com', 'ORGANICO', 'CALIENTE', 'AU_PAIR', 'Conversación', 'Intermedio', 'Flexible', '2026-04-15 10:30:00+00:00', '2026-04-15 10:30:00+00:00', '2026-05-05 14:00:00+00:00', NULL, 'ALTA'),

-- ORGÁNICO - ACTIVO
('Damián Pérez', '+5491234567819', 'damian@example.com', 'ORGANICO', 'ACTIVO', 'ADULTO', 'Laboral', 'Intermedio', 'Martes y jueves', '2026-03-20 11:30:00+00:00', '2026-03-20 11:30:00+00:00', '2026-05-02 12:00:00+00:00', '2026-03-20 11:30:00+00:00', 'ALTA');
