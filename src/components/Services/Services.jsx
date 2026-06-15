// src/components/Services/Services.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import BlurText from '../BlurText/BlurText';
import FadeContent from '../FadeContent/FadeContent';
import servicesData from '../../data/services.json';
import './Services.scss';

/**
 * Componente Services.
 * Muestra el portafolio de servicios mediante un acordeón dinámico (Desktop)
 * y un slider automático/manual (Mobile/Tablet).
 */
const Services = () => {
  const { t } = useTranslation();
  const [activeService, setActiveService] = useState(servicesData[0]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detección de Viewport para condicionar animaciones y diseño
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentIndex = servicesData.findIndex((s) => s.id === activeService.id);

  const handleNext = useCallback(() => {
    setActiveService(servicesData[(currentIndex + 1) % servicesData.length]);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    setActiveService(
      servicesData[
        (currentIndex - 1 + servicesData.length) % servicesData.length
      ],
    );
  }, [currentIndex]);

  // Autoplay para dispositivos móviles (6s)
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(handleNext, 6000);
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
              text={t(`services.items.${activeService.id}.title`)}
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
                {t(`services.items.${activeService.id}.description`)}
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

            {/* Controles de Slider (Visibles sólo en resoluciones < 900px) */}
            <div className='services__mobile-controls'>
              <button
                className='services__control-btn'
                onClick={handlePrev}
                aria-label={t('services.aria.prev')}
              >
                <ChevronLeft size={24} />
              </button>

              <div className='services__indicators'>
                {servicesData.map((service, index) => (
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

          {/* Galería Acordeón (Visible sólo en resoluciones > 900px) */}
          <div className='services__gallery'>
            {servicesData.map((service) => {
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
