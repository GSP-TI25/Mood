import { ChevronRight, ChevronUp } from 'lucide-react';
import Linkedin from '../Icons/Linkedin';
import Instagram from '../Icons/Instagram';
import Facebook from '../Icons/Facebook';
import logoMood from '../../assets/Logo_Mood.svg';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className='footer'>
      <div className='footer__container'>
        <div className='footer__top'>
          {/* Columna Izquierda: Marca Oficial, Lema y CTA */}
          <div className='footer__brand-section'>
            <img
              src={logoMood}
              alt='Mood Logo'
              className='footer__logo'
            />

            <h2 className='footer__slogan'>
              Impulsando marcas con lógica cinética y creatividad pura.
            </h2>

            <div className='footer__jobs'>
              <a
                href='#trabajo'
                className='btn-jobs'
              >
                {/* Estructura perfecta para la animación compleja */}
                <span className='btn-jobs__text'>Únete al equipo</span>
                <span className='btn-jobs__icon'>
                  <ChevronRight size={18} />
                </span>
              </a>
            </div>
          </div>

          {/* Columna Derecha: Links y Scroll Top */}
          <div className='footer__nav-section'>
            {/* Grupo 1: Navegación */}
            <div className='footer__nav-group'>
              <h3 className='footer__nav-title'>NAVEGAR</h3>
              <ul className='footer__nav-list'>
                <li>
                  <a
                    href='#adn'
                    className='footer__nav-link'
                  >
                    ADN Mood
                  </a>
                </li>
                <li>
                  <a
                    href='#print'
                    className='footer__nav-link'
                  >
                    Mood Print
                  </a>
                </li>
                <li>
                  <a
                    href='#what'
                    className='footer__nav-link'
                  >
                    #What'sYourMood
                  </a>
                </li>
              </ul>
            </div>

            {/* Grupo 2: Redes Sociales */}
            <div className='footer__nav-group'>
              <h4 className='footer__nav-title'>CONECTAR</h4>
              <ul className='footer__nav-list footer__nav-list--social'>
                <li>
                  <a
                    href='#linkedin'
                    className='footer__social-link'
                    aria-label='LinkedIn'
                  >
                    <Linkedin
                      size={24}
                      strokeWidth={1.5}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href='#instagram'
                    className='footer__social-link'
                    aria-label='Instagram'
                  >
                    <Instagram
                      size={24}
                      strokeWidth={1.5}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href='#facebook'
                    className='footer__social-link'
                    aria-label='Facebook'
                  >
                    <Facebook
                      size={24}
                      strokeWidth={1.5}
                    />
                  </a>
                </li>
              </ul>
            </div>

            {/* Botón Scroll to Top */}
            <button
              className='footer__scroll-top'
              onClick={scrollToTop}
              aria-label='Volver arriba'
            >
              <ChevronUp
                size={20}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Línea inferior: Copyright */}
        <div className='footer__bottom'>
          <p>&copy; {currentYear} Mood. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
