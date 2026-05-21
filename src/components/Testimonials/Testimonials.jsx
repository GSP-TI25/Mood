import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import './Testimonials.scss';

// Limpiamos los textos, solo dejamos el ID y la Imagen
const REVIEWS = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80&fm=webp',
  },
];

const Testimonials = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar ancho de pantalla para ajustar el offset de las tarjetas
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 475);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const cardVariants = {
    active: { x: '0%', scale: 1, opacity: 1, filter: 'blur(0px)', zIndex: 3 },
    prev: {
      // Reducimos el offset en móvil para que no se salga de la pantalla
      x: isMobile ? '-35%' : '-55%',
      scale: isMobile ? 0.75 : 0.7,
      opacity: 0.5,
      filter: 'blur(0px)',
      zIndex: 2,
    },
    next: {
      x: isMobile ? '35%' : '55%',
      scale: isMobile ? 0.75 : 0.7,
      opacity: 0.55,
      filter: 'blur(0px)',
      zIndex: 2,
    },
    hidden: {
      x: '0%',
      scale: 0.5,
      opacity: 0,
      filter: 'blur(10px)',
      zIndex: 1,
    },
  };

  return (
    <section
      className='testimonials'
      id='agencia'
    >
      <div className='testimonials__container'>
        <div className='testimonials__seo-column'>
          <h2 className='testimonials__title'>
            {t('testimonials.title1')} <span>{t('testimonials.title2')}</span>
          </h2>
          <p className='testimonials__paragraph'>
            {t('testimonials.desc1')}
            <strong>{t('testimonials.descStrong')}</strong>
            {t('testimonials.desc2')}
          </p>
        </div>

        <div className='testimonials__carousel-column'>
          <div className='testimonials__carousel'>
            {REVIEWS.map((review, i) => {
              let offset = i - activeIndex;
              if (offset < -2) offset += REVIEWS.length;
              if (offset > 2) offset -= REVIEWS.length;

              let position = 'hidden';
              if (offset === 0) position = 'active';
              else if (
                offset === -1 ||
                (offset === REVIEWS.length - 1 && activeIndex === 0)
              )
                position = 'prev';
              else if (
                offset === 1 ||
                (offset === -(REVIEWS.length - 1) &&
                  activeIndex === REVIEWS.length - 1)
              )
                position = 'next';

              return (
                <motion.div
                  key={review.id}
                  className='review-card'
                  variants={cardVariants}
                  initial='hidden'
                  animate={position}
                  transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => setActiveIndex(i)}
                >
                  <img
                    src={review.image}
                    alt={t(`testimonials.reviews.${review.id}.name`)} // <-- Traducción dinámica
                    className='review-card__background'
                    loading='lazy'
                    width={400}
                    height={600}
                    crossOrigin='anonymous'
                    referrerPolicy='no-referrer'
                  />
                  <div className='review-card__content'>
                    <div className='review-card__meta'>
                      <h3 className='review-card__name'>
                        {t(`testimonials.reviews.${review.id}.name`)}{' '}
                        {/* <-- Traducción dinámica */}
                      </h3>
                      <span className='review-card__company'>
                        {t(`testimonials.reviews.${review.id}.company`)}{' '}
                        {/* <-- Traducción dinámica */}
                      </span>
                    </div>
                    <p className='review-card__text'>
                      {t(`testimonials.reviews.${review.id}.text`)}{' '}
                      {/* <-- Traducción dinámica */}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
