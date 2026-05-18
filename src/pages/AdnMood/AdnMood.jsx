import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import GradualBlur from '../../components/GradualBlur/GradualBlur';
import AdnHero from '../../components/AdnHero/AdnHero';
import AdnContent from '../../components/AdnContent/AdnContent';
import './AdnMood.scss';

const AdnMood = () => {
  return (
    <main className='adn'>
      {/* Frame superior con Navbar y Hero específico de ADN */}
      <div className='adn__hero-frame'>
        <Navbar />
        <AdnHero />
      </div>

      {/* Contenido principal de la filosofía de la empresa */}
      <AdnContent />

      {/* Footer reutilizado */}
      <div className='adn__footer-area'>
        <Footer />
      </div>

      {/* Blur decorativo para desktop
      <div className='adn__desktop-blur'>
        <GradualBlur
          target='page'
          position='bottom'
          height='8rem'
          strength={3}
          divCount={6}
          curve='ease-out'
          exponential
          opacity={1}
        />
      </div> */}
    </main>
  );
};

export default AdnMood;
