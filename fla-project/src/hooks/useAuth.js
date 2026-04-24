import { useState, useCallback } from 'react';
import * as authService from '../services/auth';
import { MESSAGES } from '../config/constants';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (usuario, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.loginUser(usuario, password);
      setUser(data.user || { usuario });
      return { success: true, message: MESSAGES.SUCCESS_LOGIN };
    } catch (err) {
      const message = err.response?.data?.mensaje || MESSAGES.ERROR_LOGIN;
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logoutUser();
    setUser(null);
    setError(null);
    // Fuerza reload de la página
    window.location.href = '/login';
  }, []);

  const isAuthenticated = !!user && !!authService.getToken();

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    setError
  };
};

export default useAuth;
