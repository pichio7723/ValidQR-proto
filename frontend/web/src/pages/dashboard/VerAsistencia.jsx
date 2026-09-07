import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function VerAsistencia({ user }) {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const response = await api.get('/asistencias/instructor');
        setAsistencias(response.data);
      } catch (err) {
        console.error('Error al cargar asistencias:', err);
        setError('No se pudieron cargar las asistencias. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '-';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="content-area" style={{ padding: '2rem' }}>
      <div className="content-header">
        <h1 className="page-title">Registro de Asistencia</h1>
        <p className="page-subtitle">
          Bienvenido, {user.nombre} — Aquí puedes ver las asistencias de tus fichas
        </p>
      </div>

      <div className="asistencias-container" style={{ 
        background: '#12121a', 
        borderRadius: '12px', 
        padding: '1.5rem', 
        border: '1px solid #27272a',
        marginTop: '1.5rem'
      }}>
        {loading ? (
          <p style={{ color: '#a1a1aa', textAlign: 'center' }}>Cargando asistencias...</p>
        ) : error ? (
          <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
        ) : asistencias.length === 0 ? (
          <p style={{ color: '#a1a1aa', textAlign: 'center' }}>
            📋 Aún no hay asistencias registradas en tus fichas.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e4e4e7' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #27272a', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Aprendiz</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Ficha</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Sede</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Fecha y Hora</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asist) => (
                  <tr key={asist.id} style={{ borderBottom: '1px solid #27272a' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{asist.aprendiz_nombre}</div>
                      <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{asist.aprendiz_email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{asist.ficha_numero || '-'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{asist.ficha_programa || '-'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{asist.sede_nombre || '-'}</td>
                    <td style={{ padding: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                      {formatearFecha(asist.creacion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}