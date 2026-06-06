import React, { useState, useEffect } from 'react';
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faUserGraduate, faSearch, faAddressCard, faTimes, faEnvelope, faPhone, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import '../styles/global.css';

const VisualizarDocumentos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para el Modal
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inscripciones"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlumnos(docs);
    });
    return () => unsub();
  }, []);

  const abrirModal = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setAlumnoSeleccionado(null);
    setMostrarModal(false);
  };

  const filtrados = alumnos.filter(al => 
    al.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    al.boleta?.includes(busqueda)
  );

 return (
    <div className="admin-container animate-fade-in">
      {/* HEADER CORREGIDO PARA CENTRADO TOTAL */}
      <header className="admin-header-simple" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center',
          paddingTop: '100px' // Esto baja el título para que no choque con el menú
      }}>
        <h1 className="main-title" style={{ margin: '0 auto' }}>
            EXPEDIENTES C5
        </h1>
        <p className="subtitle-admin" style={{ margin: '10px 0 30px 0' }}>
            Visualización de Documentación Oficial
        </p>
        
        {/* El buscador ahora también heredará el centrado del padre */}
        <div className="search-box-expedientes glass-card" style={{ margin: '0 auto' }}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o boleta..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </header>
      <div className="expedientes-grid">
        {filtrados.map((alumno) => (
          <div key={alumno.id} className="expediente-card glass-card">
            <div className="card-top">
              <div className="avatar-circle">
                <FontAwesomeIcon icon={faUserGraduate} />
              </div>
              <div className="header-info">
                <h3>{alumno.nombre}</h3>
                <span className="folio-tag">{alumno.folio}</span>
              </div>
            </div>

            <div className="card-mid">
              <p><strong><FontAwesomeIcon icon={faAddressCard} /> Boleta:</strong> {alumno.boleta}</p>
              <p><strong>Actividad:</strong> {alumno.actividad}</p>
              <p><strong>Carrera:</strong> {alumno.carrera}</p>
            </div>

            <div className="card-bottom">
              <button className="btn-view-doc" onClick={() => abrirModal(alumno)}>
                <FontAwesomeIcon icon={faSearch} /> VER EXPEDIENTE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL DE DETALLES --- */}
      {mostrarModal && alumnoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content glass-card animate-pop-in" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={cerrarModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="modal-header">
              <FontAwesomeIcon icon={faUserGraduate} className="modal-avatar-icon" />
              <h2>{alumnoSeleccionado.nombre}</h2>
              <span className="modal-status-pill">{alumnoSeleccionado.estatus}</span>
            </div>

            <div className="modal-body-grid">
              <div className="modal-section">
                <h4><FontAwesomeIcon icon={faAddressCard} /> Académicos</h4>
                <p><strong>Boleta:</strong> {alumnoSeleccionado.boleta}</p>
                <p><strong>Carrera:</strong> {alumnoSeleccionado.carrera}</p>
                <p><strong>Semestre:</strong> {alumnoSeleccionado.semestre}</p>
                <p><strong>Promedio:</strong> {alumnoSeleccionado.promedio}</p>
              </div>

              <div className="modal-section">
                <h4><FontAwesomeIcon icon={faPhone} /> Contacto</h4>
                <p><strong>Email:</strong> {alumnoSeleccionado.correoInst}</p>
                <p><strong>Tel:</strong> {alumnoSeleccionado.telefono}</p>
                <p><strong>Emergencia:</strong> {alumnoSeleccionado.telefonoEmergencia}</p>
              </div>

              <div className="modal-section full-width">
                <h4><FontAwesomeIcon icon={faNotesMedical} /> Información de Salud</h4>
                <p><strong>Condición:</strong> {alumnoSeleccionado.condicionMedica}</p>
                {alumnoSeleccionado.limitaciones && (
                  <p className="medical-note"><strong>Notas:</strong> {alumnoSeleccionado.limitaciones}</p>
                )}
              </div>
            </div>

<div className="modal-footer">
  {alumnoSeleccionado.hojaInscripcion ? (
    <button 
      className="btn-dorado-brillante" 
      onClick={() => window.open(alumnoSeleccionado.hojaInscripcion, '_blank')}
    >
      <FontAwesomeIcon icon={faFilePdf} /> Ver Documento de Inscripcion
    </button>
  ) : (
    <p className="no-doc-msg">Documento no adjunto (Solo registro digital)</p>
  )}
</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarDocumentos;