import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contexts/UsuarioContext';
import { solicitudService } from '../services/solicitudService';
import { obtenerLabelEstado, obtenerLabelTipoSolicitud, formatearFecha, truncarTexto } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Solicitudes.css';

const MisSolicitudes = () => {
  const { usuarioActual } = useUsuario();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuarioActual) {
      cargarMisSolicitudes();
    }
  }, [usuarioActual]);

  const cargarMisSolicitudes = async () => {
    try {
      setCargando(true);
      const response = await solicitudService.obtenerMisSolicitudes(usuarioActual.id);
      
      if (response.exito) {
        setSolicitudes(response.datos);
      } else {
        toast.error('Error al cargar mis solicitudes');
      }
    } catch (error) {
      console.error('Error cargando mis solicitudes:', error);
      toast.error('Error al cargar mis solicitudes');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando mis solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="mis-solicitudes">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Mis Solicitudes</h1>
            <p>Solicitudes que has enviado para aprobación</p>
          </div>
          <Link to="/solicitudes/crear" className="btn btn-primary">
            Nueva Solicitud
          </Link>
        </div>
      </div>

      {solicitudes.length > 0 ? (
        <div className="solicitudes-grid">
          {solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="solicitud-card">
              <div className="solicitud-header">
                <h3 className="solicitud-titulo">
                  <Link to={`/solicitudes/${solicitud.id}`}>
                    {solicitud.titulo}
                  </Link>
                </h3>
                <span className={`estado-badge estado-${solicitud.estado.toLowerCase()}`}>
                  {obtenerLabelEstado(solicitud.estado)}
                </span>
              </div>

              <div className="solicitud-meta">
                <div className="meta-item">
                  <span className="meta-label">Enviada:</span>
                  <span>{formatearFecha(solicitud.fechaCreacion)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tipo:</span>
                  <span>{obtenerLabelTipoSolicitud(solicitud.tipoSolicitud)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Aprobador:</span>
                  <span>{solicitud.aprobador?.nombre || 'N/A'}</span>
                </div>
                {solicitud.fechaActualizacion !== solicitud.fechaCreacion && (
                  <div className="meta-item">
                    <span className="meta-label">Actualizada:</span>
                    <span>{formatearFecha(solicitud.fechaActualizacion)}</span>
                  </div>
                )}
              </div>

              <div className="solicitud-descripcion">
                <p>{truncarTexto(solicitud.descripcion, 120)}</p>
              </div>

              {solicitud.comentarios && (
                <div className="solicitud-comentarios">
                  <strong>Comentarios del aprobador:</strong>
                  <p>{truncarTexto(solicitud.comentarios, 100)}</p>
                </div>
              )}

              <div className="solicitud-actions">
                <Link
                  to={`/solicitudes/${solicitud.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">-</div>
          <h3>No tienes solicitudes aún</h3>
          <p>¿Necesitas aprobación para algo? ¡Crea tu primera solicitud!</p>
          <Link to="/solicitudes/crear" className="btn btn-primary">
            Crear Mi Primera Solicitud
          </Link>
        </div>
      )}
    </div>
  );
};

export default MisSolicitudes;