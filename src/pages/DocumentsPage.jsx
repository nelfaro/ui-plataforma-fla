import React, { useState, useEffect } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useNotification } from '../context/NotificationContext';
import { useForm } from 'react-hook-form';
import * as documentsService from '../services/documents';
import { Upload, File } from 'lucide-react';

export const DocumentsPage = () => {
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const { success, error: showError } = useNotification();
  const fileWatch = watch('file');

  useEffect(() => {
    const fetchLastFile = async () => {
      try {
        const data = await documentsService.getLastFile();
        setLastFile(data);
      } catch (err) {
        console.error('Error fetching last file:', err);
      }
    };
    fetchLastFile();
  }, []);

  const onSubmit = async (data) => {
    const file = data.file?.[0];
    if (!file) {
      showError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    try {
      await documentsService.uploadRAGFile(file);
      success('✅ ¡Archivo procesado exitosamente!');
      setLastFile({
        nombre_archivo: file.name,
        fecha_proceso: new Date().toLocaleString('es-AR')
      });
    } catch (err) {
      showError(`❌ Error: ${err.response?.data?.mensaje || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📤 Actualizar RAG</h1>
          <p className="text-gray-600">Sube documentos para que el agente Fla pueda aprender de ellos</p>
        </div>

        {lastFile && (
          <Card variant="elevated" className="bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <File className="text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Último archivo procesado
                </h3>
                <p className="text-blue-800 text-sm">
                  <strong>{lastFile.nombre_archivo}</strong>
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  {lastFile.fecha_proceso}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-fla-primary transition-colors cursor-pointer text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-900 font-semibold mb-1">
                    {fileWatch?.[0]?.name || 'Arrastra un archivo aquí o haz clic'}
                  </p>
                  <p className="text-gray-600 text-sm">Formato: CSV o TXT</p>
                </div>
                <input
                  type="file"
                  accept=".csv,.txt"
                  {...register('file', { required: true })}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Procesando...' : 'Procesar y Actualizar RAG'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Los documentos serán procesados y almacenados en la base de datos vectorial para que el agente Fla pueda acceder a ellos durante las conversaciones.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DocumentsPage;
