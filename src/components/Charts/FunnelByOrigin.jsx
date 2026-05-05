import React, { useState } from 'react';

export const FunnelByOrigin = ({ data = [] }) => {
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Sin datos disponibles</p>
      </div>
    );
  }

  // Datos filtrados
  const filteredData = selectedOrigin
    ? data.filter(item => item.origin === selectedOrigin)
    : data;

  // Cálculos generales
  const totales = data.reduce((acc, item) => ({
    nuevos: acc.nuevos + (item.nuevos || 0),
    nutriendo: acc.nutriendo + (item.nutriendo || 0),
    conversion: acc.conversion + (item.conversion || 0)
  }), { nuevos: 0, nutriendo: 0, conversion: 0 });

  const tasaConversionGeneral = totales.nuevos > 0
    ? Math.round((totales.conversion / totales.nuevos) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-4">📊 Resumen General (Todos los orígenes)</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Nuevos</p>
            <p className="text-3xl font-bold text-blue-600">{totales.nuevos}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Nutriendo</p>
            <p className="text-3xl font-bold text-yellow-600">{totales.nutriendo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Conversión</p>
            <p className="text-3xl font-bold text-green-600">{totales.conversion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tasa General</p>
            <p className="text-3xl font-bold text-indigo-600">{tasaConversionGeneral}%</p>
          </div>
        </div>
      </div>

      {/* Filtro por Origen */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedOrigin(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selectedOrigin === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Ver todo
        </button>
        {data.map((item) => (
          <button
            key={item.origin}
            onClick={() => setSelectedOrigin(item.origin)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedOrigin === item.origin
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {item.origin} ({item.nuevos})
          </button>
        ))}
      </div>

      {/* Cards por origen */}
      <div className="space-y-6">
        {filteredData.map((item, idx) => (
          <div key={idx} className="border-l-4 border-blue-500 pl-6 py-4 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-lg text-gray-900">{item.origin}</h4>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                Conversión: {item.tasa_conversion}%
              </span>
            </div>

            {/* Métricas en cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Nuevos</p>
                  <span className="text-xs text-blue-600">Etapa 1</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{item.nuevos}</p>
                <p className="text-xs text-gray-500 mt-2">Primeros contactos</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Nutriendo</p>
                  <span className="text-xs text-yellow-600">Etapa 2</span>
                </div>
                <p className="text-3xl font-bold text-yellow-600">{item.nutriendo}</p>
                <p className="text-xs text-gray-500 mt-2">En seguimiento</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">Conversión</p>
                  <span className="text-xs text-green-600">Etapa 3</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{item.conversion}</p>
                <p className="text-xs text-gray-500 mt-2">Clientes activos</p>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso de Conversión</span>
                <span className="text-sm font-bold text-gray-900">
                  {item.conversion}/{item.nuevos} convertidos
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 h-full transition-all duration-500"
                  style={{
                    width: item.nuevos > 0 ? `${(item.conversion / item.nuevos) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>

            {/* Detalles */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Tasa Nutriendo → Conversión</p>
                  <p className="font-semibold text-gray-900">
                    {item.nutriendo > 0 ? Math.round((item.conversion / item.nutriendo) * 100) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Pendientes en Nutriendo</p>
                  <p className="font-semibold text-gray-900">
                    {item.nutriendo - item.conversion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
