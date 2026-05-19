import axios from 'axios';

// Usar proxy local de Easypanel (evita CORS)
const API_BASE_URL = '/api/webhook';

// Crear instancia de axios con headers predeterminados
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-kpis`,
      { params }
    );
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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-analytics-weekly`,
      { params }
    );
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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-leads-distribution`,
      { params }
    );

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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-conversion-funnel`,
      { params }
    );

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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-leads-origin`,
      { params }
    );

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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-alumnos`,
      { params }
    );

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

    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-funnel-by-origin`,
      { params }
    );

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
    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-analisis-temporal`,
      { params: { ...dateRange } }
    );

    // El workflow devuelve { items: { nuevos_por_semana, conversion_por_semana, ingresos_acumulados } }
    // Extraer el contenido de items
    const data = response.data.items || response.data;
    return data;
  } catch (error) {
    console.error('Error fetching analisis temporal:', error);
    throw error;
  }
};

export const getUltimaActividad = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/ultima-actividad-agente`
    );
    const data = response.data;

    if (data?.timestamp) {
      const fecha = new Date(data.timestamp);
      const ahora = new Date();
      const difMs = ahora - fecha;
      const difMinutos = Math.floor(difMs / (1000 * 60));
      const difHoras = Math.floor(difMs / (1000 * 60 * 60));
      const difDias = Math.floor(difMs / (1000 * 60 * 60 * 24));

      if (difMinutos < 5) {
        return { texto: 'Activo ahora', tipo: 'active' };
      } else if (difMinutos < 60) {
        return { texto: `Hace ${difMinutos} minutos`, tipo: 'active' };
      } else if (difHoras < 24) {
        return { texto: `Hace ${difHoras} hora${difHoras > 1 ? 's' : ''}`, tipo: 'warning' };
      } else {
        return { texto: `Hace ${difDias} día${difDias > 1 ? 's' : ''}`, tipo: 'inactive' };
      }
    }
    return { texto: 'Sin registros', tipo: 'inactive' };
  } catch (error) {
    console.error('Error fetching ultima actividad:', error);
    return { texto: 'Sin datos', tipo: 'inactive' };
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
  getFunnelByOrigin,
  getUltimaActividad
};
