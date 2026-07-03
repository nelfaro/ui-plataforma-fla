import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { CHART_COLORS } from '../../config/constants';

export const DonutChart = ({ data, height = 300 }) => {
  const colors = [
    CHART_COLORS.blue,
    CHART_COLORS.orange,
    CHART_COLORS.teal,
    CHART_COLORS.yellow,
    CHART_COLORS.purple
  ];

  // Normalizar datos: soportar tanto {name, value} como {origen, total}
  const normalizedData = data?.map(d => ({
    label: d.name || d.origen || 'Unknown',
    total: d.value || d.total || 0
  })) || [];

  if (!normalizedData || normalizedData.length === 0 || !normalizedData.some(d => d.total > 0)) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const total = normalizedData.reduce((sum, d) => sum + d.total, 0);
      const pct = Math.round((entry.total / total) * 100);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{entry.label}</p>
          <p className="text-sm text-gray-600">{entry.total} registros</p>
          <p className="text-sm font-medium text-blue-600">{pct}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={normalizedData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="total"
          nameKey="label"
          label={(entry) => `${entry.label} (${Math.round((entry.total / normalizedData.reduce((s, d) => s + d.total, 0)) * 100)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;