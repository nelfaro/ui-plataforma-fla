// Colores Brand Fla
export const FLA_COLORS = {
  // Primarios
  primary: '#FFEB00',      // Amarillo neón
  primaryDark: '#FFD700',  // Amarillo más oscuro
  secondary: '#FF1493',    // Magenta/Rosa
  
  // Backgrounds
  bgWhite: '#FFFFFF',
  bgLight: '#F9FAFB',
  bgDark: '#0F172A',
  
  // Texto
  textDark: '#1A1A1A',
  textMuted: '#6B7280',
  textLight: '#F3F4F6',
  
  // Bordes
  borderLight: '#E5E7EB',
  borderMuted: '#D1D5DB',
  
  // Estados de Leads
  states: {
    REGISTRADO: {
      bg: '#D4EDDA',
      text: '#155724',
      label: 'Registrado'
    },
    ACTIVO: {
      bg: '#D4EDDA',
      text: '#155724',
      label: 'Activo'
    },
    PAGO_PENDIENTE: {
      bg: '#FFF3CD',
      text: '#856404',
      label: 'Pago Pendiente'
    },
    CALIFICADO: {
      bg: '#CCE5FF',
      text: '#004085',
      label: 'Calificado'
    },
    FRIO: {
      bg: '#E2E3E5',
      text: '#383D41',
      label: 'Frío'
    }
  },
  
  // Gráficos
  charts: {
    blue: '#3498DB',
    green: '#2ECC71',
    orange: '#E67E22',
    teal: '#1ABC9C',
    yellow: '#F1C40F',
    purple: '#9B59B6',
    red: '#E74C3C'
  }
};

// Función para obtener color de estado
export const getStateColor = (state) => {
  return FLA_COLORS.states[state] || FLA_COLORS.states.FRIO;
};

export default FLA_COLORS;
