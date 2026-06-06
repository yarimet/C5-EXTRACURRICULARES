import React from 'react';
import './PaginaDetalle.css'; // Importa el estilo que crearemos abajo

const PaginaDetalle = ({ actividad, usuarioLogueado }) => {
  
  return (
    <div 
      className="detalle-container" 
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${actividad.imagenFondo})` }}
    >
      <div className="content-box">
        <h1>{actividad.nombre}</h1>
        <p>{actividad.descripcion}</p>

        {}
        {!usuarioLogueado ? (
          <button className="btn-login" onClick={() => window.location.href = '/login'}>
            Iniciar Sesión para inscribirte
          </button>
        ) : (
          <form className="formulario-inscripcion" onSubmit={(e) => { e.preventDefault(); alert("¡Solicitud enviada!"); }}>
            <h3>Formulario de Inscripción</h3>
            <input type="text" placeholder="Nombre completo" required />
            <input type="email" placeholder="Correo electrónico" required />
            <button type="submit">Enviar Solicitud</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaginaDetalle;