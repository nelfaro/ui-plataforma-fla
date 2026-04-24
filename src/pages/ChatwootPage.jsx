import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { CHATWOOT_URL } from '../config/constants';
import { ExternalLink } from 'lucide-react';

export const ChatwootPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Gestión de Clientes (Chatwoot)</h1>
          <p className="text-gray-600">Administra todas tus conversaciones y clientes desde Chatwoot</p>
        </div>

        <Card variant="elevated">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Abrir Chatwoot</h2>
            <p className="text-gray-600 mb-6">
              Accede a la plataforma Chatwoot en una nueva pestaña para gestionar clientes y conversaciones.
            </p>
            <a href={CHATWOOT_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" className="inline-flex gap-2">
                <ExternalLink size={20} />
                Abrir Chatwoot
              </Button>
            </a>
          </div>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Consejo</h3>
          <p className="text-blue-800 text-sm">
            Chatwoot es tu CRM principal. Aquí puedes ver y responder todos los mensajes de tus clientes en un único lugar.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ChatwootPage;
