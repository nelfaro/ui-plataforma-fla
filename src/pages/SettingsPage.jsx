import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useNotification } from '../context/NotificationContext';
import { getConfiguracion, updateConfiguracion } from '../services/academia';
import { Settings, Bank, MapPin, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre_academia: '',
    nombre_profe: '',
    email: '',
    telefono: '',
    ubicacion_direccion: '',
    ubicacion_localidad: '',
    horario_atencion: '',
    banco: '',
    cbu: '',
    alias: '',
    linktree_url: '',
    instagram: '',
    facebook: '',
    politica_cancelacion: '',
    politica_recuperacion: '',
    politica_reembolso: ''
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const data = await getConfiguracion();
      if (data.config) {
        setFormData(data.config);
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleGuardar = async () => {
    try {
      setSaving(true);
      await updateConfiguracion(formData);
      success('✅ Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      showError('Error al guardar configuración: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando configuración...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10" />
            Configuración
          </h1>
          <p className="text-gray-600">Administra la información de tu academia y cómo el agente Fla responde a los usuarios</p>
        </div>

        {/* Sección 1: Datos Básicos */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold">Datos de la Academia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Academia"
              value={formData.nombre_academia}
              onChange={(e) => handleChange('nombre_academia', e.target.value)}
              placeholder="Ej: Clases de Inglés con Fla"
            />
            <Input
              label="Nombre de la Profe"
              value={formData.nombre_profe}
              onChange={(e) => handleChange('nombre_profe', e.target.value)}
              placeholder="Ej: Flabia Diez"
            />
            <Input
              label="Email de Contacto"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="tu@email.com"
            />
            <Input
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="+54 9 376 ..."
            />
            <Input
              label="Horario de Atención"
              value={formData.horario_atencion}
              onChange={(e) => handleChange('horario_atencion', e.target.value)}
              placeholder="Ej: Lun-Vie 9-20hs, Sáb 10-14hs"
            />
            <Input
              label="Linktree / Propuesta"
              value={formData.linktree_url}
              onChange={(e) => handleChange('linktree_url', e.target.value)}
              placeholder="https://linktr.ee/..."
            />
          </div>
        </Card>

        {/* Sección 2: Ubicación */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2 className="text-2xl font-bold">Ubicación</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección"
              value={formData.ubicacion_direccion}
              onChange={(e) => handleChange('ubicacion_direccion', e.target.value)}
              placeholder="Ej: Vargas Gómez 1667"
            />
            <Input
              label="Localidad"
              value={formData.ubicacion_localidad}
              onChange={(e) => handleChange('ubicacion_localidad', e.target.value)}
              placeholder="Ej: Corrientes, Argentina"
            />
          </div>
        </Card>

        {/* Sección 3: Datos Bancarios */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Bank className="w-5 h-5 text-purple-600" />
            <h2 className="text-2xl font-bold">Datos Bancarios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Banco"
              value={formData.banco}
              onChange={(e) => handleChange('banco', e.target.value)}
              placeholder="Ej: Banco de Corrientes"
            />
            <Input
              label="Alias"
              value={formData.alias}
              onChange={(e) => handleChange('alias', e.target.value)}
              placeholder="Ej: flabia.diez"
            />
            <Input
              label="CBU"
              value={formData.cbu}
              onChange={(e) => handleChange('cbu', e.target.value)}
              placeholder="Ej: 0940099366005413330032"
            />
          </div>
        </Card>

        {/* Sección 4: Redes Sociales */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Instagram"
              value={formData.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="@tu_usuario"
            />
            <Input
              label="Facebook"
              value={formData.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="Tu página o perfil"
            />
          </div>
        </Card>

        {/* Sección 5: Políticas */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Políticas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Política de Cancelación</label>
              <textarea
                value={formData.politica_cancelacion}
                onChange={(e) => handleChange('politica_cancelacion', e.target.value)}
                placeholder="Describe tu política de cancelación (ej: 48 horas de anticipación)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Política de Recuperación de Clases</label>
              <textarea
                value={formData.politica_recuperacion}
                onChange={(e) => handleChange('politica_recuperacion', e.target.value)}
                placeholder="Describe cómo funcionan las recuperaciones de clases"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Política de Reembolso</label>
              <textarea
                value={formData.politica_reembolso}
                onChange={(e) => handleChange('politica_reembolso', e.target.value)}
                placeholder="Describe tu política de reembolso"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Botón de guardar */}
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={cargarConfiguracion}>
            Descartar cambios
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            loading={saving}
          >
            Guardar Configuración
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
