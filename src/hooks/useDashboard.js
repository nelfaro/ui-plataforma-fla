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
          dashboardService.getLeadsDistribution(dateRange),
          dashboardService.getConversionFunnel(dateRange),
          dashboardService.getLeadsOrigin(dateRange),
          dashboardService.getAlumnos(dateRange)
        ]);

        const endpoints = ['kpis', 'weekly', 'distribution', 'funnel', 'origin', 'alumnos'];
        results.forEach((r, i) => {
          if (r.status === 'rejected') console.warn(`[Dashboard] Endpoint '${endpoints[i]}' falló:`, r.reason);
        });

        const getValue = (result, fallback) =>
          result.status === 'fulfilled' ? result.value : fallback;

        const [kpis, weekly, distribution, funnel, origin, alumnos] = results;

        setData({
          kpis: getValue(kpis, {}),
          weekly: Array.isArray(getValue(weekly, [])) ? getValue(weekly, []) : [],
          distribution: Array.isArray(getValue(distribution, [])) ? getValue(distribution, []) : [],
          funnel: Array.isArray(getValue(funnel, [])) ? getValue(funnel, []) : [],
          origin: Array.isArray(getValue(origin, [])) ? getValue(origin, []) : [],
          alumnos: Array.isArray(getValue(alumnos, [])) ? getValue(alumnos, []) : []
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