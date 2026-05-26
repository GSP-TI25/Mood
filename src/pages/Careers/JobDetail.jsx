import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, Calendar, ArrowLeft, Send, MapPin } from 'lucide-react';
import './JobDetail.scss';

const JobDetail = () => {
  const { jobId } = useParams(); // Extrae el ID de la URL
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // CONEXIÓN AL BACKEND: Cargamos los detalles completos
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        } else {
          setError(true);
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

  // Pantalla de carga (Estilo Shadcn Skeleton/Loader)
  if (isLoading) {
    return (
      <main className='job-detail-layout'>
        <div className='job-detail-loading'>
          <div className='spinner'></div>
          <p>Cargando información de la vacante...</p>
        </div>
      </main>
    );
  }

  // Si no se encuentra el trabajo o hay error
  if (error || !job) {
    return (
      <main className='job-detail-layout'>
        <div className='job-detail-error'>
          <h2>Vacante no encontrada o inactiva</h2>
          <p>
            Es posible que esta posición ya haya sido cubierta o el enlace sea
            incorrecto.
          </p>
          <Link
            to='/trabaja_con_nosotros'
            className='job-detail-error__btn'
          >
            Ver vacantes disponibles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='job-detail-layout'>
      <div className='job-detail-wrapper'>
        {/* Botón Volver (Estilo Ghost Button Shadcn) */}
        <Link
          to='/trabaja_con_nosotros'
          className='job-detail__back-link'
        >
          <ArrowLeft size={16} /> Volver a posiciones
        </Link>

        {/* Tarjeta Principal de Contenido */}
        <article className='job-detail-card'>
          <header className='job-detail-card__header'>
            <h1 className='job-detail-card__title'>{job.title}</h1>

            <div className='job-detail-card__badges'>
              <span className='job-badge'>
                <Briefcase size={14} /> {job.type}
              </span>
              <span className='job-badge'>
                <MapPin size={14} /> {job.country}
              </span>
              <span className='job-badge job-badge--secondary'>
                <Calendar size={14} /> Ingreso: {job.date}
              </span>
            </div>
          </header>

          <div className='job-detail-card__content'>
            {job.description && (
              <section className='content-section'>
                <h2>Acerca del rol</h2>
                <p>{job.description}</p>
              </section>
            )}

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className='content-section'>
                <h2>¿Qué harás?</h2>
                <ul className='custom-list'>
                  {job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <section className='content-section'>
                <h2>¿Qué buscamos?</h2>
                <ul className='custom-list'>
                  {job.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <section className='content-section'>
                <h2>Beneficios Mood</h2>
                <ul className='custom-list'>
                  {job.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <footer className='job-detail-card__footer'>
            <div className='footer-content'>
              <div>
                <h3>¿Listo para unirte al equipo?</h3>
                <p>Completa el formulario y cuéntanos sobre ti.</p>
              </div>
              {/* 🌟 CAMBIO: Redirigimos a la nueva página de postulación */}
              <Link
                to={`/trabaja_con_nosotros/${job.id}/postular`}
                className='btn-apply'
              >
                Completar formulario <Send size={16} />
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
};

export default JobDetail;
