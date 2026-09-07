// web/src/pages/ScanQR.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { sileo } from 'sileo';
import '../styles/pages/Login.css';

export default function ScanQR() {
  const { codigoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    const registrarAsistencia = async () => {
      try {
        // 1. Verificar si hay sesión activa
        const userResponse = await api.get('/usuarios/me');
        const usuario = userResponse.data;
        
        // 2. Obtener geolocalización
        const geolocation = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada'));
          }
          
          navigator.geolocation.getCurrentPosition(
            (position) => resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            }),
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });

        // 3. Registrar asistencia
        const response = await api.post('/asistencias/', {
          codigo_id: codigoId,
          aprendiz_id: usuario.id,
          latitud: geolocation.lat,
          longitud: geolocation.lon
        });

        setData(response.data);
        setStatus('success');
        sileo.success({
          title: '¡Asistencia Registrada!',
          description: 'Tu asistencia ha sido registrada correctamente',
        });

      } catch (error) {
        console.error('Error:', error);
        
        // Si no hay autenticación, redirigir al login
        if (error.response?.status === 401) {
          sileo.warning({
            title: 'Sesión requerida',
            description: 'Debes iniciar sesión para registrar asistencia',
          });
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Manejar otros errores
        if (error.response?.status === 404) {
          setStatus('error');
          sileo.error({
            title: 'Código Inválido',
            description: 'Este código QR no existe',
          });
        } else if (error.response?.status === 400) {
          const detail = error.response.data.detail;
          
          if (detail.includes('expiró')) {
            setStatus('expired');
          } else if (detail.includes('ya registraste')) {
            setStatus('duplicate');
          } else if (detail.includes('físicamente')) {
            setStatus('location');
          }
          
          sileo.error({
            title: 'No se pudo registrar',
            description: detail,
          });
        } else if (error.response?.status === 403) {
          setStatus('error');
          sileo.error({
            title: 'Acceso denegado',
            description: error.response.data.detail,
          });
        } else {
          setStatus('error');
          sileo.error({
            title: 'Error',
            description: error.response?.data?.detail || 'No pudimos validar el código',
          });
        }
      }
    };
    
    registrarAsistencia();
  }, [codigoId, navigate]);

  return (
    <div className="login-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="login-card" style={{ textAlign: 'center', maxWidth: '450px' }}>
        
        {status === 'loading' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem' }}>
              ⏳
            </div>
            <h1 className="login-title">Validando...</h1>
            <p className="login-subtitle">Obteniendo ubicación y registrando asistencia</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #10b981, #00dbde)' }}>
              ✅
            </div>
            <h1 className="login-title" style={{ color: '#10b981' }}>¡Asistencia Exitosa!</h1>
            <p className="login-subtitle">
              Ficha: {data?.ficha_id} • Sede: {data?.sede_id}
            </p>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="login-button"
              style={{ marginTop: '1.5rem' }}
            >
              Ir al Dashboard
            </button>
          </>
        )}
        
        {status === 'expired' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #fc00ff, #a855f7)' }}>
              
            </div>
            <h1 className="login-title">Código Expirado</h1>
            <p className="login-subtitle">Solicita uno nuevo a tu instructor</p>
          </>
        )}
        
        {status === 'duplicate' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #ffc107, #ff9800)' }}>
              ️
            </div>
            <h1 className="login-title">Ya Registraste Asistencia</h1>
            <p className="login-subtitle">Ya habías escaneado este código hoy</p>
          </>
        )}
        
        {status === 'location' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #ef4444, #fc00ff)' }}>
              📍
            </div>
            <h1 className="login-title">Fuera de Rango</h1>
            <p className="login-subtitle">Debes estar físicamente en el salón de clase</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #ef4444, #fc00ff)' }}>
              
            </div>
            <h1 className="login-title">Error</h1>
            <p className="login-subtitle">No pudimos validar el código QR</p>
            <button 
              onClick={() => navigate('/login')} 
              className="login-button"
              style={{ marginTop: '1.5rem' }}
            >
              Iniciar Sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}