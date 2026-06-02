import FadeContent from '../FadeContent/FadeContent';
import BlurText from '../BlurText/BlurText';
import { motion } from 'motion/react';
import './MoodMindFeatures.scss';

const FEATURES_DATA = [
  {
    id: 'rapida',
    number: '01',
    title: 'Producción rápida',
    description:
      'La IA reduce tiempos en edición, retoque, mockups, renders y adaptaciones. Mood convierte esa velocidad en piezas listas para campaña.',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'precisa',
    number: '02',
    title: 'Producción precisa',
    description:
      'La IA detecta formatos, tendencias y performance. Mood adapta cada pieza al canal correcto (RRSS, pauta, B2B, retail, eventos).',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'eficiente',
    number: '03',
    title: 'Producción eficiente',
    description:
      'Menos reprocesos. Menos pruebas innecesarias. Más claridad desde el brief hasta la entrega final.',
    image:
      'https://images.unsplash.com/photo-1614113489855-66422ad300a4?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'creativa',
    number: '04',
    title: 'Producción creativa',
    description:
      'La IA genera múltiples rutas visuales en minutos. Mood selecciona, dirige y eleva la mejor idea con criterio estratégico.',
    image:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200',
  },
];

const MoodMindFeatures = () => {
  return (
    <section className='mood-mind-features'>
      <div className='mood-mind-features__container'>
        {/* 🌟 HEADER PRINCIPAL */}
        <div className='mood-mind-features__header'>
          <h2 className='mood-mind-features__header-title'>
            <BlurText
              text='Producción inteligente con'
              as='span'
              delay={30}
              animateBy='words'
              direction='top'
            />{' '}
            <span className='mood-mind-features__highlight'>
              <BlurText
                text='IA'
                as='span'
                delay={120}
                animateBy='words'
                direction='top'
              />
            </span>
          </h2>

          <FadeContent
            duration={0.8}
            delay={0.2}
            direction='bottom'
          >
            <p className='mood-mind-features__header-desc'>
              Optimizamos cada etapa de nuestro flujo de trabajo con
              Inteligencia Artificial para entregarte campañas ágiles, precisas
              y sin límites creativos.
            </p>
          </FadeContent>
        </div>

        {/* 🌟 LISTA DE CARACTERÍSTICAS ZIG-ZAG */}
        <div className='mood-mind-features__list'>
          {FEATURES_DATA.map((feature, index) => {
            // Detectar si es fila par (index 1, 3) para invertir el layout
            const isReverse = index % 2 !== 0;

            return (
              <div
                key={feature.id}
                className={`mood-mind-features__row ${isReverse ? 'mood-mind-features__row--reverse' : ''}`}
              >
                {/* 1. NÚMERO (Siempre a la izquierda) */}
                <div className='mood-mind-features__col-number'>
                  <span>{feature.number}</span>
                </div>

                {/* 2. TEXTO (TÍTULO Y DESCRIPCIÓN) */}
                <div className='mood-mind-features__col-text'>
                  <h3 className='mood-mind-features__title'>{feature.title}</h3>
                  <motion.p
                    className='mood-mind-features__desc'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* 3. IMAGEN (Crece animada) */}
                <div className='mood-mind-features__col-media'>
                  <motion.div
                    className='mood-mind-features__image-mask'
                    // Inicia como cuadrado
                    initial={{ width: '400px' }}
                    // Se expande al 100% de su espacio disponible
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.img
                      src={feature.image}
                      alt={feature.title}
                      className='mood-mind-features__image'
                      // Animación inversa del zoom de la imagen
                      initial={{ scale: 1.3 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      loading='lazy'
                    />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MoodMindFeatures;
