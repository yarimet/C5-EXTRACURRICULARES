import React from 'react';
import '../styles/global.css';
import burroLogo from '../assets/burro-ipn.png';

const LoadingScreen = ({ visible }) => {
  return (
    <div className={`loader-overlay ${!visible ? "fade-out" : ""}`}>
      <div className="burro-loader-container">
        <img
          src={burroLogo}
          alt="Cargando..."
          className="burro-spinner"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;