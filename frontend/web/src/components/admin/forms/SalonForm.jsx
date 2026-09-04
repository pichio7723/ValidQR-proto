// web/src/components/admin/forms/SalonForm.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function SalonForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [sedes, setSedes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    sede_id: '',
  });

  useEffect(() => {
    loadSedes();
  }, []);

  const loadSedes = async () => {
    try {
      const response = await adminService.sedes.getAll();
      setSedes(response.data);
    } catch (error) {
      sileo.error({
        title: 'Error',
        description: 'No se pudieron cargar las sedes',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        sede_id: parseInt(formData.sede_id),
      };

      await adminService.salones.create(data);
      sileo.success({
        title: 'Salón creado',
        description: `El salón "${formData.nombre}" fue creado exitosamente`,
      });
      onSuccess();
    } catch (error) {
      sileo.error({
        title: 'Error al crear salón',
        description: error.response?.data?.detail || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group">
        <label className="form-label">Nombre del Salón *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="form-input"
          placeholder="Ej: Aula 101, Laboratorio 3"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Sede *</label>
        <select
          value={formData.sede_id}
          onChange={(e) => setFormData({ ...formData, sede_id: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Seleccionar sede...</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Salón'}
        </button>
      </div>
    </form>
  );
}