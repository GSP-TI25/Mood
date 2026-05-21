import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import BlurText from '../BlurText/BlurText';
import FadeContent from '../FadeContent/FadeContent';
import './Services.scss';

// Hemos limpiado los títulos y descripciones porque ahora vienen del JSON
const SERVICES_DATA = [
  {
    id: 'branding',
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80&fm=webp',
  },
  {
    id: 'web',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80&fm=webp',
  },
  {
    id: 'marketing',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80&fm=webp',
  },
  {
    id: 'social',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80&fm=webp',
  },
  {
    id: 'audiovisual',
    image:
      'https://images.unsplash.com/photo-1660326269462-b3a6b6743ea6?auto=format&fit=crop&w=600&q=80&fm=webp',
  },
];

const Services = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
  const [activeService, setActiveService] = useState(SERVICES_DATA[0]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // 1. Detectar si estamos en Tablet/Móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile(); // Check inicial
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentIndex = SERVICES_DATA.findIndex(
    (s) => s.id === activeService.id,
  );

  // 2. Funciones para navegar los slides
  const handleNext = useCallback(() => {
    setActiveService(SERVICES_DATA[(currentIndex + 1) % SERVICES_DATA.length]);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    setActiveService(
      SERVICES_DATA[
        (currentIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length
      ],
    );
  }, [currentIndex]);

  // 3. Autoplay: Solo se activa en móvil, cambia cada 6 segundos y se reinicia si el usuario hace clic.
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isMobile, handleNext]);

  return (
    <section
      className='services'
      id='servicios'
    >
      <div className='services__container'>
        <div className='services__header'>
          <h2 className='services__title'>
            {t('services.title1')}{' '}
            <span className='services__highlight'>
              {t('services.titleHighlight')}
            </span>
          </h2>
          <p className='services__description'>{t('services.headerDesc')}</p>
        </div>

        <div className='services__body'>
          <div className='services__info'>
            <BlurText
              key={`title-${activeService.id}`}
              text={t(`services.items.${activeService.id}.title`)} // Traducción dinámica
              delay={30}
              animateBy='words'
              direction='top'
              as='h3'
              className='services__info-title'
            />

            <FadeContent
              key={`desc-${activeService.id}`}
              duration={0.6}
              delay={0.1}
            >
              <p className='services__info-desc'>
                {t(`services.items.${activeService.id}.description`)} //
                Traducción dinámica
              </p>
            </FadeContent>

            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className='btn-service'
              onClick={() => navigate('/mood-print')}
            >
              <span>{t('services.btnProjects')}</span>
              <ChevronRight
                size={18}
                strokeWidth={2}
              />
            </motion.button>

            {/* --- CONTROLES MÓVILES (Ocultos en Desktop) --- */}
            <div className='services__mobile-controls'>
              <button
                className='services__control-btn'
                onClick={handlePrev}
                aria-label={t('services.aria.prev')}
              >
                <ChevronLeft size={24} />
              </button>

              <div className='services__indicators'>
                {SERVICES_DATA.map((service, index) => (
                  <button
                    key={`dot-${service.id}`}
                    className={`services__dot ${index === currentIndex ? 'services__dot--active' : ''}`}
                    onClick={() => setActiveService(service)}
                    aria-label={`${t('services.aria.goTo')}${t(`services.items.${service.id}.title`)}`}
                  />
                ))}
              </div>

              <button
                className='services__control-btn'
                onClick={handleNext}
                aria-label={t('services.aria.next')}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* --- GALERÍA (Se ocultará en móvil mediante CSS) --- */}
          <div className='services__gallery'>
            {SERVICES_DATA.map((service) => {
              const isActive = activeService.id === service.id;
              return (
                <motion.div
                  layout
                  key={service.id}
                  className={`services__card ${isActive ? 'services__card--active' : ''}`}
                  onMouseEnter={() => setActiveService(service)}
                  style={{ backgroundImage: `url(${service.image})` }}
                  role='button'
                  aria-label={`${t('services.aria.viewDetails')}${t(`services.items.${service.id}.title`)}`}
                  transition={{
                    layout: { type: 'spring', stiffness: 200, damping: 25 },
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
