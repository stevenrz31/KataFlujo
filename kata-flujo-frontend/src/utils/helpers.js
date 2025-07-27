// src/utils/helpers.js

// Estados de solicitudes
export const ESTADOS_COLORES = {
  PENDIENTE: '#ff9800',
  APROBADA: '#4caf50', 
  RECHAZADA: '#f44336',
};

export const ESTADOS_LABELS = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
};

// Tipos de solicitud
export const TIPOS_SOLICITUD_LABELS = {
  DESPLIEGUE: 'Despliegue',
  ACCESO: 'Acceso a Herramientas',
  CAMBIO_TECNICO: 'Cambio Técnico',
  CAMBIO_PIPELINE: 'Cambio en Pipeline',
  INCORPORACION_HERRAMIENTA: 'Incorporación de Herramienta',
};

// Funciones helper
export const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const obtenerColorEstado = (estado) => {
  return ESTADOS_COLORES[estado] || '#666';
};

export const obtenerLabelEstado = (estado) => {
  return ESTADOS_LABELS[estado] || estado;
};

export const obtenerLabelTipoSolicitud = (tipo) => {
  return TIPOS_SOLICITUD_LABELS[tipo] || tipo;
};

export const truncarTexto = (texto, limite = 100) => {
  if (!texto) return '';
  return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
};