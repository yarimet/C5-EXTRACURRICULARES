import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/global.css";
import { db } from "../firebaseConfig"; 
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const CustomSelect = ({ name, options, value, onChange, label }) => (
  <div className="custom-select-wrapper">
    <select name={name} value={value} onChange={onChange} className="hidden-select" required>
      <option value="">{label}</option>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <div className="custom-select-trigger">{value || label}</div>
  </div>
);

const FormularioInscripcion = () => {
  const { state } = useLocation();
  const actividad = state?.actividad; 
  const usuario = state?.usuario;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [folioGenerado, setFolioGenerado] = useState("");
const cuposLlenos = true; 


<button 
  type="submit" 
  className={`form-button ${cuposLlenos ? "btn-lleno" : ""}`} 
  disabled={loading || cuposLlenos}
>
  {loading 
    ? "Validando..." 
    : cuposLlenos 
      ? "Lugares llenos" 
      : "Enviar inscripción"}
</button>
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "",
    boleta: usuario?.identificador || "",
    correoInst: usuario?.correo || "",
    edad: "", genero: "", carrera: "", 
    semestre: "", correoPersonal: "", 
    telefono: "", telefonoEmergencia: "", turno: "", promedio: "",
    nivelExperiencia: "", posicion: "", altura: "", mano: "", 
    condicionMedica: "", limitaciones: "", hojaInscripcion: null
  });

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario_sesion"));
    if (usuarioGuardado) {
      setFormData(prev => ({
        ...prev,
        nombre: usuarioGuardado.nombre,
        correoInst: usuarioGuardado.correo || usuarioGuardado.correoInst,
        boleta: usuarioGuardado.identificador
      }));
    }
  }, []);

  const deportes = ["Voleibol", "Fútbol Soccer", "Baloncesto", "Tae Kwon Do"];
  const esDeporte = deportes.includes(actividad?.nombre);

  const handleChange = (e) => {
  const { name, files } = e.target;

  if (name === "hojaInscripcion") {
    const archivo = files[0];
    
    const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

    if (archivo && tiposPermitidos.includes(archivo.type)) {
      setFormData({ ...formData, [name]: archivo });
    } else {
      alert("⚠️ Tipo de archivo no permitido. Solo se aceptan PDF, JPG o PNG.");
      e.target.value = ""; 
      setFormData({ ...formData, [name]: null }); 
    }
  } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const q = query(collection(db, "inscripciones"), where("correoInst", "==", formData.correoInst));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("⚠️ Ya cuentas con una inscripción registrada.");
        setLoading(false);
        return;
      }

      let urlArchivo = null;
      const archivoReal = formData.hojaInscripcion;

      if (archivoReal && archivoReal instanceof File) {
        const dataCloudinary = new FormData();
        dataCloudinary.append("file", archivoReal);
        dataCloudinary.append("upload_preset", "presets_C5"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/drvcq0vne/image/upload", {
          method: "POST",
          body: dataCloudinary,
        });

        if (res.ok) {
          const fileData = await res.json();
          urlArchivo = fileData.secure_url; 
        } else {
          throw new Error("Error al subir a Cloudinary");
        }
      }

      const nuevoFolio = "IPN-" + Math.floor(Math.random() * 100000);
      const datosInscripcion = {
        ...formData, 
        hojaInscripcion: urlArchivo, 
        actividad: actividad?.nombre || "Sin actividad",
        estatus: "En revisión", 
        folio: nuevoFolio,
        fecha: new Date().toISOString()
      };

      await addDoc(collection(db, "inscripciones"), datosInscripcion);

      navigate("/panel-alumno"); 

    } catch (error) {
      console.error("Error completo:", error);
      alert("Error al procesar la inscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-card">
        {!enviado ? (
          <>
            <h2 className="form-title">Inscripción a {actividad?.nombre}</h2>
            <form onSubmit={handleSubmit} className="form-grid">
              <h3 className="form-section">Datos personales</h3>
              <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required />
              <input name="boleta" placeholder="Boleta" value={formData.boleta} onChange={handleChange} required />
              {}
<input 
  type="number" 
  name="edad" 
  placeholder="Edad (15-21)" 
  value={formData.edad} 
  onChange={handleChange} 
  min="15" 
  max="21" 
  required 
/>
              <CustomSelect name="genero" label="Género" options={["Hombre", "Mujer"]} value={formData.genero} onChange={handleChange} />
              <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
              <input name="telefonoEmergencia" placeholder="Teléfono de emergencia" value={formData.telefonoEmergencia} onChange={handleChange} />
              <input name="correoInst" placeholder="Correo institucional" value={formData.correoInst} onChange={handleChange} readOnly />
              <input name="correoPersonal" placeholder="Correo personal" value={formData.correoPersonal} onChange={handleChange} />

              <h3 className="form-section">Datos escolares</h3>
              <CustomSelect name="carrera" label="Carrera" options={["Contaduría", "Informática", "Comercio Internacional", "Tronco común"]} value={formData.carrera} onChange={handleChange} />
              <input name="semestre" placeholder="Grupo" value={formData.semestre} onChange={handleChange} />
              <CustomSelect name="turno" label="Turno" options={["Matutino", "Vespertino"]} value={formData.turno} onChange={handleChange} />
             {}
<input 
  type="number" 
  step="0.1" 
  name="promedio" 
  placeholder="Promedio (6.0 - 10.0)" 
  value={formData.promedio} 
  onChange={handleChange} 
  min="6.0" 
  max="10.0" 
  required 
/>
              <h3 className="form-section">Documentación</h3>
              <div className="file-upload-container">
                <label style={{ color: '#666', fontSize: '0.8rem' }}>Sube tu Hoja de Inscripción:</label>
                <input type="file" name="hojaInscripcion" onChange={handleChange} accept=".pdf,.jpg,.png" required className="file-input" />
              </div>

              <h3 className="form-section">Información de desempeño</h3>
              <CustomSelect name="nivelExperiencia" label="Nivel" options={["Principiante", "Intermedio", "Avanzado"]} value={formData.nivelExperiencia} onChange={handleChange} />
              
              {esDeporte && (
                <>
                  <input name="posicion" placeholder="Posición" value={formData.posicion} onChange={handleChange} />
                  <input name="altura" placeholder="Altura (cm)" value={formData.altura} onChange={handleChange} />
                  <CustomSelect name="mano" label="Mano dominante" options={["Derecha", "Izquierda"]} value={formData.mano} onChange={handleChange} />
                </>
              )}

              <h3 className="form-section">Salud</h3>
              <CustomSelect name="condicionMedica" label="¿Sufre de alguna condición médica?" options={["Sí", "No"]} value={formData.condicionMedica} onChange={handleChange} />
              {formData.condicionMedica === "Sí" && (
                <textarea name="limitaciones" placeholder="Especifique su condición..." className="textarea" value={formData.limitaciones} onChange={handleChange} required />
              )}

              <button type="submit" className="form-button" disabled={loading}>
                {loading ? "Validando..." : "Enviar inscripción"}
              </button>
            </form>
          </>
        ) : (
          <div className="success-content" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="status-header">
              <div style={{ fontSize: '60px', color: '#4caf50', marginBottom: '20px' }}>✓</div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>¡Solicitud Recibida!</h1>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '30px' }}>
                Tu inscripción ha sido registrada exitosamente.
              </p>
            </div>
            
            <div className="data-summary" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
              <div className="data-item" style={{ marginBottom: '10px' }}>
                <span>Actividad:</span> <strong style={{ color: '#6c1d45' }}>{actividad?.nombre}</strong>
              </div>
              <div className="data-item" style={{ marginBottom: '10px' }}>
                <span>Folio:</span> <strong style={{ color: '#6c1d45' }}>{folioGenerado}</strong>
              </div>
              <div className="data-item">
                <span>Estatus:</span> <strong style={{ color: '#ff9800' }}>En revisión</strong>
              </div>
            </div>

            <button className="btn-primary-action" onClick={() => navigate("/panel-alumno")}>
              Ir a mi panel de alumno
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioInscripcion;