import api from './api';

export const dashboardService = {
  // Obtener resumen del dashboard
  obtenerResumen: async () => {
    const response = await api.get('/dashboard/resumen');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/dashboard/health');
    return response.data;
  },
};