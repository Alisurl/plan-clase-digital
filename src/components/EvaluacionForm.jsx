import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EvaluacionForm() {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [comentarioForo, setComentarioForo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState(null);
  const [participaciones, setParticipaciones] = useState([]);

  // URL de tu tabla PlanClaseDigital y Token activo en NocoDB
  const NOCODB_URL = 'https://app.nocodb.com/api/v2/tables/m9649gmmamejwa9/records';
  const XC_TOKEN = 'nc_pat_qdLhWizjk9UlqZg0kgJtk3ocf8Muuorjrrn7JUbX';

  const cargarParticipaciones = async () => {
    try {
      const res = await fetch(NOCODB_URL, {
        method: 'GET',
        headers: {
          'xc-token': XC_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const data = await res.json();
      if (data.list) {
        const filtrados = data.list.filter((item) => {
          const campos = item.fields || item;
          return campos.category === 'Foro';
        });
        setParticipaciones(filtrados);
      }
    } catch (err) {
      console.warn('No se pudieron cargar las participaciones remotas:', err.message);
    }
  };

  useEffect(() => {
    cargarParticipaciones();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombreEstudiante.trim() || !comentarioForo.trim()) {
      setMensajeFeedback({
        tipo: 'error',
        texto: 'Por favor escribe tu nombre y tu comentario para participar en el foro.',
      });
      return;
    }

    setEnviando(true);
    setMensajeFeedback(null);

    const textoPublicacion = `${nombreEstudiante.trim()}: "${comentarioForo.trim()}"`;

    const nuevoRegistro = {
      TITLE: textoPublicacion,
      duration: '5 min',
      completed: true,
      category: 'Foro',
    };

    try {
      const res = await fetch(NOCODB_URL, {
        method: 'POST',
        headers: {
          'xc-token': XC_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoRegistro),
      });

      if (!res.ok) {
        throw new Error(`Error al guardar en NocoDB (${res.status})`);
      }

      setMensajeFeedback({
        tipo: 'exito',
        texto: `¡Gracias por tu aporte, ${nombreEstudiante}! Tu comentario ya se publicó en el foro.`,
      });

      setNombreEstudiante('');
      setComentarioForo('');
      cargarParticipaciones();
    } catch (err) {
      setParticipaciones((prev) => [
        ...prev,
        { Id: Date.now(), ...nuevoRegistro },
      ]);
      setMensajeFeedback({
        tipo: 'aviso',
        texto: `Comentario publicado en sesión local (${err.message}).`,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: '650px',
        margin: '32px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h3 style={{ color: '#0f172a', marginTop: 0 }}>
        💬 Foro de Participación — Tercero Básico (TIC)
      </h3>
      <p style={{ color: '#475569', fontSize: '0.95rem' }}>
        Comparte tu opinión, duda o conclusión sobre el tema de la clase:
      </p>

      <form
        onSubmit={manejarEnvio}
        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <div>
          <label
            htmlFor="nombre-alumno"
            style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}
          >
            Nombre del estudiante:
          </label>
          <input
            id="nombre-alumno"
            type="text"
            placeholder="Ej. María José López"
            value={nombreEstudiante}
            onChange={(e) => setNombreEstudiante(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #94a3b8',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="comentario-foro"
            style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}
          >
            Tu comentario o aporte:
          </label>
          <textarea
            id="comentario-foro"
            rows="3"
            placeholder="Escribe aquí lo que aprendiste hoy o tu aporte para la clase..."
            value={comentarioForo}
            onChange={(e) => setComentarioForo(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #94a3b8',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <motion.button
          type="submit"
          disabled={enviando}
          whileHover={{ scale: enviando ? 1 : 1.02 }}
          whileTap={{ scale: enviando ? 1 : 0.98 }}
          style={{
            padding: '12px',
            backgroundColor: enviando ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: enviando ? 'not-allowed' : 'pointer',
          }}
        >
          {enviando ? 'Publicando en el foro...' : 'Publicar Comentario'}
        </motion.button>
      </form>

      {mensajeFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor:
              mensajeFeedback.tipo === 'exito'
                ? '#dcfce7'
                : mensajeFeedback.tipo === 'error'
                ? '#fee2e2'
                : '#fef9c3',
            color: '#1e293b',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          {mensajeFeedback.texto}
        </motion.div>
      )}

      <div style={{ marginTop: '24px' }}>
        <h4 style={{ color: '#334155', marginBottom: '10px' }}>
          💭 Comentarios publicados ({participaciones.length})
        </h4>
        {participaciones.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Aún no hay comentarios en el foro. ¡Sé el primero en participar!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {participaciones.map((item) => {
              const datos = item.fields || item;
              const id = item.Id || item.id || datos.Id;
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2563eb',
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    marginBottom: '10px',
                    fontSize: '0.92rem',
                    color: '#1e293b',
                  }}
                >
                  {datos.TITLE || datos.title}
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.section>
  );
}