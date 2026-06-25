-- Actualizar fechas_registro de alumnos existentes a rangos del último mes
UPDATE alumnos 
SET fecha_registro = NOW() - interval '25 days'
WHERE id IN (1, 2, 3);

UPDATE alumnos 
SET fecha_registro = NOW() - interval '18 days'
WHERE id IN (4, 5, 6);

UPDATE alumnos 
SET fecha_registro = NOW() - interval '10 days'
WHERE id IN (7, 8, 9);

UPDATE alumnos 
SET fecha_registro = NOW() - interval '3 days'
WHERE id IN (10, 11, 12, 13);

-- Insertar pagos de prueba
INSERT INTO pagos_manuales (alumno_id, monto, fecha_pago, metodo_pago, estado, activo) VALUES
(1, 150.00, NOW() - interval '20 days', 'Transferencia', 'Completado', TRUE),
(2, 150.00, NOW() - interval '19 days', 'Mercado Pago', 'Completado', TRUE),
(3, 150.00, NOW() - interval '15 days', 'Efectivo', 'Completado', TRUE),
(4, 200.00, NOW() - interval '12 days', 'Transferencia', 'Completado', TRUE),
(5, 200.00, NOW() - interval '10 days', 'Transferencia', 'Completado', TRUE),
(6, 150.00, NOW() - interval '8 days', 'Mercado Pago', 'Completado', TRUE),
(7, 150.00, NOW() - interval '5 days', 'Transferencia', 'Completado', TRUE),
(8, 200.00, NOW() - interval '4 days', 'Efectivo', 'Completado', TRUE),
(9, 150.00, NOW() - interval '2 days', 'Transferencia', 'Completado', TRUE),
(10, 200.00, NOW() - interval '1 day', 'Mercado Pago', 'Completado', TRUE);

SELECT 'Datos de análisis temporal cargados' as status;
SELECT COUNT(*) as total_alumnos_con_fecha FROM alumnos WHERE fecha_registro IS NOT NULL;
SELECT COUNT(*) as total_pagos FROM pagos_manuales;
