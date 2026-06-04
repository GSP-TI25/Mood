import FadeContent from '../FadeContent/FadeContent';
import DotGrid from '../DotGrid/DotGrid';
import './MoodMindFeatures.scss';

const MoodMindFeatures = () => {
  return (
    <section
      className='mood-mind-features'
      id='moodmind-features'
    >
      <div className='mood-mind-features__container'>
        <FadeContent
          duration={0.8}
          delay={0.2}
          direction='bottom'
        >
          {/* 🌟 ÚNICO CONTENEDOR PRINCIPAL */}
          <div className='mood-mind-features__main-card'>
            {/* FONDO INTERACTIVO DOT GRID */}
            <div className='mood-mind-features__bg'>
              <DotGrid
                dotSize={3}
                gap={10} /* Un poco más de gap para que respire mejor */
                baseColor='#2a2a2c'
                activeColor='#4ade80'
                proximity={100}
                shockRadius={200}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
              />
            </div>

            {/* CONTENIDO SUPERPUESTO */}
            <div className='mood-mind-features__content'>
              {/* 🌟 COLUMNA 1: QUIÉNES SOMOS HOY */}
              <div className='mood-mind-features__section'>
                <div className='mood-mind-features__badge'>
                  <span className='mood-mind-features__badge-dot'></span>
                  Quiénes somos Hoy
                </div>

                {/* Tarjeta Glassmorphism */}
                <div className='mood-mind-features__glass-card'>
                  <p className='mood-mind-features__text'>
                    Mood es una unidad de negocio creativa y estratégica de
                    crecimiento impulsada por inteligencia Artificial.
                    Combinamos talento creativo, expertise digital en contenido,
                    data y tecnología para transformar el marketing en un
                    sistema inteligente, eficiente y orientado a resultados de
                    negocio.
                  </p>
                </div>
              </div>

              {/* 🌟 COLUMNA 2: QUIÉNES QUEREMOS SER */}
              <div className='mood-mind-features__section'>
                <div className='mood-mind-features__badge'>
                  <span className='mood-mind-features__badge-dot'></span>
                  Quiénes queremos ser
                </div>

                {/* Tarjeta Glassmorphism Destacada */}
                <div className='mood-mind-features__glass-card mood-mind-features__glass-card--highlight'>
                  {/* Protagonista Absoluto */}
                  <h3 className='mood-mind-features__hero-text'>
                    IA DRIVEN AGENCY.
                  </h3>

                  <p className='mood-mind-features__text'>
                    Nos encontramos en una transición sana hacia un nuevo modelo
                    de negocio donde la IA será el centro de todo con la
                    validación y curación de talento humano.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
};

export default MoodMindFeatures;
