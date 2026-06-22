import axios from 'axios';

// Usar proxy local de Easypanel (evita CORS)
const API_BASE_URL = '/api/webhook';

export const getItems = async (categoria = '', segmento = '') => {
  try {
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (segmento) params.append('segmento', segmento);
    const queryString = params.toString();
    const url = `${API_BASE_URL}/conocimiento-get${queryString ? '?' + queryString : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching conocimiento items:', error);
    throw error;
  }
};

export const createItem = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/conocimiento-post`, {
      ...data,
      _action: 'create'
    });
    return response.data;
  } catch (error) {
    console.error('Error creating conocimiento item:', error);
    throw error;
  }
};

export const updateItem = async (id, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/conocimiento-post`, {
      ...data,
      id,
      _action: 'update'
    });
    return response.data;
  } catch (error) {
    console.error('Error updating conocimiento item:', error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/conocimiento-post`, {
      id,
      _action: 'delete'
    });
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
