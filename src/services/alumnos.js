import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY || '';
const N8N_BASE_URL = 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';

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
      `${N8N_BASE_URL}/webhook/get-alumno-by-id?id=${id}`
    );
    return response.data.alumno;
  } catch (error) {
    console.error('Error fetching alumno:', error);
    throw error;
  }
};

/**
 * Actualizar datos del alumno
 */
export const updateAlumno = async (id, datos) => {
  try {
    const response = await axiosInstance.post(
      `${N8N_BASE_URL}/webhook/update-alumno`,
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
      `${N8N_BASE_URL}/webhook/register-pago`,
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
      `${N8N_BASE_URL}/webhook/get-alumnos-list?${queryString}`
    );
    return response.data;
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
      `${N8N_BASE_URL}/webhook/update-cupo-horario`,
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
  updateAlumno,
  registrarPago,
  getAlumnosList,
  updateCupoHorario
};