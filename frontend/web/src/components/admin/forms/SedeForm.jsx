// web/src/components/admin/forms/SedeForm.jsx
import { useState } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function SedeForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
    radio_metros: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        radio_metros: parseInt(formData.radio_metros),
      };

      await adminService.sedes.create(data);
      sileo.success({
        title: 'Sede creada',
        description: `La sede "${formData.nombre}" fue creada exitosamente`,
      });
      onSuccess();
    } catch (error) {
      sileo.error({
        title: 'Error al crear sede',
        description: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label className="form-label">Nombre de la Sede *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="form-input"
          placeholder="Ej: Calle 52, Unigermana"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Dirección *</label>
        <input
          type="text"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          className="form-input"
          placeholder="Dirección completa"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Latitud *</label>
          <input
            type="number"
            step="any"
            value={formData.latitud}
            onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
            className="form-input"
            placeholder="Ej: 4.6097"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Longitud *</label>
          <input
            type="number"
            step="any"
            value={formData.longitud}
            onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
            className="form-input"
            placeholder="Ej: -74.0817"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Radio de geolocalización (metros) *</label>
        <input
          type="number"
          value={formData.radio_metros}
          onChange={(e) => setFormData({ ...formData, radio_metros: e.target.value })}
          className="form-input"
          placeholder="Ej: 100"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Sede'}
        </button>
      </div>
    </form>
  );
}