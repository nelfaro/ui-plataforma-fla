-- Poblar conocimiento_academia con información de precios correcta
INSERT INTO conocimiento_academia (categoria, segmento, titulo, contenido, activo) VALUES
('Precios', 'KIDS', 'Clases Grupales', 'Las clases grupales para niños tienen un valor de $85.000.', true),
('Precios', 'ADULTOS', 'Clases Grupales', 'Las clases grupales para adultos tienen un valor de $97.000.', true),
('Precios', 'GENERAL', 'Clases Grupales', 'Las clases grupales tienen un valor de $85.000 para niños y $97.000 para adultos.', true)
ON CONFLICT DO NOTHING;

-- Verificar los datos insertados
SELECT id, categoria, segmento, titulo, contenido, activo FROM conocimiento_academia WHERE categoria = 'Precios';
