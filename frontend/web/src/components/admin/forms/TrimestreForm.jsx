// web/src/components/admin/forms/TrimestreForm.jsx
import { useState } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function TrimestreForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.trimestres.create(formData);
      sileo.success({
        title: 'Trimestre creado',
        description: `El trimestre "${formData.nombre}" fue creado`,
      });
      onSuccess();
    } catch (error) {
      sileo.error({
        title: 'Error al crear trimestre',
        description: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label className="form-label">Nombre del Trimestre *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="form-input"
          placeholder="Ej: Trimestre 1 - 2024"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Fecha Inicio *</label>
          <input
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha Fin *</label>
          <input
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Trimestre'}
        </button>
      </div>
    </form>
  );
}