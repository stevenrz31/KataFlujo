import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { toast } from 'react-toastify';

const UsuarioContext = createContext();

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario debe ser usado dentro de un UsuarioProvider');
  }
  return context;
};

export const UsuarioProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [aprobadores, setAprobadores] = useState([]);
  const [tiposSolicitud, setTiposSolicitud] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Simular login (en un caso real sería con JWT/OAuth)
  const simularLogin = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
    if (usuario) {
      setUsuarioActual(usuario);
      localStorage.setItem('usuarioActualId', usuarioId);
      toast.success(`Bienvenido, ${usuario.nombre}!`);
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActualId');
    toast.info('Sesión cerrada');
  };

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargando(true);
        
        // Cargar usuarios, aprobadores y tipos de solicitud en paralelo
        const [usuariosResponse, aprobadoresResponse, tiposResponse] = await Promise.all([
          usuarioService.obtenerTodos(),
          usuarioService.obtenerAprobadores(),
          usuarioService.obtenerTiposSolicitud(),
        ]);

        if (usuariosResponse.exito) {
          setUsuarios(usuariosResponse.datos);
        }

        if (aprobadoresResponse.exito) {
          setAprobadores(aprobadoresResponse.datos);
        }

        if (tiposResponse.exito) {
          setTiposSolicitud(tiposResponse.datos);
        }

        // Verificar si hay un usuario logueado
        const usuarioGuardadoId = localStorage.getItem('usuarioActualId');
        if (usuarioGuardadoId && usuariosResponse.exito) {
          const usuario = usuariosResponse.datos.find(u => u.id === parseInt(usuarioGuardadoId));
          if (usuario) {
            setUsuarioActual(usuario);
          }
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
        toast.error('Error al cargar datos de la aplicación');
      } finally {
        setCargando(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  const value = {
    usuarioActual,
    usuarios,
    aprobadores,
    tiposSolicitud,
    cargando,
    simularLogin,
    cerrarSesion,
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
};