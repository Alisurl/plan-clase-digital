import React from 'react';
import HeaderClase from './components/HeaderClase';
import ObjetivosCard from './components/ObjetivosCard';
import ListaActividades from './components/ListaActividades';
import EvaluacionForm from './components/EvaluacionForm';
import './App.css';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
      <HeaderClase />
      
      <main style={{ flex: 1, padding: '0 16px' }}>
        <ObjetivosCard />
        <ListaActividades />
        <EvaluacionForm />
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          marginTop: '40px',
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0 }}>
          Plan de Clase Digital Interactivo — Tercero Básico (TIC) • Universidad Rafael Landívar 2026
        </p>
      </footer>
    </div>
  );
}

export default App;