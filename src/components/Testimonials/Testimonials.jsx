import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import './Testimonials.scss';

const REVIEWS = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    company: 'Director General, AutoStar',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80&fm=webp',
    text: '"El equipo de Mood transformó por completo nuestra estrategia de captación. No solo rediseñaron nuestra identidad, sino que las ventas online crecieron un 45% en el primer trimestre. Son verdaderos estrategas."',
  },
  {
    id: 2,
    name: 'Lucía Santamarina',
    company: 'CMO, Grupo Bahía',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80&fm=webp',
    text: '"Buscábamos una agencia que entendiera nuestra visión y la superara. El contenido audiovisual y el diseño web que entregaron están en otro nivel. Entienden perfectamente el lenguaje digital actual."',
  },
  {
    id: 3,
    name: 'Roberto Vilela',
    company: 'CEO, Marcan',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80&fm=webp',
    text: '"La comunicación y la agilidad de esta agencia son destacables. Estructuraron nuestras campañas de pauta publicitaria bajando nuestro costo de adquisición en tiempo récord. Altamente recomendados."',
  },
  {
    id: 4,
    name: 'Andrea Ruiz',
    company: 'Founder, Santa Ana',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80&fm=webp',
    text: '"El rebranding que hicieron para nuestra marca superó cualquier expectativa. Desde el logotipo hasta la estrategia en redes sociales, todo respira profesionalismo y creatividad."',
  },
  {
    id: 5,
    name: 'Martín Torres',
    company: 'Gerente de Marketing, iShop',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80&fm=webp',
    text: '"Una agencia que realmente se compromete con tus resultados. Las métricas de interacción en nuestros canales digitales se multiplicaron gracias a su gestión de comunidades."',
  },
];

const Testimonials = () => {
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
            Resultados que hablan por <span>sí solos.</span>
          </h2>
          <p className='testimonials__paragraph'>
            El éxito de tu marca es nuestra mejor carta de presentación. Como{' '}
            <strong>agencia de comunicación y marketing digital</strong>, nos
            enfocamos en generar crecimiento real, escalable y medible.
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
                    alt={review.name}
                    className='review-card__background'
                    loading='lazy'
                    width={400}
                    height={600}
                    crossOrigin='anonymous'
                    referrerPolicy='no-referrer'
                  />
                  <div className='review-card__content'>
                    <div className='review-card__meta'>
                      <h3 className='review-card__name'>{review.name}</h3>
                      <span className='review-card__company'>
                        {review.company}
                      </span>
                    </div>
                    <p className='review-card__text'>{review.text}</p>
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
