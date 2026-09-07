// web/src/pages/dashboard/AprendizDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { sileo } from 'sileo';
import '../../styles/pages/dashboard/dashboard.css';
import '../../styles/pages/dashboard/aprendiz.css';

export default function AprendizDashboard({ user }) {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'manual'
  const [manualUrl, setManualUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const scannerRef = useRef('qr-scanner');

  // ✅ FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop().catch(err => console.error('Error deteniendo scanner:', err));
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    setScanning(true);
    
    try {
      const html5QrCode = new Html5Qrcode(scannerRef.current);
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleQRScanned(decodedText);
          html5QrCode.stop();
        },
        (errorMessage) => {
          // Errores de escaneo son normales, no hacer nada
        }
      );
      
      setScanner(html5QrCode);
    } catch (error) {
      console.error('Error iniciando cámara:', error);
      sileo.error({
        title: 'Error de cámara',
        description: 'No se pudo acceder a la cámara. Usa la opción manual.',
      });
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      await scanner.stop();
      setScanner(null);
    }
    setScanning(false);
  };

  const handleQRScanned = async (qrData) => {
    try {
      // Extraer el código ID de la URL
      let codigoId = qrData;
      
      if (qrData.includes('/escanear/')) {
        const parts = qrData.split('/escanear/');
        codigoId = parts[1];
      }

      // Obtener geolocalización
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      // Registrar asistencia
      await api.post('/asistencias/', {
        codigo_id: codigoId,
        aprendiz_id: user.id,
        latitud: position.coords.latitude,
        longitud: position.coords.longitude,
      });

      sileo.success({
        title: '¡Asistencia Registrada!',
        description: 'Tu asistencia ha sido registrada correctamente',
      });

      stopScanning();
    } catch (error) {
      console.error('Error registrando asistencia:', error);
      
      if (error.response?.status === 400) {
        const detail = error.response.data.detail;
        if (detail.includes('expiró')) {
          sileo.error({
            title: 'QR Expirado',
            description: 'Este código ya no es válido',
          });
        } else if (detail.includes('ya registraste')) {
          sileo.error({
            title: 'Ya registrado',
            description: 'Ya registraste asistencia hoy',
          });
        } else if (detail.includes('físicamente')) {
          sileo.error({
            title: 'Fuera de rango',
            description: 'Debes estar en el salón de clase',
          });
        }
      } else {
        sileo.error({
          title: 'Error',
          description: 'No se pudo registrar la asistencia',
        });
      }
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    if (!manualUrl.trim()) {
      sileo.error({
        title: 'URL vacía',
        description: 'Ingresa la URL del código QR',
      });
      return;
    }

    await handleQRScanned(manualUrl);
    setManualUrl('');
  };

  return (
    <div className="dashboard-container">
      
      {/* ✅ BOTÓN FLOTANTE DE CERRAR SESIÓN */}
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          padding: '0.6rem 1.2rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.color = '#fca5a5';
        }}
      >
        <span>🚪</span> Cerrar Sesión
      </button>

      <main className="main-content" style={{ marginLeft: 0 }}>
        <div className="content-area">
          <div className="content-header">
            <h1 className="page-title">Panel de Aprendiz</h1>
            <p className="page-subtitle">
              Bienvenido, {user.nombre} — Escanea el QR para registrar asistencia
            </p>
          </div>

          <div className="aprendiz-scan-container">
            {/* Selector de modo */}
            <div className="scan-mode-selector">
              <button
                className={`mode-btn ${scanMode === 'camera' ? 'active' : ''}`}
                onClick={() => {
                  setScanMode('camera');
                  stopScanning();
                }}
              >
                📷 Escanear con cámara
              </button>
              <button
                className={`mode-btn ${scanMode === 'manual' ? 'active' : ''}`}
                onClick={() => {
                  setScanMode('manual');
                  stopScanning();
                }}
              >
                🔗 Ingresar URL manualmente
              </button>
            </div>

            {/* Modo Cámara */}
            {scanMode === 'camera' && (
              <div className="camera-scan-section">
                <div className="scanner-container">
                  <div id={scannerRef.current} className="qr-scanner"></div>
                  
                  {!scanning && (
                    <div className="scanner-placeholder">
                      <div className="scanner-icon">📷</div>
                      <p>Cámara inactiva</p>
                      <button className="btn-primary" onClick={startScanning}>
                        Iniciar cámara
                      </button>
                    </div>
                  )}
                </div>

                {scanning && (
                  <button className="btn-secondary" onClick={stopScanning}>
                    Detener cámara
                  </button>
                )}

                <div className="scan-instructions">
                  <h3>Instrucciones:</h3>
                  <ol>
                    <li>Haz clic en "Iniciar cámara"</li>
                    <li>Permite el acceso a la cámara</li>
                    <li>Apunta al código QR generado por tu instructor</li>
                    <li>La asistencia se registrará automáticamente</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Modo Manual */}
            {scanMode === 'manual' && (
              <div className="manual-scan-section">
                <div className="manual-form-container">
                  <h3>Ingresar URL del QR</h3>
                  <p className="manual-description">
                    Pega la URL completa del código QR que te proporcionó tu instructor
                  </p>

                  <form onSubmit={handleManualSubmit} className="manual-form">
                    <div className="form-group">
                      <label className="form-label">URL del código QR *</label>
                      <input
                        type="text"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="form-input"
                        placeholder="http://localhost:5173/escanear/abc-123..."
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary">
                      Registrar asistencia
                    </button>
                  </form>

                  <div className="manual-instructions">
                    <h3>¿Cómo obtener la URL?</h3>
                    <ol>
                      <li>Tu instructor genera un código QR</li>
                      <li>Copia la URL que aparece debajo del QR</li>
                      <li>Pégala en el campo de arriba</li>
                      <li>Haz clic en "Registrar asistencia"</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}