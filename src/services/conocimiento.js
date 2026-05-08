import axios from 'axios';

const N8N_BASE_URL = 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';

export const getItems = async (categoria = '', segmento = '') => {
  try {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (segmento) params.append('segmento', segmento);
    const queryString = params.toString();
    const url = `${N8N_BASE_URL}/webhook/conocimiento${queryString ? '?' + queryString : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching conocimiento items:', error);
    throw error;
  }
};

export const createItem = async (data) => {
  try {
    const response = await axios.post(`${N8N_BASE_URL}/webhook/conocimiento`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating conocimiento item:', error);
    throw error;
  }
};

export const updateItem = async (id, data) => {
  try {
    const response = await axios.put(`${N8N_BASE_URL}/webhook/conocimiento/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating conocimiento item:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axios.delete(`${N8N_BASE_URL}/webhook/conocimiento/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conocimiento item:', error);
    throw error;
  }
};

export default {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
