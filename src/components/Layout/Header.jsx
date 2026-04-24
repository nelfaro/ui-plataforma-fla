import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import Button from '../UI/Button';

export const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Fla Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <h1 className="text-xl font-bold text-gray-900">Clases de Ingles con Fla</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user.usuario || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">Conectado</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
