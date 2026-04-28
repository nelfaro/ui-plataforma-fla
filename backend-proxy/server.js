const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://asistente-ia-fla-frontend.x5miqk.easypanel.host';

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: nginx interno, health checks)
    if (!origin || origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origen no permitido'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

// Limitar tamaño del body a 1MB
app.use(express.json({ limit: '1mb' }));

const N8N_BASE_URL = process.env.N8N_BASE_URL;
const API_KEY = process.env.API_KEY;

if (!N8N_BASE_URL) {
  console.error('❌ N8N_BASE_URL no está definida');
  process.exit(1);
}

// Proxy dinámico para todos los webhooks
app.all('/api/webhook/:webhook', async (req, res) => {
  try {
    const { webhook } = req.params;

    // Solo permitir nombres de webhook alfanuméricos con guiones
    if (!/^[a-zA-Z0-9-_]+$/.test(webhook)) {
      return res.status(400).json({ error: 'Nombre de webhook inválido' });
    }

    const url = `${N8N_BASE_URL}/webhook/${webhook}`;

    const config = {
      method: req.method,
      url,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      params: req.query,
      data: req.body,
      timeout: 30000
    };

    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    console.error(`[proxy] Error ${status} en webhook "${req.params.webhook}":`, error.message);

    // No exponer detalles internos al cliente
    res.status(status).json({
      error: status >= 500 ? 'Error interno del servidor' : 'Error al procesar la solicitud'
    });
  }
});

// Health check (sin info sensible)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Bloquear rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend proxy escuchando en puerto ${PORT}`);
  console.log(`📡 Apuntando a n8n: ${N8N_BASE_URL}`);
});
