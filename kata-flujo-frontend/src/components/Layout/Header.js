// src/components/Layout/Header.js
import React from 'react';
import { useUsuario } from '../../contexts/UsuarioContext';

const Header = () => {
  const { usuarioActual, cerrarSesion } = useUsuario();

  // Estilos inline profesionales
  const headerStyle = {
    background: 'linear-gradient(135deg, #012169 0%, #1e3a8a 100%)',
    color: '#ffffff',
    padding: '1rem 2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    position: 'sticky',
    top: '0',
    zIndex: '50',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const headerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const headerTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0',
    color: '#ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };

  const userInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem'
  };

  const userRoleStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.875rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const roleBadgeStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const logoutButtonStyle = {
    background: '#ffffff',
    color: '#012169',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const logoutButtonHoverStyle = {
    ...logoutButtonStyle,
    background: '#f1f5f9',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  // Estados para hover
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        <div style={headerLeftStyle}>
          <h1 style={headerTitleStyle}>
            Sistema de Aprobaciones - Kata
          </h1>
        </div>
        
        <div style={headerRightStyle}>
          <div style={userInfoStyle}>
            <span style={roleBadgeStyle}>
              {usuarioActual?.rol}
            </span>
          </div>
          
          <button 
            style={isHovered ? logoutButtonHoverStyle : logoutButtonStyle}
            onClick={cerrarSesion}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

// ¡IMPORTANTE! Esta línea debe estar al final
export default Header;