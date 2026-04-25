import axios from 'axios';
import { N8N_BASE_URL, API_TIMEOUT } from '../config/constants';

const API_KEY = import.meta.env.VITE_API_KEY || '';

console.log('API_KEY loaded:', API_KEY ? 'YES' : 'NO');
console.log('N8N_BASE_URL:', N8N_BASE_URL);

// Crear instancia axios con baseURL correcto
const api = axios.create({
  baseURL: N8N_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

// Interceptor para agregar token y API key a requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Asegurar que siempre incluya API key
  config.headers['x-api-key'] = API_KEY;
  
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;