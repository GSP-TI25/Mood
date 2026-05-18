import { ChevronDown } from 'lucide-react';
import BlurText from '../BlurText/BlurText';
import FadeContent from '../FadeContent/FadeContent';
import './AdnHero.scss';

const AdnHero = () => {
  const handleScroll = () => {
    const element = document.getElementById('adn-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className='adn-hero'>
      <div className='adn-hero__container'>
        {/* 1. Título dividido en dos BlurText */}
        <div className='adn-hero__header'>
          <BlurText
            text='Más que una agencia,'
            delay={30}
            animateBy='words'
            direction='top'
            as='h1'
            className='adn-hero__title'
          />
          <BlurText
            text='tu partner creativo.'
            delay={50}
            animateBy='words'
            direction='top'
            as='h1'
            className='adn-hero__title adn-hero__title-light'
          />
        </div>

        {/* 2. Sección media: Botón y descripción corta */}
        <div className='adn-hero__middle'>
          <button
            className='adn-hero__scroll-btn'
            aria-label='Ir a la siguiente sección'
            onClick={handleScroll}
          >
            <ChevronDown size={24} />
          </button>

          <div className='adn-hero__paragraph-wrapper'>
            <BlurText
              text='Creamos estrategias basadas en datos y diseño con propósito para hacer destacar tu marca.'
              delay={40}
              animateBy='words'
              direction='top'
              as='p'
              className='adn-hero__paragraph'
            />
          </div>
        </div>
      </div>

      {/* 3A. IMAGEN EXCLUSIVA PARA DESKTOP */}
      <div className='adn-hero__image-wrapper adn-hero__image-wrapper--desktop'>
        <FadeContent
          duration={1}
          delay={0.5}
        >
          <img
            src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=492&q=80'
            alt='Equipo Mood trabajando en Desktop'
            className='adn-hero__image'
          />
        </FadeContent>
      </div>

      {/* 3B. IMAGEN EXCLUSIVA PARA TABLET Y MÓVIL */}
      <div className='adn-hero__image-wrapper adn-hero__image-wrapper--mobile'>
        <FadeContent
          duration={1}
          delay={0.5}
        >
          <img
            // Sin altura predefinida para que fluya hasta el final de la pantalla
            src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
            alt='Equipo Mood trabajando en Móvil'
            className='adn-hero__image'
          />
        </FadeContent>
      </div>
    </section>
  );
};

export default AdnHero;
