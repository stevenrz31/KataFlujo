import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { solicitudService } from '../services/solicitudService';
import { obtenerLabelEstado, obtenerLabelTipoSolicitud, formatearFecha, truncarTexto } from '../utils/helpers';
import { toast } from 'react-toastify';
import './Solicitudes.css';

const ListaSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const response = await solicitudService.obtenerTodas();
      
      if (response.exito) {
        setSolicitudes(response.datos);
      } else {
        toast.error('Error al cargar solicitudes');
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    const cumpleFiltro = filtro === 'TODAS' || solicitud.estado === filtro;
    const cumpleBusqueda = solicitud.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          solicitud.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  if (cargando) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="lista-solicitudes">
      <div className="page-header">
        <h1>Todas las Solicitudes</h1>
        <p>Vista completa de todas las solicitudes del sistema</p>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="filtro">Filtrar por estado:</label>
          <select
            id="filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="form-control filter-select"
          >
            <option value="TODAS">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADA">Aprobadas</option>
            <option value="RECHAZADA">Rechazadas</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="busqueda">Buscar:</label>
          <input
            type="text"
            id="busqueda"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título o descripción..."
            className="form-control search-input"
          />
        </div>
      </div>

      <div className="results-info">
        <p>
          Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
        </p>
      </div>

      {solicitudesFiltradas.length > 0 ? (
        <div className="solicitudes-grid">
          {solicitudesFiltradas.map((solicitud) => (
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
                  <span className="meta-label">Creada:</span>
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
                  <span className="meta-label">Aprobador:</span>
                  <span>{solicitud.aprobador?.nombre || 'N/A'}</span>
                </div>
              </div>

              <div className="solicitud-descripcion">
                <p>{truncarTexto(solicitud.descripcion, 120)}</p>
              </div>

              {solicitud.comentarios && (
                <div className="solicitud-comentarios">
                  <strong>Comentarios:</strong>
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
          <h3>No se encontraron solicitudes</h3>
          <p>
            {busqueda || filtro !== 'TODAS'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay solicitudes en el sistema aún'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ListaSolicitudes;