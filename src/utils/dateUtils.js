// Calcula las 4 semanas del mes: 1-7, 8-14, 15-21, 22-31
export const buildFourWeekSkeleton = (year, month) => {
  const weeks = [
    {
      weekNumber: 1,
      label: `1-7 ${new Date(year, month - 1).toLocaleString('es-AR', { month: 'short' })}`,
      startDay: 1,
      endDay: 7,
      chats: 0,
      registros: 0
    },
    {
      weekNumber: 2,
      label: `8-14 ${new Date(year, month - 1).toLocaleString('es-AR', { month: 'short' })}`,
      startDay: 8,
      endDay: 14,
      chats: 0,
      registros: 0
    },
    {
      weekNumber: 3,
      label: `15-21 ${new Date(year, month - 1).toLocaleString('es-AR', { month: 'short' })}`,
      startDay: 15,
      endDay: 21,
      chats: 0,
      registros: 0
    },
    {
      weekNumber: 4,
      label: `22-31 ${new Date(year, month - 1).toLocaleString('es-AR', { month: 'short' })}`,
      startDay: 22,
      endDay: 31,
      chats: 0,
      registros: 0
    }
  ];
  return weeks;
};

// Obtiene el rango de fechas para una semana específica del mes
export const getWeekDateRange = (year, month, weekNumber) => {
  const weekConfigs = [
    { start: 1, end: 7 },
    { start: 8, end: 14 },
    { start: 15, end: 21 },
    { start: 22, end: 31 }
  ];

  if (weekNumber < 1 || weekNumber > 4) {
    throw new Error('weekNumber debe ser entre 1 y 4');
  }

  const config = weekConfigs[weekNumber - 1];
  const startDate = new Date(year, month - 1, config.start);
  const endDate = new Date(year, month - 1, config.end);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    label: `${config.start}-${config.end}`
  };
};

// Obtiene el período actual (mes actual por defecto)
export const getCurrentMonthPeriods = () => {
  const today = new Date();
  return buildFourWeekSkeleton(today.getFullYear(), today.getMonth() + 1);
};

// Obtiene el período para un mes específico
export const getMonthPeriods = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return buildFourWeekSkeleton(year, month);
};

// Determina a cuál de las 4 semanas pertenece un día
export const getWeekNumberForDay = (day) => {
  if (day >= 1 && day <= 7) return 1;
  if (day >= 8 && day <= 14) return 2;
  if (day >= 15 && day <= 21) return 3;
  if (day >= 22 && day <= 31) return 4;
  return null;
};
