import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen'; 
import '../styles/global.css';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

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