import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { CHART_COLORS } from '../../config/constants';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    const label = entry.origen || entry.categoria || entry.nombre || entry.name;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-sm text-gray-600">{entry.total.toLocaleString()} registros</p>
        <p className="text-sm font-medium" style={{ color: entry.fill }}>
          {entry.porcentaje || 0}% del total
        </p>
      </div>
    );
  }
  return null;
};

export const PieChart = ({ data, height = 300 }) => {
  const colors = [
    CHART_COLORS.blue,
    CHART_COLORS.orange,
    CHART_COLORS.teal,
    CHART_COLORS.yellow,
    CHART_COLORS.purple,
    CHART_COLORS.pink,
    CHART_COLORS.cyan
  ];

  if (!data || !Array.isArray(data) || data.length === 0 || !data.some(d => d.total > 0)) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">Sin datos disponibles</p>
      </div>
    );
  }

  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    fill: colors[index % colors.length]
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={dataWithColors}
          cx="50%"
          cy="50%"
          outerRadius={100}
          paddingAngle={1}
          dataKey="total"
          label={(entry) => {
            const name = entry.origen || entry.nombre || entry.name || 'Sin nombre';
            return `${entry.porcentaje || 0}%`;
          }}
          animationDuration={800}
          animationBegin={0}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value, entry) => (
            <span className="text-sm font-medium text-gray-700">
              {entry.payload.origen || entry.payload.categoria || entry.payload.nombre || value} ({entry.payload.porcentaje}%)
            </span>
          )}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;