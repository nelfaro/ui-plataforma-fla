import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AlumnosPage() {
  const [activeTab, setActiveTab] = useState('categoria');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ADULTO');
  const [horariosData, setHorariosData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Cargar horarios reales
  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://asistente-ia-fla-n8n.x5miqk.easypanel.host/webhook/get-horarios'
        );

        if (response.data.items) {
          // Transformar datos para que tenga el formato que necesitamos
          const horariosFormateados = response.data.items.map(h => ({
            horario: h.nombre,
            cantidad: h.cupo_max,
            activos: h.cupo_actual || 0,
            pausados: (h.cupo_max - (h.cupo_actual || 0)) / 2, // Aproximado
            ocupacion: Math.round(((h.cupo_actual || 0) / h.cupo_max) * 100)
          }));
          setHorariosData(horariosFormateados);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar horarios');
      } finally {
        setLoading(false);
      }
    };

    cargarHorarios();
  }, []);

  const tabs = [
    { id: 'categoria', label: '📚 Por Categoría' },
    { id: 'horario', label: '⏰ Por Horario' },
    { id: 'funnel', label: '📈 Funnel por Categoría' },
    { id: 'pagos', label: '💳 Estado de Pagos' },
    { id: 'temporal', label: '📊 Análisis Temporal' }
  ];

  // Datos de ejemplo para pagos
  const pagosData = [
    { nombre: 'Juan Pérez', horario: 'Lunes 18:00', ultimoPago: '2026-04-20', estado: 'PAGADO', diasVencido: 0 },
    { nombre: 'María García', horario: 'Martes 19:00', ultimoPago: '2026-04-10', estado: 'VENCIDO', diasVencido: 12 },
    { nombre: 'Carlos López', horario: 'Miércoles 18:00', ultimoPago: '2026-04-15', estado: 'PENDIENTE', diasVencido: 7 },
    { nombre: 'Ana Martínez', horario: 'Jueves 20:00', ultimoPago: '2026-04-22', estado: 'PAGADO', diasVencido: 0 },
    { nombre: 'Luis Rodríguez', horario: 'Viernes 19:00', ultimoPago: '2026-03-22', estado: 'VENCIDO', diasVencido: 31 },
  ];

  // Datos de ejemplo para temporal
  const alumnosNuevosData = [
    { semana: 'Sem 1', nuevos: 5 },
    { semana: 'Sem 2', nuevos: 8 },
    { semana: 'Sem 3', nuevos: 6 },
    { semana: 'Sem 4', nuevos: 12 },
    { semana: 'Sem 5', nuevos: 9 },
    { semana: 'Sem 6', nuevos: 14 },
    { semana: 'Sem 7', nuevos: 11 },
    { semana: 'Sem 8', nuevos: 15 }
  ];

  const conversionData = [
    { semana: 'Sem 1', conversion: 45 },
    { semana: 'Sem 2', conversion: 52 },
    { semana: 'Sem 3', conversion: 48 },
    { semana: 'Sem 4', conversion: 61 },
    { semana: 'Sem 5', conversion: 55 },
    { semana: 'Sem 6', conversion: 68 },
    { semana: 'Sem 7', conversion: 64 },
    { semana: 'Sem 8', conversion: 71 }
  ];

  const ingresosData = [
    { mes: 'Enero', ingresos: 2400 },
    { mes: 'Febrero', ingresos: 3200 },
    { mes: 'Marzo', ingresos: 2800 },
    { mes: 'Abril', ingresos: 3900 }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Alumnos</h1>
          <p className="text-gray-600">Administra y analiza el estado detallado de cada alumno</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 font-semibold shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Por Categoría */}
        {activeTab === 'categoria' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Alumnos por Categoría</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>KIDS</option>
                <option>ADULTO</option>
                <option>ADOLESCENTE</option>
                <option>AU_PAIR</option>
                <option>CORPORATIVO</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Teléfono</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Origen</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Último contacto</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">Juan Pérez</td>
                    <td className="px-4 py-3">+5491123456701</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">ACTIVO</span>
                    </td>
                    <td className="px-4 py-3">INSTAGRAM</td>
                    <td className="px-4 py-3">Hace 2 días</td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:underline text-xs font-medium">Editar</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">María García</td>
                    <td className="px-4 py-3">+5491123456702</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">INTERESADO</span>
                    </td>
                    <td className="px-4 py-3">FACEBOOK</td>
                    <td className="px-4 py-3">Hace 5 días</td>
                    <td className="px-4 py-3">
                    <Link 
                      to={`/alumno/1`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Ver Ficha
                    </Link>
                  </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 2: Por Horario */}
        {activeTab === 'horario' && (
          <div className="space-y-4">
            {loading ? (
              <Card>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Cargando horarios...</p>
                </div>
              </Card>
            ) : horariosData.length === 0 ? (
              <Card>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No hay horarios disponibles</p>
                </div>
              </Card>
            ) : (
              <>
                <Card>
                  <h2 className="text-xl font-bold mb-4">Ocupación de Horarios</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={horariosData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="horario" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="activos" fill="#10B981" name="Activos" />
                      <Bar dataKey="pausados" fill="#F59E0B" name="Pausados" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-4">Detalle de Horarios</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Horario</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Activos</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Pausados</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Ocupación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {horariosData.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{item.horario}</td>
                            <td className="px-4 py-3">{item.cantidad}</td>
                            <td className="px-4 py-3">{Math.round(item.activos)}</td>
                            <td className="px-4 py-3">{Math.round(item.pausados)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${item.ocupacion}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{item.ocupacion}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* TAB 3: Funnel por Categoría */}
        {activeTab === 'funnel' && (
          <Card>
            <h2 className="text-xl font-bold mb-4">Funnel de Conversión por Categoría</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Categoría:</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>KIDS</option>
                <option>ADULTO</option>
                <option>ADOLESCENTE</option>
                <option>AU_PAIR</option>
                <option>CORPORATIVO</option>
              </select>
            </div>
            
            <div className="space-y-6">
              {[
                { etapa: 'Contactos', cantidad: 45, color: '#3B82F6' },
                { etapa: 'Nutriendo', cantidad: 32, color: '#A855F7' },
                { etapa: 'Registrados', cantidad: 18, color: '#10B981' },
                { etapa: 'Activos', cantidad: 12, color: '#F59E0B' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{item.etapa}</span>
                    <span className="font-bold text-gray-900">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div 
                      className="h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ 
                        width: `${(item.cantidad / 45) * 100}%`,
                        backgroundColor: item.color
                      }}
                    >
                      {((item.cantidad / 45) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB 4: Estado de Pagos */}
        {activeTab === 'pagos' && (
          <div className="space-y-4">
            {/* Resumen de Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Total Cobrado</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">$8,500</p>
                </div>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Pagos Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">$2,100</p>
                </div>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Vencidos</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">2</p>
                </div>
              </Card>
            </div>

            {/* Tabla de Pagos */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Alumnos Activos - Estado de Pagos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Horario</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Último Pago</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Días Vencido</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{item.nombre}</td>
                        <td className="px-4 py-3">{item.horario}</td>
                        <td className="px-4 py-3">{item.ultimoPago}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            item.estado === 'PAGADO' ? 'bg-green-100 text-green-800' :
                            item.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.diasVencido > 0 ? (
                            <span className="text-red-600 font-medium">{item.diasVencido} días</span>
                          ) : (
                            <span className="text-green-600">Al día</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:underline text-xs font-medium">Marcar pago</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: Análisis Temporal */}
        {activeTab === 'temporal' && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-bold mb-4">📈 Alumnos Nuevos por Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={alumnosNuevosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="nuevos" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">📊 Conversión por Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversion" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">💰 Ingresos Acumulados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={ingresosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="ingresos" fill="#A855F7" stroke="#A855F7" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-4">Filtrar por período</h3>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desde:</label>
                  <input 
                    type="date" 
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hasta:</label>
                  <input 
                    type="date" 
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}