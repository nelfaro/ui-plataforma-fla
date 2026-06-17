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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 text-sm">{data.etapa}</p>
        <p className="text-sm text-gray-600">{data.cantidad.toLocaleString()} prospectos</p>
        <p className="text-sm font-medium" style={{ color: payload[0].fill }}>
          {data.porcentaje}% de conversión
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelChart = ({ data, height = 400 }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">Sin datos disponibles</p>
      </div>
    );
  }

  const etapasEsperadas = ['NUEVO', 'FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO'];
  const dataMap = {};

  data.forEach(item => {
    dataMap[item.etapa] = parseInt(item.cantidad) || 0;
  });

  const filteredData = etapasEsperadas.map(etapa => ({
    etapa,
    cantidad: dataMap[etapa] || 0
  }));

  if (filteredData.every(item => item.cantidad === 0)) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">Sin datos disponibles</p>
      </div>
    );
  }

  const maxValue = filteredData[0].cantidad;

  const chartData = filteredData.map((item, idx) => ({
    ...item,
    porcentaje: Math.round((item.cantidad / maxValue) * 100)
  }));

  const colors = ['#3B82F6', '#A855F7', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="w-full overflow-hidden" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            type="number"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            dataKey="etapa"
            type="category"
            width={110}
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} animationDuration={500}>
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