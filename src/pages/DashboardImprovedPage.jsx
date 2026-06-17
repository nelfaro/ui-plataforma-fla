import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { ProspectsStatusBoard } from '../components/Dashboard/ProspectsStatusBoard';
import { BarChart } from '../components/Charts/BarChart';
import { Card } from '../components/UI/Card';
import { Users, TrendingUp, CheckCircle, Target } from 'lucide-react';

export default function DashboardImprovedPage() {
  const [dateRange, setDateRange] = useState('month');

  const metrics = [
    {
      label: 'Leads Totales',
      value: '2,450',
      change: '+12',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Conversiones',
      value: '340',
      change: '+8',
      icon: CheckCircle,
      trend: 'up'
    },
    {
      label: 'Tasa Conversión',
      value: '13.9%',
      change: '+2',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      label: 'Prospects Activos',
      value: '580',
      change: '+15',
      icon: Target,
      trend: 'up'
    }
  ];

  const prospectsData = {
    NUEVO: 450,
    FRIO: 320,
    TIBIO: 280,
    CALIENTE: 580,
    ACTIVO: 620,
    PAUSADO: 150,
    BAJA: 50
  };

  const chartData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Nuevos Leads',
        data: [120, 190, 150, 200],
        backgroundColor: '#3b82f6'
      },
      {
        label: 'Conversiones',
        data: [40, 60, 50, 75],
        backgroundColor: '#10b981'
      }
    ]
  };

  return (
    <MainLayout>
      <div className="p-6">
        <DashboardHeader
          title="Dashboard de Gestión"
          subtitle="Seguimiento de leads y prospects en tiempo real"
          onDateChange={() => setDateRange(dateRange === 'month' ? 'week' : 'month')}
          onFilter={() => console.log('Filtros')}
        />

        <MetricsGrid metrics={metrics} />

        <div className="mb-8">
          <ProspectsStatusBoard data={prospectsData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Evolución de Leads
            </h3>
            <BarChart data={chartData} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Distribución por Origen
            </h3>
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Gráfico de distribución</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
