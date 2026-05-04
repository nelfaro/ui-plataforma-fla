import React from 'react';

export const FunnelByOrigin = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((item, idx) => (
        <div key={idx} className="border-l-4 border-blue-500 pl-4 py-4">
          <h4 className="font-semibold text-gray-900 mb-4">{item.origin}</h4>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600 mb-1">Nuevos</p>
              <p className="text-2xl font-bold text-blue-600">{item.nuevos}</p>
            </div>

            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-sm text-gray-600 mb-1">Nutriendo</p>
              <p className="text-2xl font-bold text-yellow-600">{item.nutriendo}</p>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-600 mb-1">Conversión</p>
              <p className="text-2xl font-bold text-green-600">{item.conversion}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-400 to-green-400 h-full"
              style={{
                width: item.nuevos > 0 ? `${(item.conversion / item.nuevos) * 100}%` : '0%'
              }}
            />
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <p>
              Tasa de conversión: <span className="font-semibold text-gray-900">{item.tasa_conversion}%</span>
            </p>
            <p className="text-xs mt-1">
              {item.conversion} de {item.nuevos} nuevos se convirtieron en clientes
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
