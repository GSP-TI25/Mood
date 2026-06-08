import { useTranslation } from 'react-i18next';
import { Rocket, Brain, Coffee } from 'lucide-react';
import BlurText from '../BlurText/BlurText';
import './CareersHero.scss';

const CareersHero = () => {
  const { t } = useTranslation();

  return (
    <section className='careers-hero'>
      <div className='careers-hero__background'>
        <div className='careers-hero__container'>
          {/* COLUMNA IZQUIERDA: MENSAJE CREATIVO */}
          <div className='careers-hero__left-col'>
            <div className='careers-hero__title-group'>
              <BlurText
                text={t('careers.hero.title1')}
                delay={30}
                animateBy='words'
                direction='top'
                as='h1'
                className='careers-hero__title'
              />
              <BlurText
                text={t('careers.hero.title2')}
                delay={45}
                animateBy='words'
                direction='top'
                as='span'
                className='careers-hero__highlight'
              />
            </div>
            <div
              className='careers-hero__fade-in'
              style={{ animationDelay: '0.4s' }}
            >
              <p className='careers-hero__subtitle'>
                {t('careers.hero.subtitle')}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: CULTURA */}
          <div
            className='careers-hero__right-col careers-hero__fade-in'
            style={{ animationDelay: '0.5s' }}
          >
            <h2 className='careers-hero__culture-title'>
              {t('careers.culture.title')}
            </h2>

            <div className='careers-hero__culture-grid'>
              <div className='culture-card'>
                <Brain className='culture-card__icon' />
                <div className='culture-card__info'>
                  <h3>{t('careers.culture.items.1.title')}</h3>
                  <p>{t('careers.culture.items.1.desc')}</p>
                </div>
              </div>

              <div className='culture-card'>
                <Rocket className='culture-card__icon' />
                <div className='culture-card__info'>
                  <h3>{t('careers.culture.items.2.title')}</h3>
                  <p>{t('careers.culture.items.2.desc')}</p>
                </div>
              </div>

              <div className='culture-card'>
                <Coffee className='culture-card__icon' />
                <div className='culture-card__info'>
                  <h3>{t('careers.culture.items.3.title')}</h3>
                  <p>{t('careers.culture.items.3.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
