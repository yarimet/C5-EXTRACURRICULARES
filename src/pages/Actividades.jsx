  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import ActividadCard from '../components/ActividadCard';
  import '../styles/global.css';
  import imgVoleibol from '../assets/voleibol.jpg';
  import imgTaeKwonDo from '../assets/TAE KWON DO.jpg';
  import imgFutbol from '../assets/FÚTBOL SOCCER.webp';
  import imgDanza from '../assets/DANZA FOLKLÓRICA.jpg';
  import imgTeatro from '../assets/TEATRO.jpg';
  import imgCreacion from '../assets/CREACIÓN LITERARIA.jpg';
  import imgMusica from '../assets/MÚSICA.jpg';
  import imgBaloncesto from '../assets/BALONCESTO.jpg';

  const Actividades = ({ sesionIniciada }) => {
    const navigate = useNavigate();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tallerSeleccionado, setTallerSeleccionado] = useState("");

    
   const handleInscribir = () => {
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario_sesion"));
  const datosDeLaActividad = listaActividades.find(a => a.nombre === tallerSeleccionado);

  if (datosDeLaActividad) {
    navigate("/formulario", { 
      state: { 
        actividad: datosDeLaActividad,
        usuario: usuarioLogueado 
      } 
    });
  
  } else {
    console.error("No se encontró la actividad seleccionada");
  }
};

    const listaActividades = [
      { nombre: "Voleibol", imagen: imgVoleibol, profesor: "Aarón Oliva Maheda", horario: "Lu, Mi, Vi: 10:00-13:00 / 15:00-16:00", lugar: "Canchas", cupo: "20", descripcion: "Desarrolla habilidades en la cancha." },
      { nombre: "Tae Kwon Do", imagen: imgTaeKwonDo, profesor: "Juan Carlos Rubio G.", horario: "Lu, Mi, Vi: 11:00-13:00 / 14:00-16:00", lugar: "Salón de Usos Múltiples", cupo: "15", descripcion: "Disciplina y defensa personal." },
      { nombre: "Fútbol Soccer", imagen: imgFutbol, profesor: "Pendiente", horario: "Ma, Ju, Vi: 12:00-14:00 / 14:00-16:00", lugar: "Canchas", cupo: "30", descripcion: "Táctica y condición física." },
      { nombre: "Danza Folklórica", imagen: imgDanza, profesor: "María de Lourdes Nambo", horario: "Lu, Ma, Mi, Vi: 12:00 - 15:00", lugar: "Auditorio", cupo: "25", descripcion: "Expresa nuestra cultura." },
      { nombre: "Teatro", imagen: imgTeatro, profesor: "Antonio Núñez Toledo", horario: "Jueves: 13:00 - 15:00", lugar: "Auditorio", cupo: "20", descripcion: "Pierde el miedo escénico." },
      { nombre: "Creación Literaria", imagen: imgCreacion, profesor: "Luis Fernando Ramírez L.", horario: "Miércoles y Viernes: 12:00 - 15:00", lugar: "Anexo de Biblioteca", cupo: "15", descripcion: "Taller para jóvenes escritores." },
      { nombre: "Música", imagen: imgMusica, profesor: "Por definir", horario: "Jueves: 14:00-15:00 / Viernes: 14:00-15:00", lugar: "Auditorio CECyT 5", cupo: "Ilimitado", descripcion: "Taller de orquesta, piano, guitarra y canto." },
      { nombre: "Baloncesto", imagen: imgBaloncesto, profesor: "Por definir", horario: "Ma, Ju: 15:00-17:00", lugar: "Canchas", cupo: "20", descripcion: "Entrenamiento táctico y físico." }
    ];

    const abrirConfirmacion = (nombre) => {
      setTallerSeleccionado(nombre);
      setMostrarModal(true);
    };

    return (
  <div className="home-container">
    {}
    <h1 className="titulo-actividades-page">Actividades disponibles</h1>
        
        <div className="cards-grid">
          {listaActividades.map((act, index) => (
            <ActividadCard 
              key={index}
              {...act} 
              estado="Abierto"
              sesionIniciada={sesionIniciada}
              onInscribir={abrirConfirmacion}
            />
          ))}
        </div>
      </div>
    );
  };

  export default Actividades;