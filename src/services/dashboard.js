import api from './api';

export const getKPIs = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-kpis', {
      params: { 
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    throw error;
  }
};

export const getWeeklyData = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-analytics-weekly', {
      params: { 
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    });
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return data;
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    throw error;
  }
};

export const getLeadsDistribution = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-leads-distribution', {
      params: { ...dateRange }
    });
    
    // Obtener el array de items
    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching distribution:', error);
    throw error;
  }
};

export const getConversionFunnel = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-conversion-funnel', {
      params: { ...dateRange }
    });
    
    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching funnel:', error);
    throw error;
  }
};

export const getLeadsOrigin = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-leads-origin', {
      params: { ...dateRange }
    });
    
    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching origin:', error);
    throw error;
  }
};

export const getAlumnos = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-alumnos', {
      params: { ...dateRange }
    });
    
    // Si retorna {items: [...]} extrae el array
    const data = response.data.items || response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching alumnos:', error);
    throw error;
  }
};

export const getAnalisisTemporal = async (dateRange = {}) => {
  try {
    const response = await api.get('/webhook/get-analisis-temporal', {
      params: { ...dateRange }
    });
    
    const data = response.data.data || response.data;
    
    // Limpiar y deduplicar datos
    if (data.items) {
      return {
        items: {
          nuevos_por_semana: [...new Map(data.items.nuevos_por_semana.map(item => [item.semana, item])).values()],
          conversion_por_semana: [...new Map(data.items.conversion_por_semana.map(item => [item.semana, item])).values()].filter(item => item.conversion !== null),
          ingresos_acumulados: [...new Map(data.items.ingresos_acumulados.map(item => [item.mes, item])).values()]
        }
      };
    }
    
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
  getAnalisisTemporal

};