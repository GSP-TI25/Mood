import { Search, Zap, Sparkles } from 'lucide-react';
import FadeContent from '../FadeContent/FadeContent';
import BlurText from '../BlurText/BlurText';
import './MoodApproach.scss';

const APPROACH_DATA = [
  {
    id: 'analiza',
    overline: 'IA Analiza',
    title: 'Mood Interpreta',
    description:
      'Procesamos datos masivos en segundos. Nuestro equipo extrae los insights estratégicos.',
    icon: Search,
  },
  {
    id: 'acelera',
    overline: 'IA Acelera',
    title: 'Mood Decide',
    description:
      'Automatizamos la creación visual. Nuestros directores seleccionan y refinan la idea ganadora.',
    icon: Zap,
  },
  {
    id: 'optimiza',
    overline: 'IA Optimiza',
    title: 'Mood Construye Marca',
    description:
      'El algoritmo escala el performance comercial. Nosotros cuidamos la esencia de tu marca.',
    icon: Sparkles,
  },
];

const MoodApproach = () => {
  return (
    <section className='mood-approach'>
      <div className='mood-approach__container'>
        {/* 🌟 CABECERA */}
        <div className='mood-approach__header'>
          {/* Lado Izquierdo */}
          <div className='mood-approach__header-left'>
            <FadeContent
              duration={0.8}
              delay={0.1}
              direction='right'
            >
              <div className='mood-approach__badge'>
                <span className='mood-approach__badge-dot'></span>
                NUESTRO ENFOQUE
              </div>
            </FadeContent>
          </div>

          {/* Lado Derecho */}
          <div className='mood-approach__header-right'>
            {/* 🌟 TÍTULO REESCRITO Y FORZADO A 2 LÍNEAS EXACTAS */}
            <h2 className='mood-approach__title'>
              <span className='mood-approach__title-line'>
                <BlurText
                  text='Sinergia perfecta entre Inteligencia'
                  as='span'
                  delay={30}
                  animateBy='words'
                  direction='top'
                />
              </span>
              <span className='mood-approach__title-line'>
                <BlurText
                  text='Artificial y talento humano.'
                  as='span'
                  delay={100}
                  animateBy='words'
                  direction='top'
                />
              </span>
            </h2>

            <FadeContent
              duration={0.8}
              delay={0.3}
              direction='bottom'
            >
              <p className='mood-approach__description'>
                La tecnología aporta velocidad y precisión milimétrica. Sin
                embargo, es nuestra visión estratégica la que guía estas
                herramientas para crear conexiones reales y resultados de
                negocio tangibles.
              </p>
            </FadeContent>
          </div>
        </div>

        {/* 🌟 GRILLA DE TARJETAS */}
        <div className='mood-approach__grid'>
          {APPROACH_DATA.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <FadeContent
                key={card.id}
                duration={0.8}
                delay={0.2 * (index + 1)}
                direction='bottom'
              >
                {/* 🌟 UNA SOLA CLASE BASE. EL SCSS HARÁ LA MAGIA */}
                <div className='mood-approach__card'>
                  <div className='mood-approach__card-icon'>
                    <IconComponent
                      size={32}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className='mood-approach__card-content'>
                    <span className='mood-approach__card-overline'>
                      {card.overline}
                    </span>
                    <h3 className='mood-approach__card-title'>{card.title}</h3>
                    <p className='mood-approach__card-desc'>
                      {card.description}
                    </p>
                  </div>
                </div>
              </FadeContent>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MoodApproach;
