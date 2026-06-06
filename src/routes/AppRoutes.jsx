import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import PanelAlumno from "./pages/PanelAlumno";
import PanelAdmin from "./pages/PanelAdmin";
import Actividades from "./pages/Actividades";
import GestionarActividades from "./pages/GestionarActividades"; 

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PanelAlumno from "./pages/PanelAlumno";
import PanelAdmin from "./pages/PanelAdmin";
import Actividades from "./pages/Actividades";
import GestionarActividades from "./pages/GestionarActividades"; 

const AppRoutes = () => {
  const obtenerUsuario = () => {
    const sesion = localStorage.getItem("usuario_sesion");
    return sesion ? JSON.parse(sesion) : null;
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={() => {}} />} />
      <Route path="/actividades" element={<Actividades />} />

      {}
      <Route 
        path="/gestionar-actividades" 
        element={
          obtenerUsuario()?.rol === "maestro" 
            ? <GestionarActividades /> 
            : <Navigate to="/" replace />
        } 
      />

      <Route 
        path="/panel-admin" 
        element={
          obtenerUsuario()?.rol === "maestro" 
            ? <PanelAdmin /> 
            : <Navigate to="/" replace />
        } 
      />

      {}
      <Route 
        path="/panel-alumno" 
        element={
          obtenerUsuario()?.rol === "alumno" 
            ? <PanelAlumno /> 
            : <Navigate to="/" replace />
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;