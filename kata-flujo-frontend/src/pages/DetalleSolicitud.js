import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contexts/UsuarioContext';
import { solicitudService } from '../services/solicitudService';
import { obtenerLabelEstado, obtenerLabelTipoSolicitud, formatearFecha } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Solicitudes.css';

const DetalleSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual } = useUsuario();
  const [solicitud, setSolicitud] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormularioAprobacion, setMostrarFormularioAprobacion] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDetalleSolicitud();
  }, [id]);

  const cargarDetalleSolicitud = async () => {
    try {
      setCargando(true);
      const response = await solicitudService.obtenerPorId(id);
      
      if (response.exito) {
        setSolicitud(response.datos.solicitud);
        setHistorial(response.datos.historial || []);
      } else {
        toast.error('Solicitud no encontrada');
        navigate('/solicitudes');
      }
    } catch (error) {
      console.error('Error cargando detalle:', error);
      toast.error('Error al cargar la solicitud');
      navigate('/solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const manejarAprobacion = async (accion) => {
    if (!comentarios.trim() && accion === 'rechazar') {
      toast.error('Los comentarios son obligatorios al rechazar una solicitud');
      return;
    }

    try {
      setProcesando(true);
      
      let response;
      if (accion === 'aprobar') {
        response = await solicitudService.aprobar(id, usuarioActual.id, comentarios);
      } else {
        response = await solicitudService.rechazar(id, usuarioActual.id, comentarios);
      }

      if (response.exito) {
        toast.success(`Solicitud ${accion === 'aprobar' ? 'aprobada' : 'rechazada'} exitosamente`);
        setMostrarFormularioAprobacion(false);
        setComentarios('');
        cargarDetalleSolicitud(); // Recargar para ver los cambios
      } else {
        toast.error(response.mensaje || `Error al ${accion} la solicitud`);
      }
    } catch (error) {
      console.error(`Error al ${accion}:`, error);
      toast.error(`Error al ${accion} la solicitud`);
    } finally {
      setProcesando(false);
    }
  };

  const puedeAprobar = () => {
    return (usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR') &&
           solicitud?.estado === 'PENDIENTE' &&
           solicitud?.aprobadorId === usuarioActual.id;
  };

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando solicitud...</p>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="error-state">
        <h2>Solicitud no encontrada</h2>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="detalle-solicitud">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Detalle de Solicitud</h1>
            <p>ID: {solicitud.id}</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Volver
          </button>
        </div>
      </div>

      <div className="detalle-container">
        <div className="solicitud-detalle-card">
          <div className="detalle-header">
            <h2>{solicitud.titulo}</h2>
            <span className={`estado-badge estado-${solicitud.estado.toLowerCase()}`}>
              {obtenerLabelEstado(solicitud.estado)}
            </span>
          </div>

          <div className="detalle-grid">
            <div className="detalle-item">
              <strong>Tipo de Solicitud:</strong>
              <span>{obtenerLabelTipoSolicitud(solicitud.tipoSolicitud)}</span>
            </div>

            <div className="detalle-item">
              <strong>Solicitante:</strong>
              <span>{solicitud.solicitante?.nombre || 'N/A'}</span>
            </div>

            <div className="detalle-item">
              <strong>Aprobador:</strong>
              <span>{solicitud.aprobador?.nombre || 'N/A'}</span>
            </div>

            <div className="detalle-item">
              <strong>Fecha de Creación:</strong>
              <span>{formatearFecha(solicitud.fechaCreacion)}</span>
            </div>

            {solicitud.fechaActualizacion !== solicitud.fechaCreacion && (
              <div className="detalle-item">
                <strong>Última Actualización:</strong>
                <span>{formatearFecha(solicitud.fechaActualizacion)}</span>
              </div>
            )}
          </div>

          <div className="descripcion-section">
            <h3>Descripción</h3>
            <div className="descripcion-content">
              <p>{solicitud.descripcion}</p>
            </div>
          </div>

          {solicitud.comentarios && (
            <div className="comentarios-section">
              <h3>Comentarios del Aprobador</h3>
              <div className="comentarios-content">
                <p>{solicitud.comentarios}</p>
              </div>
            </div>
          )}

          {/* Formulario de Aprobación */}
          {puedeAprobar() && (
            <div className="aprobacion-section">
              <h3>Acciones de Aprobación</h3>
              
              {!mostrarFormularioAprobacion ? (
                <div className="aprobacion-buttons">
                  <button
                    onClick={() => setMostrarFormularioAprobacion(true)}
                    className="btn btn-success"
                  >
                    Aprobar Solicitud
                  </button>
                  <button
                    onClick={() => setMostrarFormularioAprobacion(true)}
                    className="btn btn-danger"
                  >
                    Rechazar Solicitud
                  </button>
                </div>
              ) : (
                <div className="aprobacion-form">
                  <div className="form-group">
                    <label htmlFor="comentarios" className="form-label">
                      Comentarios:
                    </label>
                    <textarea
                      id="comentarios"
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      className="form-control"
                      rows="4"
                      placeholder="Agregue comentarios sobre su decisión..."
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button
                      onClick={() => setMostrarFormularioAprobacion(false)}
                      className="btn btn-secondary"
                      disabled={procesando}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => manejarAprobacion('aprobar')}
                      className="btn btn-success"
                      disabled={procesando}
                    >
                      {procesando ? 'Procesando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => manejarAprobacion('rechazar')}
                      className="btn btn-danger"
                      disabled={procesando}
                    >
                      {procesando ? 'Procesando...' : 'Rechazar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historial */}
        {historial.length > 0 && (
          <div className="historial-card">
            <h3>Historial de Cambios</h3>
            <div className="historial-timeline">
              {historial.map((evento, index) => (
                <div key={evento.id || index} className="timeline-item">
                  <div className="timeline-marker">
                    <span className={`timeline-icon ${evento.estadoNuevo.toLowerCase()}`}>
                      {evento.estadoNuevo === 'APROBADA' ? 'A' : 
                       evento.estadoNuevo === 'RECHAZADA' ? 'R' : 'P'}
                    </span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>
                        {evento.estadoAnterior ? 
                          `${obtenerLabelEstado(evento.estadoAnterior)} → ${obtenerLabelEstado(evento.estadoNuevo)}` :
                          obtenerLabelEstado(evento.estadoNuevo)
                        }
                      </strong>
                      <span className="timeline-date">
                        {formatearFecha(evento.fechaCreacion)}
                      </span>
                    </div>
                    {evento.comentarios && (
                      <p className="timeline-comment">{evento.comentarios}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleSolicitud;