import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { ArrowLeft, Edit2, Phone, Mail, Calendar, User, BookOpen, Clock, DollarSign, Save, X } from 'lucide-react';
import { updateAlumno, registrarPago, getAlumnoById } from '../services/alumnos';
import toast from 'react-hot-toast';
import {getAlumnosList, updateCupoHorario } from '../services/alumnos';
import axios from 'axios';

export default function AlumnoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [savingPago, setSavingPago] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [pagoForm, setPagoForm] = useState({
    monto: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    tipo_pago: 'MANUAL',
    metodo: 'EFECTIVO',
    nota: ''
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getAlumnoById(id);
        setAlumno(data);
        setFormData(data);
        setLoading(false);

        // Cargar horarios disponibles
        const response = await axios.get(
          'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-horarios'
        );
        if (response.data.items) {
          setHorariosDisponibles(response.data.items);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error cargando datos');
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleEditChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Si cambió el horario, actualizar cupos
      if (alumno.horario_clase !== formData.horario_clase) {
        // Decrementar cupo del horario anterior
        if (alumno.horario_clase) {
          const horarioAnterior = horariosDisponibles.find(h => h.nombre === alumno.horario_clase);
          if (horarioAnterior) {
            await updateCupoHorario(horarioAnterior.id, 'decrementar');
          }
        }
        
        // Incrementar cupo del nuevo horario
        if (formData.horario_clase) {
          const horarioNuevo = horariosDisponibles.find(h => h.nombre === formData.horario_clase);
          if (horarioNuevo) {
            await updateCupoHorario(horarioNuevo.id, 'incrementar');
          }
        }
      }
      
      const resultado = await updateAlumno(alumno.id, formData);
      setAlumno({...alumno, ...resultado});
      setEditMode(false);
      toast.success('Alumno actualizado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar alumno: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarPago = async () => {
    try {
      if (!pagoForm.monto) {
        toast.error('El monto es requerido');
        return;
      }

      setSavingPago(true);
      const resultado = await registrarPago({
        alumno_id: alumno.id,
        monto: parseFloat(pagoForm.monto),
        fecha_pago: pagoForm.fecha_pago,
        tipo_pago: pagoForm.tipo_pago,
        metodo: pagoForm.metodo,
        nota: pagoForm.nota,
        registrado_por: 'usuario_actual'
      });

      // Actualizar estado local
      setAlumno({
        ...alumno,
        estado_pago: 'PAGADO',
        fecha_pago_ultimo: pagoForm.fecha_pago
      });

      toast.success('Pago registrado correctamente');
      setShowPagoModal(false);
      setPagoForm({
        monto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        tipo_pago: 'MANUAL',
        metodo: 'EFECTIVO',
        nota: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al registrar pago: ' + error.message);
    } finally {
      setSavingPago(false);
    }
  };

  if (loading && !alumno) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!alumno) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Alumno no encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header con botón atrás */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/alumnos')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Ficha del Alumno</h1>
        </div>

        {/* Foto y datos principales */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Foto */}
            <div className="flex-shrink-0">
              <img
                src={alumno.foto_url}
                alt={alumno.nombre}
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            {/* Datos principales */}
            <div className="flex-grow">
              {editMode ? (
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleEditChange('nombre', e.target.value)}
                  className="text-3xl font-bold text-gray-900 bg-white px-3 py-2 rounded border border-gray-300 mb-2"
                />
              ) : (
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{alumno.nombre}</h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} className="text-blue-600" />
                  <span>{alumno.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} className="text-blue-600" />
                  <span>{alumno.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={18} className="text-blue-600" />
                  <span>Registrado: {alumno.fecha_registro}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} className="text-blue-600" />
                  <span>{alumno.lead_tipo}</span>
                </div>
              </div>
            </div>

            {/* Botón Editar */}
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Editar
              </button>
            )}
          </div>
        </Card>

        {/* Información académica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-purple-600" />
              Información Académica
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nivel</label>
                {editMode ? (
                  <select
                    value={formData.nivel}
                    onChange={(e) => handleEditChange('nivel', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{alumno.nivel}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                {editMode ? (
                  <select
                    value={formData.estado}
                    onChange={(e) => handleEditChange('estado', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>NUEVO</option>
                    <option>CONSULTÓ</option>
                    <option>INTERESADO</option>
                    <option>NUTRIENDO</option>
                    <option>REGISTRADO</option>
                    <option>ACTIVO</option>
                    <option>PAUSADO</option>
                    <option>BAJA</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    alumno.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                    alumno.estado === 'PAUSADO' ? 'bg-yellow-100 text-yellow-800' :
                    alumno.estado === 'BAJA' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alumno.estado}
                  </span>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                {editMode ? (
                  <select
                    value={formData.lead_tipo}
                    onChange={(e) => handleEditChange('lead_tipo', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>KIDS</option>
                    <option>ADULTO</option>
                    <option>ADOLESCENTE</option>
                    <option>AU_PAIR</option>
                    <option>CORPORATIVO</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium">{alumno.lead_tipo}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Información de clase */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-orange-600" />
              Información de Clase
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Horario</label>
                {editMode ? (
                  <div className="space-y-2">
                    <select
                      value={formData.horario_clase}
                      onChange={(e) => handleEditChange('horario_clase', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar horario...</option>
                      {horariosDisponibles.map((h) => (
                        <option key={h.id} value={h.nombre}>
                          {h.nombre} - {h.hora_inicio} a {h.hora_fin} ({h.cupo_actual}/{h.cupo_max})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Selecciona un horario disponible</p>
                  </div>
                ) : (
                  <p className="text-gray-900 font-medium">{alumno.horario_clase || 'Sin asignar'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Origen</label>
                <p className="text-gray-900 font-medium">{alumno.origen}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Intención</label>
                <p className="text-gray-900 font-medium">{alumno.intencion}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Estado de pago */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Estado de Pago
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estado</p>
              <p className={`text-lg font-bold mt-1 ${
                alumno.estado_pago === 'PAGADO' ? 'text-green-600' :
                alumno.estado_pago === 'PENDIENTE' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {alumno.estado_pago}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Último pago</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{alumno.fecha_pago_ultimo}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <button 
                onClick={() => setShowPagoModal(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Registrar Pago
              </button>
            </div>
          </div>
        </Card>

        {/* Notas */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
          {editMode ? (
            <textarea
              value={formData.notas}
              onChange={(e) => handleEditChange('notas', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          ) : (
            <p className="text-gray-700">{alumno.notas}</p>
          )}
        </Card>

        {/* Botones de acción */}
        {editMode && (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              Guardar Cambios
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(alumno);
              }}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium flex items-center gap-2"
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Modal Registrar Pago */}
      {showPagoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Registrar Pago</h3>
              <button
                onClick={() => setShowPagoModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  value={pagoForm.monto}
                  onChange={(e) => setPagoForm({...pagoForm, monto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago</label>
                <input
                  type="date"
                  value={pagoForm.fecha_pago}
                  onChange={(e) => setPagoForm({...pagoForm, fecha_pago: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago</label>
                <select
                  value={pagoForm.tipo_pago}
                  onChange={(e) => setPagoForm({...pagoForm, tipo_pago: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="MERCADO_PAGO">Mercado Pago</option>
                </select>
              </div>

              {pagoForm.tipo_pago === 'MANUAL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                  <select
                    value={pagoForm.metodo}
                    onChange={(e) => setPagoForm({...pagoForm, metodo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                <input
                  type="text"
                  value={pagoForm.nota}
                  onChange={(e) => setPagoForm({...pagoForm, nota: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRegistrarPago}
                disabled={savingPago}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {savingPago ? 'Registrando...' : 'Registrar'}
              </button>
              <button
                onClick={() => setShowPagoModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
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