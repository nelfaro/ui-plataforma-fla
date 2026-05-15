import axios from 'axios';

// Usar proxy local de Easypanel en lugar de acceder directamente a n8n (evita CORS)
const API_BASE_URL = '/api/webhook';

export const getConfiguracion = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-academia-config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching academia config:', error);
    throw error;
  }
};

export const updateConfiguracion = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update-academia-config`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating academia config:', error);
    throw error;
  }
};

export default {
  getConfiguracion,
  updateConfiguracion
};
