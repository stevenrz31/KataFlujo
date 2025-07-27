import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contexts/UsuarioContext';
import { solicitudService } from '../services/solicitudService';
import { obtenerLabelTipoSolicitud, formatearFecha, truncarTexto } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Solicitudes.css';

const SolicitudesPendientes = () => {
  const { usuarioActual } = useUsuario();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuarioActual) {
      cargarSolicitudesPendientes();
    }
  }, [usuarioActual]);

  const cargarSolicitudesPendientes = async () => {
    try {
      setCargando(true);
      const response = await solicitudService.obtenerPendientesPorAprobador(usuarioActual.id);
      
      if (response.exito) {
        setSolicitudes(response.datos);
      } else {
        toast.error('Error al cargar solicitudes pendientes');
      }
    } catch (error) {
      console.error('Error cargando solicitudes pendientes:', error);
      toast.error('Error al cargar solicitudes pendientes');
    } finally {
      setCargando(false);
    }
  };

  const manejarAprobacionRapida = async (solicitudId, accion, comentarios = '') => {
    try {
      let response;
      if (accion === 'aprobar') {
        response = await solicitudService.aprobar(solicitudId, usuarioActual.id, comentarios);
      } else {
        response = await solicitudService.rechazar(solicitudId, usuarioActual.id, comentarios);
      }

      if (response.exito) {
        toast.success(`Solicitud ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente`);
        cargarSolicitudesPendientes(); // Recargar lista
      } else {
        toast.error(response.mensaje || `Error al ${accion} la solicitud`);
      }
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
      toast.error(`Error al ${accion} la solicitud`);
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando solicitudes pendientes...</p>
      </div>
    );
  }

  return (
    <div className="solicitudes-pendientes">
      <div className="page-header">
        <h1>Solicitudes Pendientes</h1>
        <p>Solicitudes que requieren tu aprobación</p>
      </div>

      {solicitudes.length > 0 ? (
        <>
          <div className="pendientes-summary">
            <div className="summary-card">
              <span className="summary-number">{solicitudes.length}</span>
              <span className="summary-text">Solicitudes pendientes</span>
            </div>
          </div>

          <div className="solicitudes-pendientes-grid">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="solicitud-pendiente-card">
                <div className="solicitud-header">
                  <h3 className="solicitud-titulo">
                    <Link to={`/solicitudes/${solicitud.id}`}>
                      {solicitud.titulo}
                    </Link>
                  </h3>
                  <span className="estado-badge estado-pendiente">
                    Pendiente
                  </span>
                </div>

                <div className="solicitud-meta">
                  <div className="meta-item">
                    <span className="meta-label">Recibida:</span>
                    <span>{formatearFecha(solicitud.fechaCreacion)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Tipo:</span>
                    <span>{obtenerLabelTipoSolicitud(solicitud.tipoSolicitud)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Solicitante:</span>
                    <span>{solicitud.solicitante?.nombre || 'N/A'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Correo:</span>
                    <span>{solicitud.solicitante?.correo || 'N/A'}</span>
                  </div>
                </div>

                <div className="solicitud-descripcion">
                  <h4>Descripción:</h4>
                  <p>{truncarTexto(solicitud.descripcion, 200)}</p>
                </div>

                <div className="solicitud-actions">
                  <Link
                    to={`/solicitudes/${solicitud.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Ver Detalle Completo
                  </Link>
                  
                  <div className="quick-actions">
                    <button
                      onClick={() => {
                        const comentarios = prompt('Comentarios (opcional):');
                        if (comentarios !== null) {
                          manejarAprobacionRapida(solicitud.id, 'aprobar', comentarios);
                        }
                      }}
                      className="btn btn-success btn-sm"
                      title="Aprobación rápida"
                    >
                      Aprobar
                    </button>
                    
                    <button
                      onClick={() => {
                        const comentarios = prompt('Comentarios de rechazo (requeridos):');
                        if (comentarios && comentarios.trim()) {
                          manejarAprobacionRapida(solicitud.id, 'rechazar', comentarios);
                        } else if (comentarios !== null) {
                          toast.error('Los comentarios son obligatorios al rechazar');
                        }
                      }}
                      className="btn btn-danger btn-sm"
                      title="Rechazo rápido"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>

                <div className="urgencia-indicator">
                  {(() => {
                    const diasPendiente = Math.floor(
                      (new Date() - new Date(solicitud.fechaCreacion)) / (1000 * 60 * 60 * 24)
                    );
                    
                    if (diasPendiente >= 7) {
                      return <span className="urgencia alta">Urgente ({diasPendiente} días)</span>;
                    } else if (diasPendiente >= 3) {
                      return <span className="urgencia media">Moderada ({diasPendiente} días)</span>;
                    } else {
                      return <span className="urgencia baja">Reciente ({diasPendiente} días)</span>;
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">-</div>
          <h3>¡Excelente trabajo!</h3>
          <p>No tienes solicitudes pendientes por revisar.</p>
          <Link to="/solicitudes" className="btn btn-primary">
            Ver Todas las Solicitudes
          </Link>
        </div>
      )}
    </div>
  );
};

export default SolicitudesPendientes;