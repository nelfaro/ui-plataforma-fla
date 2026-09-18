import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { getPagosPendientes, verificarPago } from '../services/pagos';
import { CheckCircle, XCircle, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';

const formatMonto = (monto, moneda) => {
  const num = parseFloat(monto);
  if (isNaN(num)) return '-';
  return `${moneda || 'ARS'} ${num.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
};

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-AR');
};

export default function PagosPendientesPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { pago, accion }
  const [notas, setNotas] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setLoading(true);
      const response = await getPagosPendientes();
      setPagos(response.items || []);
    } catch (error) {
      console.error('Error al cargar pagos pendientes:', error);
      toast.error('Error al cargar los pagos pendientes');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (pago, accion) => {
    setNotas('');
    setModal({ pago, accion });
  };

  const cerrarModal = () => {
    setModal(null);
    setNotas('');
  };

  const confirmarAccion = async () => {
    if (!modal) return;
    try {
      setProcesando(true);
      await verificarPago({
        pago_id: modal.pago.id,
        accion: modal.accion,
        verificado_por: 'Fla',
        notas_verificacion: notas || undefined
      });
      toast.success(
        modal.accion === 'VERIFICADO' ? 'Pago verificado correctamente' : 'Pago rechazado'
      );
      cerrarModal();
      cargarPagos();
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const montoTotalPendiente = pagos.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagos Pendientes de Verificación</h1>
          <p className="text-gray-600">Comprobantes recibidos por WhatsApp, esperando confirmación</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="text-center py-6 bg-yellow-50">
            <p className="text-gray-600 text-sm font-medium mb-2">Pendientes de verificar</p>
            <p className="text-4xl font-bold text-gray-900">{pagos.length}</p>
          </Card>
          <Card className="text-center py-6 bg-blue-50">
            <p className="text-gray-600 text-sm font-medium mb-2">Monto total pendiente</p>
            <p className="text-4xl font-bold text-gray-900">
              {montoTotalPendiente.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </Card>
        </div>

        {/* Tabla */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Cargando pagos...</p>
              </div>
            </div>
          ) : pagos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-center">No hay pagos pendientes de verificación 🎉</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Alumno</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">WhatsApp</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Monto</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Canal</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Horario</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha comprobante</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Comprobante</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {pago.alumno_nombre || 'Sin nombre'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {pago.alumno_whatsapp || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        {formatMonto(pago.monto, pago.moneda)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{pago.tipo || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">{pago.canal || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {pago.horario_nombre || (pago.dia_semana ? `${pago.dia_semana} ${pago.hora_inicio || ''}` : '-')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {formatFecha(pago.comprobante_fecha)}
                      </td>
                      <td className="px-4 py-3">
                        {pago.comprobante_url ? (
                          <a
                            href={pago.comprobante_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Ver <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span className="text-gray-400">Sin link</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModal(pago, 'VERIFICADO')}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Aprobar pago"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => abrirModal(pago, 'RECHAZADO')}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Rechazar pago"
                          >
                            <XCircle size={18} />
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

      {/* Modal de confirmación */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {modal.accion === 'VERIFICADO' ? 'Aprobar pago' : 'Rechazar pago'}
              </h3>
              <button onClick={cerrarModal} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">{modal.pago.alumno_nombre}</span> — {formatMonto(modal.pago.monto, modal.pago.moneda)}
              </p>
              {modal.accion === 'VERIFICADO' && (
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  El alumno pasará a estado ACTIVO.
                </p>
              )}
              {modal.accion === 'RECHAZADO' && (
                <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                  El pago quedará marcado como rechazado. El alumno se mantiene como está.
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota (opcional)
                </label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: comprobante confuso, monto no coincide, etc."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarAccion}
                disabled={procesando}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium disabled:opacity-50 ${
                  modal.accion === 'VERIFICADO' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {procesando ? 'Procesando...' : modal.accion === 'VERIFICADO' ? 'Confirmar aprobación' : 'Confirmar rechazo'}
              </button>
              <button
                onClick={cerrarModal}
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
