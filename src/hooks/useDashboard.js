import { useState, useEffect } from 'react';
import * as dashboardService from '../services/dashboard';

export const useDashboard = (dateRange = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await Promise.allSettled([
          dashboardService.getKPIs(dateRange),
          dashboardService.getWeeklyData(dateRange),
          dashboardService.getConversionFunnel(dateRange),
          dashboardService.getFunnelByOrigin(dateRange),
          dashboardService.getUltimaActividad()
        ]);

        const endpoints = ['kpis', 'weekly', 'funnel', 'funnelByOrigin', 'ultimaActividad'];
        results.forEach((r, i) => {
          if (r.status === 'rejected') console.warn(`[Dashboard] Endpoint '${endpoints[i]}' falló:`, r.reason);
        });

        const getValue = (result, fallback) =>
          result.status === 'fulfilled' ? result.value : fallback;

        const [kpis, weekly, funnel, funnelByOrigin, ultimaActividad] = results;

        const ultimaActData = getValue(ultimaActividad, {});
        setData({
          kpis: getValue(kpis, {}),
          weekly: Array.isArray(getValue(weekly, [])) ? getValue(weekly, []) : [],
          distribution: [],
          funnel: Array.isArray(getValue(funnel, [])) ? getValue(funnel, []) : [],
          origin: [],
          alumnos: [],
          funnelByOrigin: Array.isArray(getValue(funnelByOrigin, [])) ? getValue(funnelByOrigin, []) : [],
          ultimaActividad: ultimaActData?.texto || 'Sin datos'
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange.startDate, dateRange.endDate]);

  return { data, loading, error };
};