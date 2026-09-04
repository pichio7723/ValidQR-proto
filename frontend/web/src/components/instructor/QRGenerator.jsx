// web/src/components/instructor/QRGenerator.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { sileo } from 'sileo';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator({ user }) {
  const [fichas, setFichas] = useState([]);
  const [selectedFicha, setSelectedFicha] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    loadFichas();
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, []);

  const loadFichas = async () => {
    try {
      const response = await adminService.fichas.getAll();
      setFichas(response.data);
    } catch (error) {
      sileo.error({
        title: 'Error',
        description: 'No se pudieron cargar las fichas',
      });
    }
  };

  const handleGenerate = async () => {
    if (!selectedFicha) {
      sileo.error({
        title: 'Selecciona una ficha',
        description: 'Debes elegir una ficha para generar el QR',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await adminService.codigosQr.create({
        ficha_id: parseInt(selectedFicha),
      });

      const qrUrl = `${window.location.origin}/escanear/${response.data.id}`;
      
      setQrData({
        id: response.data.id,
        url: qrUrl,
        expiracion: response.data.expiracion,
        ficha: fichas.find(f => f.id === parseInt(selectedFicha)),
      });

      // Iniciar countdown
      const expiracion = new Date(response.data.expiracion).getTime();
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((expiracion - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(countdown);
          setQrData(null);
          sileo.warning({
            title: 'QR Expirado',
            description: 'El código QR ha expirado. Genera uno nuevo.',
          });
        }
      };
      updateCountdown();
      const newCountdown = setInterval(updateCountdown, 1000);
      setCountdown(newCountdown);

      sileo.success({
        title: 'QR Generado',
        description: 'El código QR está listo para ser escaneado',
      });
    } catch (error) {
      sileo.error({
        title: 'Error al generar QR',
        description: error.response?.data?.detail || 'No tienes clase asignada en este horario',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="qr-generator">
      <div className="qr-controls">
        <h2>Generar Código QR</h2>
        <p className="qr-description">
          Selecciona la ficha y genera un QR para registrar asistencia. El código expira en 5 minutos.
        </p>

        <div className="form-group">
          <label className="form-label">Ficha *</label>
          <select
            value={selectedFicha}
            onChange={(e) => setSelectedFicha(e.target.value)}
            className="form-input"
          >
            <option value="">Seleccionar ficha...</option>
            {fichas.map((ficha) => (
              <option key={ficha.id} value={ficha.id}>
                {ficha.numero_ficha} - {ficha.nombre_programa}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="btn-primary"
          disabled={loading || !selectedFicha}
        >
          {loading ? 'Generando...' : '📱 Generar QR'}
        </button>
      </div>

      {qrData && (
        <div className="qr-display">
          <div className="qr-header">
            <h3>Código QR Activo</h3>
            <div className={`qr-timer ${timeLeft < 60 ? 'urgent' : ''}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="qr-code-container">
            <QRCodeSVG
              value={qrData.url}
              size={256}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#09090b"
            />
          </div>

          <div className="qr-info">
            <div className="qr-info-row">
              <span className="qr-info-label">Ficha:</span>
              <span className="qr-info-value">{qrData.ficha?.numero_ficha}</span>
            </div>
            <div className="qr-info-row">
              <span className="qr-info-label">Programa:</span>
              <span className="qr-info-value">{qrData.ficha?.nombre_programa}</span>
            </div>
            <div className="qr-info-row">
              <span className="qr-info-label">ID:</span>
              <span className="qr-info-value qr-id">{qrData.id.slice(0, 8)}...</span>
            </div>
          </div>

          <div className="qr-url">
            <p className="qr-url-label">URL de escaneo:</p>
            <code>{qrData.url}</code>
          </div>

          <div className="qr-instructions">
            <p>📲 Los aprendices deben escanear este código o visitar la URL para registrar su asistencia.</p>
          </div>
        </div>
      )}
    </div>
  );
}