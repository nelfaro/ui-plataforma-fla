import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import { getAlumnosList } from '../services/alumnos';
import toast from 'react-hot-toast';

export default function AlumnosPage() {
  const [activeTab, setActiveTab] = useState('categoria');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('KIDS');
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosPorCategoria, setAlumnosPorCategoria] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const categorias = ['KIDS', 'ADULTO', 'ADOLESCENTE', 'AU_PAIR', 'CORPORATIVO'];

  // Cargar alumnos reales
  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const response = await getAlumnosList();
      const alumnosList = response.alumnos || [];
      setAlumnos(alumnosList);

      // Agrupar por categoría
      const agrupado = {};
      categorias.forEach(cat => {
        agrupado[cat] = alumnosList.filter(a => a.categoria === cat || a.lead_tipo === cat);
      });
      setAlumnosPorCategoria(agrupado);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'categoria', label: '📚 Por Categoría' },
    { id: 'horario', label: '⏰ Por Horario' },
    { id: 'funnel', label: '📈 Funnel por Categoría' },
    { id: 'pagos', label: '💳 Estado de Pagos' },
    { id: 'temporal', label: '📊 Análisis Temporal' }
  ];

  // Preparar datos para pagos (alumnos activos)
  const pagosData = alumnos
    .filter(a => a.estado === 'ACTIVO' || a.estado === 'ACTIVOS')
    .slice(0, 10)
    .map(a => ({
      nombre: a.nombre || a.nombre_contacto || 'Sin nombre',
      horario: a.horario_clase || 'No asignado',
      ultimoPago: a.ultimo_pago || 'Sin registro',
      estado: a.pago_estado || 'PENDIENTE',
      diasVencido: 0
    }));

  // Preparar datos de alumnos nuevos por semana (aproximado)
  const alumnosNuevosData = [
    { semana: 'Sem 1', nuevos: Math.floor(alumnos.length * 0.1) },
    { semana: 'Sem 2', nuevos: Math.floor(alumnos.length * 0.12) },
    { semana: 'Sem 3', nuevos: Math.floor(alumnos.length * 0.08) },
    { semana: 'Sem 4', nuevos: Math.floor(alumnos.length * 0.15) },
    { semana: 'Sem 5', nuevos: Math.floor(alumnos.length * 0.1) },
    { semana: 'Sem 6', nuevos: Math.floor(alumnos.length * 0.14) },
    { semana: 'Sem 7', nuevos: Math.floor(alumnos.length * 0.11) },
    { semana: 'Sem 8', nuevos: Math.floor(alumnos.length * 0.16) }
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
            <h2 className="text-xl font-bold mb-4">Alumnos por Categoría ({alumnosPorCategoria[selectedCategory]?.length || 0})</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por categoría:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Cargando alumnos...</p>
              </div>
            ) : alumnosPorCategoria[selectedCategory]?.length === 0 ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">No hay alumnos en esta categoría</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Teléfono</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Origen</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Horario</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosPorCategoria[selectedCategory]?.map(alumno => (
                      <tr key={alumno.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{alumno.nombre || alumno.nombre_contacto || '—'}</td>
                        <td className="px-4 py-3">{alumno.whatsapp || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            alumno.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
                            alumno.estado === 'CALIENTE' ? 'bg-orange-100 text-orange-800' :
                            alumno.estado === 'TIBIO' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alumno.estado || 'FRIO'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{alumno.origen || '—'}</td>
                        <td className="px-4 py-3">{alumno.horario_clase || '—'}</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/alumno/${alumno.id}`}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            Ver Ficha
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* TAB 2: Por Horario */}
        {activeTab === 'horario' && (
          <div className="space-y-4">
            {loading ? (
              <Card>
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">Cargando análisis por horario...</p>
                </div>
              </Card>
            ) : (
              <>
                <Card>
                  <h2 className="text-xl font-bold mb-4">Distribución de Alumnos por Estado</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { estado: 'ACTIVOS', cantidad: alumnos.filter(a => a.estado === 'ACTIVO' || a.estado === 'ACTIVOS').length },
                      { estado: 'CALIENTE', cantidad: alumnos.filter(a => a.estado === 'CALIENTE').length },
                      { estado: 'TIBIO', cantidad: alumnos.filter(a => a.estado === 'TIBIO').length },
                      { estado: 'FRIO', cantidad: alumnos.filter(a => a.estado === 'FRIO').length }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="estado" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#3B82F6" name="Cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-4">Resumen por Estado</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Activos', color: 'bg-green-100 text-green-800', count: alumnos.filter(a => a.estado === 'ACTIVO' || a.estado === 'ACTIVOS').length },
                      { label: 'Caliente', color: 'bg-orange-100 text-orange-800', count: alumnos.filter(a => a.estado === 'CALIENTE').length },
                      { label: 'Tibio', color: 'bg-yellow-100 text-yellow-800', count: alumnos.filter(a => a.estado === 'TIBIO').length },
                      { label: 'Frío', color: 'bg-gray-100 text-gray-800', count: alumnos.filter(a => a.estado === 'FRIO').length }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${item.color}`}>
                        <p className="text-sm font-medium opacity-75">{item.label}</p>
                        <p className="text-2xl font-bold">{item.count}</p>
                      </div>
                    ))}
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
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Cargando datos...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const alumnosCat = alumnosPorCategoria[selectedCategory] || [];
                  const total = alumnosCat.length || 1;
                  const activos = alumnosCat.filter(a => a.estado === 'ACTIVO' || a.estado === 'ACTIVOS').length;
                  const calientes = alumnosCat.filter(a => a.estado === 'CALIENTE').length;
                  const tibios = alumnosCat.filter(a => a.estado === 'TIBIO').length;
                  const frios = alumnosCat.filter(a => a.estado === 'FRIO').length;

                  return [
                    { etapa: 'Total', cantidad: total, color: '#3B82F6' },
                    { etapa: 'Calientes', cantidad: calientes, color: '#A855F7' },
                    { etapa: 'Tibios', cantidad: tibios, color: '#F59E0B' },
                    { etapa: 'Activos', cantidad: activos, color: '#10B981' }
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
                            width: `${(item.cantidad / (total || 1)) * 100}%`,
                            backgroundColor: item.color
                          }}
                        >
                          {((item.cantidad / (total || 1)) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </Card>
        )}

        {/* TAB 4: Estado de Pagos */}
        {activeTab === 'pagos' && (
          <div className="space-y-4">
            {/* Resumen de Pagos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Alumnos Pagados</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{alumnos.filter(a => a.pago_estado === 'PAGADO').length}</p>
                </div>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Pagos Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{alumnos.filter(a => a.pago_estado === 'PENDIENTE').length}</p>
                </div>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium">Vencidos</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{alumnos.filter(a => a.pago_estado === 'VENCIDO').length}</p>
                </div>
              </Card>
            </div>

            {/* Tabla de Pagos */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Alumnos Activos - Estado de Pagos</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p className="text-gray-500">Cargando datos de pagos...</p>
                </div>
              ) : pagosData.length === 0 ? (
                <div className="flex justify-center py-8">
                  <p className="text-gray-500">No hay alumnos activos registrados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Horario</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Último Pago</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
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
                            <Link
                              to={`/alumno/${alumnos.find(a => a.nombre === item.nombre)?.id || ''}`}
                              className="text-blue-600 hover:underline text-xs font-medium"
                            >
                              Ver Ficha
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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