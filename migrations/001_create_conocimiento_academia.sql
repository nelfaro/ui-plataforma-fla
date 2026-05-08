-- Migration: Crear tabla conocimiento_academia
-- Ejecutar en PostgreSQL para crear la base de conocimiento del agente Fla

CREATE TABLE IF NOT EXISTS conocimiento_academia (
  id          SERIAL PRIMARY KEY,
  categoria   TEXT NOT NULL CHECK (categoria IN ('PRECIOS','FAQ','METODOLOGIA','CLASES')),
  segmento    TEXT NOT NULL CHECK (segmento IN ('KIDS','ADULTOS','AU_PAIR','PERSONALIZADO','GENERAL')),
  titulo      TEXT NOT NULL,
  contenido   TEXT NOT NULL,
  activo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_conocimiento_categoria_segmento
  ON conocimiento_academia(categoria, segmento);

CREATE INDEX IF NOT EXISTS idx_conocimiento_activo
  ON conocimiento_academia(activo);

-- Comentarios
COMMENT ON TABLE conocimiento_academia IS 'Base de conocimiento estructurada para el agente Fla. Contiene información sobre precios, FAQs, metodología e información de clases, segmentada por tipo de alumno.';
COMMENT ON COLUMN conocimiento_academia.categoria IS 'Categoría de conocimiento: PRECIOS, FAQ, METODOLOGIA, CLASES';
COMMENT ON COLUMN conocimiento_academia.segmento IS 'Segmento de alumnos: KIDS, ADULTOS, AU_PAIR, PERSONALIZADO, GENERAL';
COMMENT ON COLUMN conocimiento_academia.titulo IS 'Título o encabezado del item de conocimiento';
COMMENT ON COLUMN conocimiento_academia.contenido IS 'Contenido completo del item (texto, markdown permitido)';
COMMENT ON COLUMN conocimiento_academia.activo IS 'Si FALSE, el agente no verá este item';
