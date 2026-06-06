import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/global.css";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const DetalleActividad = ({ sesionIniciada }) => {
  const { state: datos } = useLocation();
  const navigate = useNavigate();
  
  
  const [yaInscrito, setYaInscrito] = useState(false);
  const [cargandoValidacion, setCargandoValidacion] = useState(true);


  const [cuposOcupados, setCuposOcupados] = useState(0);
  const [cargandoCupos, setCargandoCupos] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario_sesion"));
  const datosFinales = datos || JSON.parse(localStorage.getItem('actividadActual'));

  useEffect(() => {
    if (datos) localStorage.setItem('actividadActual', JSON.stringify(datos));

const verificarRegistro = async () => {
  if (usuario?.rol === "alumno") {
    try {
      const q = query(
        collection(db, "inscripciones"),
        where("correoInst", "==", usuario.correo)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const datosInscripcion = querySnapshot.docs[0].data();
        if (datosInscripcion.estatus !== "Rechazado") {
          setYaInscrito(true);
        } else {
          setYaInscrito(false); 
        }
      } else {
        setYaInscrito(false);
      }
    } catch (error) {
      console.error("Error al validar inscripción:", error);
    }
  }
  setCargandoValidacion(false);
};

   const obtenerLugaresOcupados = async () => {
  if (datosFinales?.nombre) {
    try {
      const qCupos = query(
        collection(db, "inscripciones"),
        where("actividad", "==", datosFinales.nombre),
        where("estatus", "in", ["Aceptado", "En revisión"]) 
      );
      const snapshotCupos = await getDocs(qCupos);
      setCuposOcupados(snapshotCupos.size); 
    } catch (error) {
      console.error("Error al obtener cupos:", error);
    } finally {
      setCargandoCupos(false);
    }
  }
};

    verificarRegistro();
    obtenerLugaresOcupados();
  }, [datos, usuario?.correo, usuario?.rol, datosFinales?.nombre]);

  if (!datosFinales) {
    navigate('/actividades');
    return null;
  }
  const esIlimitado = datosFinales.cupo === "Ilimitado";
  const cupoMaximo = parseInt(datosFinales.cupo) || 0;

  const lugaresDisponibles = esIlimitado ? "Ilimitados" : cupoMaximo - cuposOcupados;

  const estaLleno = !esIlimitado && lugaresDisponibles <= 0;

  return (
    <div className="detalle-page">
      <section 
        className="hero-actividad"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${datosFinales.imagen})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-content">
          <h1>{datosFinales.nombre?.toUpperCase()}</h1>
          <p>{datosFinales.descripcion}</p>
        </div>
      </section>

      <section className="info-section">
        {sesionIniciada ? (
          <>
            <div className="info-grid">
              <div className="info-card"><h3>Promotor</h3><p>{datosFinales.profesor}</p></div>
              <div className="info-card"><h3>Lugar</h3><p>{datosFinales.lugar || "Gimnasio / Patio"}</p></div>
              <div className="info-card"><h3>Horario</h3><p>{datosFinales.horario}</p></div>
              <div className="info-card">
                <h3>Lugares Disponibles</h3>
                {}
                <p style={{ fontWeight: 'bold', color: estaLleno ? '#e74c3c' : '#2ecc71', fontSize: '1.2rem' }}>
                  {cargandoCupos ? "Calculando..." : estaLleno ? "0 (Lleno)" : `${lugaresDisponibles} de ${datosFinales.cupo}`}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
             {}
{usuario?.rol === "alumno" && (
  <>
    {cargandoValidacion || cargandoCupos ? (
      <p style={{ color: '#aaa' }}>Verificando disponibilidad...</p>
    ) : yaInscrito ? (
      <div className="mensaje-inscrito">
        <p style={{ color: '#ff9800', marginBottom: '10px', fontWeight: 'bold' }}>
          ⚠️ Ya cuentas con una inscripción activa en el sistema.
        </p>
        <button className="btn-bloqueado" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
          Inscripción No Disponible
        </button>
      </div>
    ) : estaLleno ? (
      <div className="mensaje-cupo-lleno">
        <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '10px' }}>
         Lo sentimos, el cupo para esta actividad se ha agotado.
        </p>
        <button 
          className="form-button btn-lleno" 
          disabled 
          style={{ backgroundColor: '#d32f2f', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
        >
          Sin lugares disponibles
        </button>
      </div>
    ) : (
      <button 
        onClick={() => navigate('/formulario', { state: { actividad: datosFinales, usuario: usuario } })} 
        className="btn-dorado-brillante"
      >
        Inscribirme a esta actividad
      </button>
    )}
  </>
)}

              {(usuario?.rol === "maestro" || usuario?.rol === "admin") && (
                <button 
                  onClick={() => navigate('/gestionar-actividades')} 
                  className="btn-admin-edit"
                >
                  ⚙️ Ir al Panel de Gestión
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="login-card">
            <h3>¡Forma parte de la comunidad!</h3>
            <p>
              Para acceder a horarios, cupos y asegurar tu lugar en 
              <strong> {datosFinales.nombre}</strong>, inicia sesión.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="btn-dorado-brillante"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DetalleActividad;