import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActividadCard = (props) => {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

const handleVerDetalle = () => {
  setCargando(true);
  
  setTimeout(() => {
    const idParaUrl = props.nombre.toLowerCase().replace(/\s+/g, '-');
  
    const datosParaNavegar = {
      nombre: props.nombre,
      imagen: props.imagen,
      profesor: props.profesor,
      horario: props.horario,
      lugar: props.lugar,
      cupo: props.cupo,
      descripcion: props.descripcion
    };

    // NAVEGA USANDO SOLO EL OBJETO LIMPIO
    navigate(`/actividad/${idParaUrl}`, { state: datosParaNavegar });
  }, 800);
};

  return (
    <div className="activity-card-cover" style={{ backgroundImage: `url(${props.imagen})` }}>
      <div className="overlay">
        <h3>{props.nombre.toUpperCase()}</h3>
        <button 
          className="btn-descubre" 
          onClick={handleVerDetalle}
          disabled={cargando}
        >
          {cargando ? "Cargando..." : "¡Descubre la extraescolar!"}
        </button>
      </div>
    </div>
  );
};

export default ActividadCard;