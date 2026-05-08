import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workflowPath = path.join(__dirname, '../..', 'n8n-workflows-backup 28-04-26', 'get-funnel-by-origin.json');

const newSql = `WITH monthly_funnel AS (
  SELECT
    a.origen,
    CASE
      WHEN a.estado = 'NUEVO' THEN 'Nuevos'
      WHEN a.estado IN ('CONSULTÓ', 'INTERESADO', 'NUTRIENDO') THEN 'Nutriendo'
      WHEN a.estado IN ('REGISTRADO', 'ACTIVO') THEN 'Conversión'
      ELSE 'Otros'
    END as etapa,
    COUNT(DISTINCT a.id)::integer as cantidad
  FROM alumnos a
  WHERE
    DATE(a.fecha_registro) >= '{{ $json.query.startDate }}'::date
    AND DATE(a.fecha_registro) <= '{{ $json.query.endDate }}'::date
  GROUP BY a.origen, etapa
)
SELECT
  origen,
  JSON_OBJECT_AGG(etapa, cantidad) as etapas
FROM monthly_funnel
GROUP BY origen
ORDER BY origen;`;

try {
  const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

  // Encontrar el nodo de PostgreSQL
  const postgresNode = workflow.nodes.find(node => node.type === 'n8n-nodes-base.postgres');

  if (postgresNode) {
    postgresNode.parameters.query = newSql;

    // Actualizar también activeVersion si existe
    if (workflow.activeVersion && workflow.activeVersion.nodes) {
      const activePostgresNode = workflow.activeVersion.nodes.find(node => node.type === 'n8n-nodes-base.postgres');
      if (activePostgresNode) {
        activePostgresNode.parameters.query = newSql;
      }
    }

    fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2));
    console.log('✅ Workflow actualizado correctamente');
    console.log('Ubicación:', workflowPath);
  } else {
    console.error('❌ No se encontró el nodo PostgreSQL');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
