import api from './api';

const convertYearMonthToDateRange = (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

export const getKPIs = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-kpis', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    throw error;
  }
};

export const getWeeklyData = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-analytics-weekly', { params });
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return data;
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    throw error;
  }
};

export const getLeadsDistribution = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-leads-distribution', { params });

    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching distribution:', error);
    throw error;
  }
};

export const getConversionFunnel = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-conversion-funnel', { params });

    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching funnel:', error);
    throw error;
  }
};

export const getLeadsOrigin = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-leads-origin', { params });

    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching origin:', error);
    throw error;
  }
};

export const getAlumnos = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-alumnos', { params });

    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching alumnos:', error);
    throw error;
  }
};

export const getFunnelByOrigin = async (dateRange = {}) => {
  try {
    const params = dateRange.year && dateRange.month
      ? convertYearMonthToDateRange(dateRange.year, dateRange.month)
      : { startDate: dateRange.startDate, endDate: dateRange.endDate };

    const response = await api.get('/webhook/get-funnel-by-origin', { params });

    const data = response.data.items || response.data || [];

    if (Array.isArray(data)) {
      return data.map(item => ({
        origin: item.origen || item.origin || 'Unknown',
        nuevos: item.nuevos || item.etapas?.Nuevos || 0,
        nutriendo: item.nutriendo || item.etapas?.Nutriendo || 0,
        conversion: item.conversion || item.etapas?.Conversión || 0,
        tasa_conversion: item.tasa_conversion !== undefined
          ? item.tasa_conversion
          : (item.etapas?.Nuevos > 0
              ? Math.round((item.etapas?.Conversión || 0) / item.etapas?.Nuevos * 100)
              : 0)
      }));
    }

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching funnel by origin:', error);
    throw error;
  }
};

export const getAnalisisTemporal = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-analisis-temporal', {
      params: { ...dateRange }
    });

    const data = response.data.data || response.data;
    return data;
  } catch (error) {
    console.error('Error fetching analisis temporal:', error);
    throw error;
  }
};

export default {
  getKPIs,
  getWeeklyData,
  getLeadsDistribution,
  getConversionFunnel,
  getLeadsOrigin,
  getAlumnos,
  getAnalisisTemporal,
  getFunnelByOrigin
};