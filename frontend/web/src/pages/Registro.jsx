// web/src/pages/Registro.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { sileo } from 'sileo';
import '../styles/pages/Login.css';

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fichas, setFichas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'aprendiz',
    ficha_id: '',
  });

  useEffect(() => {
    cargarFichas();
  }, []);

  const cargarFichas = async () => {
    try {
      const response = await api.get('/fichas/');
      setFichas(response.data || []);
    } catch (error) {
      console.error('Error cargando fichas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        ficha_id: formData.rol === 'aprendiz' ? parseInt(formData.ficha_id) : null,
      };

      await api.post('/usuarios/registro', data);

      sileo.success({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
      });

      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      sileo.error({
        title: 'Error en el registro',
        description: error.response?.data?.detail || 'No se pudo crear la cuenta',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="login-title">Crear Cuenta</h1>
          <p className="login-subtitle">Regístrate en ValidQR</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="form-input"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol *</label>
            <select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value, ficha_id: '' })}
              className="form-input"
              required
            >
              <option value="aprendiz">Aprendiz</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {formData.rol === 'aprendiz' && (
            <div className="form-group">
              <label className="form-label">Ficha *</label>
              <select
                value={formData.ficha_id}
                onChange={(e) => setFormData({ ...formData, ficha_id: e.target.value })}
                className="form-input"
                required
              >
                <option value="">Seleccionar ficha...</option>
                {fichas.map((ficha) => (
                  <option key={ficha.id} value={ficha.id}>
                    {ficha.numero_ficha} - {ficha.nombre_programa}
                  </option>
                ))}
              </select>
              {fichas.length === 0 && (
                <small style={{ color: '#fc00ff', fontSize: '0.75rem' }}>
                  ⚠️ No hay fichas disponibles. Contacta al administrador.
                </small>
              )}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="login-link">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}