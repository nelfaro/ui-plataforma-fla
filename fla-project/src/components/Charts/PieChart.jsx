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

  // Si data no es un array, retorna vacío
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="total"
          nameKey="origen"  // o "origen" según corresponda
          label={(entry) => entry.lead_tipo || entry.origen}  // ← MOSTRAR NOMBRE
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
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