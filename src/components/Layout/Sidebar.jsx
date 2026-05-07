import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  MessageSquare,
  Smartphone,
  Settings,
  X,
  Users,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: BarChart3
    },
    { 
      to: '/alumnos', 
      label: 'Gestión de Alumnos', 
      icon: Users 
    },
    {
    to: '/directorio',
    label: 'Directorio de Alumnos',
    icon: Users
    },
    {
      label: 'Documentos',
      to: '/documents',
      icon: FileText
    },
    {
    to: '/horarios',
    label: 'Gestión de Horarios',
    icon: Clock  // Importa de lucide-react
    },
    {
    to: '/analisis-temporal',
    label: 'Análisis Temporal',
    icon: TrendingUp  // Importa de lucide-react
    },
    {
      to: '/leads',
      label: 'Leads / Pipeline',
      icon: Target
    },
    {
      label: 'Chatwoot',
      to: '/chatwoot',
      icon: MessageSquare
    },
    {
      label: 'WhatsApp',
      to: '/whatsapp',
      icon: Smartphone
    },
    {
      label: 'Configuración',
      to: '/settings',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.png"
              alt="Fla Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h2 className="text-lg font-bold text-gray-900">Clases de Ingles con Fla</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-fla-primary text-black font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Clases de Inglés con Fla © 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
