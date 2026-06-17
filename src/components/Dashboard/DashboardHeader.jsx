import React from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../UI/Button';

export const DashboardHeader = ({ title, subtitle, onDateChange, onFilter, showActions = true }) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {showActions && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={onDateChange}
            >
              <Calendar className="w-4 h-4" />
              Período
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={onFilter}
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
