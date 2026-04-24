import React from 'react';
import Card from '../UI/Card';
import clsx from 'clsx';

export const KpiCard = ({
  label,
  value,
  trend,
  trendPositive = true,
  icon: Icon,
  color = 'blue'
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <Card variant="elevated" className="col-span-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-fla-primary mb-2">{value}</h3>
          {trend && (
            <p className={clsx(
              'text-sm font-medium',
              trendPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {trendPositive ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx(
            'p-3 rounded-lg',
            colorMap[color]
          )}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default KpiCard;
