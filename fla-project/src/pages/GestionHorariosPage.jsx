import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Clock, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function GestionHorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'GRUPAL',
    nivel: 'inicial',
    categoria: 'ADULTO',
    dia_1: 'lunes',
    dia_2: 'miercoles',
    hora_inicio: '18:00',
    hora_fin: '19:00',
    cupo_max: 20,
    precio_mensual: '',
    descripcion: ''
  });

  const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const niveles = ['inicial', 'intermedio', 'avanzado'];
  const categorias = ['KIDS', 'ADULTO', 'ADOLESCENTE', 'AU_PAIR', 'CORPORATIVO'];
  const tipos = ['GRUPAL', 'INDIVIDUAL'];

  const diasEtiquetas = {
    lunes: 'Lun',
    martes: 'Mar',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    sabado: 'Sáb',
    domingo: 'Dom'
  };

  // Cargar horarios
  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-horarios'
      );

      if (response.data.items) {
        setHorarios(response.data.items);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleGuardar = async () => {
    try {
      if (!formData.nombre) {
        toast.error('El nombre es requerido');
        return;
      }

      if (editingId) {
        // Actualizar
        await axios.post(
          'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/update-horario',
          {
            id: editingId,
            nombre: formData.nombre,
            tipo: formData.tipo,
            nivel: formData.nivel,
            categoria: formData.categoria,
            dia_1: formData.dia_1,
            dia_2: formData.dia_2,
            hora_inicio: formData.hora_inicio,
            hora_fin: formData.hora_fin,
            cupo_max: parseInt(formData.cupo_max),
            precio_mensual: formData.precio_mensual ? parseFloat(formData.precio_mensual) : null,
            descripcion: formData.descripcion
          }
        );
        toast.success('Horario actualizado');
      } else {
        // Crear
        await axios.post(
          'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/create-horario',
          {
            nombre: formData.nombre,
            tipo: formData.tipo,
            nivel: formData.nivel,
            categoria: formData.categoria,
            dia_1: formData.dia_1,
            dia_2: formData.dia_2,
            hora_inicio: formData.hora_inicio,
            hora_fin: formData.hora_fin,
            cupo_max: parseInt(formData.cupo_max),
            precio_mensual: formData.precio_mensual ? parseFloat(formData.precio_mensual) : null,
            descripcion: formData.descripcion
          }
        );
        toast.success('Horario creado');
      }

      setShowModal(false);
      setEditingId(null);
      resetForm();
      cargarHorarios();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar horario');
    }
  };

  const handleEditar = (horario) => {
    setFormData({
      nombre: horario.nombre,
      tipo: horario.tipo,
      nivel: horario.nivel,
      categoria: horario.categoria,
      dia_1: horario.dia_1,
      dia_2: horario.dia_2,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      cupo_max: horario.cupo_max,
      precio_mensual: horario.precio_mensual || '',
      descripcion: horario.descripcion || ''
    });
    setEditingId(horario.id);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      return;
    }

    try {
      await axios.post(
        'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/delete-horario',
        { id }
      );
      toast.success('Horario eliminado');
      cargarHorarios();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar horario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'GRUPAL',
      nivel: 'inicial',
      categoria: 'ADULTO',
      dia_1: 'lunes',
      dia_2: 'miercoles',
      hora_inicio: '18:00',
      hora_fin: '19:00',
      cupo_max: 20,
      precio_mensual: '',
      descripcion: ''
    });
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const getCategoriaBadgeColor = (categoria) => {
    const colors = {
      KIDS: 'bg-pink-100 text-pink-800',
      ADULTO: 'bg-blue-100 text-blue-800',
      ADOLESCENTE: 'bg-green-100 text-green-800',
      AU_PAIR: 'bg-purple-100 text-purple-800',
      CORPORATIVO: 'bg-orange-100 text-orange-800'
    };
    return colors[categoria] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios</h1>
            <p className="text-gray-600 mt-1">Administra los horarios de clases disponibles</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Horario
          </button>
        </div>

        {/* Tabla */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Cargando horarios...</p>
            </div>
          ) : horarios.length === 0 ? (
            <div className="flex items-center justify-center h-96 flex-col">
              <Clock size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No hay horarios registrados</p>
              <button
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setShowModal(true);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Crear primer horario
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Días</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Horario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nivel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cupo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {horarios.map((horario) => (
                    <tr key={horario.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{horario.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="font-medium">
                          {diasEtiquetas[horario.dia_1]} / {diasEtiquetas[horario.dia_2]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {horario.hora_inicio} - {horario.hora_fin}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {horario.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoriaBadgeColor(horario.categoria)}`}>
                          {horario.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {horario.nivel}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {horario.cupo_actual || 0}/{horario.cupo_max}
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                ((horario.cupo_actual || 0) / horario.cupo_max) * 100 > 75
                                  ? 'bg-red-500'
                                  : ((horario.cupo_actual || 0) / horario.cupo_max) * 100 > 50
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${((horario.cupo_actual || 0) / horario.cupo_max) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-12">
                            {Math.round(((horario.cupo_actual || 0) / horario.cupo_max) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {horario.precio_mensual ? `$${horario.precio_mensual}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(horario)}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Edit2 size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(horario.id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Editar Horario' : 'Crear Nuevo Horario'}
              </h3>
              <button
                onClick={handleCancelar}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Horario</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleFormChange('nombre', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Grupales Adultos - Lun/Mié 18:00"
                />
              </div>

              {/* Tipo y Nivel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleFormChange('tipo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tipos.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <select
                    value={formData.nivel}
                    onChange={(e) => handleFormChange('nivel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {niveles.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categorias.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Días */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día 1</label>
                  <select
                    value={formData.dia_1}
                    onChange={(e) => handleFormChange('dia_1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dias.map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Día 2</label>
                  <select
                    value={formData.dia_2}
                    onChange={(e) => handleFormChange('dia_2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dias.map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => handleFormChange('hora_inicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Fin</label>
                  <input
                    type="time"
                    value={formData.hora_fin}
                    onChange={(e) => handleFormChange('hora_fin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cupo y Precio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cupo Máximo</label>
                  <input
                    type="number"
                    value={formData.cupo_max}
                    onChange={(e) => handleFormChange('cupo_max', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Mensual (opcional)</label>
                  <input
                    type="number"
                    value={formData.precio_mensual}
                    onChange={(e) => handleFormChange('precio_mensual', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleFormChange('descripcion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Descripción adicional del horario"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handleGuardar}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingId ? 'Actualizar' : 'Crear'} Horario
              </button>
              <button
                onClick={handleCancelar}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}