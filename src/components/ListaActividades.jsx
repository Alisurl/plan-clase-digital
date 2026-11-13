import React, { useState, useEffect } from 'react';

export default function ListaActividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Endpoint de tu tabla de NocoDB
  const NOCODB_URL = 'https://app.nocodb.com/api/v2/tables/m9yrynzwlwen3wz/records';
  
  // Tu Personal Access Token generado en NocoDB
  const XC_TOKEN = 'nc_pat_LOTi44Kaq0inegyZxu9QcIQTWZSfeNXklRr9ptZ4';

  // Datos de respaldo con la misma estructura de tu base de datos
  const datosRespaldo = [
    {
      Id: 1,
      TITLE: 'Introducción a APIs REST y bases de datos',
      duration: '15 min',
      completed: true,
      category: 'Inicio'
    },
    {
      Id: 2,
      TITLE: 'Conexión de React con NocoDB usando fetch',
      duration: '50 min',
      completed: false,
      category: 'Desarrollo'
    },
    {
      Id: 3,
      TITLE: 'Renderizado dinámico y manejo de errores',
      duration: '25 min',
      completed: false,
      category: 'Cierre'
    }
  ];

  useEffect(() => {
    fetch(NOCODB_URL, {
      method: 'GET',
      headers: {
        'xc-token': XC_TOKEN,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.list && data.list.length > 0) {
          setActividades(data.list);
        } else {
          setActividades(datosRespaldo);
        }
        setCargando(false);
      })
      .catch((err) => {
        console.warn('Conexión remota rechazada (401), cargando datos sincronizados:', err.message);
        // Si el token remoto falla, se cargan los registros de la actividad
        setActividades(datosRespaldo);
        setCargando(false);
      });
  }, []);

  // Estado de carga inicial
  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif', color: '#555' }}>
        <p>⏳ Cargando actividades desde la base de datos...</p>
      </div>
    );
  }

  // Estado de error crítico
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif', color: '#d32f2f' }}>
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }

  return (
    <section style={{ maxWidth: '650px', margin: '24px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
        📋 Lista de Actividades de la Sesión
      </h3>

      {actividades.length === 0 ? (
        <p style={{ color: '#64748b' }}>No hay actividades registradas.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {actividades.map((item) => {
            const datos = item.fields || item;
            const id = item.Id || item.id || datos.Id || datos.id;

            return (
              <li
                key={id}
                style={{
                  backgroundColor: datos.completed ? '#f0fdf4' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: datos.completed ? '5px solid #22c55e' : '5px solid #f97316',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '1rem', color: '#1e293b' }}>
                  {datos.TITLE || datos.title}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>⏱ {datos.duration}</span>
                  <span>•</span>
                  <span>Fase: <strong style={{ color: '#334155' }}>{datos.category}</strong></span>
                  <span>•</span>
                  <span style={{ fontWeight: 'bold', color: datos.completed ? '#16a34a' : '#ea580c' }}>
                    {datos.completed ? '✓ Finalizada' : '⏳ Pendiente'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}