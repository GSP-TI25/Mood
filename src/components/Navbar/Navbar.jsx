import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- Importamos el hook
import logoMood from '../../assets/Logo_mood.svg';
import './Navbar.scss';

const Navbar = () => {
  const { t, i18n } = useTranslation(); // <-- Inicializamos la traducción
  const currentLang = i18n.language; // Obtenemos el idioma actual ('ES' o 'EN')

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // El Navbar oscuro ahora solo aplica a Mood Print
  const isDarkMode = location.pathname === '/mood-print';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`header 
        ${isScrolled ? 'header--scrolled' : ''} 
        ${isMenuOpen ? 'header--menu-open' : ''} 
        ${isDarkMode ? 'header--dark-mode' : ''}`}
    >
      <nav className='navbar'>
        <Link
          to='/'
          className='navbar__brand'
          aria-label='Ir al inicio'
          onClick={closeMenu}
        >
          <img
            src={logoMood}
            alt='Mood Logo'
            className='navbar__logo'
            width='120'
            height='40'
          />
        </Link>

        <ul className='navbar__nav navbar__desktop-only'>
          <li className='navbar__item'>
            <Link
              to='/adn-mood'
              className={`navbar__link ${location.pathname === '/adn-mood' ? 'navbar__link--active' : ''}`}
            >
              {t('navbar.adn')} {/* <-- Texto traducido */}
            </Link>
          </li>
          <li className='navbar__item'>
            <Link
              to='/mood-print'
              className={`navbar__link ${location.pathname === '/mood-print' ? 'navbar__link--active' : ''}`}
            >
              {t('navbar.print')} {/* <-- Texto traducido */}
            </Link>
          </li>
          <li className='navbar__item'>
            <a
              href='/#what'
              className='navbar__link'
            >
              #TheMoodEdit
            </a>
          </li>
        </ul>

        <div className='navbar__actions navbar__desktop-only'>
          <div className='navbar__lang-selector'>
            <button
              className={`navbar__lang-btn ${currentLang === 'ES' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => i18n.changeLanguage('ES')} // <-- Cambia a Español globalmente
            >
              ES
            </button>
            <button
              className={`navbar__lang-btn ${currentLang === 'EN' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => i18n.changeLanguage('EN')} // <-- Cambia a Inglés globalmente
            >
              EN
            </button>
          </div>

          <Link
            to='/contacto'
            className='btn btn--contact'
          >
            <span>{t('navbar.contact')}</span> {/* <-- Texto traducido */}
            <Sparkles
              size={18}
              className='btn__icon'
            />
          </Link>
        </div>

        <button
          className={`navbar__toggle ${isMenuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label='Alternar menú'
        >
          <span className='navbar__toggle-line'></span>
          <span className='navbar__toggle-line'></span>
        </button>
      </nav>

      {/* PANEL FULLSCREEN MÓVIL */}
      <div className={`mobile-panel ${isMenuOpen ? 'mobile-panel--open' : ''}`}>
        <ul className='mobile-panel__nav'>
          <li>
            <Link
              to='/adn-mood'
              className={`mobile-panel__link ${location.pathname === '/adn-mood' ? 'mobile-panel__link--active' : ''}`}
              onClick={closeMenu}
            >
              {t('navbar.adn')} {/* <-- Texto traducido */}
            </Link>
          </li>
          <li>
            <Link
              to='/mood-print'
              className={`mobile-panel__link ${location.pathname === '/mood-print' ? 'mobile-panel__link--active' : ''}`}
              onClick={closeMenu}
            >
              {t('navbar.print')} {/* <-- Texto traducido */}
            </Link>
          </li>
          <li>
            <a
              href='/#what'
              className='mobile-panel__link'
              onClick={closeMenu}
            >
              #TheMoodEdit
            </a>
          </li>
        </ul>

        <div className='mobile-panel__actions'>
          <div className='navbar__lang-selector'>
            <button
              className={`navbar__lang-btn ${currentLang === 'ES' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => {
                i18n.changeLanguage('ES'); // <-- Cambia idioma y cierra menú
                closeMenu();
              }}
            >
              ES
            </button>
            <button
              className={`navbar__lang-btn ${currentLang === 'EN' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => {
                i18n.changeLanguage('EN'); // <-- Cambia idioma y cierra menú
                closeMenu();
              }}
            >
              EN
            </button>
          </div>

          <Link
            to='/contacto'
            className='btn btn--contact mobile-panel__btn'
            onClick={closeMenu}
          >
            <span>{t('navbar.contact')}</span> {/* <-- Texto traducido */}
            <Sparkles
              size={18}
              className='btn__icon'
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
