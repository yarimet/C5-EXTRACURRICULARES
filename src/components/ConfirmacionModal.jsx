import React from 'react';
import '../styles/global.css';

const ConfirmacionModal = ({ actividad, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h2 className="activity-title" style={{ color: '#ffd700' }}>¡Casi listo!</h2>
        <p className="description-text">
          Estás por inscribirte al taller de: <br />
          <strong>{actividad.nombre}</strong>
        </p>
        <p className="activity-info" style={{ fontSize: '12px' }}>
          Se registrará tu número de boleta para el profesor {actividad.profesor}.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button className="login-button" onClick={onConfirm}>Confirmar</button>
          <button 
            className="login-button" 
            style={{ background: 'transparent', border: '1px solid white' }} 
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;