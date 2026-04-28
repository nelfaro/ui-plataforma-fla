// URLs Base
//export const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://asistente-ia-fla-n8n.x5miqk.easypanel.host';
// En desarrollo: usar proxy local
// En producción: usar proxy en EasyPanel
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const CHATWOOT_URL = import.meta.env.VITE_CHATWOOT_URL || 'https://asistente-ia-fla-chatwoot.x5miqk.easypanel.host';
export const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL || 'https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host';

// Timeouts
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Rutas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/documents',
  CHATWOOT: '/chatwoot',
  WHATSAPP: '/whatsapp',
  SETTINGS: '/settings',
  NOT_FOUND: '*'
};

// Mensajes
export const MESSAGES = {
  LOADING: 'Cargando...',
  ERROR_DEFAULT: 'Ocurrió un error. Intenta de nuevo.',
  ERROR_LOGIN: 'Usuario o contraseña incorrectos.',
  ERROR_NETWORK: 'Error de conexión. Verifica tu internet.',
  SUCCESS_LOGIN: 'Bienvenido a Academia Fla',
  SUCCESS_UPLOAD: 'Archivo cargado exitosamente',
  SUCCESS_LOGOUT: 'Sesión cerrada'
};

// Estados de Leads
export const LEAD_STATES = {
  REGISTRADO: { label: 'REGISTRADO', color: 'bg-green-100', textColor: 'text-green-800' },
  ACTIVO: { label: 'ACTIVO', color: 'bg-green-100', textColor: 'text-green-800' },
  PAGO_PENDIENTE: { label: 'PAGO PENDIENTE', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
  CALIFICADO: { label: 'CALIFICADO', color: 'bg-blue-100', textColor: 'text-blue-800' },
  FRIO: { label: 'FRÍO', color: 'bg-gray-100', textColor: 'text-gray-800' }
};

// Colores para gráficos
export const CHART_COLORS = {
  blue: '#3498db',
  green: '#2ecc71',
  orange: '#e67e22',
  teal: '#1abc9c',
  yellow: '#f1c40f',
  purple: '#9b59b6',
  pink: '#ff6b9d'
};

// Formato de números
export const CURRENCY_FORMAT = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0
});

export const NUMBER_FORMAT = new Intl.NumberFormat('es-AR');
