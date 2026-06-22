import axios from 'axios';

// Usar proxy local de Easypanel (evita CORS)
const API_BASE_URL = '/api/webhook';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Crear instancia de axios con headers predeterminados
const axiosInstance = axios.create({
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  }
});

/**
 * Obtener alumno por ID
 */
export const getAlumnoById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-alumno-by-id?id=${id}`
    );
    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    if (!data.success) throw new Error(data.message || 'Alumno no encontrado');
    return data.alumno;
  } catch (error) {
    console.error('Error fetching alumno:', error);
    throw error;
  }
};

/**
 * Crear un nuevo alumno
 */
export const createAlumno = async (datos) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/create-alumno`,
      datos
    );
    return response.data.alumno;
  } catch (error) {
    console.error('Error creating alumno:', error);
    throw error;
  }
};

/**
 * Actualizar datos del alumno
 */
export const updateAlumno = async (id, datos) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/update-alumno`,
      {
        id,
        ...datos
      }
    );
    return response.data.alumno;
  } catch (error) {
    console.error('Error updating alumno:', error);
    throw error;
  }
};

/**
 * Registrar pago (MANUAL o MERCADO_PAGO)
 */
export const registrarPago = async (datospago) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/register-pago`,
      datospago
    );
    return response.data;
  } catch (error) {
    console.error('Error registering pago:', error);
    throw error;
  }
};

/**
 * Obtener lista de alumnos con filtros, búsqueda y paginación
 */
export const getAlumnosList = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-alumnos-list?${queryString}`
    );
    // El workflow devuelve { items: [...], total, limit, offset }
    // Lo convertimos a { alumnos: [...] } para compatibilidad con AlumnosPage
    return {
      alumnos: response.data.items || [],
      total: response.data.total || 0,
      limit: response.data.limit || 50,
      offset: response.data.offset || 0
    };
  } catch (error) {
    console.error('Error fetching alumnos list:', error);
    throw error;
  }
};

/**
 * Actualizar cupo de un horario
 * Incrementa o decrementa el cupo_actual
 */
export const updateCupoHorario = async (horarioId, accion) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/update-cupo-horario`,
      {
        horario_id: horarioId,
        accion: accion // 'incrementar' o 'decrementar'
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('Error al actualizar cupo');
    }
  } catch (error) {
    console.error('Error updating cupo horario:', error);
    throw error;
  }
};

export default {
  getAlumnoById,
  createAlumno,
  updateAlumno,
  registrarPago,
  getAlumnosList,
  updateCupoHorario
};