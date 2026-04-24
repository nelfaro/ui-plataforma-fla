import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../config/constants';

export const BarChart = ({ data, height = 300 }) => {
  // Agregar esta validación al inicio
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 rounded">
        <p className="text-gray-500">Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis 
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
          cursor={{ fill: 'rgba(255, 235, 0, 0.1)' }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="square"
        />
        <Bar 
          dataKey="chats" 
          fill={CHART_COLORS.blue} 
          name="Chats"
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="registros" 
          fill={CHART_COLORS.green} 
          name="Registros"
          radius={[8, 8, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
