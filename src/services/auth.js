import api from './api';
import { MESSAGES } from '../config/constants';

// Login
export const loginUser = async (usuario, password) => {
  // Credenciales hardcodeadas (como en Streamlit)
  if (usuario.toLowerCase() !== 'fla' || password !== 'academia2026') {
    throw new Error('Usuario o contraseña incorrectos');
  }
  
  const token = 'fla-token-' + Date.now();
  const userData = { usuario: 'fla' };
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  return { token, user: userData };
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Verificar autenticación
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Obtener token
export const getToken = () => {
  return localStorage.getItem('token');
};

export default {
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  getToken
};
