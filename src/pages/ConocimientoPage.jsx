import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useNotification } from '../context/NotificationContext';
import * as conocimientoService from '../services/conocimiento';
import { BookOpen, Trash2, Edit2, ChevronDown } from 'lucide-react';

export const ConocimientoPage = () => {
  const CATEGORIAS = ['PRECIOS', 'FAQ', 'METODOLOGIA', 'CLASES'];
  const SEGMENTOS = ['GENERAL', 'KIDS', 'ADULTOS', 'AU_PAIR', 'PERSONALIZADO'];

  const { success, error: showError } = useNotification();

  const [tabActiva, setTabActiva] = useState('PRECIOS');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filtroSegmento, setFiltroSegmento] = useState('');

  const [formData, setFormData] = useState({
    segmento: 'GENERAL',
    titulo: '',
    contenido: '',
    activo: true
  });

  useEffect(() => {
    loadItems();
  }, [tabActiva, filtroSegmento]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await conocimientoService.getItems(tabActiva, filtroSegmento);
      setItems(response.items || []);
    } catch (err) {
      showError('Error al cargar items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!formData.titulo.trim()) {
      showError('Por favor ingresá un título');
      return;
    }
    if (!formData.contenido.trim()) {
      showError('Por favor ingresá el contenido');
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        categoria: tabActiva
      };

      if (editingId) {
        await conocimientoService.updateItem(editingId, dataToSave);
        success('✅ Actualizado exitosamente');
      } else {
        await conocimientoService.createItem(dataToSave);
        success('✅ Creado exitosamente');
      }

      resetForm();
      setShowModal(false);
      await loadItems();
    } catch (err) {
      showError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (item) => {
    setFormData({
      segmento: item.segmento,
      titulo: item.titulo,
      contenido: item.contenido,
      activo: item.activo
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este item?')) return;

    try {
      setLoading(true);
      await conocimientoService.deleteItem(id);
      success('✅ Eliminado exitosamente');
      await loadItems();
    } catch (err) {
      showError('Error al eliminar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      segmento: 'GENERAL',
      titulo: '',
      contenido: '',
      activo: true
    });
    setEditingId(null);
  };

  const handleCancelar = () => {
    resetForm();
    setShowModal(false);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Base de Conocimiento</h1>
          <p className="text-gray-600">Gestiona precios, FAQs, metodología e información de clases que el agente Fla utilizará para responder consultas</p>
        </div>

        <Card>
          {/* Tab bar */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setTabActiva(cat);
                  setFiltroSegmento('');
                }}
                className={`px-6 py-3 font-medium transition-colors ${
                  tabActiva === cat
                    ? 'bg-fla-primary text-black border-b-2 border-fla-primary'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filtrar por segmento:</label>
              <select
                value={filtroSegmento}
                onChange={e => setFiltroSegmento(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fla-primary text-sm"
              >
                <option value="">Todos</option>
                {SEGMENTOS.map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + Agregar nuevo
            </Button>
          </div>

          {/* Table */}
          {loading && items.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fla-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay items en esta categoría</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Segmento</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Preview</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Activo</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{item.titulo}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {item.segmento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {item.contenido.substring(0, 60)}...
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          item.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.activo ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEditar(item)}
                          className="inline-block mr-3 p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleEliminar(item.id)}
                          className="inline-block p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-fla-dark" />
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Editar item' : 'Crear nuevo item'}
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segmento <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.segmento}
                  onChange={e => handleFormChange('segmento', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fla-primary"
                >
                  {SEGMENTOS.map(seg => (
                    <option key={seg} value={seg}>{seg}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Título"
                value={formData.titulo}
                onChange={e => handleFormChange('titulo', e.target.value)}
                placeholder="Ej: Precio clase grupal KIDS"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.contenido}
                  onChange={e => handleFormChange('contenido', e.target.value)}
                  placeholder="Ingresá el contenido completo..."
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fla-primary font-sans"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={e => handleFormChange('activo', e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Activo (visible para el agente)
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
              <Button variant="secondary" onClick={handleCancelar}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGuardar}
                loading={loading}
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default ConocimientoPage;
