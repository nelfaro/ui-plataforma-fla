import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { getLeadsPipeline } from '../services/leads';
import toast from 'react-hot-toast';

const ESTADOS = ['FRIO', 'TIBIO', 'CALIENTE', 'ACTIVO'];
const ORIGENES = ['RECOMENDACION', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'ORGANICO'];
const TIPOS = ['KIDS', 'ADULTO', 'ADOLESCENTE', 'AU_PAIR'];

const getEstadoBadgeColor = (estado) => {
  const colorMap = {
    'FRIO': 'bg-gray-100 text-gray-800',
    'TIBIO': 'bg-yellow-100 text-yellow-800',
    'CALIENTE': 'bg-orange-100 text-orange-800',
    'ACTIVO': 'bg-green-100 text-green-800'
  };
  return colorMap[estado] || 'bg-gray-100 text-gray-800';
};

const formatearFechaRelativa = (fecha) => {
  if (!fecha) return 'Sin registro';

  const fechaObj = new Date(fecha);
  const ahora = new Date();
  const difMs = ahora - fechaObj;
  const difDias = Math.floor(difMs / (1000 * 60 * 60 * 24));

  if (difDias === 0) return 'Hoy';
  if (difDias === 1) return 'Hace 1 día';
  if (difDias < 7) return `Hace ${difDias} días`;
  if (difDias < 30) return `Hace ${Math.floor(difDias / 7)} semanas`;
  return `Hace ${Math.floor(difDias / 30)} meses`;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: '',
    origen: '',
    lead_tipo: ''
  });

  const [kpis, setKpis] = useState({
    total: 0,
    frio: 0,
    seguimiento: 0,
    activo: 0
  });

  useEffect(() => {
    cargarLeads();
  }, [filtros]);

  const cargarLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeadsPipeline(
        Object.fromEntries(
          Object.entries(filtros).filter(([_, v]) => v !== '')
        )
      );

      const items = response.items || [];
      setLeads(items);

      // Calcular KPIs
      const total = items.length;
      const frio = items.filter(l => l.estado === 'FRIO').length;
      const seguimiento = items.filter(l => l.estado === 'TIBIO' || l.estado === 'CALIENTE').length;
      const activo = items.filter(l => l.estado === 'ACTIVO').length;

      setKpis({ total, frio, seguimiento, activo });
    } catch (error) {
      console.error('Error al cargar leads:', error);
      toast.error('Error al cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (tipo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };

  const KpiCard = ({ label, value, color }) => (
    <Card className={`text-center py-6 ${color}`}>
      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline de Leads</h1>
          <p className="text-gray-600">Todas las personas que contactaron a Fla</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total contactos" value={kpis.total} color="bg-blue-50" />
          <KpiCard label="FRIO" value={kpis.frio} color="bg-gray-50" />
          <KpiCard label="En seguimiento" value={kpis.seguimiento} color="bg-purple-50" />
          <KpiCard label="ACTIVO" value={kpis.activo} color="bg-green-50" />
        </div>

        {/* Filtros */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => handleFiltroChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {ESTADOS.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            {/* Filtro Origen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Origen</label>
              <select
                value={filtros.origen}
                onChange={(e) => handleFiltroChange('origen', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {ORIGENES.map(origen => (
                  <option key={origen} value={origen}>{origen}</option>
                ))}
              </select>
            </div>

            {/* Filtro Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={filtros.lead_tipo}
                onChange={(e) => handleFiltroChange('lead_tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Tabla de Leads */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Cargando leads...</p>
              </div>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-center">No hay leads que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">WhatsApp</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nivel</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Origen</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Último contacto</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Motivo del estado</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Resumen</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {lead.nombre || 'Sin nombre'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {lead.whatsapp || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getEstadoBadgeColor(lead.estado)}`}>
                          {lead.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.nivel || 'No especificado'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.lead_tipo || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.origen || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {formatearFechaRelativa(lead.ultimo_contacto)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                        <span title={lead.estado_motivo || 'Sin motivo registrado'}>
                          {lead.estado_motivo ? lead.estado_motivo.substring(0, 50) + (lead.estado_motivo.length > 50 ? '...' : '') : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">
                        <span title={lead.resumen || 'Sin resumen'}>
                          {lead.resumen ? lead.resumen.substring(0, 50) + (lead.resumen.length > 50 ? '...' : '') : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
