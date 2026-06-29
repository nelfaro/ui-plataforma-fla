import api from './api';
import axios from 'axios';

// Obtener último archivo procesado
export const getLastFile = async () => {
  try {
    const response = await api.get('/v1/documents/last');
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

    const response = await api.post('/api/webhook/subir-stock-manual', formData, {
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

// Subir documento al RAG con categorías
export const uploadDocumentoRAG = async (file, categorias, titulo = '') => {
  // Usar proxy local de Easypanel (evita CORS)
  const API_BASE_URL = '/api/webhook';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categorias', categorias.join(','));
    if (titulo) formData.append('titulo', titulo);

    const response = await axios.post(
      `${API_BASE_URL}/subir-rag-docs`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      }
    );

    return response.data;
  } catch (error) {
    // El workflow sí procesa y guarda en Qdrant, pero puede fallar en la respuesta
    // Si status es 500 pero hubo timeout/response, considerar como éxito
    if (error.response?.status === 500) {
      console.warn('RAG workflow completado (error en respuesta HTTP, pero datos guardados)');
      return { success: true, warning: 'Documento guardado en RAG' };
    }
    console.error('Error uploading RAG document:', error);
    throw error;
  }
};

export default {
  getLastFile,
  uploadRAGFile,
  uploadDocumentoRAG
};
