import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faTrashAlt, faUserGraduate, faSearch } from '@fortawesome/free-solid-svg-icons';
import { db } from "../firebaseConfig";
import { collection, getDocs, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; 

import '../styles/global.css'; 

const PanelAdmin = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const obtenerAlumnos = async () => {
    try {
      const q = query(collection(db, "inscripciones"));
      const querySnapshot = await getDocs(q);
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nombre: doc.data().nombre || "Sin nombre",
        boleta: doc.data().boleta || doc.data().identificador || "",
        estatus: doc.data().estatus || "En revisión"
      }));
      setAlumnos(lista);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setTimeout(() => setCargando(false), 500);
    }
  };

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  const alumnosFiltrados = alumnos.filter(alumno => 
    alumno.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    alumno.boleta.includes(busqueda)
  );

  const actualizarEstatus = async (id, nuevoEstatus) => {
    try {
      const alumnoRef = doc(db, "inscripciones", id);
      await updateDoc(alumnoRef, { estatus: nuevoEstatus });
      
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Estatus actualizado: ${nuevoEstatus}`,
        showConfirmButton: false,
        timer: 1500,
        background: '#1a1a1a',
        color: '#fff'
      });

      obtenerAlumnos();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const eliminarAlumno = async (id) => {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c1d45', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1a1a1a', 
      color: '#fff'       
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "inscripciones", id));
          Swal.fire({
            title: '¡Eliminado!',
            icon: 'success',
            background: '#1a1a1a',
            color: '#fff',
            timer: 1000,
            showConfirmButton: false
          });
          obtenerAlumnos();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    });
  };

  return (
    <div className="admin-page-root animate-fade-in">
      <header className="admin-header">
        <FontAwesomeIcon icon={faUserGraduate} className="header-icon" />
        <h1 className="main-title">Control de Inscripciones</h1>
        <p className="italic-subtitle">Gestión Escolar - C5</p>
        
        <div className="search-bar-container glass-card">
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o boleta..." 
              className="modern-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="admin-table-wrapper glass-card">
        <table className="admin-view-table">
          <thead>
            <tr>
              <th>Nombre del Alumno</th>
              <th>Boleta</th>
              <th>Estado Actual</th>
              <th className="text-center">GESTIÓN</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.length > 0 ? (
              alumnosFiltrados.map((alumno) => (
                <tr key={alumno.id} className="admin-data-row">
                  <td className="font-bold">{alumno.nombre}</td>
                  <td className="text-secondary">{alumno.boleta}</td>
                  <td>
                    <span className={`status-pill admin-pill ${alumno.estatus.toLowerCase().replace(/\s+/g, '-')}`}>
                      {alumno.estatus}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="admin-actions-flex">
                      <button className="action-btn btn-accept" onClick={() => actualizarEstatus(alumno.id, "Aceptado")}>
                        <FontAwesomeIcon icon={faCheck} /> <span>ACEPTAR</span>
                      </button>
                      <button className="action-btn btn-reject" onClick={() => actualizarEstatus(alumno.id, "Rechazado")}>
                        <FontAwesomeIcon icon={faTimes} /> <span>RECHAZAR</span>
                      </button>
                      <button className="btn-circular btn-delete" onClick={() => eliminarAlumno(alumno.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  {cargando ? "Cargando alumnos..." : "No hay alumnos registrados con ese nombre."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelAdmin;