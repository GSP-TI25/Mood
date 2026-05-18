import { ChevronRight } from 'lucide-react';
import FadeContent from '../FadeContent/FadeContent';
import './AdnWork.scss';

const AdnWork = () => {
  return (
    <section className='adn-work'>
      <div className='adn-work__container'>
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <FadeContent
          duration={0.8}
          delay={0.2}
          className='adn-work__image-col'
        >
          <img
            src='https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80'
            alt='Equipo de Mood'
            className='adn-work__image'
          />
        </FadeContent>

        {/* COLUMNA DERECHA: TEXTO Y BOTÓN */}
        <div className='adn-work__content-col'>
          <div className='adn-work__texts'>
            <FadeContent
              duration={0.8}
              delay={0.4}
            >
              <p>
                Construimos un ecosistema de estrategias digitales decodificando
                la complejidad del mercado. Inspirados por la disrupción y los
                datos, la metodología de nuestro equipo ha logrado conectar
                marcas tradicionales con el consumidor moderno de manera
                escalable.
              </p>
            </FadeContent>

            <FadeContent
              duration={0.8}
              delay={0.5}
            >
              <p>
                Hoy, nos enfocamos en combatir la irrelevancia, con el objetivo
                a largo plazo de transformar la forma fundamental en que las
                empresas interactúan y crecen en su entorno.
              </p>
            </FadeContent>
          </div>

          <FadeContent
            duration={0.8}
            delay={0.6}
          >
            <div className='adn-work__actions'>
              <a
                href='/#contacto'
                className='btn-jobs'
              >
                <span className='btn-jobs__text'>Trabaja con nosotros</span>
                <span className='btn-jobs__icon'>
                  <ChevronRight size={18} />
                </span>
              </a>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default AdnWork;
