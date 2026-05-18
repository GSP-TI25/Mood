import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- IMPORTAMOS useLocation
import { Sparkles } from 'lucide-react';
import './Navbar.scss';
import logoMood from '../../assets/Logo_mood.svg';

const Navbar = () => {
  const [lang, setLang] = useState('ES');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NUEVO: Obtenemos la ruta actual
  const location = useLocation();

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
      className={`header ${isScrolled ? 'header--scrolled' : ''} ${isMenuOpen ? 'header--menu-open' : ''}`}
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
              // LÓGICA ACTIVE: Si la ruta es '/adn-mood', agregamos la clase activa
              className={`navbar__link ${location.pathname === '/adn-mood' ? 'navbar__link--active' : ''}`}
            >
              ADN Mood
            </Link>
          </li>
          <li className='navbar__item'>
            {/* CORRECCIÓN: Agregamos la '/' para que funcione desde cualquier página */}
            <a
              href='/#print'
              className='navbar__link'
            >
              Mood Print
            </a>
          </li>
          <li className='navbar__item'>
            <a
              href='/#what'
              className='navbar__link'
            >
              #What'sYourMood
            </a>
          </li>
        </ul>

        <div className='navbar__actions navbar__desktop-only'>
          <div className='navbar__lang-selector'>
            <button
              className={`navbar__lang-btn ${lang === 'ES' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => setLang('ES')}
            >
              ES
            </button>
            <button
              className={`navbar__lang-btn ${lang === 'EN' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => setLang('EN')}
            >
              EN
            </button>
          </div>

          <a
            href='/#contacto'
            className='btn btn--contact'
          >
            <span>Contacto</span>
            <Sparkles
              size={18}
              className='btn__icon'
            />
          </a>
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
              // LÓGICA ACTIVE PARA MÓVIL
              className={`mobile-panel__link ${location.pathname === '/adn-mood' ? 'mobile-panel__link--active' : ''}`}
              onClick={closeMenu}
            >
              ADN Mood
            </Link>
          </li>
          <li>
            <a
              href='/#print'
              className='mobile-panel__link'
              onClick={closeMenu}
            >
              Mood Print
            </a>
          </li>
          <li>
            <a
              href='/#what'
              className='mobile-panel__link'
              onClick={closeMenu}
            >
              #What'sYourMood
            </a>
          </li>
        </ul>

        <div className='mobile-panel__actions'>
          <div className='navbar__lang-selector'>
            <button
              className={`navbar__lang-btn ${lang === 'ES' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => {
                setLang('ES');
                closeMenu();
              }}
            >
              ES
            </button>
            <button
              className={`navbar__lang-btn ${lang === 'EN' ? 'navbar__lang-btn--active' : ''}`}
              onClick={() => {
                setLang('EN');
                closeMenu();
              }}
            >
              EN
            </button>
          </div>

          <a
            href='/#contacto'
            className='btn btn--contact mobile-panel__btn'
            onClick={closeMenu}
          >
            <span>Contacto</span>
            <Sparkles
              size={18}
              className='btn__icon'
            />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
