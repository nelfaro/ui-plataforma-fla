import React from 'react';
import { Card } from '../UI/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCard = ({ label, value, change, icon: Icon, trend = 'up' }) => {
  const isPositive = trend === 'up';
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {value}
          </h3>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}% vs período anterior</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${changeColor}`} />
          </div>
        )}
      </div>
    </Card>
  );
};

export const MetricsGrid = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
};
