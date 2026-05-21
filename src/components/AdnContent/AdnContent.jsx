import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import FadeContent from '../FadeContent/FadeContent';
import './AdnContent.scss';

const AdnContent = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK

  return (
    <section
      className='adn-content'
      id='adn-content'
    >
      <div className='adn-content__container'>
        {/* Columna Izquierda: Etiqueta (Badge) */}
        <FadeContent
          duration={0.6}
          delay={0.2}
          className='adn-content__left'
        >
          <div className='adn-content__badge'>
            <span className='adn-content__badge-dot'></span>
            {t('adnContent.badge')}
          </div>
        </FadeContent>

        {/* Columna Derecha: Tipografía Gigante y Hashtags */}
        <FadeContent
          duration={0.8}
          delay={0.4}
          className='adn-content__right'
        >
          <h2 className='adn-content__text'>
            {t('adnContent.textMain')}
            <span className='adn-content__text-light'>
              {t('adnContent.textLight')}
            </span>
          </h2>

          <div className='adn-content__hashtags'>
            {/* Estos pueden quedar fijos porque ya son términos globales en inglés */}
            <span>#Ecommerce</span>
            <span>#DigitalTransformation</span>
            <span>#BrandStrategy</span>
            <span>#Partnership</span>
            <span>#SocialStrategy</span>

            {/* Estos sí los traducimos */}
            <span>{t('adnContent.tags.content')}</span>
            <span>{t('adnContent.tags.web')}</span>
          </div>
        </FadeContent>
      </div>
    </section>
  );
};

export default AdnContent;
