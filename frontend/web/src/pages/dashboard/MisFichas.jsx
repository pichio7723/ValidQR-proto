// web/src/pages/dashboard/MisFichas.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MisFichas({ user }) {
  const [fichasHoy, setFichasHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFichasHoy = async () => {
      try {
        const response = await api.get('/horarios/instructor/hoy');
        setFichasHoy(response.data);
      } catch (err) {
        console.error('Error cargando fichas de hoy:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFichasHoy();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ color: '#fc00ff', marginBottom: '1rem' }}>📅 Mis Clases de Hoy</h2>
      
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Cargando tus fichas de hoy...</p>
      ) : fichasHoy.length === 0 ? (
        <div style={{ 
          background: '#18181b', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #27272a' 
        }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>☕</p>
          <p style={{ color: '#e4e4e7' }}>No tienes clases programadas para hoy.</p>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Las fichas de otros días aparecen en estado de "suspensión" hasta que llegue su día.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {fichasHoy.map((item, index) => (
            <div key={index} style={{
              background: '#18181b', border: '1px solid #fc00ff', borderRadius: '12px', padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(252, 0, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ background: '#fc00ff', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  HOY
                </span>
                <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{item.hora_inicio} - {item.hora_fin}</span>
              </div>
              
              <h3 style={{ color: '#e4e4e7', margin: '0 0 0.5rem 0' }}>{item.ficha_programa}</h3>
              <p style={{ color: '#fc00ff', fontWeight: 'bold', margin: '0 0 1rem 0' }}>Ficha: {item.ficha_numero}</p>
              
              <div style={{ borderTop: '1px solid #27272a', paddingTop: '1rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                <p style={{ margin: '0.25rem 0' }}>📍 Sede: {item.sede_nombre}</p>
                <p style={{ margin: '0.25rem 0' }}>🏫 Salón: {item.salon_nombre}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}