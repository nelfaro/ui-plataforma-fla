import React from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

const statusConfig = {
  NUEVO: { bg: 'bg-blue-50', color: 'text-blue-700', badgeColor: 'bg-blue-100' },
  FRIO: { bg: 'bg-gray-50', color: 'text-gray-700', badgeColor: 'bg-gray-100' },
  TIBIO: { bg: 'bg-yellow-50', color: 'text-yellow-700', badgeColor: 'bg-yellow-100' },
  CALIENTE: { bg: 'bg-orange-50', color: 'text-orange-700', badgeColor: 'bg-orange-100' },
  ACTIVO: { bg: 'bg-green-50', color: 'text-green-700', badgeColor: 'bg-green-100' },
  PAUSADO: { bg: 'bg-purple-50', color: 'text-purple-700', badgeColor: 'bg-purple-100' },
  BAJA: { bg: 'bg-red-50', color: 'text-red-700', badgeColor: 'bg-red-100' },
};

export const StatusColumn = ({ status, count, percentage, lastUpdated }) => {
  const config = statusConfig[status] || statusConfig.NUEVO;

  return (
    <div className={`p-4 rounded-lg ${config.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-900 dark:text-white">
          {status}
        </span>
        <Badge className={config.badgeColor}>
          {percentage}%
        </Badge>
      </div>

      <div className={`text-3xl font-bold ${config.color} mb-2`}>
        {count}
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500">
          Actualizado: {lastUpdated}
        </p>
      )}
    </div>
  );
};

export const ProspectsStatusBoard = ({ data = {} }) => {
  const statuses = Object.keys(statusConfig);
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Estado de Prospects
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {statuses.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            count={data[status] || 0}
            percentage={total > 0 ? Math.round((data[status] || 0) / total * 100) : 0}
            lastUpdated="Hoy"
          />
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Total Prospects</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {total}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">En Conversión</p>
            <p className="text-2xl font-bold text-green-600">
              {(data.CALIENTE || 0) + (data.ACTIVO || 0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
