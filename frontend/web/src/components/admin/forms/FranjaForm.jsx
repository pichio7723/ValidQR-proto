// web/src/components/admin/forms/FranjaForm.jsx
import { useState } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function FranjaForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hora_inicio: '',
    hora_fin: '',
    jornada: 'MAÑANA',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.franjas.create(formData);
      sileo.success({
        title: 'Franja creada',
        description: `Franja de ${formData.hora_inicio} a ${formData.hora_fin} creada`,
      });
      onSuccess();
    } catch (error) {
      sileo.error({
        title: 'Error al crear franja',
        description: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Hora Inicio *</label>
          <input
            type="time"
            value={formData.hora_inicio}
            onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Hora Fin *</label>
          <input
            type="time"
            value={formData.hora_fin}
            onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Jornada *</label>
        <select
          value={formData.jornada}
          onChange={(e) => setFormData({ ...formData, jornada: e.target.value })}
          className="form-input"
          required
        >
          <option value="MAÑANA">Mañana</option>
          <option value="TARDE">Tarde</option>
          <option value="NOCHE">Noche</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Franja'}
        </button>
      </div>
    </form>
  );
}