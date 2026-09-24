import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useInstructor } from '../../context/InstructorContext'; // ✅ Importar contexto

export default function VerAsistencia({ user }) {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [aprendices, setAprendices] = useState([]);
  const [formData, setFormData] = useState({
    ficha_id: '',
    aprendiz_id: '',
    sede_id: '',
    es_tarde: false
  });

  // ✅ Obtener funciones del contexto global
  const { refreshKey, triggerRefresh } = useInstructor();

  // ✅ Se ejecuta al montar Y cada vez que refreshKey cambia
  useEffect(() => {
    fetchAsistencias();
    fetchFichas();
  }, [refreshKey]);

  const fetchAsistencias = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get(`/asistencias/instructor?t=${timestamp}`);
      
      const asistenciasNormalizadas = response.data.map(asist => ({
        ...asist,
        es_tarde: asist.es_tarde === true || asist.es_tarde === 'true' || asist.es_tarde === 't' || asist.es_tarde === 1
      }));
      
      setAsistencias(asistenciasNormalizadas);
    } catch (err) {
      console.error('Error al cargar asistencias:', err);
      setError('No se pudieron cargar las asistencias.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFichas = async () => {
    try {
      const response = await api.get('/fichas/instructor');
      setFichas(response.data);
    } catch (err) {
      console.error('Error al cargar fichas:', err);
    }
  };

  const fetchAprendicesPorFicha = async (fichaId) => {
    try {
      const response = await api.get(`/fichas/${fichaId}/aprendices`);
      setAprendices(response.data);
    } catch (err) {
      console.error('Error al cargar aprendices:', err);
      setAprendices([]);
    }
  };

  const handleFichaChange = (e) => {
    const fichaId = e.target.value;
    setFormData({ ...formData, ficha_id: fichaId, aprendiz_id: '' });
    if (fichaId) {
      fetchAprendicesPorFicha(fichaId);
    } else {
      setAprendices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/asistencias/manual', {
        aprendiz_id: parseInt(formData.aprendiz_id),
        ficha_id: parseInt(formData.ficha_id),
        sede_id: parseInt(formData.sede_id),
        es_tarde: formData.es_tarde
      });
      
      setMensaje('✅ Asistencia registrada correctamente');
      setMostrarModal(false);
      setFormData({ ficha_id: '', aprendiz_id: '', sede_id: '', es_tarde: false });
      
      // ✅ Disparar la actualización global en lugar de llamar a fetchAsistencias directamente
      triggerRefresh();
      
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error al registrar asistencia:', err);
      setMensaje('❌ Error al registrar: ' + (err.response?.data?.detail || 'Intenta de nuevo'));
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  const exportarAExcel = async () => {
    setExporting(true);
    setMensaje('');
    try {
      const response = await api.get('/asistencias/instructor/exportar-excel', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const disposition = response.headers['content-disposition'];
      let filename = `asistencias_${new Date().toISOString().slice(0,10)}.xlsx`;
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setMensaje('✅ Archivo descargado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error exportando a Excel:', err);
      setMensaje('❌ Error al exportar');
      setTimeout(() => setMensaje(''), 3000);
    } finally {
      setExporting(false);
    }
  };

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

  const totalAsistencias = asistencias.length;

  return (
    <div className="content-area" style={{ padding: '2rem' }}>
      <div className="content-header">
        <h1 className="page-title">Registro de Asistencia</h1>
        <p className="page-subtitle">
          Bienvenido, {user.nombre} — Aquí puedes ver las asistencias de tus fichas
        </p>

        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            Total de Asistencias Registradas
          </div>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: '1' }}>
            {totalAsistencias}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.8, marginTop: '0.5rem' }}>
            {totalAsistencias === 1 ? 'asistencia' : 'asistencias'} en total
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={exportarAExcel}
            disabled={asistencias.length === 0 || exporting}
            style={{
              background: asistencias.length === 0 || exporting 
                ? '#6b7280' 
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: asistencias.length === 0 || exporting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {exporting ? '⏳ Exportando...' : '📊 Exportar a Excel'}
          </button>

          <button
            onClick={() => setMostrarModal(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ✍️ Registrar Asistencia Manual
          </button>
        </div>

        {mensaje && (
          <p style={{ color: mensaje.includes('✅') ? '#22c55e' : '#ef4444', marginTop: '0.75rem', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {mensaje}
          </p>
        )}
      </div>

      <div className="asistencias-container" style={{ background: '#12121a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #27272a', marginTop: '2rem' }}>
        {loading ? (
          <p style={{ color: '#a1a1aa', textAlign: 'center' }}>Cargando asistencias...</p>
        ) : error ? (
          <p style={{ color: '#ef4444', textAlign: 'center' }}>{error}</p>
        ) : asistencias.length === 0 ? (
          <p style={{ color: '#a1a1aa', textAlign: 'center' }}>📋 Aún no hay asistencias registradas en tus fichas.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e4e4e7' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #27272a', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Aprendiz</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Ficha</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Sede</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Tipo</th>
                  <th style={{ padding: '1rem', color: '#fc00ff' }}>Tarde</th>
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
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: asist.tipo === 'manual' ? '#f59e0b' : '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {asist.tipo === 'manual' ? '📝 Manual' : '📱 QR'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {asist.es_tarde ? (
                        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏰ Sí</span>
                      ) : (
                        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓ No</span>
                      )}
                    </td>
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

      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#18181b', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '500px', border: '1px solid #27272a' }}>
            <h2 style={{ color: '#e4e4e7', marginBottom: '1.5rem', fontSize: '1.5rem' }}>✍️ Registrar Asistencia Manual</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Ficha *</label>
                <select value={formData.ficha_id} onChange={handleFichaChange} required style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', fontSize: '1rem' }}>
                  <option value="">Seleccionar ficha...</option>
                  {fichas.map((ficha) => (
                    <option key={ficha.id} value={ficha.id}>{ficha.numero_ficha} - {ficha.nombre_programa}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Aprendiz *</label>
                <select value={formData.aprendiz_id} onChange={(e) => setFormData({ ...formData, aprendiz_id: e.target.value })} required disabled={!formData.ficha_id} style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', fontSize: '1rem', opacity: !formData.ficha_id ? 0.5 : 1 }}>
                  <option value="">Seleccionar aprendiz...</option>
                  {aprendices.map((aprendiz) => (
                    <option key={aprendiz.id} value={aprendiz.id}>{aprendiz.nombre} - {aprendiz.email}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#a1a1aa', marginBottom: '0.5rem' }}>Sede *</label>
                <select value={formData.sede_id} onChange={(e) => setFormData({ ...formData, sede_id: e.target.value })} required style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#e4e4e7', fontSize: '1rem' }}>
                  <option value="">Seleccionar sede...</option>
                  <option value="1">Sena CGMLTI</option>
                  <option value="2">Calle52</option>
                  <option value="3">MI CASA</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e4e4e7', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.es_tarde} onChange={(e) => setFormData({ ...formData, es_tarde: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#f59e0b' }} />
                  <span style={{ fontSize: '1rem' }}>⏰ El aprendiz llegó tarde</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ background: '#3f3f46', color: '#e4e4e7', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Registrar Asistencia</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}