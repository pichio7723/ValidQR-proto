import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext.jsx';
import { Toaster } from 'sileo';
import Login from './pages/login';
import Dashboard from './pages/dashboard/DashboardRouter.jsx';
import ScanQR from './pages/ScanQR';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid rgba(255,255,255,0.2)',
          borderTopColor: '#fc00ff',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        options={{
          fill: "#0f0f16",  
          roundness: 12,     
          styles: {
            title: "text-white! font-semibold",
            description: "text-white/70! text-sm",
            badge: "bg-white/10!",
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Ruta pública para escanear QR (sin autenticación) */}
            <Route path="/escanear/:codigoId" element={<ScanQR />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;