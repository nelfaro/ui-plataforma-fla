import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Search, Filter, Users, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { getAlumnosList } from '../services/alumnos';
import toast from 'react-hot-toast';

export default function DirectorioAlumnosPage() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  // Estados y categorías disponibles
  const estados = [
    'NUEVO',
    'CONSULTÓ',
    'INTERESADO',
    'NUTRIENDO',
    'REGISTRADO',
    'ACTIVO',
    'PAUSADO',
    'BAJA',
    'LISTA_ESPERA',
    'PAGO_PENDIENTE',
    'FRIO'
  ];

  const categorias = ['KIDS', 'ADULTO', 'ADOLESCENTE', 'AU_PAIR', 'CORPORATIVO'];

  // Cargar alumnos
  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        setLoading(true);
        const params = {
          limit,
          offset,
          ...(searchTerm && { search: searchTerm }),
          ...(filtroEstado && { estado: filtroEstado }),
          ...(filtroCategoria && { lead_tipo: filtroCategoria })
        };

        const resultado = await getAlumnosList(params);
        setAlumnos(resultado.items || []);
        setTotal(resultado.total || 0);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar alumnos');
      } finally {
        setLoading(false);
      }
    };

    cargarAlumnos();
  }, [searchTerm, filtroEstado, filtroCategoria, limit, offset]);

  const handleBuscar = (e) => {
    setSearchTerm(e.target.value);
    setOffset(0);
  };

  const handleFiltroEstado = (e) => {
    setFiltroEstado(e.target.value);
    setOffset(0);
  };

  const handleFiltroCategoria = (e) => {
    setFiltroCategoria(e.target.value);
    setOffset(0);
  };

  const handleLimpiarFiltros = () => {
    setSearchTerm('');
    setFiltroEstado('');
    setFiltroCategoria('');
    setOffset(0);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      ACTIVO: 'bg-green-100 text-green-800',
      REGISTRADO: 'bg-blue-100 text-blue-800',
      PAUSADO: 'bg-yellow-100 text-yellow-800',
      BAJA: 'bg-red-100 text-red-800',
      NUEVO: 'bg-purple-100 text-purple-800',
      CONSULTÓ: 'bg-indigo-100 text-indigo-800',
      INTERESADO: 'bg-cyan-100 text-cyan-800',
      PAGO_PENDIENTE: 'bg-orange-100 text-orange-800',
      FRIO: 'bg-gray-100 text-gray-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getCategoriaBadge = (categoria) => {
    const badges = {
      KIDS: 'bg-pink-100 text-pink-800',
      ADULTO: 'bg-blue-100 text-blue-800',
      ADOLESCENTE: 'bg-green-100 text-green-800',
      AU_PAIR: 'bg-purple-100 text-purple-800',
      CORPORATIVO: 'bg-orange-100 text-orange-800'
    };
    return badges[categoria] || 'bg-gray-100 text-gray-800';
  };

  const paginaActual = Math.floor(offset / limit) + 1;
  const totalPaginas = Math.ceil(total / limit);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Directorio de Alumnos</h1>
            <p className="text-gray-600 mt-1">Total: {total} alumnos</p>
          </div>
          <Users size={32} className="text-blue-600" />
        </div>

        {/* Búsqueda y Filtros */}
        <Card>
          <div className="space-y-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={18} className="inline mr-2" />
                Buscar por nombre, teléfono o email
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleBuscar}
                placeholder="Ej: Juan Pérez, +5491234567, juan@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={handleFiltroEstado}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Categoría
                </label>
                <select
                  value={filtroCategoria}
                  onChange={handleFiltroCategoria}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleLimpiarFiltros}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabla de Alumnos */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Cargando alumnos...</p>
            </div>
          ) : alumnos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No se encontraron alumnos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Último Contacto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alumnos.map((alumno) => (
                    <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{alumno.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <a
                          href={`https://wa.me/${alumno.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <Phone size={16} />
                          {alumno.whatsapp}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {alumno.email ? (
                          <a href={`mailto:${alumno.email}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                            <Mail size={16} />
                            {alumno.email}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(alumno.estado)}`}>
                          {alumno.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoriaBadge(alumno.lead_tipo)}`}>
                          {alumno.lead_tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {alumno.ultimo_contacto ? alumno.ultimo_contacto : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/alumno/${alumno.id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <Eye size={16} />
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Paginación */}
        {total > 0 && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {offset + 1}-{Math.min(offset + limit, total)} de {total} alumnos
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <div className="text-sm font-medium text-gray-700">
                  Página {paginaActual} de {totalPaginas}
                </div>

                <button
                  onClick={() => setOffset(offset + limit)}
                  disabled={paginaActual >= totalPaginas}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setOffset(0);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10 por página</option>
                <option value="25">25 por página</option>
                <option value="50">50 por página</option>
                <option value="100">100 por página</option>
              </select>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}