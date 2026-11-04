/**
 * Gateway de la plataforma Fla.
 *
 * - Sirve el frontend (dist) y la API desde un único servicio / dominio.
 * - Login real (usuario + contraseña en variables de entorno) -> JWT en cookie HttpOnly.
 * - /api/webhook/<nombre> exige sesión válida, solo permite webhooks de una lista blanca
 *   e inyecta la clave secreta x-api-key hacia n8n (la clave NUNCA llega al navegador).
 *
 * Variables de entorno obligatorias (si falta alguna el servidor no arranca):
 *   JWT_SECRET       cadena aleatoria de 32+ caracteres
 *   ADMIN_PASSWORD   contraseña del panel (12+ caracteres)
 *   N8N_BASE_URL     ej: https://agente-fla-n8n.x5miqk.easypanel.host
 *   N8N_API_KEY      secreto compartido con las credenciales Header Auth de n8n
 * Opcionales: ADMIN_USER (default "fla"), SESSION_HOURS (default 8), PORT (default 80)
 */
require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

// ---------- Configuración (falla cerrado) ----------
const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_USER = (process.env.ADMIN_USER || 'fla').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const N8N_BASE_URL = (process.env.N8N_BASE_URL || '').replace(/\/+$/, '');
const N8N_API_KEY = process.env.N8N_API_KEY || process.env.API_KEY || '';
const SESSION_HOURS = Number(process.env.SESSION_HOURS || 8);
const PORT = Number(process.env.PORT || 80);
const PUBLIC_DIR = path.resolve(process.env.PUBLIC_DIR || path.join(__dirname, 'public'));
const COOKIE_NAME = 'fla_session';

const faltantes = [];
if (JWT_SECRET.length < 32) faltantes.push('JWT_SECRET (mínimo 32 caracteres)');
if (ADMIN_PASSWORD.length < 12) faltantes.push('ADMIN_PASSWORD (mínimo 12 caracteres)');
if (!N8N_BASE_URL) faltantes.push('N8N_BASE_URL');
if (!N8N_API_KEY) faltantes.push('N8N_API_KEY');
if (faltantes.length) {
  console.error('❌ Configuración incompleta, no se inicia el servidor. Falta:', faltantes.join(', '));
  process.exit(1);
}

// Webhooks que la UI puede invocar. Todo lo demás (whatsapp-entrada, create-lead, etc.) queda bloqueado.
const WEBHOOKS_PERMITIDOS = new Set([
  'conocimiento-get', 'conocimiento-post',
  'create-alumno', 'update-alumno', 'register-pago', 'update-cupo-horario',
  'create-horario', 'update-horario', 'delete-horario', 'get-horarios',
  'get-academia-config', 'update-academia-config',
  'get-alumno-by-id', 'get-alumnos', 'get-alumnos-list',
  'get-analisis-temporal', 'get-analytics-weekly', 'get-conversion-funnel',
  'get-funnel-by-origin', 'get-kpis',
  'get-leads-distribution', 'get-leads-origin', 'get-leads-pipeline', 'get-leads-list', 'get-lead-by-id',
  'get-pagos-pendientes', 'verificar-pago',
  'subir-rag-docs', 'ultima-actividad-agente'
]);

// ---------- Utilidades ----------
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const readCookie = (req, name) => {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1 && part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
};

const getSession = (req) => {
  const token = readCookie(req, COOKIE_NAME);
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return null;
  }
};

const requireSession = (req, res, next) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'No autenticado' });
  req.session = session;
  next();
};

// Mitiga CSRF en métodos que modifican datos: solo acepta peticiones del mismo origen.
const sameOriginOnly = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { host = null; }
    if (host !== req.headers.host) return res.status(403).json({ error: 'Origen no permitido' });
  }
  next();
};

// ---------- App ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // detrás del proxy de EasyPanel

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      frameSrc: [
        "'self'",
        'https://agente-fla-puentewhatsapp.x5miqk.easypanel.host',
        'https://agente-fla-chatwoot.x5miqk.easypanel.host'
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"]
    }
  },
  frameguard: { action: 'sameorigin' },
  crossOriginEmbedderPolicy: false
}));

// Health check (sin información sensible)
app.get(['/health', '/api/health'], (req, res) => res.json({ status: 'OK' }));

// ----- Autenticación -----
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }
});

app.post('/api/auth/login', loginLimiter, sameOriginOnly, express.json({ limit: '10kb' }), (req, res) => {
  const { usuario, password } = req.body || {};
  const userOk = typeof usuario === 'string' && safeEqual(usuario.toLowerCase(), ADMIN_USER);
  const passOk = typeof password === 'string' && safeEqual(password, ADMIN_PASSWORD);
  if (!(userOk && passOk)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }
  const token = jwt.sign({ sub: ADMIN_USER }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${SESSION_HOURS}h`
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: req.secure,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600 * 1000
  });
  res.json({ user: { usuario: ADMIN_USER } });
});

app.post('/api/auth/logout', sameOriginOnly, (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: req.secure, sameSite: 'strict', path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'No autenticado' });
  res.json({ user: { usuario: session.sub } });
});

// ----- Proxy hacia n8n (solo con sesión y webhooks permitidos) -----
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 150,
  standardHeaders: true,
  legacyHeaders: false
});

const n8nProxy = createProxyMiddleware({
  target: N8N_BASE_URL,
  changeOrigin: true,
  secure: true, // valida el certificado TLS de n8n
  proxyTimeout: 60000,
  timeout: 60000,
  pathRewrite: (p) => p.replace(/^\/api\/webhook\//, '/webhook/'),
  on: {
    proxyReq: (proxyReq) => {
      // Se descarta cualquier credencial del navegador y se usa la clave del servidor
      proxyReq.removeHeader('cookie');
      proxyReq.removeHeader('authorization');
      proxyReq.setHeader('x-api-key', N8N_API_KEY);
    },
    error: (err, req, res) => {
      console.error('[proxy] error:', err.message);
      if (res && !res.headersSent && typeof res.writeHead === 'function') {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Servicio no disponible' }));
      }
    }
  }
});

app.use(
  '/api/webhook/:nombre',
  apiLimiter,
  requireSession,
  sameOriginOnly,
  (req, res, next) => {
    if (!WEBHOOKS_PERMITIDOS.has(req.params.nombre)) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    next();
  },
  (req, res, next) => {
    // Express 5 recorta el prefijo montado; restauramos la URL completa para el proxy
    req.url = req.originalUrl;
    n8nProxy(req, res, next);
  }
);

app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ----- Frontend estático (SPA) -----
app.use(express.static(PUBLIC_DIR, {
  index: false,
  setHeaders: (res, filePath) => {
    if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)$/i.test(filePath) && filePath.includes(`${path.sep}assets${path.sep}`)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));
app.get(/.*/, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Gateway Fla escuchando en puerto ${PORT} -> n8n: ${N8N_BASE_URL}`);
});
