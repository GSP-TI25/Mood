import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- Cambiamos etiqueta <a> por <Link>
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import FadeContent from '../FadeContent/FadeContent';
import './AdnWork.scss';

const AdnWork = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK

  return (
    <section className='adn-work'>
      <div className='adn-work__container'>
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <FadeContent
          duration={0.8}
          delay={0.2}
          className='adn-work__image-col'
        >
          <img
            src='https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80'
            alt={t('adnWork.altImage')} // <-- Traducción dinámica
            className='adn-work__image'
            crossOrigin='anonymous'
            referrerPolicy='no-referrer'
          />
        </FadeContent>

        {/* COLUMNA DERECHA: TEXTO Y BOTÓN */}
        <div className='adn-work__content-col'>
          <div className='adn-work__texts'>
            <FadeContent
              duration={0.8}
              delay={0.4}
            >
              <p>
                {t('adnWork.p1')} {/* <-- Traducción dinámica */}
              </p>
            </FadeContent>

            <FadeContent
              duration={0.8}
              delay={0.5}
            >
              <p>
                {t('adnWork.p2')} {/* <-- Traducción dinámica */}
              </p>
            </FadeContent>
          </div>

          <FadeContent
            duration={0.8}
            delay={0.6}
          >
            <div className='adn-work__actions'>
              <Link
                to='/contacto' // <-- Actualizado a la nueva ruta de contacto
                className='btn-jobs'
              >
                <span className='btn-jobs__text'>{t('adnWork.btn')}</span>{' '}
                {/* <-- Traducción dinámica */}
                <span className='btn-jobs__icon'>
                  <ChevronRight size={18} />
                </span>
              </Link>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default AdnWork;
