import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import { WHATSAPP_URL } from '../config/constants';
import { AlertCircle } from 'lucide-react';

export const WhatsAppPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📱 Conectar WhatsApp al Agente</h1>
          <p className="text-gray-600">Escanea el código QR para vincular tu número de WhatsApp al agente Fla</p>
        </div>

        <Card variant="elevated">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Instrucciones</h3>
              <p className="text-yellow-800 text-sm">
                Abre WhatsApp en tu celular, escanea el código QR que aparecerá abajo, y autoriza al agente Fla para recibir y responder mensajes automáticamente.
              </p>
            </div>
          </div>

          <iframe
            src={WHATSAPP_URL}
            title="WhatsApp QR"
            className="w-full h-96 border border-gray-200 rounded-lg"
          />

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ⚠️ Si el código QR no carga, verifica que el servicio de WhatsApp esté activo en EasyPanel.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WhatsAppPage;
