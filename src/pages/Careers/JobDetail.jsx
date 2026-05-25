import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Calendar, ArrowLeft, Send } from 'lucide-react';
import './JobDetail.scss';

const JobDetail = () => {
  const { jobId } = useParams(); // Extrae el ID de la URL
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // 🌟 CONEXIÓN AL BACKEND: Cargamos los detalles completos desde PostgreSQL
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          setError(true); // Si el backend responde 404 (no encontrado)
        }
      } catch (error) {
        console.error('Error al cargar los detalles del puesto:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Pantalla de carga mientras React habla con la base de datos
  if (isLoading) {
    return (
      <main className='job-detail-page'>
        <div
          className='job-detail__container'
          style={{ textAlign: 'center', padding: '100px 0' }}
        >
          <h2>Cargando información de la vacante...</h2>
        </div>
      </main>
    );
  }

  // Si alguien escribe una URL incorrecta o el trabajo fue borrado
  if (error || !job) {
    return (
      <div
        className='job-detail-not-found'
        style={{ textAlign: 'center', padding: '100px 0' }}
      >
        <h2>Vacante no encontrada o inactiva</h2>
        <Link
          to='/trabaja_con_nosotros'
          style={{ color: '#73f440', fontWeight: 'bold' }}
        >
          Volver a posiciones
        </Link>
      </div>
    );
  }

  return (
    <main className='job-detail-page'>
      <div className='job-detail__container'>
        {/* Botón Volver */}
        <Link
          to='/trabaja_con_nosotros'
          className='job-detail__back'
        >
          <ArrowLeft size={20} /> Volver a posiciones
        </Link>

        {/* Cabecera (Viene de la tabla 'jobs') */}
        <header className='job-detail__header'>
          <h1 className='job-detail__title'>{job.title}</h1>
          <div className='job-detail__meta'>
            <span className='job-detail__tag'>
              <Briefcase size={18} /> {job.type}
            </span>
            <span className='job-detail__tag'>
              <Calendar size={18} /> {job.date}
            </span>
          </div>
        </header>

        {/* Contenido Completo (Viene de la tabla 'job_details') */}
        <div className='job-detail__content'>
          {job.description && (
            <section className='job-detail__section'>
              <h3>Descripción</h3>
              <p>{job.description}</p>
            </section>
          )}

          {/* Renderizado condicional para arrays que vienen de PostgreSQL */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className='job-detail__section'>
              <h3>Responsabilidades / Funcionalidades</h3>
              <ul>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section className='job-detail__section'>
              <h3>Requisitos</h3>
              <ul>
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <section className='job-detail__section'>
              <h3>Beneficios</h3>
              <ul>
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Botón de Postulación */}
        <div className='job-detail__action'>
          <a
            href={`mailto:rrhh@mood.pe?subject=Postulación: ${job.title}`}
            className='job-detail__apply-btn'
          >
            Postular a esta posición <Send size={18} />
          </a>
        </div>
      </div>
    </main>
  );
};

export default JobDetail;
