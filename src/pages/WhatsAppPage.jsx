import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { WHATSAPP_URL } from '../config/constants';
import { ExternalLink } from 'lucide-react';

export const WhatsAppPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📱 Conectar WhatsApp al Agente</h1>
          <p className="text-gray-600">Escanea el código QR para vincular tu número de WhatsApp al agente Fla</p>
        </div>

        <Card variant="elevated">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Puente WhatsApp</h2>
            <p className="text-gray-600 mb-6">
              Accede al puente de WhatsApp en una nueva pestaña para conectar tu número y autorizar al agente Fla.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="inline-flex gap-2">
                <ExternalLink size={20} />
                Abrir Puente WhatsApp
              </Button>
            </a>
          </div>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Instrucciones</h3>
          <p className="text-blue-800 text-sm">
            Abre WhatsApp en tu celular, escanea el código QR que aparecerá, y autoriza al agente Fla para recibir y responder mensajes automáticamente.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WhatsAppPage;
