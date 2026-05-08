import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(__dirname, '../..', 'n8n-workflows-backup 28-04-26');

const sqlUpdates = {
  'KPIs Dashboard.json': {
    newSql: `SELECT
    COUNT(DISTINCT CASE WHEN l.created_at::date >= '{{ $json.query.startDate }}'::date AND l.created_at::date <= '{{ $json.query.endDate }}'::date THEN l.id END)::integer as leads_nuevos_mes,
    COUNT(DISTINCT CASE WHEN a.estado IN ('REGISTRADO', 'ACTIVO') AND a.fecha_registro::date >= '{{ $json.query.startDate }}'::date AND a.fecha_registro::date <= '{{ $json.query.endDate }}'::date THEN a.id END)::integer as registrados,
    COUNT(DISTINCT CASE WHEN a.estado IN ('CONSULTÓ', 'INTERESADO', 'NUTRIENDO') AND a.fecha_registro::date >= '{{ $json.query.startDate }}'::date AND a.fecha_registro::date <= '{{ $json.query.endDate }}'::date THEN a.id END)::integer as leads_calificados,
    COALESCE(SUM(p.monto), 0)::float as ingresos_mes
  FROM conversation_logs l
  FULL OUTER JOIN alumnos a ON TRUE
  LEFT JOIN pagos p ON p.alumno_id = a.id AND p.estado = 'confirmado' AND p.fecha::date >= '{{ $json.query.startDate }}'::date AND p.fecha::date <= '{{ $json.query.endDate }}'::date
  WHERE l.created_at::date >= '{{ $json.query.startDate }}'::date OR a.fecha_registro::date >= '{{ $json.query.startDate }}'::date OR (p.fecha::date >= '{{ $json.query.startDate }}'::date AND p.fecha::date <= '{{ $json.query.endDate }}'::date);`,
    nodeNames: ['obtener datos', 'Query Database']
  },
  'Analytics Weekly.json': {
    newSql: `WITH dias AS (
    SELECT generate_series(
        '{{ $json.query.startDate }}'::date,
        '{{ $json.query.endDate }}'::date,
        '1 day'::interval
    )::date AS fecha_calendario
)
SELECT
    TO_CHAR(d.fecha_calendario, 'Day') as name,
    COALESCE(COUNT(DISTINCT l.id), 0)::integer as chats,
    COALESCE(COUNT(DISTINCT a.id), 0)::integer as registros
FROM dias d
LEFT JOIN conversation_logs l ON DATE(l.created_at) = d.fecha_calendario
LEFT JOIN alumnos a ON DATE(a.ultimo_contacto) = d.fecha_calendario
GROUP BY d.fecha_calendario
ORDER BY d.fecha_calendario ASC;`,
    nodeNames: ['obtener datos', 'Query Database']
  }
};

Object.entries(sqlUpdates).forEach(([filename, { newSql, nodeNames }]) => {
  try {
    const filepath = path.join(backupDir, filename);
    const workflow = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    let updated = false;

    // Actualizar en nodes
    workflow.nodes.forEach(node => {
      if (node.type === 'n8n-nodes-base.postgres' && nodeNames.includes(node.name)) {
        node.parameters.query = newSql;
        updated = true;
      }
    });

    // Actualizar en activeVersion
    if (workflow.activeVersion && workflow.activeVersion.nodes) {
      workflow.activeVersion.nodes.forEach(node => {
        if (node.type === 'n8n-nodes-base.postgres' && nodeNames.includes(node.name)) {
          node.parameters.query = newSql;
        }
      });
    }

    if (updated) {
      fs.writeFileSync(filepath, JSON.stringify(workflow, null, 2));
      console.log(`✅ ${filename} actualizado`);
    }
  } catch (error) {
    console.error(`❌ Error en ${filename}:`, error.message);
  }
});

console.log('\n✅ Actualización completada. Necesitas reimportar los workflows en n8n');
