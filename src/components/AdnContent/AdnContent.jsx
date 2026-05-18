import FadeContent from '../FadeContent/FadeContent';
import './AdnContent.scss';

const AdnContent = () => {
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
            HISTORIA
          </div>
        </FadeContent>

        {/* Columna Derecha: Tipografía Gigante y Hashtags */}
        <FadeContent
          duration={0.8}
          delay={0.4}
          className='adn-content__right'
        >
          <h2 className='adn-content__text'>
            Somos una red de espacios creativos en LATAM. Llevamos una década de
            éxito gestionando proyectos de comunicación y transformación
            digital, impulsando marcas con ideas disruptivas en{' '}
            <span className='adn-content__text-light'>
              un mundo hiperconectado y complejo.
            </span>
          </h2>

          <div className='adn-content__hashtags'>
            <span>#Ecommerce</span>
            <span>#DigitalTransformation</span>
            <span>#BrandStrategy</span>
            <span>#Partnership</span>
            <span>#SocialStrategy</span>
            <span>#Contenido</span>
            <span>#DesarrolloWeb</span>
          </div>
        </FadeContent>
      </div>
    </section>
  );
};

export default AdnContent;
