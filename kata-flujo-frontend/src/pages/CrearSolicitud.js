import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../contexts/UsuarioContext';
import { solicitudService } from '../services/solicitudService';
import { TIPOS_SOLICITUD_LABELS } from '../utils/constants';
import { toast } from 'react-toastify';
import './Solicitudes.css';

const CrearSolicitud = () => {
  const navigate = useNavigate();
  const { usuarioActual, aprobadores } = useUsuario();
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    aprobadorId: '',
    tipoSolicitud: ''
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!formulario.titulo || !formulario.descripcion || !formulario.aprobadorId || !formulario.tipoSolicitud) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      setCargando(true);
      
      const solicitudData = {
        titulo: formulario.titulo,
        descripcion: formulario.descripcion,
        solicitanteId: usuarioActual.id,
        aprobadorId: parseInt(formulario.aprobadorId),
        tipoSolicitud: formulario.tipoSolicitud
      };

      const response = await solicitudService.crear(solicitudData);
      
      if (response.exito) {
        toast.success('Solicitud creada exitosamente');
        navigate('/mis-solicitudes');
      } else {
        toast.error(response.mensaje || 'Error al crear la solicitud');
      }
    } catch (error) {
      console.error('Error creando solicitud:', error);
      toast.error('Error al crear la solicitud');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="crear-solicitud">
      <div className="page-header">
        <h1>Crear Nueva Solicitud</h1>
        <p>Complete el formulario para enviar una nueva solicitud de aprobación</p>
      </div>

      <div className="form-container">
        <form onSubmit={manejarEnvio} className="solicitud-form">
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">
              Título de la Solicitud *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formulario.titulo}
              onChange={manejarCambio}
              className="form-control"
              placeholder="Ej: Despliegue de Microservicio Auth v2.1.0"
              maxLength="200"
              required
            />
            <small className="form-text">
              {formulario.titulo.length}/200 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tipoSolicitud" className="form-label">
              Tipo de Solicitud *
            </label>
            <select
              id="tipoSolicitud"
              name="tipoSolicitud"
              value={formulario.tipoSolicitud}
              onChange={manejarCambio}
              className="form-control"
              required
            >
              <option value="">-- Seleccione un tipo --</option>
              {Object.entries(TIPOS_SOLICITUD_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="aprobadorId" className="form-label">
              Aprobador *
            </label>
            <select
              id="aprobadorId"
              name="aprobadorId"
              value={formulario.aprobadorId}
              onChange={manejarCambio}
              className="form-control"
              required
            >
              <option value="">-- Seleccione un aprobador --</option>
              {aprobadores.map((aprobador) => (
                <option key={aprobador.id} value={aprobador.id}>
                  {aprobador.nombre} ({aprobador.correo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción Detallada *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              className="form-control"
              rows="6"
              placeholder="Describa detalladamente su solicitud, incluyendo justificación, impacto, cronograma, etc."
              required
            />
            <small className="form-text">
              Proporcione todos los detalles necesarios para la evaluación
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
            >
              {cargando ? 'Creando...' : 'Crear Solicitud'}
            </button>
          </div>
        </form>

        <div className="form-info">
          <h3>Consejos para una buena solicitud:</h3>
          <ul>
            <li><strong>Título claro:</strong> Use un título descriptivo y específico</li>
            <li><strong>Justificación:</strong> Explique por qué es necesaria la solicitud</li>
            <li><strong>Impacto:</strong> Describa el impacto en el negocio o sistema</li>
            <li><strong>Cronograma:</strong> Incluya fechas tentativas si aplica</li>
            <li><strong>Riesgos:</strong> Mencione posibles riesgos y mitigaciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrearSolicitud;