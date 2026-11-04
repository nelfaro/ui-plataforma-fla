import axios from 'axios';

// La sesión vive en una cookie HttpOnly emitida por el servidor.
// En localStorage solo se guarda el nombre de usuario para pintar la UI.
const USER_KEY = 'user';

// Login (valida contra el servidor)
export const loginUser = async (usuario, password) => {
  const { data } = await axios.post('/api/auth/login', { usuario, password });
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return { user: data.user };
};

// Logout
export const logoutUser = async () => {
  try {
    await axios.post('/api/auth/logout');
  } catch {
    // si falla igual limpiamos el estado local
  }
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('token');
};

// Verifica con el servidor si la sesión sigue vigente
export const checkSession = async () => {
  try {
    const { data } = await axios.get('/api/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// Obtener usuario actual (solo informativo)
export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export default {
  loginUser,
  logoutUser,
  checkSession,
  getCurrentUser
};
