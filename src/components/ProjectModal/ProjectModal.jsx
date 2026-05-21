import { X, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import './ProjectModal.scss';

const ProjectModal = ({ project, onClose }) => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK

  if (!project) return null;

  // Renderizamos el modal directamente en el body usando un Portal
  return createPortal(
    <div className='project-modal'>
      {/* Fondo oscuro desenfocado */}
      <div
        className='project-modal__overlay'
        onClick={onClose}
      ></div>

      {/* Contenedor del Modal */}
      <div className='project-modal__content'>
        <button
          className='project-modal__close'
          onClick={onClose}
          aria-label={t('projectModal.closeAria')} // <-- Traducción dinámica
        >
          <X size={24} />
        </button>

        <div className='project-modal__image-wrapper'>
          <img
            src={project.img}
            alt={project.title}
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
        </div>

        <div className='project-modal__info'>
          {/* Usamos categoryTranslated que inyectamos en MoodPrintProjects */}
          <span className='project-modal__badge'>
            {project.categoryTranslated || project.category}
          </span>

          <h3 className='project-modal__title'>{project.title}</h3>

          <div className='project-modal__meta'>
            <p>
              <strong>{t('projectModal.client')}</strong> {project.client}{' '}
              {/* <-- Traducción dinámica */}
            </p>
            <p>
              <strong>{t('projectModal.date')}</strong> {project.date}{' '}
              {/* <-- Traducción dinámica */}
            </p>
          </div>

          <p className='project-modal__desc'>{project.description}</p>

          <a
            href={project.url || '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='project-modal__btn'
          >
            <span>{t('projectModal.btnView')}</span> <ExternalLink size={18} />{' '}
            {/* <-- Traducción dinámica */}
          </a>
        </div>
      </div>
    </div>,
    document.body, // <-- Destino del Portal
  );
};

export default ProjectModal;
