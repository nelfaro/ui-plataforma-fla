import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useNotification } from '../context/NotificationContext';
import { useForm } from 'react-hook-form';
import * as documentsService from '../services/documents';
import { Upload, File, BookOpen, Tag } from 'lucide-react';

export const DocumentsPage = () => {
  const RAG_CATEGORIAS = ['KIDS', 'PRECIOS', 'PARTICULARES', 'METODOLOGIA', 'GENERAL'];

  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [lastFile, setLastFile] = useState(null);
  const { success, error: showError } = useNotification();
  const fileWatch = watch('file');

  const [ragLoading, setRagLoading] = useState(false);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [ragFile, setRagFile] = useState(null);
  const [ragTitulo, setRagTitulo] = useState('');
  const [categoriasError, setCategoriasError] = useState('');
  const [ragFileError, setRagFileError] = useState('');
  const ragFileInputRef = useRef(null);

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

  const toggleCategoria = (cat) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCategoriasError('');
  };

  const onSubmitRAG = async (e) => {
    e.preventDefault();

    if (!ragFile) {
      setRagFileError('Por favor seleccioná un archivo');
      return;
    }
    if (categoriasSeleccionadas.length === 0) {
      setCategoriasError('Seleccioná al menos una categoría');
      return;
    }

    setRagLoading(true);
    try {
      await documentsService.uploadDocumentoRAG(ragFile, categoriasSeleccionadas, ragTitulo);
      success('✅ Documento subido al RAG exitosamente');
      setRagFile(null);
      setCategoriasSeleccionadas([]);
      setRagTitulo('');
      if (ragFileInputRef.current) ragFileInputRef.current.value = '';
    } catch (err) {
      showError(`❌ Error: ${err.response?.data?.mensaje || err.message}`);
    } finally {
      setRagLoading(false);
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actualizar Stock / Precios (CSV o TXT)</h2>
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

        <Card>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-fla-dark" />
            <h2 className="text-lg font-semibold text-gray-900">
              Subir Documento al RAG
            </h2>
          </div>

          <form onSubmit={onSubmitRAG} className="space-y-6">
            {/* File drop zone */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Archivo <span className="text-red-500">*</span>
              </label>
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  ragFileError ? 'border-red-400' : 'border-gray-300 hover:border-fla-primary'
                }`}>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-900 font-semibold mb-1">
                    {ragFile ? ragFile.name : 'Arrastrá un archivo aquí o hacé clic'}
                  </p>
                  <p className="text-gray-500 text-sm">Formatos: PDF, TXT, CSV</p>
                </div>
                <input
                  ref={ragFileInputRef}
                  type="file"
                  accept=".pdf,.txt,.csv"
                  className="hidden"
                  onChange={(e) => {
                    setRagFile(e.target.files?.[0] || null);
                    setRagFileError('');
                  }}
                />
              </label>
              {ragFileError && (
                <p className="mt-1 text-sm text-red-600">{ragFileError}</p>
              )}
            </div>

            {/* Optional title */}
            <Input
              label="Título / descripción (opcional)"
              value={ragTitulo}
              onChange={(e) => setRagTitulo(e.target.value)}
              placeholder="Ej: Precios vigentes mayo 2026"
            />

            {/* Category checkboxes */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">
                  Categoría del contenido <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                {RAG_CATEGORIAS.map((cat) => {
                  const selected = categoriasSeleccionadas.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategoria(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                        selected
                          ? 'bg-fla-primary border-fla-primary text-black'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-fla-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {categoriasError && (
                <p className="mt-2 text-sm text-red-600">{categoriasError}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={ragLoading}
              className="w-full"
            >
              {ragLoading ? 'Subiendo al RAG...' : 'Subir Documento al RAG'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> El archivo será procesado y almacenado en la base de datos vectorial (Qdrant) con la categoría indicada para que el agente Fla pueda consultarlo.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DocumentsPage;
