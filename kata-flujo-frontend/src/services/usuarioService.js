import api from './api';

export const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Obtener aprobadores
  obtenerAprobadores: async () => {
    const response = await api.get('/usuarios/aprobadores');
    return response.data;
  },

  // Obtener solicitantes
  obtenerSolicitantes: async () => {
    const response = await api.get('/usuarios/solicitantes');
    return response.data;
  },

  // Obtener tipos de solicitud
  obtenerTiposSolicitud: async () => {
    const response = await api.get('/usuarios/tipos-solicitud');
    return response.data;
  },

  // Crear usuario
  crear: async (usuarioData) => {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  },

  // Buscar usuarios
  buscar: async (nombre) => {
    const response = await api.get(`/usuarios/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response.data;
  },

  // Obtener estadísticas
  obtenerEstadisticas: async () => {
    const response = await api.get('/usuarios/estadisticas');
    return response.data;
  },
};