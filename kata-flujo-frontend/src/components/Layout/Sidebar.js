import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUsuario } from '../../contexts/UsuarioContext';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();
  const { usuarioActual } = useUsuario();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      roles: ['SOLICITANTE', 'APROBADOR', 'ADMINISTRADOR']
    },
    {
      path: '/solicitudes',
      label: 'Todas las Solicitudes',
      roles: ['APROBADOR', 'ADMINISTRADOR']
    },
    {
      path: '/solicitudes/crear',
      label: 'Crear Solicitud',
      roles: ['SOLICITANTE', 'ADMINISTRADOR']
    },
    {
      path: '/mis-solicitudes',
      label: 'Mis Solicitudes',
      roles: ['SOLICITANTE', 'ADMINISTRADOR']
    },
    {
      path: '/solicitudes-pendientes',
      label: 'Solicitudes Pendientes',
      roles: ['APROBADOR', 'ADMINISTRADOR']
    }
  ];

  const menuItemsFiltrados = menuItems.filter(item => 
    item.roles.includes(usuarioActual?.rol)
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItemsFiltrados.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon"></span>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            {usuarioActual?.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{usuarioActual?.nombre}</div>
            <div className="user-email">{usuarioActual?.correo}</div>
            <div className="user-role-badge">
              {usuarioActual?.rol}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;