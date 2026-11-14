import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EvaluacionForm() {
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState(null);
  const [participaciones, setParticipaciones] = useState([]);

  // REEMPLAZA ESTA LÍNEA CON TU URL EXACTA DE LA LÍNEA 9 DE ListaActividades.jsx
  const NOCODB_URL = 'https://app.nocodb.com/api/v2/tables/m9yrynzwlwen3w.../records';
  const XC_TOKEN = 'nc_pat_LOTi44Kaq0inegyZxu9QcIQTWZSfeNXklRr9ptZ4';

  const cargarEvaluaciones = async () => {
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
          return campos.category === 'Evaluación';
        });
        setParticipaciones(filtrados);
      }
    } catch (err) {
      console.warn('No se pudieron cargar las participaciones remotas:', err.message);
    }
  };

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombreEstudiante.trim() || !respuestaSeleccionada) {
      setMensajeFeedback({
        tipo: 'error',
        texto: 'Por favor escribe tu nombre y selecciona una respuesta.',
      });
      return;
    }

    setEnviando(true);
    setMensajeFeedback(null);

    const esCorrecta = respuestaSeleccionada === 'POST';
    const resultadoTexto = esCorrecta
      ? `${nombreEstudiante.trim()} — Respuesta: POST (¡Correcto! 100 pts)`
      : `${nombreEstudiante.trim()} — Respuesta: ${respuestaSeleccionada} (Revisar concepto)`;

    const nuevoRegistro = {
      TITLE: resultadoTexto,
      duration: '5 min',
      completed: esCorrecta,
      category: 'Evaluación',
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
        tipo: esCorrecta ? 'exito' : 'aviso',
        texto: esCorrecta
          ? `¡Excelente trabajo, ${nombreEstudiante}! Tu respuesta correcta se guardó en la nube.`
          : `Registro guardado, ${nombreEstudiante}. Recuerda: para crear registros nuevos en una API REST usamos el método POST.`,
      });

      setNombreEstudiante('');
      setRespuestaSeleccionada('');
      cargarEvaluaciones();
    } catch (err) {
      setParticipaciones((prev) => [
        ...prev,
        { Id: Date.now(), ...nuevoRegistro },
      ]);
      setMensajeFeedback({
        tipo: 'aviso',
        texto: `Respuesta registrada en sesión local (${err.message}).`,
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
        📝 Evaluación Rápida — Tercero Básico (TIC)
      </h3>
      <p style={{ color: '#475569', fontSize: '0.95rem' }}>
        Comprueba lo aprendido sobre bases de datos en la nube y envía tu resultado a NocoDB:
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
            Nombre completo del estudiante:
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
            htmlFor="pregunta-tic"
            style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#1e293b' }}
          >
            Pregunta: ¿Qué método HTTP se utiliza en fetch() para guardar un nuevo registro en NocoDB?
          </label>
          <select
            id="pregunta-tic"
            value={respuestaSeleccionada}
            onChange={(e) => setRespuestaSeleccionada(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">-- Selecciona una opción --</option>
            <option value="GET">GET (Solo consultar datos)</option>
            <option value="POST">POST (Crear y enviar datos nuevos)</option>
            <option value="DELETE">DELETE (Eliminar registros)</option>
          </select>
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
          {enviando ? 'Guardando en NocoDB...' : 'Enviar Evaluación'}
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
          ✅ Registros recibidos en NocoDB ({participaciones.length})
        </h4>
        {participaciones.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Aún no hay evaluaciones enviadas. ¡Sé el primero en probar el formulario!
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
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '8px',
                    fontSize: '0.9rem',
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