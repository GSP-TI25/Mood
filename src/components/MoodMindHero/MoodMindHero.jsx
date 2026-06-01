import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeContent from '../FadeContent/FadeContent';
import RotatingText from '../RotatingText/RotatingText';
import LogoLoop from '../LogoLoop/LogoLoop'; // 🌟 Importamos el componente LogoLoop
import logoMoodBg from '../../assets/Logo_Mood_Vectorizado.svg';
import './MoodMindHero.scss';

// 🌟 DATA DINÁMICA SINCRONIZADA
const CONTENT_STEPS = [
  {
    word: 'RÁPIDA',
    description:
      'La IA reduce tiempos en edición, retoque, mockups, renders y adaptaciones. Mood convierte esa velocidad en piezas listas para campaña.',
  },
  {
    word: 'PRECISA',
    description:
      'La IA detecta formatos, tendencias y performance. Mood adapta cada pieza al canal correcto (RRSS, pauta, B2B, retail, eventos).',
  },
  {
    word: 'EFICIENTE',
    description:
      'Menos reprocesos. Menos pruebas innecesarias. Más claridad desde el brief hasta la entrega final.',
  },
  {
    word: 'CREATIVA',
    description:
      'La IA genera múltiples rutas visuales en minutos. Mood selecciona, dirige y eleva la mejor idea con criterio estratégico.',
  },
];

// 🌟 LOGOS CON FORMATO PARA LOGOLOOP
const AI_LOGOS = [
  { src: '/Logos/ChatGPT.webp', alt: 'ChatGPT' },
  { src: '/Logos/Deepl.webp', alt: 'DeepL' },
  { src: '/Logos/ElevenLabs.webp', alt: 'ElevenLabs' },
  { src: '/Logos/Envato.webp', alt: 'Envato' },
  { src: '/Logos/KlingAI.webp', alt: 'KlingAI' },
  { src: '/Logos/Krea.webp', alt: 'Krea' },
  { src: '/Logos/Magnific.webp', alt: 'Magnific' },
  { src: '/Logos/Midjourney.webp', alt: 'Midjourney' },
];

const ROTATION_INTERVAL_MS = 4000;

const MoodMindHero = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const rotatingWords = CONTENT_STEPS.map((step) => step.word);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % CONTENT_STEPS.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='mood-mind-hero'>
      <img
        src={logoMoodBg}
        alt=''
        className='mood-mind-hero__bg-graphic'
        aria-hidden='true'
      />

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
                <div
                  className={`mood-mind-hero__highlight font-style-${activeIndex}`}
                >
                  <RotatingText
                    texts={rotatingWords}
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
              <p
                key={activeIndex}
                className='mood-mind-hero__description mood-mind-hero__fade-in-text'
              >
                {CONTENT_STEPS[activeIndex].description}
              </p>
            </div>
          </div>
        </div>

        {/* 🌟 CARRUSEL USANDO EL COMPONENTE LOGOLOOP */}
        <div className='mood-mind-hero__bottom'>
          <FadeContent
            duration={1}
            delay={0.6}
          >
            <div className='mood-mind-hero__carousel-wrapper'>
              <LogoLoop
                logos={AI_LOGOS}
                speed={30}
                direction='left'
                logoHeight={45}
                gap={80}
                hoverSpeed={10}
                scaleOnHover={true}
                fadeOut={false} // Desactivamos el fade interno porque le pondremos un mask de difuminado por CSS
              />
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default MoodMindHero;
