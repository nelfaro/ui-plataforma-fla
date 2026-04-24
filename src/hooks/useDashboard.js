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

        const [kpis, weekly, distribution, funnel, origin, alumnos] = await Promise.all([
          dashboardService.getKPIs(dateRange),
          dashboardService.getWeeklyData(dateRange),
          dashboardService.getLeadsDistribution(dateRange),
          dashboardService.getConversionFunnel(dateRange),
          dashboardService.getLeadsOrigin(dateRange),
          dashboardService.getAlumnos(dateRange)
        ]);

        setData({
          kpis,
          weekly: Array.isArray(weekly) ? weekly : [],
          distribution: Array.isArray(distribution) ? distribution : [],
          funnel: Array.isArray(funnel) ? funnel : [],
          origin: Array.isArray(origin) ? origin : [],
          alumnos: Array.isArray(alumnos) ? alumnos : []
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