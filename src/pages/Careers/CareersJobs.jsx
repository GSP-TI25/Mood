import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import './CareersJobs.scss';

const CareersJobs = () => {
  const { t } = useTranslation();

  // Obtenemos la lista. Si falla, devolvemos un arreglo vacío [] por seguridad.
  const rawJobs = t('careers.jobs.list', { returnObjects: true });
  const jobsList = Array.isArray(rawJobs) ? rawJobs : [];

  return (
    <section className='careers-jobs'>
      <div className='careers-jobs__container'>
        <h2 className='careers-jobs__title'>{t('careers.jobs.title')}</h2>

        <div className='careers-jobs__grid'>
          {jobsList.length > 0 ? (
            jobsList.map((job) => (
              <div
                className='job-card'
                key={job.id}
              >
                <div className='job-card__header'>
                  <h3 className='job-card__title'>{job.title}</h3>
                  <div className='job-card__meta'>
                    <span className='job-card__tag'>
                      <Briefcase size={16} /> {job.type}
                    </span>
                    <span className='job-card__tag'>
                      <Calendar size={16} /> {job.date}
                    </span>
                  </div>
                </div>

                {/* Enlace dinámico con el formato de guion bajo configurado */}
                <Link
                  to={`/trabaja_con_nosotros/${job.id}`}
                  className='job-card__btn'
                >
                  {t('careers.jobs.cta')} <ChevronRight size={18} />
                </Link>
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
