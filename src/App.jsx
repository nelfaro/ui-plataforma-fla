import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import ChatwootPage from './pages/ChatwootPage';
import WhatsAppPage from './pages/WhatsAppPage';
import AlumnosPage from './pages/AlumnosPage';
import AlumnoDetallePage from './pages/AlumnoDetallePage';
import DirectorioAlumnosPage from './pages/DirectorioAlumnosPage';
import AnalisisTemporalPage from './pages/AnalisisTemporalPage';
import GestionHorariosPage from './pages/GestionHorariosPage';
import LeadsPage from './pages/LeadsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      {/* Login */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/*Alumnos*/}
          <Route 
            path="/alumnos" 
            element={
              <AlumnosPage />
            }
          />
          {/*DetalleAlumnos*/}
          <Route 
            path="/alumno/:id" 
            element={
              <AlumnoDetallePage />
            }
          />
          {/*DirectorioAlumnosPage*/}
          <Route 
            path="/directorio" 
            element={
              <DirectorioAlumnosPage />
            }
          />
          {/*GestionHorariosPage*/}
          <Route 
            path="/horarios" 
            element={
              <GestionHorariosPage />
            }
          />
          {/*AnalisisTemporalPage*/}
          <Route
            path="/analisis-temporal"
            element={
              <AnalisisTemporalPage />
            }
          />

          {/*LeadsPage*/}
          <Route
            path="/leads"
            element={
              <LeadsPage />
            }
          />

          {/* Documents */}
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />

          {/* Chatwoot */}
          <Route
            path="/chatwoot"
            element={
              <ProtectedRoute>
                <ChatwootPage />
              </ProtectedRoute>
            }
          />

          {/* WhatsApp */}
          <Route
            path="/whatsapp"
            element={
              <ProtectedRoute>
                <WhatsAppPage />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
