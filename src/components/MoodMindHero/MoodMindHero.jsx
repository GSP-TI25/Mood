import { useTranslation } from 'react-i18next';
import FadeContent from '../FadeContent/FadeContent';
import RotatingText from '../RotatingText/RotatingText';
import LightRays from '../LightRays/LightRays'; // 🌟 Importamos el nuevo fondo
import './MoodMindHero.scss';

const ROTATING_WORDS = ['RÁPIDA', 'PRECISA', 'EFICIENTE', 'CREATIVA'];
const ROTATION_INTERVAL_MS = 4000;

const MoodMindHero = () => {
  const { t } = useTranslation();

  return (
    <section className='mood-mind-hero'>
      {/* 🌟 FONDO INTERACTIVO LIGHT RAYS */}
      <div className='mood-mind-hero__bg'>
        <LightRays
          raysOrigin='top-center'
          raysColor='#4ade80' // Usamos el verde neón para que haga match con la caja
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className='custom-rays'
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      <div className='mood-mind-hero__container'>
        <div className='mood-mind-hero__top'>
          <div className='mood-mind-hero__title-col'>
            <FadeContent
              duration={0.8}
              delay={0.1}
              direction='bottom'
            >
              <h1 className='mood-mind-hero__title'>
                PRODUCCIÓN <br /> MÁS <br />
                <div className='mood-mind-hero__highlight'>
                  <RotatingText
                    texts={ROTATING_WORDS}
                    mainClassName='mood-mind-hero__rotating-word'
                    staggerFrom='last'
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    staggerDuration={0.025}
                    splitLevelClassName='overflow-hidden'
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    rotationInterval={ROTATION_INTERVAL_MS}
                  />
                </div>
              </h1>
            </FadeContent>
          </div>

          <div className='mood-mind-hero__desc-col'>
            <div className='mood-mind-hero__description-wrapper'>
              <FadeContent
                duration={0.8}
                delay={0.3}
                direction='bottom'
              >
                <p className='mood-mind-hero__description'>
                  Fusionamos el <strong>ingenio humano</strong> con el poder
                  ilimitado de la <strong>Inteligencia Artificial</strong>. En
                  Mood, no solo optimizamos tiempos y recursos; elevamos la
                  dirección de arte y las estrategias digitales para crear
                  marcas, campañas y experiencias que rompen el molde. El futuro
                  de tu marca empieza aquí.
                </p>
              </FadeContent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodMindHero;
