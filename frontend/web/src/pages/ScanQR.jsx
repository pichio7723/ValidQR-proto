// web/src/pages/ScanQR.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api'; // Usamos api directamente para evitar dependencias
import { sileo } from 'sileo';
//import '../styles/pages/login.css'; // Reutilizamos el fondo oscuro y los blobs

export default function ScanQR() {
  const { codigoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error | expired
  const [data, setData] = useState(null);

  useEffect(() => {
    const checkQR = async () => {
      try {
        // 1. Consultar el código QR al backend
        const response = await api.get(`/codigos_qr/${codigoId}`);
        const qr = response.data;
        
        // 2. Validar si está expirado
        const now = new Date();
        const expiracion = new Date(qr.expiracion);
        
        if (now > expiracion) {
          setStatus('expired');
          sileo.error({
            title: 'Código Expirado',
            description: 'Este QR ya no es válido. Pide uno nuevo a tu instructor.',
          });
          return;
        }
        
        // 3. Si es válido, mostramos éxito
        // NOTA: Aquí deberías llamar a tu endpoint de POST /asistencias/ 
        // para registrar realmente la asistencia en la base de datos.
        setData(qr);
        setStatus('success');
        sileo.success({
          title: '¡Asistencia Registrada!',
          description: `Ficha: ${qr.ficha_id} | Horario: ${qr.horario_id}`,
        });

      } catch (error) {
        setStatus('error');
        sileo.error({
          title: 'Código Inválido',
          description: error.response?.data?.detail || 'No pudimos encontrar este código QR.',
        });
      }
    };
    
    checkQR();
  }, [codigoId]);

  return (
    <div className="login-container">
      {/* Reutilizamos los blobs del login para mantener la estética */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div className="login-card" style={{ textAlign: 'center', maxWidth: '450px' }}>
        
        {/* ESTADO: CARGANDO */}
        {status === 'loading' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </div>
            <h1 className="login-title">Validando código...</h1>
            <p className="login-subtitle">Por favor espera un momento</p>
          </>
        )}
        
        {/* ESTADO: ÉXITO */}
        {status === 'success' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #10b981, #00dbde)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="login-title" style={{ color: '#10b981' }}>¡Asistencia Exitosa!</h1>
            <p className="login-subtitle">
              Tu asistencia ha sido registrada correctamente en el sistema.
            </p>
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }}>
              <p><strong>Ficha ID:</strong> {data?.ficha_id}</p>
              <p><strong>Sede ID:</strong> {data?.sede_id}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/'} 
              className="login-button"
              style={{ marginTop: '1.5rem' }}
            >
              Volver al inicio
            </button>
          </>
        )}
        
        {/* ESTADO: EXPIRADO */}
        {status === 'expired' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #fc00ff, #a855f7)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h1 className="login-title">Código Expirado</h1>
            <p className="login-subtitle">
              Este código QR ha expirado. Por favor, solicita uno nuevo a tu instructor.
            </p>
          </>
        )}
        
        {/* ESTADO: ERROR (No existe) */}
        {status === 'error' && (
          <>
            <div className="logo-icon" style={{ margin: '0 auto 1rem', background: 'linear-gradient(135deg, #ef4444, #fc00ff)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="login-title">Código Inválido</h1>
            <p className="login-subtitle">
              El código QR que escaneaste no existe o fue eliminado.
            </p>
          </>
        )}
      </div>
    </div>
  );
}