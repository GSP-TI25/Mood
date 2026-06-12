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

  // 🌟 CONSTRUCCIÓN DEL SCHEMA MARKUP (JSON-LD) PARA GOOGLE JOBS
  const jobSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    // Limpiamos un poco la descripción y responsabilidades para que quede bien en el schema
    description: `
      <p>${job.description || ''}</p>
      ${job.responsibilities?.length ? `<h3>Responsabilidades:</h3><ul>${job.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
      ${job.requirements?.length ? `<h3>Requisitos:</h3><ul>${job.requirements.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
    `,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Mood',
      value: job.id,
    },
    // Trata de usar una fecha ISO real si viene de la DB. Si no, usamos la de hoy como fallback.
    datePosted: job.created_at || new Date().toISOString(),
    validThrough: '2026-12-31T00:00', // Puedes ajustar esto si la vacante expira
    // Mapeo básico de modalidad a los formatos que Google espera
    employmentType:
      job.type === 'Full-time'
        ? 'FULL_TIME'
        : job.type === 'Part-time'
          ? 'PART_TIME'
          : job.type === 'Freelance'
            ? 'CONTRACTOR'
            : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Mood',
      sameAs: 'https://www.mood.pe/',
      logo: 'https://www.mood.pe/Logo_Mood.svg', // Ajustar si el path de tu logo es distinto en prod
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        // Mapeo básico del país
        addressCountry:
          job.country === 'Peru' || job.country === 'Perú' ? 'PE' : 'CO',
      },
    },
  };

  return (
    <main className='job-detail-layout'>
      {/* 🌟 INYECTAMOS EL SCHEMA EN EL DOM DE FORMA INVISIBLE */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

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
                <Calendar size={14} /> Fecha Publicación: {job.date}
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
