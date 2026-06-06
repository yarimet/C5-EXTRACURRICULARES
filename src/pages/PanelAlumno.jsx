import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faClock, faCheckCircle, faPlusCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import "../styles/global.css";
import jsPDF from "jspdf";
import logoIPN from "../assets/logo-ipn.png"; 
import logoCecyt from "../assets/logo-cecyt.png";
import { db } from "../firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

const PanelAlumno = () => {
  const [inscripcion, setInscripcion] = useState(null);
  const [cargando, setCargando] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const sesion = localStorage.getItem("usuario_sesion");
        if (!sesion) {
          setCargando(false);
          return;
        }

        const usuarioActivo = JSON.parse(sesion);
        const correoABuscar = usuarioActivo.correoInst || usuarioActivo.correo || usuarioActivo.email;

        if (!correoABuscar) {
          setCargando(false);
          return;
        }

        const q = query(
          collection(db, "inscripciones"), 
          where("correoInst", "==", correoABuscar)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setInscripcion({ ...docSnap.data(), id: docSnap.id });
        }
      } catch (error) {
        console.error("Error crítico:", error);
      } finally {
        // Delay para que el burro luzca y la transición sea suave
        setTimeout(() => setCargando(false), 800);
      }
    };

    cargarDatos();
  }, []);

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "¡Buenos días!";
    if (hora < 19) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  const imprimirComprobante = async (datos) => {
    if (!datos) return;
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(img);
          img.onerror = (err) => reject(err);
        });
      };

      const imgIpn = await loadImage(logoIPN);
      const imgCecyt = await loadImage(logoCecyt);

      doc.setFillColor(108, 29, 69); 
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, 8, 26, 26, 3, 3, 'F'); 
      doc.roundedRect(pageWidth - 38, 8, 26, 26, 3, 3, 'F'); 
      doc.addImage(imgIpn, 'PNG', 15, 11, 20, 20);
      doc.addImage(imgCecyt, 'PNG', pageWidth - 35, 11, 20, 20);

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("INSTITUTO POLITÉCNICO NACIONAL", pageWidth / 2, 22, { align: "center" });
      doc.setFontSize(13);
      doc.text("CECyT 5 \"BENITO JUÁREZ\"", pageWidth / 2, 30, { align: "center" });
      
      doc.setTextColor(108, 29, 69);
      doc.setFontSize(15);
      doc.text("COMPROBANTE DE INSCRIPCIÓN", pageWidth / 2, 65, { align: "center" });
      doc.setDrawColor(108, 29, 69);
      doc.setLineWidth(0.5);
      doc.line(60, 68, pageWidth - 60, 68);

      const datosPdf = [
        { label: "Nombre:", value: datos.nombre },
        { label: "Actividad:", value: (datos.actividad && datos.actividad !== "Sin actividad") ? datos.actividad : "Actividad Registrada" },
        { label: "Folio:", value: datos.folio },
        { label: "Estatus:", value: "ACEPTADO" }
      ];

      datosPdf.forEach((dato, i) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(108, 29, 69);
        doc.text(dato.label, 30, 88 + (i * 12));
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(String(dato.value || ""), 75, 88 + (i * 12));
      });

      doc.setDrawColor(108, 29, 69);
      doc.setLineWidth(1);
      doc.rect(20, 150, pageWidth - 40, 25);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(108, 29, 69);
      doc.text("VALIDACIÓN ELECTRÓNICA EXITOSA", pageWidth / 2, 165, { align: "center" });

      doc.save(`Comprobante_${datos.folio}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  };

  return (
    <>
      {/* 1. Loader con el burro que creamos */}
      {cargando && <LoadingScreen visible={cargando} />}

      {/* 2. Contenido Real (Solo se monta si NO está cargando) */}
      {!cargando && (
        <div className="dashboard-container animate-fade-in">
          <div className="dashboard-content">
            
            <header className="welcome-header">
              <div className="user-profile-icon">
                <FontAwesomeIcon icon={faUserCircle} size="4x" />
              </div>
              <div className="welcome-text">
                <h1>{obtenerSaludo()}</h1>
                <p className="student-name-highlight">
                    {inscripcion?.nombre || "Estudiante Politécnico"}
                </p>
              </div>
            </header>

            {inscripcion ? (
              <div className="main-status-grid">
<div className="glass-card status-detail-card">
  <div className="card-header-modern">
    <FontAwesomeIcon 
      icon={
        inscripcion.estatus === "Aceptado" ? faCheckCircle : 
        inscripcion.estatus === "Rechazado" ? faPlusCircle : faClock
      } 
      className={`status-icon-main ${inscripcion.estatus.toLowerCase().replace(" ", "-")}`} 
    />
    <h3>Detalles de tu Registro</h3>
  </div>
  
  <div className="inscripcion-info-grid">
    {/* ... otros items ... */}
    
    <div className="info-item">
      <span>Estado:</span>
      <p className={`status-pill-modern ${
        inscripcion.estatus === "En revisión" ? "en-revision" : 
        inscripcion.estatus === "Rechazado" ? "rechazado" : "aceptado"
      }`}>
        {inscripcion.estatus}
      </p>
    </div>
    
    {/* ... resto de los items ... */}
  </div>

  <div className="action-footer">
    {inscripcion.estatus === "Aceptado" ? (
      <button className="btn-download-pdf" onClick={() => imprimirComprobante(inscripcion)}>
        <FontAwesomeIcon icon={faFileDownload} /> Descargar Comprobante Oficial
      </button>
    ) : inscripcion.estatus === "Rechazado" ? (
      <div className="rejected-notice">
        <p>Tu solicitud no pudo ser procesada. Por favor, acude a Gestión Escolar.</p>
        <button className="btn-retry-small" onClick={() => navigate("/actividades")}>
           Ver otras opciones
        </button>
      </div>
    ) : (
      <div className="pending-notice">
        <p>Tu documentación está siendo validada por Gestión Escolar.</p>
      </div>
    )}
  </div>
</div>
                {inscripcion.estatus === "Aceptado" && (
                  <div className="glass-card notice-card">
                    <h4>Avisos Importantes</h4>
                    <ul className="notice-list">
                      <li>Presenta tu comprobante impreso el primer día de actividad.</li>
                      <li>Mantén tu estatus de alumno regular.</li>
                      <li>Dudas: Acude a la oficina de Actividades Extracurriculares.</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-data-card glass-card">
                <FontAwesomeIcon icon={faPlusCircle} size="3x" className="empty-icon" />
                <h3>No se encontraron registros</h3>
                <p>Parece que aún no te has inscrito a ninguna actividad para este ciclo escolar.</p>
                <button className="btn-primary-action" onClick={() => navigate("/actividades")}>
                  Explorar Actividades Disponibles
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PanelAlumno;