import axios from 'axios';

const N8N_BASE_URL = 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';

export const getConfiguracion = async () => {
  try {
    const response = await axios.get(`${N8N_BASE_URL}/webhook/get-academia-config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching academia config:', error);
    throw error;
  }
};

export const updateConfiguracion = async (data) => {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/webhook/update-academia-config`, data);
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
