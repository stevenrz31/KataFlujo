// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UsuarioProvider } from './contexts/UsuarioContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ListaSolicitudes from './pages/ListaSolicitudes';
import CrearSolicitud from './pages/CrearSolicitud';
import DetalleSolicitud from './pages/DetalleSolicitud';
import MisSolicitudes from './pages/MisSolicitudes';
import SolicitudesPendientes from './pages/SolicitudesPendientes';
import Login from './components/Auth/Login';

import './App.css';

function App() {
  return (
    <div className="App">
      <UsuarioProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/solicitudes" element={<ListaSolicitudes />} />
              <Route path="/solicitudes/crear" element={<CrearSolicitud />} />
              <Route path="/solicitudes/:id" element={<DetalleSolicitud />} />
              <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
              <Route path="/solicitudes-pendientes" element={<SolicitudesPendientes />} />
            </Routes>
          </Layout>
        </Router>
      </UsuarioProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;