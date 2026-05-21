import { ChevronRight, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import Linkedin from '../Icons/Linkedin';
import Instagram from '../Icons/Instagram';
import Facebook from '../Icons/Facebook';
import logoMood from '../../assets/Logo_Mood.svg';
import './Footer.scss';

const Footer = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
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

            <h2 className='footer__slogan'>{t('footer.slogan')}</h2>

            <div className='footer__jobs'>
              <a
                href='#trabajo'
                className='btn-jobs'
              >
                {/* Estructura perfecta para la animación compleja */}
                <span className='btn-jobs__text'>{t('footer.btnJoin')}</span>
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
              <h3 className='footer__nav-title'>{t('footer.navTitle')}</h3>
              <ul className='footer__nav-list'>
                <li className='navbar__item'>
                  <Link
                    to='/adn-mood'
                    className='footer__nav-link'
                  >
                    {t('navbar.adn')}{' '}
                    {/* Reutilizamos la traducción del navbar */}
                  </Link>
                </li>
                <li className='navbar__item'>
                  <Link
                    to='/mood-print'
                    className='footer__nav-link'
                  >
                    {t('navbar.print')}{' '}
                    {/* Reutilizamos la traducción del navbar */}
                  </Link>
                </li>
                <li>
                  <a
                    href='/#what'
                    className='footer__nav-link'
                  >
                    #TheMoodEdit
                  </a>
                </li>
              </ul>
            </div>

            {/* Grupo 2: Redes Sociales */}
            <div className='footer__nav-group'>
              <h4 className='footer__nav-title'>{t('footer.connectTitle')}</h4>
              <ul className='footer__nav-list footer__nav-list--social'>
                <li>
                  <a
                    href='https://www.linkedin.com/company/moodagenciacreativa/'
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
                    href='https://www.instagram.com/mood.advertising/'
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
                    href='https://www.facebook.com/moodper'
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
          <p>
            &copy; {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
