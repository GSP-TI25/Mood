import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, ChevronRight, MapPin } from 'lucide-react'; // <-- Importamos MapPin para el futuro
import './CareersJobs.scss';

const CareersJobs = () => {
  const { t } = useTranslation();

  // Obtenemos la lista base desde el i18n.
  const rawJobs = t('careers.jobs.list', { returnObjects: true });
  const jobsList = Array.isArray(rawJobs) ? rawJobs : [];

  /* =======================================================================
     🚀 INFRAESTRUCTURA MULTI-PAÍS (PREPARADA Y EN MODO INCÓGNITO)
     Inyectamos la propiedad de país a cada ID correspondiente de tu JSON.
     Por ejemplo: Puestos 1 y 2 son de Perú. Puesto 3 es de Colombia.
     ======================================================================= */
  const jobsWithCountries = jobsList.map((job) => {
    // Definimos por ID a qué país pertenece estratégicamente en backend/UI
    let country = 'Peru';

    if (job.id === '3' || job.id === '5') {
      // <--- Ejemplo: El ID 3 y 5 están asignados a Colombia
      country = 'Colombia';
    }

    return { ...job, country };
  });

  /* 🔥 EL FILTRO SECRETO: 
     Por el momento, filtramos estrictamente para que en pantalla SOLO aparezca 'Peru'.
     Cuando quieras activar Colombia, simplemente comentas esta línea o añades: || job.country === 'Colombia' */
  const visibleJobs = jobsWithCountries.filter((job) => job.country === 'Peru');

  return (
    <section className='careers-jobs'>
      <div className='careers-jobs__container'>
        <h2 className='careers-jobs__title'>{t('careers.jobs.title')}</h2>

        <div className='careers-jobs__grid'>
          {visibleJobs.length > 0 ? (
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

                    {/* 🕵️‍♂️ TAG DE PAÍS PREPARADO (Comentado/Oculto por CSS hasta su lanzamiento oficial) */}
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
