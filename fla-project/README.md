# 🎓 Academia Fla - Plataforma de Gestión

[![Deploy to EasyPanel](https://img.shields.io/badge/deploy-EasyPanel-blue)]()
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)]()

Plataforma moderna de gestión para Academia de Inglés "Clases de Inglés con Fla".

## 🚀 Características

- ✅ **Dashboard en tiempo real** - KPIs, gráficos, análiticas
- ✅ **Gestión de leads** - Clasificación, funnel de conversión
- ✅ **Carga de documentos RAG** - Integración con Qdrant
- ✅ **Integración Chatwoot** - CRM de clientes
- ✅ **Conexión WhatsApp** - Escaneo de código QR
- ✅ **Autenticación JWT** - Sesiones seguras
- ✅ **Deploy automático** - GitHub Actions + EasyPanel
- ✅ **Responsive** - Mobile, tablet, desktop

## 📋 Stack Tecnológico

**Frontend:**
- React 19 (JavaScript)
- Vite (build tool)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Recharts (gráficos)
- Zustand (state management)
- react-hot-toast (notificaciones)

**Backend:**
- n8n (orquestación, webhooks)
- PostgreSQL (base de datos)
- Qdrant (búsqueda vectorial)

**DevOps:**
- Docker (containerización)
- Nginx (web server)
- GitHub Actions (CI/CD)
- EasyPanel (hosting)

## 🛠️ Instalación Local

### Requisitos
- Node.js 20+
- npm 10+

### Setup

```bash
# 1. Clonar repo
git clone https://github.com/nelfaro/ui-plataforma-fla.git
cd ui-plataforma-fla

# 2. Instalar dependencias
npm install

# 3. Crear .env.local
cp .env.example .env.local
# Editar .env.local con tus valores

# 4. Ejecutar en desarrollo
npm run dev
# Abre http://localhost:5173
```

### Variables de Entorno

Ver `.env.example` para la lista completa. Variables principales:

```env
VITE_N8N_BASE_URL=https://agentes-n8n.xjkmv6.easypanel.host
VITE_CHATWOOT_URL=https://asistente-ia-fla-chatwoot.x5miqk.easypanel.host
VITE_WHATSAPP_URL=https://asistente-ia-fla-puentewhatsapp.x5miqk.easypanel.host
```

## 📦 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor dev (Vite)
npm run build           # Build para producción
npm run preview         # Vista previa del build
npm run lint            # ESLint

# Docker (opcional)
docker build -t fla .
docker run -p 80:80 fla
```

## 🏗️ Estructura de Carpetas

```
src/
├── components/          # Componentes React reutilizables
│   ├── Layout/         # Header, Sidebar, MainLayout
│   ├── UI/             # Button, Card, Badge, Input, etc.
│   ├── Cards/          # KpiCard
│   └── Charts/         # BarChart, DonutChart, FunnelChart, PieChart
├── pages/              # Páginas/rutas
│   ├── LoginPage
│   ├── DashboardPage
│   ├── DocumentsPage
│   ├── ChatwootPage
│   └── WhatsAppPage
├── services/           # Servicios HTTP
│   ├── api.js         # Cliente axios
│   ├── auth.js        # Autenticación
│   ├── dashboard.js   # Datos dashboard
│   └── documents.js   # Carga RAG
├── hooks/              # Hooks custom
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDashboard.js
├── context/            # Context API
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── config/             # Configuración
│   ├── constants.js
│   └── colors.js
├── App.jsx             # Router principal
└── index.css           # Estilos globales
```

## 🔐 Autenticación

Las credenciales se validan contra n8n webhook `/webhook/verificar_login`.

Flujo:
1. Usuario ingresa usuario/contraseña en LoginPage
2. POST a n8n con credenciales
3. n8n retorna JWT token
4. Token guardado en localStorage
5. Token agregado a cada request (Authorization header)
6. Si token expira (401), usuario redirigido a login

## 📊 Dashboard

El dashboard carga datos en paralelo desde n8n:

- **KPIs**: Chats, leads calificados, registros, ingresos
- **Gráficos**: Chats semanales, clasificación leads, funnel, origen
- **Tabla**: Últimos alumnos con estados y badges

Datos vienen de webhooks:
- `/api/v1/dashboard/kpis`
- `/api/v1/analytics/leads/weekly`
- `/api/v1/analytics/leads/distribution`
- `/api/v1/analytics/conversion-funnel`
- `/api/v1/analytics/leads/origin`
- `/api/v1/alumnos`

## 🚀 Deploy en EasyPanel

### Opción A: Push a GitHub (Automático)

```bash
git push origin main
# GitHub Actions ejecuta build
# EasyPanel detecta cambios y redeploya automáticamente
```

### Opción B: Deploy Manual

1. Ir a EasyPanel Dashboard
2. Crear nueva aplicación
3. Conectar repo GitHub: `nelfaro/ui-plataforma-fla`
4. Seleccionar Dockerfile
5. Agregar variables de entorno (copiar de .env.example)
6. Deploy

**URL:** `https://clasesdeinglesconfla.escalia.com.ar`

## 🔧 Troubleshooting

### "Cannot find module 'react'"
```bash
npm install
npm run dev
```

### "Webpack/Vite complains about missing dependencies"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Localhost:5173 no carga"
- Verificar que no hay otro proceso en puerto 5173
- Reiniciar: `npm run dev`

### "Errores en EasyPanel"
- Ver logs: EasyPanel → Application → Logs
- Verificar variables de entorno (.env está correcto)
- Probar build local: `npm run build`

## 📞 Soporte

**Issues:** GitHub Issues en el repo  
**Contacto:** Fla Team  
**Documentación:** Ver archivos .md en raíz

## 📝 Licencia

Propietario. Clases de Inglés con Fla © 2024

---

**Última actualización:** Abril 2024  
**Versión:** 1.0.0
