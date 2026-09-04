// web/src/components/admin/forms/FichaForm.jsx
import { useState } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function FichaForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero_ficha: '',
    nombre_programa: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        numero_ficha: parseInt(formData.numero_ficha),
      };

      await adminService.fichas.create(data);
      sileo.success({
        title: 'Ficha creada',
        description: `Ficha ${formData.numero_ficha} creada exitosamente`,
      });
      onSuccess();
    } catch (error) {
      sileo.error({
        title: 'Error al crear ficha',
        description: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label className="form-label">Número de Ficha *</label>
        <input
          type="number"
          value={formData.numero_ficha}
          onChange={(e) => setFormData({ ...formData, numero_ficha: e.target.value })}
          className="form-input"
          placeholder="Ej: 3407186"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Nombre del Programa *</label>
        <input
          type="text"
          value={formData.nombre_programa}
          onChange={(e) => setFormData({ ...formData, nombre_programa: e.target.value })}
          className="form-input"
          placeholder="Ej: Análisis y Desarrollo de Software"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Ficha'}
        </button>
      </div>
    </form>
  );
}