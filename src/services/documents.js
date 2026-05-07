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

// Subir documento al RAG con categorías
export const uploadDocumentoRAG = async (file, categorias, titulo = '') => {
  const N8N_BASE_URL = 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categorias', categorias.join(','));
    if (titulo) formData.append('titulo', titulo);

    const response = await axios.post(
      `${N8N_BASE_URL}/webhook/subir-rag-docs`,
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
    console.error('Error uploading RAG document:', error);
    throw error;
  }
};

export default {
  getLastFile,
  uploadRAGFile,
  uploadDocumentoRAG
};
