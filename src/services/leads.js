import axios from 'axios';

const API_BASE_URL = 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';

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
    const url = `${API_BASE_URL}/webhook/get-leads-pipeline${queryString ? '?' + queryString : ''}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pipeline de leads:', error);
    throw error;
  }
};
