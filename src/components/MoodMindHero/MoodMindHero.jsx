import { useTranslation } from 'react-i18next';
import FadeContent from '../FadeContent/FadeContent';
import LightRays from '../LightRays/LightRays';
import logoMoodBg from '../../assets/Logo_Mood_Vectorizado.svg';
import './MoodMindHero.scss';

const MoodMindHero = () => {
  const { t } = useTranslation();

  return (
    <section className='mood-mind-hero'>
      {/* FONDO LIGHT RAYS */}
      <div className='mood-mind-hero__bg'>
        <LightRays
          raysOrigin='top-center'
          raysColor='#4ade80'
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

      {/* LOGO GIGANTE DE FONDO (MARCA DE AGUA) */}
      <img
        src={logoMoodBg}
        alt=''
        className='mood-mind-hero__bg-logo'
        aria-hidden='true'
      />

      <div className='mood-mind-hero__container'>
        <div className='mood-mind-hero__content'>
          {/* 🌟 TÍTULO: MARCAS AL LADO DE POTENCIAMOS */}
          <FadeContent
            duration={0.8}
            delay={0.1}
            direction='bottom'
          >
            <h1 className='mood-mind-hero__title'>
              <span className='mood-mind-hero__title-top'>
                <span className='mood-mind-hero__muted-text'>Potenciamos</span>
                <span className='mood-mind-hero__highlight'>marcas</span>
              </span>
              <span className='mood-mind-hero__title-bottom'>
                extraordinarias con IA.
              </span>
            </h1>
          </FadeContent>

          {/* PÁRRAFO DESCRIPTIVO */}
          <FadeContent
            duration={0.8}
            delay={0.2}
            direction='bottom'
          >
            <p className='mood-mind-hero__description'>
              Fusionamos la creatividad estratégica con el poder ilimitado de la
              Inteligencia Artificial para diseñar el futuro de tu marca, romper
              el molde y acelerar tus resultados.
            </p>
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default MoodMindHero;
