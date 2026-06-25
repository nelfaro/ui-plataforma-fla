-- Script para cargar datos de ejemplo en conocimiento_academia
-- Categorías: PRECIOS, FAQ, METODOLOGIA, CLASES
-- Segmentos: KIDS, ADULTOS, AU_PAIR, PERSONALIZADO, GENERAL

INSERT INTO conocimiento_academia (categoria, segmento, titulo, contenido, activo) VALUES

-- PRECIOS - GENERAL
('PRECIOS', 'GENERAL', 'Planes disponibles', 'Ofrecemos planes mensuales, trimestrales y anuales con descuentos progresivos.', true),
('PRECIOS', 'GENERAL', 'Formas de pago', 'Aceptamos transferencia bancaria, Mercado Pago, efectivo y cheque.', true),
('PRECIOS', 'GENERAL', 'Cambio de plan', 'Puedes cambiar tu plan en cualquier momento. Si pagas la diferencia, es efectivo inmediatamente.', true),

-- PRECIOS - KIDS
('PRECIOS', 'KIDS', 'Plan Kids - Clases grupales', 'Clases de inglés para niños (4-12 años). Grupos de máximo 6 alumnos. $150 por clase individual, $100 por clase grupal.', true),
('PRECIOS', 'KIDS', 'Plan Kids - Conversación', 'Conversación natural y juegos educativos. Perfecto para aumentar confianza y fluidez. $180 por clase.', true),

-- PRECIOS - ADULTOS
('PRECIOS', 'ADULTOS', 'Plan Adultos - Conversación', 'Enfoque en conversación diaria y situaciones reales. Ideal para viajes y trabajo. $200 por clase.', true),
('PRECIOS', 'ADULTOS', 'Plan Adultos - Negocio', 'Inglés de negocios, presentaciones y escritura profesional. $250 por clase.', true),

-- PRECIOS - AU_PAIR
('PRECIOS', 'AU_PAIR', 'Plan Au Pair - Intensivo', 'Clases intensivas para au pairs. Conversación enfocada en vida cotidiana y cuidado de niños. $180 por clase.', true),

-- FAQ - GENERAL
('FAQ', 'GENERAL', '¿Cuál es el horario de atención?', 'Atendemos de lunes a viernes de 9:00 a 20:00 hs, y sábados de 9:00 a 14:00 hs.', true),
('FAQ', 'GENERAL', '¿Ofrecen clases de prueba?', 'Sí, ofrecemos una clase de prueba gratuita para que conozcas nuestro método.', true),
('FAQ', 'GENERAL', '¿Cuánto tiempo tarda ver resultados?', 'Con dedicación y práctica consistente, notarás mejoras en 4-6 semanas.', true),
('FAQ', 'GENERAL', '¿Hay reembolso si cancelo?', 'Las clases no reembolsables. Puedes pausar tu plan hasta 3 meses sin costo adicional.', true),

-- FAQ - KIDS
('FAQ', 'KIDS', '¿A qué edad pueden empezar?', 'Los niños pueden empezar desde los 4 años. Tenemos grupos por edades.', true),
('FAQ', 'KIDS', '¿Es necesario que el alumno sepa leer?', 'No es necesario. Usamos métodos visuales y lúdicos adaptados a cada nivel.', true),

-- FAQ - ADULTOS
('FAQ', 'ADULTOS', '¿Puedo estudiar si no tengo base de inglés?', 'Por supuesto. Tenemos cursos desde nivel principiante hasta avanzado.', true),
('FAQ', 'ADULTOS', '¿Hay certificados?', 'Emitimos certificados de asistencia y niveles alcanzados.', true),

-- METODOLOGIA - GENERAL
('METODOLOGIA', 'GENERAL', 'Nuestro enfoque', 'Enseñanza comunicativa con énfasis en conversación real. Combinamos gramática con práctica práctica.', true),
('METODOLOGIA', 'GENERAL', 'Materiales', 'Usamos libros de texto actualizados, recursos digitales y material auténtico.', true),

-- METODOLOGIA - KIDS
('METODOLOGIA', 'KIDS', 'Métodos divertidos', 'Usamos juegos, canciones, películas y actividades interactivas para mantener a los niños motivados.', true),
('METODOLOGIA', 'KIDS', 'Aprendizaje lúdico', 'El juego es la herramienta principal. Los niños aprenden sin darse cuenta.', true),

-- METODOLOGIA - ADULTOS
('METODOLOGIA', 'ADULTOS', 'Conversación auténtica', 'Practicamos situaciones reales: viajes, trabajo, vida cotidiana.', true),
('METODOLOGIA', 'ADULTOS', 'Feedback individualizado', 'Cada alumno recibe correcciones personalizadas y plan de mejora.', true),

-- CLASES - GENERAL
('CLASES', 'GENERAL', 'Duración de las clases', 'Las clases tienen una duración de 60 minutos (adultos) o 45 minutos (niños).', true),
('CLASES', 'GENERAL', 'Frecuencia recomendada', 'Recomendamos 2-3 clases por semana para progreso consistente.', true),

-- CLASES - KIDS
('CLASES', 'KIDS', 'Contenido de clases Kids', 'Vocabulario básico, frases simples, canciones, juegos y mucha diversión.', true),
('CLASES', 'KIDS', 'Tareas para casa', 'Ejercicios simples y divertidos para reforzar lo aprendido (15-20 minutos).', true),

-- CLASES - ADULTOS
('CLASES', 'ADULTOS', 'Estructura de clase', 'Calentamiento, enfoque gramatical o temático, conversación y cierre.', true),
('CLASES', 'ADULTOS', 'Preparación para exámenes', 'Cursos específicos para Cambridge, IELTS, TOEFL y otros certificados.', true)

ON CONFLICT DO NOTHING;

SELECT 'Datos de conocimiento_academia cargados correctamente' as status;
SELECT COUNT(*) as total_items FROM conocimiento_academia WHERE activo = true;
