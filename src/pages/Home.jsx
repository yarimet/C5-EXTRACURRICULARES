import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen'; // Asegúrate de que la ruta sea correcta
import '../styles/global.css';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // El burro aparecerá por 1.5 segundos antes de mostrar el C5
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Mientras loading sea true, se muestra el burro animado
  if (loading) {
    return <LoadingScreen />;
  }

  // Una vez que termina de cargar, se muestra tu tarjeta de Home
  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="main-title">C5</h1>
        
        <h2 className="italic-subtitle">
          Sistema de Actividades Extracurriculares
        </h2>
        
        <div className="accent-line"></div>

        <p className="description-text">
          Control, seguimiento de talleres y deportes <br />
          <span style={{ fontSize: "10px", letterSpacing: "2px", opacity: 0.6 }}>
            GESTIÓN ACADÉMICA
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;