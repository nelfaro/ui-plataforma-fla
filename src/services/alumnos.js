import api from './api';
import axios from 'axios';
/**
 * Obtener un alumno por ID
 * Llama al webhook get-alumno-by-id en n8n
 */
export const getAlumnoById = async (id) => {
  try {
    // Llamar directamente sin usar el baseURL de api
    const response = await axios.get(
      `https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-alumno-by-id?id=${id}`
    );

    console.log('Respuesta getAlumnoById:', response.data);

    if (response.data.success && response.data.alumno) {
      return response.data.alumno;
    } else {
      throw new Error('Alumno no encontrado');
    }
  } catch (error) {
    console.error('Error fetching alumno:', error);
    throw error;
  }
};

/**
 * Obtener lista de alumnos con filtros
 * Llama al webhook get-alumnos-list en n8n
 */
export const getAlumnosList = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(
      `https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-alumnos-list?${queryString}`
    );

    if (response.data.items) {
      return {
        items: response.data.items,
        total: response.data.total,
        limit: response.data.limit,
        offset: response.data.offset
      };
    } else {
      throw new Error('Error al obtener lista de alumnos');
    }
  } catch (error) {
    console.error('Error fetching alumnos list:', error);
    throw error;
  }
};

/**
 * Actualizar información de un alumno
 * Llama al webhook update-alumno en n8n
 */
export const updateAlumno = async (id, alumnoData) => {
  try {
    const response = await api.post('/webhook/update-alumno', {
      id,
      nombre: alumnoData.nombre,
      estado: alumnoData.estado,
      lead_tipo: alumnoData.lead_tipo,
      horario_clase: alumnoData.horario_clase,
      notas: alumnoData.notas,
      email: alumnoData.email
    });

    if (response.data.success) {
      return response.data.alumno;
    } else {
      throw new Error(response.data.mensaje || 'Error al actualizar alumno');
    }
  } catch (error) {
    console.error('Error updating alumno:', error);
    throw error;
  }
};

/**
 * Actualizar cupo de un horario
 * Incrementa o decrementa el cupo_actual
 */
export const updateCupoHorario = async (horarioId, accion) => {
  try {
    const response = await axios.post(
      'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/update-cupo-horario',
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

/**
 * Registrar un pago para un alumno
 * Llama al webhook register-pago en n8n
 * Soporta MANUAL y MERCADO_PAGO
 */
export const registrarPago = async (pagoData) => {
  try {
    const response = await api.post('/webhook/register-pago', {
      alumno_id: pagoData.alumno_id,
      monto: pagoData.monto,
      fecha_pago: pagoData.fecha_pago,
      tipo_pago: pagoData.tipo_pago, // 'MANUAL' o 'MERCADO_PAGO'
      metodo: pagoData.metodo, // Para MANUAL: 'EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'OTRO'
      nota: pagoData.nota,
      registrado_por: pagoData.registrado_por
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.mensaje || 'Error al registrar pago');
    }
  } catch (error) {
    console.error('Error registering pago:', error);
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