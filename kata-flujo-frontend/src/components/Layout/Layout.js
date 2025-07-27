// src/components/Layout/Layout.js
import React from 'react';
import { useUsuario } from '../../contexts/UsuarioContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Login from '../Auth/Login';
import './Layout.css';

const Layout = ({ children }) => {
  const { usuarioActual, cargando } = useUsuario();

  if (cargando) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando Kata Flujo...</p>
        </div>
      </div>
    );
  }

  if (!usuarioActual) {
    return <Login />;
  }

  return (
    <div className="layout">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;