import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, ChevronRight, MapPin } from 'lucide-react';
import './CareersJobs.scss';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CareersJobs = () => {
  const { t } = useTranslation();
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 CONEXIÓN AL BACKEND: Cargamos los puestos reales desde PostgreSQL
  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/jobs`);
        if (response.ok) {
          const data = await response.json();
          // Filtramos primero para asegurarnos de mostrar SOLO las vacantes "Activas"
          const activeJobs = data.filter((job) => job.is_active === true);
          setJobsList(activeJobs);
        }
      } catch (error) {
        console.error('Error al cargar las vacantes públicas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicJobs();
  }, []);

  /* 🔥 EL FILTRO SECRETO MULTI-PAÍS: 
     Por el momento, filtramos para que en pantalla SOLO aparezca Perú. */
  const visibleJobs = jobsList.filter(
    (job) => job.country === 'Peru' || job.country === 'Perú',
  );

  return (
    <section className='careers-jobs'>
      <div className='careers-jobs__container'>
        <h2 className='careers-jobs__title'>{t('careers.jobs.title')}</h2>

        <div className='careers-jobs__grid'>
          {isLoading ? (
            <div className='careers-jobs__empty-state'>
              <p>Cargando vacantes disponibles...</p>
            </div>
          ) : visibleJobs.length > 0 ? (
            visibleJobs.map((job) => (
              <div
                className='job-card'
                key={job.id}
              >
                {/* Lado izquierdo: Info del puesto */}
                <div className='job-card__info'>
                  <h3 className='job-card__name'>{job.title}</h3>
                  <div className='job-card__meta'>
                    <span className='job-card__role'>
                      <Briefcase size={14} /> {job.type}
                    </span>
                    <span className='job-card__role'>
                      <Calendar size={14} /> {job.date}
                    </span>

                    {/* 🕵️‍♂️ TAG DE PAÍS PREPARADO (Oculto por CSS hasta el lanzamiento en otros países) */}
                    <span className='job-card__role job-card__role--country-tag'>
                      <MapPin size={14} /> {job.country}
                    </span>
                  </div>
                </div>

                {/* Lado derecho: Botón CTA unificado al estilo AdnTeam */}
                <div className='job-card__footer'>
                  <Link
                    to={`/trabaja_con_nosotros/${job.id}`}
                    className='job-card__btn'
                    aria-label={`Ver detalles del puesto ${job.title}`}
                  >
                    <ChevronRight
                      size={22}
                      strokeWidth={2.5}
                    />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className='careers-jobs__empty-state'>
              <p>{t('careers.jobs.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CareersJobs;
