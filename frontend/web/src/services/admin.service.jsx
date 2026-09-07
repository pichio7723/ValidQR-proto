import api from './api';

export const adminService = {

  // ===== CÓDIGOS QR =====
  codigosQr: {
    getAll: () => api.get('/codigos_qr/'),
    getByInstructor: (instructorId) => api.get(`/codigos_qr/instructor/${instructorId}`),
    getById: (id) => api.get(`/codigos_qr/${id}`),
    getByFicha: (fichaId) => api.get(`/codigos_qr/ficha/${fichaId}`),
    create: (data) => api.post('/codigos_qr/', data),
    delete: (id) => api.delete(`/codigos_qr/${id}`),
  },
  // ===== SEDES =====
  sedes: {
    getAll: () => api.get('/sedes/'),
    getById: (id) => api.get(`/sedes/${id}`),
    create: (data) => api.post('/sedes/', data),
    update: (id, data) => api.put(`/sedes/${id}`, data),
    delete: (id) => api.delete(`/sedes/${id}`),
  },

  // ===== SALONES =====
  salones: {
    getAll: () => api.get('/salones/'),
    getById: (id) => api.get(`/salones/${id}`),
    create: (data) => api.post('/salones/', data),
    update: (id, data) => api.put(`/salones/${id}`, data),
    delete: (id) => api.delete(`/salones/${id}`),
  },

  // ===== FRANJAS CLASE =====
  franjas: {
    getAll: () => api.get('/franjas_clase/'),
    getById: (id) => api.get(`/franjas_clase/${id}`),
    create: (data) => api.post('/franjas_clase/', data),
    update: (id, data) => api.put(`/franjas_clase/${id}`, data),
    delete: (id) => api.delete(`/franjas_clase/${id}`),
  },

  // ===== TRIMESTRES =====
  trimestres: {
    getAll: () => api.get('/trimestres/'),
    getById: (id) => api.get(`/trimestres/${id}`),
    create: (data) => api.post('/trimestres/', data),
    update: (id, data) => api.put(`/trimestres/${id}`, data),
    delete: (id) => api.delete(`/trimestres/${id}`),
  },

  // ===== FICHAS =====
  fichas: {
    getAll: () => api.get('/fichas/'),
    getById: (id) => api.get(`/fichas/${id}`),
    create: (data) => api.post('/fichas/', data),
    update: (id, data) => api.put(`/fichas/${id}`, data),
    delete: (id) => api.delete(`/fichas/${id}`),
  },

  // ===== HORARIOS =====
  horarios: {
    getAll: () => api.get('/horarios/'),
    getById: (id) => api.get(`/horarios/${id}`),
    create: (data) => api.post('/horarios/', data),
    update: (id, data) => api.patch(`/horarios/${id}`, data), // PATCH según backend
    delete: (id) => api.delete(`/horarios/${id}`),
  },

  // ===== USUARIOS (para obtener instructores) =====
  // Reemplaza la sección de usuarios con esto:

  usuarios: {
    getAll: () => api.get('/usuarios/'),
    getInstructores: () => {
      console.log('🔍 GET /usuarios/instructores');
      return api.get('/usuarios/instructores');
    },
  },
};

