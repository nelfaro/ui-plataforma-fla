const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const N8N_BASE_URL = process.env.N8N_BASE_URL;
const API_KEY = process.env.API_KEY;

// Proxy dinámico para todos los webhooks
app.all('/api/webhook/:webhook', async (req, res) => {
  try {
    const { webhook } = req.params;
    const url = `${N8N_BASE_URL}/webhook/${webhook}`;
    
    const config = {
      method: req.method,
      url: url,
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
    console.error('Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Error en n8n',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend proxy running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend proxy escuchando en http://localhost:${PORT}`);
  console.log(`📡 Apuntando a n8n: ${N8N_BASE_URL}`);
});