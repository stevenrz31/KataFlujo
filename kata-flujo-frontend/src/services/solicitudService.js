import api from './api';

export const solicitudService = {
  // Obtener todas las solicitudes
  obtenerTodas: async () => {
    const response = await api.get('/solicitudes');
    return response.data;
  },

  // Obtener solicitud por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/solicitudes/${id}`);
    return response.data;
  },

  // Crear nueva solicitud
  crear: async (solicitudData) => {
    const response = await api.post('/solicitudes', solicitudData);
    return response.data;
  },

  // Aprobar solicitud
  aprobar: async (id, aprobadorId, comentarios = '') => {
    const response = await api.put(`/solicitudes/${id}/aprobar`, {
      aprobadorId,
      comentarios
    });
    return response.data;
  },

  // Rechazar solicitud
  rechazar: async (id, aprobadorId, comentarios = '') => {
    const response = await api.put(`/solicitudes/${id}/rechazar`, {
      aprobadorId,
      comentarios
    });
    return response.data;
  },

  // Obtener solicitudes pendientes por aprobador
  obtenerPendientesPorAprobador: async (aprobadorId) => {
    const response = await api.get(`/solicitudes/aprobador/${aprobadorId}/pendientes`);
    return response.data;
  },

  // Obtener mis solicitudes
  obtenerMisSolicitudes: async (solicitanteId) => {
    const response = await api.get(`/solicitudes/solicitante/${solicitanteId}`);
    return response.data;
  },

  // Buscar solicitudes
  buscar: async (titulo) => {
    const response = await api.get(`/solicitudes/buscar?titulo=${encodeURIComponent(titulo)}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await api.get('/solicitudes/estadisticas');
    return response.data;
  },
};