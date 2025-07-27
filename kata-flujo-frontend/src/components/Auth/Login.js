// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useUsuario } from '../../contexts/UsuarioContext';

const Login = () => {
  const { usuarios, simularLogin, cargando } = useUsuario();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');

  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuarioSeleccionado) {
      simularLogin(usuarioSeleccionado);
    }
  };

  // Colores corporativos Banco de Bogotá
  const colores = {
    primaryBlue: '#012169',
    secondaryBlue: '#1e3a8a',
    lightBlue: '#3b82f6',
    accentBlue: '#60a5fa',
    gray100: '#f8fafc',
    gray200: '#e2e8f0',
    gray600: '#475569',
    gray800: '#1e293b',
    white: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b'
  };

  // Estilos del contenedor principal
  const containerStyle = {
    minHeight: '100vh',
    background: colores.primaryBlue,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(30, 58, 138, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(30, 58, 138, 0.4) 0%, transparent 50%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative'
  };

  // Estilos de la tarjeta principal
  const cardStyle = {
    background: colores.white,
    borderRadius: '16px',
    boxShadow: `
      0 25px 50px -12px rgba(1, 33, 105, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1)
    `,
    padding: '3rem',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    overflow: 'hidden'
  };

  // Línea decorativa superior
  const decorativeLineStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '4px',
    background: `linear-gradient(90deg, ${colores.primaryBlue} 0%, ${colores.lightBlue} 50%, ${colores.primaryBlue} 100%)`
  };

  // Estilos del header
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2.75rem',
    color: colores.primaryBlue,
    marginBottom: '0.75rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const subtitleStyle = {
    color: colores.gray600,
    fontSize: '1.125rem',
    margin: '0',
    fontWeight: '400',
    lineHeight: '1.6'
  };

  // Estilos del formulario
  const formStyle = {
    marginBottom: '2rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.75rem',
    color: colores.gray800,
    fontSize: '1rem',
    fontWeight: '600'
  };

  const selectStyle = {
    width: '100%',
    padding: '1rem',
    marginTop: '0.5rem',
    border: `2px solid ${colores.gray200}`,
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: colores.white,
    color: colores.gray800,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none'
  };

  const selectFocusStyle = {
    ...selectStyle,
    borderColor: colores.lightBlue,
    boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.1)`
  };

  const buttonStyle = {
    width: '100%',
    padding: '1.25rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    marginTop: '1.5rem',
    background: usuarioSeleccionado ? colores.primaryBlue : colores.gray200,
    border: 'none',
    borderRadius: '12px',
    color: usuarioSeleccionado ? colores.white : colores.gray600,
    cursor: usuarioSeleccionado ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    position: 'relative',
    overflow: 'hidden'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    background: usuarioSeleccionado ? colores.secondaryBlue : colores.gray200,
    transform: usuarioSeleccionado ? 'translateY(-2px)' : 'none',
    boxShadow: usuarioSeleccionado ? '0 10px 25px -5px rgba(1, 33, 105, 0.4)' : 'none'
  };

  // Estilos del footer
  const footerStyle = {
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: `1px solid ${colores.gray200}`,
    color: colores.gray600,
    fontSize: '0.9rem',
    marginTop: '2rem'
  };

  // Estilos para cargando
  const loadingStyle = {
    minHeight: '100vh',
    background: colores.primaryBlue,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: colores.white,
    fontSize: '1.25rem',
    fontWeight: '500'
  };

  const spinnerStyle = {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.2)',
    borderTop: `4px solid ${colores.white}`,
    borderRadius: '50%',
    animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    marginBottom: '1.5rem'
  };

  // Estados para hover
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  if (cargando) {
    return (
      <div style={loadingStyle}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={spinnerStyle}></div>
        <div>Cargando sistema...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Línea decorativa */}
        <div style={decorativeLineStyle}></div>
        
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}> 
            Sistema de Aprobaciones
          </h1>
          <p style={subtitleStyle}>
            Ingrese al sistema seleccionando su usuario
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={manejarLogin} style={formStyle}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              Seleccionar Usuario:
            </label>
            <select
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
              style={isSelectFocused ? selectFocusStyle : selectStyle}
              required
            >
              <option value="">-- Seleccione un usuario --</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} - {usuario.rol}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!usuarioSeleccionado}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={isButtonHovered ? buttonHoverStyle : buttonStyle}
          >
            Ingresar al Sistema
          </button>
        </form>

       
      </div>
    </div>
  );
};

export default Login;