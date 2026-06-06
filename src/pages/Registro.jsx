import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "../styles/global.css";

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', correo: '', password: '', identificador: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    let e = {};
    if (!formData.nombre) e.nombre = "Campo obligatorio";
    if (!formData.correo.endsWith('@alumno.ipn.mx')) e.correo = "Debe ser correo @alumno.ipn.mx";
    if (!formData.identificador) e.identificador = "Boleta obligatoria";
    if (formData.password.length < 6) e.password = "Mínimo 6 caracteres";

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validar()) {
      setCargando(true);
      try {
        await addDoc(collection(db, "usuarios"), {
          nombre: formData.nombre,
          correo: formData.correo,
          password: formData.password,
          rol: 'alumno', 
          identificador: formData.identificador,
          fechaRegistro: new Date().toISOString()
        });

        navigate('/login', { 
          state: { usuarioPrellenado: formData.correo, passwordPrellenada: formData.password } 
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    }
  };

  return (
    <div className="home-container">
      <div className="glass-card" style={{ maxWidth: '500px' }}>
        <h1 className="main-title">Crear Cuenta</h1>
        <p className="italic-subtitle">COMUNIDAD ESTUDIANTIL</p>

        <form onSubmit={handleSubmit} className="register-form">
          <input className="custom-input" placeholder="Nombre completo" onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          
          <input className="custom-input" type="email" placeholder="Correo institucional (@alumno.ipn.mx)" onChange={(e) => setFormData({...formData, correo: e.target.value})} />
          {errores.correo && <span className="error-text">{errores.correo}</span>}

          <input className="custom-input" placeholder="Número de Boleta" onChange={(e) => setFormData({...formData, identificador: e.target.value})} />
          {errores.identificador && <span className="error-text">{errores.identificador}</span>}
          
          <input className="custom-input" type="password" placeholder="Contraseña" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          {errores.password && <span className="error-text">{errores.password}</span>}

          <button type="submit" className="login-button" disabled={cargando}>
            {cargando ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="register-section">
          ¿Ya tienes cuenta? <Link to="/login" className="register-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;