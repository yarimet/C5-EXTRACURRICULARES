import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

import Home from './pages/Home';
import Login from './pages/Login';
import Actividades from './pages/Actividades';
import PanelAlumno from './pages/PanelAlumno';
import PanelAdmin from './pages/PanelAdmin';
import Registro from './pages/Registro';
import DetalleActividad from './pages/DetalleActividad';
import FormularioInscripcion from './pages/FormularioInscripcion';
import VisualizarDocumentos from './pages/VisualizarDocumentos';

const RutaProtegida = ({ children, sesionIniciada }) => {
  return sesionIniciada ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [rolUsuario, setRolUsuario] = useState('');

  const handleLogin = (rol) => {
    setSesionIniciada(true);
    setRolUsuario(rol);
  };

  const handleLogout = () => {
    setSesionIniciada(false);
    setRolUsuario('');
  };

  useEffect(() => {
    const rutasConLoader = ["/", "/actividades", "/login"];
    if (rutasConLoader.includes(location.pathname)) {
      setLoading(true);
      const duracion = location.pathname === "/" ? 1400 : 900;
      const timer = setTimeout(() => {
        setLoading(false);
      }, duracion);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location]);

  return (
    <>
      <LoadingScreen visible={loading} />
      <Navbar sesionIniciada={sesionIniciada} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* LA RUTA DE EXPEDIENTES YA BIEN PUESTA */}
        <Route
          path="/visualizar-documentos"
          element={
            <RutaProtegida sesionIniciada={sesionIniciada}>
              <VisualizarDocumentos />
            </RutaProtegida>
          }
        />

        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/actividades" element={<Actividades sesionIniciada={sesionIniciada} />} />
        <Route path="/actividad/:id" element={<DetalleActividad sesionIniciada={sesionIniciada} />} />

        <Route
          path="/formulario"
          element={
            <RutaProtegida sesionIniciada={sesionIniciada}>
              <FormularioInscripcion />
            </RutaProtegida>
          }
        />

        <Route
          path="/panel-alumno"
          element={
            <RutaProtegida sesionIniciada={sesionIniciada}>
              <PanelAlumno />
            </RutaProtegida>
          }
        />

        <Route
          path="/panel-admin"
          element={
            <RutaProtegida sesionIniciada={sesionIniciada}>
              <PanelAdmin />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;