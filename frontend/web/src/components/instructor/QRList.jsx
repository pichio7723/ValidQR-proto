// web/src/components/instructor/QRList.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../../services/admin.service';
import { sileo } from 'sileo';

export default function QRList({ user }) {
  const [codigos, setCodigos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodigos();
  }, [user?.id]);

  const loadCodigos = async () => {
    setLoading(true);
    try {
      const response = await adminService.codigosQr.getByInstructor(user.id);
      setCodigos(response.data);
    } catch (error) {
      sileo.error({
        title: 'Error',
        description: 'No se pudieron cargar los códigos QR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este código QR?')) return;

    try {
      await adminService.codigosQr.delete(id);
      sileo.success({
        title: 'QR Eliminado',
        description: 'El código fue eliminado correctamente',
      });
      loadCodigos();
    } catch (error) {
      sileo.error({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo eliminar',
      });
    }
  };

  const isExpired = (expiracion) => {
    return new Date(expiracion) < new Date();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="qr-list-loading">Cargando códigos QR...</div>;
  }

  return (
    <div className="qr-list">
      <div className="qr-list-header">
        <h2>Códigos QR Generados</h2>
        <button onClick={loadCodigos} className="btn-secondary">
          🔄 Actualizar
        </button>
      </div>

      {codigos.length === 0 ? (
        <div className="qr-list-empty">
          <p>No has generado códigos QR aún</p>
        </div>
      ) : (
        <div className="qr-list-items">
          {codigos.map((codigo) => {
            const expired = isExpired(codigo.expiracion);
            return (
              <div
                key={codigo.id}
                className={`qr-list-item ${expired ? 'expired' : 'active'}`}
              >
                <div className="qr-item-status">
                  <span className={`status-badge ${expired ? 'expired' : 'active'}`}>
                    {expired ? 'Expirado' : 'Activo'}
                  </span>
                </div>
                <div className="qr-item-info">
                  <div className="qr-item-id">{codigo.id.slice(0, 12)}...</div>
                  <div className="qr-item-meta">
                    <span>Ficha ID: {codigo.ficha_id}</span>
                    <span>•</span>
                    <span>Creado: {formatDate(codigo.expiracion)}</span>
                  </div>
                </div>
                <div className="qr-item-actions">
                  <button
                    onClick={() => handleDelete(codigo.id)}
                    className="btn-danger"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}