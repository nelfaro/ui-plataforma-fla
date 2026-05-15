import axios from 'axios';

// Usar proxy local de Easypanel (evita CORS)
const API_BASE_URL = '/api/webhook';

export const getLeadsPipeline = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.estado) {
      params.append('estado', filters.estado);
    }
    if (filters.origen) {
      params.append('origen', filters.origen);
    }
    if (filters.lead_tipo) {
      params.append('lead_tipo', filters.lead_tipo);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/get-leads-pipeline${queryString ? '?' + queryString : ''}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pipeline de leads:', error);
    throw error;
  }
};
