  import React, { useState, useEffect } from "react";
  import { useNavigate, useLocation, Link } from "react-router-dom";
  import { db } from "../firebaseConfig";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import "../styles/global.css";

  const Login = ({ onLogin }) => {
    const [rol, setRol] = useState("alumno");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (location.state?.usuarioPrellenado) {
        setCorreo(location.state.usuarioPrellenado);
      }
      if (location.state?.passwordPrellenada) {
        setPassword(location.state.passwordPrellenada);
      }
    }, [location]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(""); 

    try {
      const campoBusqueda = rol === "maestro" ? "identificador" : "correo";
      const qUsuario = query(
        collection(db, "usuarios"), 
        where(campoBusqueda, "==", correo)
      );

      const querySnapshot = await getDocs(qUsuario);

      if (querySnapshot.empty) {
        setError(rol === "maestro" 
          ? "Número de empleado incorrecto. Verifique." 
          : "Correo incorrrecto. Verifique o cree una cuenta.");
      } else {
        const usuarioData = querySnapshot.docs[0].data();
        
        if (usuarioData.password === password) {
    
    localStorage.setItem("usuario_sesion", JSON.stringify(usuarioData));
    
    onLogin(usuarioData.rol); 
    
    navigate(usuarioData.rol === "maestro" ? "/panel-admin" : "/panel-alumno", { replace: true });
  } else {
        
          setError("Contraseña incorrecta. Inténtelo de nuevo.");
        }
      }
    } catch (err) {
      console.error("Error en Login:", err);
      setError("Error de conexión. Inténtalo más tarde.");
    } finally {
      setCargando(false);
    }
  };

    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="main-title">Bienvenido</h1>
          <p className="italic-subtitle">SISTEMA DE ACTIVIDADES</p>

          {}
          {error && (
            <div className="error-badge">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label className="input-label">Rol</label>
              <div className="rol-selector">
                <button 
                  type="button" 
                  className={`rol-btn ${rol === "alumno" ? "active" : ""}`} 
                  onClick={() => { setRol("alumno"); setError(""); }}
                >
                  Alumno
                </button>
                <button 
                  type="button" 
                  className={`rol-btn ${rol === "maestro" ? "active" : ""}`} 
                  onClick={() => { setRol("maestro"); setError(""); }}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                {rol === "maestro" ? "Número de Empleado" : "Correo Institucional"}
              </label>
              <input 
                type="text" 
                className="custom-input" 
                placeholder={rol === "maestro" ? "Ej. 2026001" : "usuario@alumno.ipn.mx"} 
                value={correo} 
                required 
                onChange={(e) => { setCorreo(e.target.value); setError(""); }} 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Contraseña</label>
              <input 
                type="password" 
                className="custom-input" 
                placeholder="••••••" 
                value={password} 
                required 
                onChange={(e) => { setPassword(e.target.value); setError(""); }} 
              />
            </div>

           <button type="submit" className="login-button" disabled={cargando}>
            {cargando ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        {rol === "alumno" ? (
          <p className="register-section">
            ¿No tienes cuenta? <Link to="/registro" className="register-link">Regístrate aquí</Link>
          </p>
        ) : (
          <p className="register-section">
            <span style={{ color: '#888', fontSize: '0.9rem' }}>
              Acceso exclusivo para personal administrativo.
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;