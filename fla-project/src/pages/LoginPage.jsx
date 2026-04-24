import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { success, error: showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !password) {
      showError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // Credenciales hardcodeadas (como en Streamlit)
      if (usuario.toLowerCase() === 'fla' && password === 'academia2026') {
        // Login exitoso
        localStorage.setItem('token', 'fla-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({ usuario: 'fla' }));
        
        // Actualiza el estado de autenticación en el hook
        const result = await login(usuario, password);
        
        if (result.success) {
          success('¡Bienvenido a Academia Fla!');
          // Redirige después de 500ms
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 500);
        }
      } else {
        showError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      showError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fla-secondary to-fla-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/logo-fla.svg"
            alt="Fla Logo"
            className="h-24 w-24 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Clases de Inglés con Fla</h1>
          <p className="text-gray-600 mt-2">Acceso a la plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            disabled={loading}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-6"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? Contacta al administrador
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
