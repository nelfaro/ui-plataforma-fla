import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { CHART_COLORS } from '../../config/constants';

export const PieChart = ({ data, height = 300 }) => {
  const colors = [
    CHART_COLORS.blue,
    CHART_COLORS.orange,
    CHART_COLORS.teal,
    CHART_COLORS.yellow,
    CHART_COLORS.purple
  ];

  if (!data || !Array.isArray(data) || data.length === 0 || !data.some(d => d.total > 0)) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const label = entry.origen || entry.lead_tipo;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{entry.total} registros</p>
          <p className="text-sm font-medium text-blue-600">{entry.porcentaje || 0}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="total"
          nameKey="origen"
          label={(entry) => `${entry.origen || entry.lead_tipo} (${entry.porcentaje || 0}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ paddingLeft: '20px' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;