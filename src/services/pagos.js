import axios from 'axios';

// Usar proxy local de Easypanel (evita CORS)
const API_BASE_URL = '/api/webhook';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Obtener pagos (por defecto, los pendientes de verificación)
 */
export const getPagosPendientes = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(
      `${API_BASE_URL}/get-pagos-pendientes${query ? `?${query}` : ''}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching pagos pendientes:', error);
    throw error;
  }
};

/**
 * Verificar o rechazar un pago
 */
export const verificarPago = async ({ pago_id, accion, verificado_por, notas_verificacion }) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/verificar-pago`,
      { pago_id, accion, verificado_por, notas_verificacion }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'No se pudo procesar el pago');
    }
    return response.data;
  } catch (error) {
    console.error('Error verificando pago:', error);
    throw error;
  }
};

export default { getPagosPendientes, verificarPago };
