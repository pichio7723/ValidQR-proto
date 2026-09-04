// web/src/components/admin/forms/HorarioForm.jsx
import { useState, useEffect } from 'react';
import { adminService } from '../../../services/admin.service';
import { sileo } from 'sileo';

export default function HorarioForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [fichas, setFichas] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [salones, setSalones] = useState([]);
  const [franjas, setFranjas] = useState([]);
  const [trimestres, setTrimestres] = useState([]);

  const [formData, setFormData] = useState({
    ficha_id: '',
    instructor_id: '',
    salon_id: '',
    franja_id: '',
    trimestre_id: '',
    dia_semana: 'MARTES', // Por defecto MARTES (hoy)
    tematica: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    console.log('🔍 Cargando datos para el formulario de horarios...');
    
    try {
      const [fichasRes, instructoresRes, salonesRes, franjasRes, trimestresRes] = await Promise.all([
        adminService.fichas.getAll(),
        adminService.usuarios.getInstructores(),
        adminService.salones.getAll(),
        adminService.franjas.getAll(),
        adminService.trimestres.getAll(),
      ]);

      console.log('✅ Fichas cargadas:', fichasRes.data);
      console.log('✅ Instructores cargados:', instructoresRes.data);
      console.log('✅ Salones cargados:', salonesRes.data);
      console.log('✅ Franjas cargadas:', franjasRes.data);
      console.log('✅ Trimestres cargados:', trimestresRes.data);

      setFichas(fichasRes.data || []);
      setInstructores(instructoresRes.data || []);
      setSalones(salonesRes.data || []);
      setFranjas(franjasRes.data || []);
      setTrimestres(trimestresRes.data || []);

      // Verificar si hay datos
      if (fichasRes.data?.length === 0) {
        sileo.warning({
          title: 'Sin fichas',
          description: 'No hay fichas registradas. Crea una primero.',
        });
      }
      if (instructoresRes.data?.length === 0) {
        sileo.warning({
          title: 'Sin instructores',
          description: 'No hay instructores registrados.',
        });
      }
      if (salonesRes.data?.length === 0) {
        sileo.warning({
          title: 'Sin salones',
          description: 'No hay salones registrados.',
        });
      }
      if (franjasRes.data?.length === 0) {
        sileo.warning({
          title: 'Sin franjas',
          description: 'No hay franjas horarias registradas.',
        });
      }
      if (trimestresRes.data?.length === 0) {
        sileo.warning({
          title: 'Sin trimestres',
          description: 'No hay trimestres registrados.',
        });
      }

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      sileo.error({
        title: 'Error al cargar datos',
        description: error.response?.data?.detail || 'No se pudieron cargar los datos necesarios',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = {
      ficha_id: parseInt(formData.ficha_id),
      instructor_id: parseInt(formData.instructor_id),
      salon_id: parseInt(formData.salon_id),
      franja_id: parseInt(formData.franja_id),
      trimestre_id: parseInt(formData.trimestre_id),
      dia_semana: formData.dia_semana.toLowerCase(),  // ← AGREGAR ESTO
      tematica: formData.tematica || null,
    };

    console.log('📤 Enviando datos al backend:', data);

    await adminService.horarios.create(data);
    
    sileo.success({
      title: 'Horario creado',
      description: 'El horario fue creado exitosamente',
    });
    onSuccess();
  } catch (error) {
    console.error('❌ Error creando horario:', error);
    sileo.error({
      title: 'Error al crear horario',
      description: error.response?.data?.detail || 'Error desconocido',
    });
  } finally {
    setLoading(false);
  }
};
  return (
    <form onSubmit={handleSubmit} className="admin-form">
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
            ⚠️ No hay fichas disponibles
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Instructor *</label>
        <select
          value={formData.instructor_id}
          onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Seleccionar instructor...</option>
          {instructores.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.nombre} ({inst.email})
            </option>
          ))}
        </select>
        {instructores.length === 0 && (
          <small style={{ color: '#fc00ff', fontSize: '0.75rem' }}>
            ⚠️ No hay instructores disponibles
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Salón *</label>
        <select
          value={formData.salon_id}
          onChange={(e) => setFormData({ ...formData, salon_id: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Seleccionar salón...</option>
          {salones.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.nombre}
            </option>
          ))}
        </select>
        {salones.length === 0 && (
          <small style={{ color: '#fc00ff', fontSize: '0.75rem' }}>
            ⚠️ No hay salones disponibles
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Franja Horaria *</label>
        <select
          value={formData.franja_id}
          onChange={(e) => setFormData({ ...formData, franja_id: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Seleccionar franja...</option>
          {franjas.map((franja) => (
            <option key={franja.id} value={franja.id}>
              {franja.hora_inicio} - {franja.hora_fin} ({franja.jornada})
            </option>
          ))}
        </select>
        {franjas.length === 0 && (
          <small style={{ color: '#fc00ff', fontSize: '0.75rem' }}>
            ⚠️ No hay franjas disponibles
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Trimestre *</label>
        <select
          value={formData.trimestre_id}
          onChange={(e) => setFormData({ ...formData, trimestre_id: e.target.value })}
          className="form-input"
          required
        >
          <option value="">Seleccionar trimestre...</option>
          {trimestres.map((trim) => (
            <option key={trim.id} value={trim.id}>
              {trim.nombre}
            </option>
          ))}
        </select>
        {trimestres.length === 0 && (
          <small style={{ color: '#fc00ff', fontSize: '0.75rem' }}>
            ⚠️ No hay trimestres disponibles
          </small>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Día de la Semana *</label>
        <select
          value={formData.dia_semana}
          onChange={(e) => setFormData({ ...formData, dia_semana: e.target.value })}
          className="form-input"
          required
        >
          <option value="LUNES">Lunes</option>
          <option value="MARTES">Martes</option>
          <option value="MIERCOLES">Miércoles</option>
          <option value="JUEVES">Jueves</option>
          <option value="VIERNES">Viernes</option>
          <option value="SABADO">Sábado</option>
          <option value="DOMINGO">Domingo</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Temática (opcional)</label>
        <input
          type="text"
          value={formData.tematica}
          onChange={(e) => setFormData({ ...formData, tematica: e.target.value })}
          className="form-input"
          placeholder="Ej: Introducción a Python"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || fichas.length === 0 || instructores.length === 0 || salones.length === 0 || franjas.length === 0 || trimestres.length === 0}
        >
          {loading ? 'Creando...' : 'Crear Horario'}
        </button>
      </div>
    </form>
  );
}