import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import Linkedin from '../Icons/Linkedin';
import FadeContent from '../FadeContent/FadeContent';
import './AdnTeam.scss';

// --- LÍDERES ---
// Agregamos una propiedad 'roleKey' para saber qué texto buscar en el JSON
const TEAM_MEMBERS = [
  {
    name: 'Matthias Stimman',
    roleKey: 'matthias',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    linkedin: '#',
  },
  {
    name: 'Vasco Romero',
    roleKey: 'vasco',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    linkedin: '#',
  },
  {
    name: 'Carolina Mendoza',
    roleKey: 'carolina',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    linkedin: '#',
  },
  {
    name: 'Alejandro Torres',
    roleKey: 'alejandro',
    image:
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
    linkedin: '#',
  },
];

// --- MIEMBROS DEL EQUIPO ---
const GENERAL_TEAM = [
  { name: 'Sofía Reyes', roleKey: 'sofia', linkedin: '#' },
  { name: 'Diego Arango', roleKey: 'diego', linkedin: '#' },
  { name: 'Valeria Costa', roleKey: 'valeria', linkedin: '#' },
  { name: 'Martín Soler', roleKey: 'martin', linkedin: '#' },
  { name: 'Lucía Vallejo', roleKey: 'lucia', linkedin: '#' },
  { name: 'Andrés Silva', roleKey: 'andres', linkedin: '#' },
];

const AdnTeam = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollProgress(progress);
  };

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth, children } =
      sliderRef.current;

    // Calcula el tamaño exacto de la tarjeta actual + el gap (24px = 1.5rem)
    const cardWidth = children[0] ? children[0].offsetWidth + 24 : 300;
    const maxScroll = scrollWidth - clientWidth;

    if (direction === 'right') {
      if (scrollLeft >= maxScroll - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    } else {
      if (scrollLeft <= 10) {
        sliderRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className='adn-team'>
      <div className='adn-team__content-wrapper'>
        <div className='adn-team__container'>
          <FadeContent
            duration={0.8}
            delay={0.1}
          >
            <div className='adn-team__main-title'>
              <h2>
                {t('adnTeam.title1')} <span>{t('adnTeam.title2')}</span>
              </h2>
            </div>
          </FadeContent>

          <div className='adn-team__layout'>
            <div className='adn-team__info-column'>
              <FadeContent
                duration={0.8}
                delay={0.2}
              >
                <div className='adn-team__badge-wrapper'>
                  <div className='adn-team__badge'>
                    <span className='adn-team__badge-dot'></span>
                    {t('adnTeam.badgeLeadership')}
                  </div>
                </div>
                <p className='adn-team__description'>
                  {t('adnTeam.descLeadership')}
                </p>
              </FadeContent>
            </div>

            <div className='adn-team__grid'>
              {TEAM_MEMBERS.map((member, index) => (
                <FadeContent
                  key={index}
                  duration={0.6}
                  delay={0.3 + index * 0.1}
                >
                  <div className='team-card'>
                    <div className='team-card__image-wrapper'>
                      <img
                        src={member.image}
                        alt={member.name}
                        className='team-card__image'
                        crossOrigin='anonymous'
                        referrerPolicy='no-referrer'
                      />
                      <a
                        href={member.linkedin}
                        className='team-card__linkedin'
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin size={18} />
                      </a>
                    </div>
                    <div className='team-card__info-wrapper'>
                      <div className='team-card__info'>
                        <h3 className='team-card__name'>{member.name}</h3>
                        <p className='team-card__role'>
                          {t(`adnTeam.roles.${member.roleKey}`)}{' '}
                          {/* <-- Traducción dinámica */}
                        </p>
                      </div>
                      <button
                        className='team-card__action-btn'
                        aria-label='Ver perfil completo'
                      >
                        <ChevronRight
                          size={20}
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>

          <div className='team-slider'>
            <FadeContent
              duration={0.8}
              delay={0.2}
            >
              <div className='team-slider__header'>
                <div className='team-slider__badge-wrapper'>
                  <div className='adn-team__badge'>
                    <span className='adn-team__badge-dot'></span>
                    {t('adnTeam.badgeTeam')}
                  </div>
                </div>

                <h3 className='team-slider__title'>{t('adnTeam.descTeam')}</h3>
              </div>
            </FadeContent>

            <FadeContent
              duration={0.8}
              delay={0.4}
            >
              <div
                className='team-slider__track'
                ref={sliderRef}
                onScroll={handleScroll}
              >
                {GENERAL_TEAM.map((member, index) => (
                  <div
                    className='member-card'
                    key={index}
                  >
                    <div className='member-card__info'>
                      <h4 className='member-card__name'>{member.name}</h4>
                      <p className='member-card__role'>
                        {t(`adnTeam.roles.${member.roleKey}`)}{' '}
                        {/* <-- Traducción dinámica */}
                      </p>
                    </div>
                    <div className='member-card__footer'>
                      <a
                        href={member.linkedin}
                        className='member-card__link'
                      >
                        LINKEDIN
                      </a>
                      <a
                        href={member.linkedin}
                        className='member-card__btn'
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <ChevronRight
                          size={18}
                          strokeWidth={2.5}
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className='team-slider__controls'>
                <div className='team-slider__progress'>
                  <div
                    className='team-slider__progress-bar'
                    style={{ width: `${scrollProgress * 100}%` }}
                  ></div>
                </div>
                <div className='team-slider__arrows'>
                  <button
                    onClick={() => scroll('left')}
                    aria-label='Anterior'
                  >
                    <ChevronLeft
                      size={22}
                      strokeWidth={2}
                    />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    aria-label='Siguiente'
                  >
                    <ChevronRight
                      size={22}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            </FadeContent>
          </div>
        </div>
      </div>

      <div className='adn-team__footer-overlap'></div>
    </section>
  );
};

export default AdnTeam;
