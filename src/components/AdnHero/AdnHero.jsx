import { ChevronDown } from 'lucide-react';
import BlurText from '../BlurText/BlurText';
import FadeContent from '../FadeContent/FadeContent';
import './AdnHero.scss';

const AdnHero = () => {
  const handleScroll = () => {
    // Busca el elemento al que queremos ir (asegúrate de que AdnContent tenga id='adn-content')
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
              text='Creamos estrategias basadas en datos y diseño
con propósito para hacer destacar tu marca.'
              delay={40}
              animateBy='words'
              direction='top'
              as='p'
              className='adn-hero__paragraph'
            />
          </div>
        </div>
      </div>

      {/* 3. Imagen inferior */}
      <div className='adn-hero__image-wrapper'>
        <FadeContent
          duration={1}
          delay={0.5}
        >
          <img
            // Añadimos h=600 en lugar de 300 para que no se pixelee en monitores grandes
            src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=492&q=80'
            alt='Equipo Mood trabajando'
            className='adn-hero__image'
          />
        </FadeContent>
      </div>
    </section>
  );
};

export default AdnHero;
