import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { KpiCard } from '../components/Cards/KpiCard';
import { BarChart } from '../components/Charts/BarChart';
import { DonutChart } from '../components/Charts/DonutChart';
import { FunnelChart } from '../components/Charts/FunnelChart';
import { FunnelByOrigin } from '../components/Charts/FunnelByOrigin';
import { PieChart } from '../components/Charts/PieChart';
import { useDashboard } from '../hooks/useDashboard';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { TrendingUp, Users, CheckCircle, DollarSign } from 'lucide-react';
import { getMonthPeriods } from '../utils/dateUtils';

const buildFourWeeksSkeleton = (year, month) => {
  return getMonthPeriods(new Date(year, month - 1));
};

export default function DashboardPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [periodConfig, setPeriodConfig] = useState({
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState('metrics');

  const dateRange = {
    startDate: periodConfig.startDate,
    endDate: periodConfig.endDate
  };

  const { data, loading, error } = useDashboard(dateRange);

  const handleCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setPeriodConfig({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    });
  };

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header con selector de fechas */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard en tiempo real</h1>
          <p className="text-gray-600">Gestión de Academia de Inglés con Fla</p>
        </div>

        {/* Selector de Rango de Fechas */}
        <Card variant="bordered">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">📅 Período de análisis</h3>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input
                  type="date"
                  value={periodConfig.startDate}
                  onChange={(e) => {
                    setPeriodConfig(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input
                  type="date"
                  value={periodConfig.endDate}
                  onChange={(e) => {
                    setPeriodConfig(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleCurrentMonth}
                >
                  Mes actual
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs de análisis */}
        <div className="flex border-b border-gray-200 gap-0">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'metrics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Métricas generales
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'origin'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌍 Funnel por origen
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Chats este mes"
                value={data?.kpis?.leads_nuevos_mes || 0}
                trend="+18%"
                trendLabel="vs mes anterior"
                color="blue"
              />
              <KpiCard
                label="Conversaciones atendidas"
                value={data?.kpis?.leads_calificados || 0}
                trend="+12 nuevos"
                trendLabel="este mes"
                color="green"
              />
              <KpiCard
                label="Registros confirmados"
                value={data?.kpis?.registrados || 0}
                trend="0%"
                trendLabel="conversión"
                color="purple"
              />
              <KpiCard
                label="Ingresos"
                value={`$${data?.kpis?.ingresos_mes || 0}`}
                trend="8 pagos pendientes"
                trendLabel=""
                color="orange"
              />
            </div>

            {/* TAB: Métricas Generales */}
            {activeTab === 'metrics' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-4">📊 Chats y conversiones por semana (4 semanas/mes)</h3>
                    <BarChart
                      data={
                        data?.weekly?.length > 0
                          ? data.weekly
                          : buildFourWeeksSkeleton(
                              new Date(periodConfig.startDate).getFullYear(),
                              new Date(periodConfig.startDate).getMonth() + 1
                            )
                      }
                      height={300}
                    />
                  </Card>

                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-4">🎯 Clasificación de leads</h3>
                    <DonutChart data={data?.distribution || []} height={300} />
                  </Card>

                  <Card className="overflow-hidden">
                    <h3 className="font-semibold text-gray-900 mb-4">📈 Funnel de conversión</h3>
                    <FunnelChart data={data?.funnel || []} height={300} />
                  </Card>

                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-4">🌎 Origen de leads</h3>
                    <PieChart data={data?.origin || []} height={300} />
                  </Card>
                </div>

                {/* Tabla de alumnos */}
                <Card>
                  <h3 className="font-semibold text-gray-900 mb-4">👥 Últimas consultas atendidas</h3>
                  {data?.alumnos && data.alumnos.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Origen</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Intención</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.alumnos.map((alumno, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 text-gray-900">{alumno.nombre}</td>
                              <td className="px-4 py-3 text-gray-600">{alumno.lead_tipo}</td>
                              <td className="px-4 py-3 text-gray-600">{alumno.origen}</td>
                              <td className="px-4 py-3">
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  {alumno.estado}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{alumno.intencion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Sin datos disponibles</p>
                  )}
                </Card>

                {/* Banner agente */}
                <Card variant="bordered" className="bg-yellow-50 border-yellow-200">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Asistente Fla será Activo</h4>
                      <p className="text-gray-700 mt-1">Respondiendo actualmente a 14 clientes en tiempo real vía WhatsApp.</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* TAB: Funnel por Origen */}
            {activeTab === 'origin' && (
              <Card className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-6">🌍 Análisis de Conversión por Origen</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Comparación de prospectos nuevos vs conversión entre leads provenientes de recomendación vs búsqueda orgánica.
                </p>
                <FunnelByOrigin data={data?.funnelByOrigin || []} />
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}