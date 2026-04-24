import api from './api';

// Obtener último archivo procesado
export const getLastFile = async () => {
  try {
    const response = await api.get('/api/v1/documents/last');
    return response.data;
  } catch (error) {
    console.error('Error fetching last file:', error);
    throw error;
  }
};

// Subir archivo RAG
export const uploadRAGFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/webhook/subir-stock-manual', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default {
  getLastFile,
  uploadRAGFile
};
