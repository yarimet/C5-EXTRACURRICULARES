import { Link } from 'react-router-dom';

const Navbar = ({ sesionIniciada, onLogout }) => {
  const datosUsuario = JSON.parse(localStorage.getItem("usuario_sesion"));
  const esAdmin = datosUsuario?.rol === "maestro";

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">INICIO</Link>
        
        {}
        {sesionIniciada && esAdmin ? (
          <Link to="/visualizar-documentos" className="nav-item">EXPEDIENTES</Link>
        ) : (
          <Link to="/actividades" className="nav-item">ACTIVIDADES</Link>
        )}
        
        {sesionIniciada && (
          <Link to={esAdmin ? "/panel-admin" : "/panel-alumno"} className="nav-item">
            {esAdmin ? "PANEL ADMIN" : "MI PERFIL"}
          </Link>
        )}

        {!sesionIniciada ? (
          <Link to="/login" className="nav-item">LOGIN</Link>
        ) : (
          <span onClick={onLogout} className="nav-item logout-btn" style={{cursor: 'pointer'}}>SALIR</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;