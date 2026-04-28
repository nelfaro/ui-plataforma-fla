import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { getAnalisisTemporal } from '../services/dashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AnalisisTemporalPage() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3); // Últimos 3 meses
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [dataNuevos, setDataNuevos] = useState([]);
  const [dataConversion, setDataConversion] = useState([]);
  const [dataIngresos, setDataIngresos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {

        if (new Date(startDate) > new Date(endDate)) {
        toast.error('La fecha "Desde" no puede ser posterior a "Hasta"');
        return;
        }
        
        setLoading(true);

        const data = await getAnalisisTemporal({ startDate, endDate });

        console.log('Datos recibidos:', data);

        if (data.items) {
          const items = data.items;
          setDataNuevos(items.nuevos_por_semana || []);
          setDataConversion(items.conversion_por_semana || []);
          setDataIngresos(items.ingresos_acumulados || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al cargar análisis temporal');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [startDate, endDate]);

  const handleFechasAhora = () => {
    const ahora = new Date().toISOString().split('T')[0];
    setEndDate(ahora);
  };

  const handleUltimos7Dias = () => {
    const ahora = new Date();
    const hace7 = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    setStartDate(hace7.toISOString().split('T')[0]);
    setEndDate(ahora.toISOString().split('T')[0]);
  };

  const handleUltimos30Dias = () => {
    const ahora = new Date();
    const hace30 = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
    setStartDate(hace30.toISOString().split('T')[0]);
    setEndDate(ahora.toISOString().split('T')[0]);
  };

  const handleUltimos90Dias = () => {
    const ahora = new Date();
    const hace90 = new Date(ahora.getTime() - 90 * 24 * 60 * 60 * 1000);
    setStartDate(hace90.toISOString().split('T')[0]);
    setEndDate(ahora.toISOString().split('T')[0]);
  };

  const handleQ1 = () => {
    const year = new Date().getFullYear();
    setStartDate(`${year}-01-01`);
    setEndDate(`${year}-03-31`);
  };

  const handleQ2 = () => {
    const year = new Date().getFullYear();
    setStartDate(`${year}-04-01`);
    setEndDate(`${year}-06-30`);
  };

  const handleQ3 = () => {
    const year = new Date().getFullYear();
    setStartDate(`${year}-07-01`);
    setEndDate(`${year}-09-30`);
  };

  const handleQ4 = () => {
    const year = new Date().getFullYear();
    setStartDate(`${year}-10-01`);
    setEndDate(`${year}-12-31`);
  };

  // Calcular totales
  const totalNuevos = dataNuevos.reduce((sum, item) => sum + (item.nuevos || 0), 0);
  const conversionPromedio =
    dataConversion.length > 0
      ? Math.round(dataConversion.reduce((sum, item) => sum + (item.conversion || 0), 0) / dataConversion.length)
      : 0;
  const totalIngresos = dataIngresos.reduce((sum, item) => sum + (parseFloat(item.ingresos) || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis Temporal</h1>
          <p className="text-gray-600 mt-1">Visualiza tendencias y métricas a lo largo del tiempo</p>
        </div>

        {/* Selectores de fecha y atajos */}
        <Card>
          <div className="space-y-6">
            {/* Fechas personalizadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Fechas personalizadas</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Desde</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Hasta</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Atajos de período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Períodos rápidos</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleUltimos7Dias}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                >
                  7 días
                </button>
                <button
                  onClick={handleUltimos30Dias}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                >
                  30 días
                </button>
                <button
                  onClick={handleUltimos90Dias}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                >
                  90 días
                </button>
                <button
                  onClick={handleFechasAhora}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                >
                  Hoy
                </button>
              </div>
            </div>

            {/* Atajos por Trimestre */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Por Trimestre</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleQ1}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm"
                >
                  Q1 (Ene-Mar)
                </button>
                <button
                  onClick={handleQ2}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm"
                >
                  Q2 (Abr-Jun)
                </button>
                <button
                  onClick={handleQ3}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm"
                >
                  Q3 (Jul-Sep)
                </button>
                <button
                  onClick={handleQ4}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm"
                >
                  Q4 (Oct-Dic)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* KPIs Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos Alumnos</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{totalNuevos}</p>
              </div>
              <Users size={40} className="text-blue-300" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversión Promedio</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{conversionPromedio}%</p>
              </div>
              <TrendingUp size={40} className="text-green-300" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">${totalIngresos.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
              </div>
              <DollarSign size={40} className="text-purple-300" />
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        {loading ? (
          <Card>
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Cargando análisis...</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Nuevos Alumnos */}
            {dataNuevos.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  Nuevos Alumnos por Semana
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataNuevos} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="semana" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value) => [`${value} alumnos`, 'Nuevos']}
                    />
                    <Line
                      type="monotone"
                      dataKey="nuevos"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Conversión */}
            {dataConversion.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-600" />
                  Tasa de Conversión por Semana
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataConversion} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="semana" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value) => [`${value}%`, 'Conversión']}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversion"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Ingresos Acumulados */}
            {dataIngresos.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <DollarSign size={20} className="text-purple-600" />
                  Ingresos Acumulados por Mes
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dataIngresos} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="mes" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value) => [`$${parseFloat(value).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`, 'Ingresos']}
                    />
                    <Bar
                      dataKey="ingresos"
                      fill="#a855f7"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {dataNuevos.length === 0 && dataConversion.length === 0 && dataIngresos.length === 0 && (
              <Card>
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-500">No hay datos disponibles para el período seleccionado</p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}