import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const FunnelChart = ({ data, height = 400 }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  // Filtrar datos con cantidad > 0
  const filteredData = data
    .map(item => ({
      ...item,
      cantidad: parseInt(item.cantidad) || 0
    }))
    .filter(item => item.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad);

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  // El primer valor (máximo) es 100%
  const maxValue = filteredData[0].cantidad;

  // Calcular porcentaje con respecto a la primera etapa
  const chartData = filteredData.map((item, idx) => ({
    ...item,
    porcentaje: Math.round((item.cantidad / maxValue) * 100)
  }));

  const colors = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{data.etapa}</p>
          <p className="text-sm text-gray-600">{data.cantidad} prospectos</p>
          <p className="text-sm font-medium text-blue-600">{data.porcentaje}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="etapa" type="category" width={110} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cantidad" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;