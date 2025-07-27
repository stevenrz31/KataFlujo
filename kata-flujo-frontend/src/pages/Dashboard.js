// src/pages/Dashboard.js (Solo cambios de texto, funcionalidad intacta)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contexts/UsuarioContext';
import { dashboardService } from '../services/dashboardService';
import { solicitudService } from '../services/solicitudService';
import { obtenerLabelEstado, formatearFecha } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { usuarioActual } = useUsuario();
  const [resumen, setResumen] = useState(null);
  const [solicitudesRecientes, setSolicitudesRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setCargando(true);
      
      // Cargar resumen general
      const resumenResponse = await dashboardService.obtenerResumen();
      if (resumenResponse.exito) {
        setResumen(resumenResponse.datos);
      }

      // Cargar solicitudes dependiendo del rol
      let solicitudesResponse;
      if (usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR') {
        solicitudesResponse = await solicitudService.obtenerPendientesPorAprobador(usuarioActual.id);
      } else {
        solicitudesResponse = await solicitudService.obtenerMisSolicitudes(usuarioActual.id);
      }

      if (solicitudesResponse.exito) {
        setSolicitudesRecientes(solicitudesResponse.datos.slice(0, 5));
      }

    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido, <strong>{usuarioActual.nombre}</strong></p>
      </div>

      

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total Solicitudes</h3>
            <div className="stat-number">{resumen?.solicitudes?.totalSolicitudes || 0}</div>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Pendientes</h3>
            <div className="stat-number">{resumen?.solicitudes?.pendientes || 0}</div>
          </div>
        </div>

        <div className="stat-card stat-approved">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Aprobadas</h3>
            <div className="stat-number">{resumen?.solicitudes?.aprobadas || 0}</div>
          </div>
        </div>

        <div className="stat-card stat-rejected">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Rechazadas</h3>
            <div className="stat-number">{resumen?.solicitudes?.rechazadas || 0}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Acciones Rápidas */}
        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            {(usuarioActual.rol === 'SOLICITANTE' || usuarioActual.rol === 'ADMINISTRADOR') && (
              <Link to="/solicitudes/crear" className="action-card action-create">
                <div className="action-icon"></div>
                <div className="action-content">
                  <h3>Crear Solicitud</h3>
                  <p>Nueva solicitud de aprobación</p>
                </div>
              </Link>
            )}

            {(usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR') && (
              <Link to="/solicitudes-pendientes" className="action-card action-pending">
                <div className="action-icon"></div>
                <div className="action-content">
                  <h3>Solicitudes Pendientes</h3>
                  <p>Revisar y aprobar solicitudes</p>
                </div>
              </Link>
            )}

            <Link to="/mis-solicitudes" className="action-card action-my">
              <div className="action-icon"></div>
              <div className="action-content">
                <h3>Mis Solicitudes</h3>
                <p>Ver mis solicitudes enviadas</p>
              </div>
            </Link>

            {(usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR') && (
              <Link to="/solicitudes" className="action-card action-all">
                <div className="action-icon"></div>
                <div className="action-content">
                  <h3>Todas las Solicitudes</h3>
                  <p>Vista completa del sistema</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Solicitudes Recientes */}
        <div className="recent-requests">
          <h2>
            {usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR' 
              ? 'Solicitudes Pendientes para Ti' 
              : 'Mis Solicitudes Recientes'
            }
          </h2>
          
          {solicitudesRecientes.length > 0 ? (
            <div className="requests-list">
              {solicitudesRecientes.map((solicitud) => (
                <div key={solicitud.id} className="request-item">
                  <div className="request-header">
                    <h3 className="request-title">
                      <Link to={`/solicitudes/${solicitud.id}`}>
                        {solicitud.titulo}
                      </Link>
                    </h3>
                    <span className={`estado-badge estado-${solicitud.estado.toLowerCase()}`}>
                      {obtenerLabelEstado(solicitud.estado)}
                    </span>
                  </div>
                  
                  <div className="request-info">
                    <div className="request-meta">
                      <span>{formatearFecha(solicitud.fechaCreacion)}</span>
                      <span>{solicitud.tipoSolicitud}</span>
                      {solicitud.solicitante && (
                        <span>{solicitud.solicitante.nombre}</span>
                      )}
                    </div>
                    
                    <p className="request-description">
                      {solicitud.descripcion.length > 150 
                        ? solicitud.descripcion.substring(0, 150) + '...'
                        : solicitud.descripcion
                      }
                    </p>
                  </div>
                  
                  <div className="request-actions">
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
              <div className="empty-icon">📭</div>
              <h3>No hay solicitudes</h3>
              <p>
                {usuarioActual.rol === 'APROBADOR' || usuarioActual.rol === 'ADMINISTRADOR'
                  ? 'No tienes solicitudes pendientes por revisar.'
                  : 'No has creado solicitudes aún.'
                }
              </p>
              {(usuarioActual.rol === 'SOLICITANTE' || usuarioActual.rol === 'ADMINISTRADOR') && (
                <Link to="/solicitudes/crear" className="btn btn-primary">
                  Crear Mi Primera Solicitud
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Actividad Reciente */}
        {resumen?.actividadReciente && resumen.actividadReciente.length > 0 && (
          <div className="recent-activity">
            <h2>Actividad Reciente del Sistema</h2>
            <div className="activity-list">
              {resumen.actividadReciente.map((actividad, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {actividad.estadoNuevo === 'APROBADA' ? '✓' : 
                     actividad.estadoNuevo === 'RECHAZADA' ? '✗' : '⋯'}
                  </div>
                  <div className="activity-content">
                    <p>
                      Solicitud <strong>{actividad.estadoNuevo.toLowerCase()}</strong>
                    </p>
                    <span className="activity-time">
                      {formatearFecha(actividad.fechaCreacion)}
                    </span>
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

export default Dashboard;