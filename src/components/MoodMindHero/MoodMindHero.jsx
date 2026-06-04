import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import BlurText from '../BlurText/BlurText';
import FadeContent from '../FadeContent/FadeContent';
import './MoodMindHero.scss';

const MoodMindHero = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK

  const handleScroll = () => {
    const element = document.getElementById('moodmind-features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className='moodmind-hero'>
      <div className='moodmind-hero__container'>
        {/* 1. Título dividido en dos BlurText */}
        <div className='moodmind-hero__header'>
          <BlurText
            text={t('moodmindHero.title1')}
            delay={30}
            animateBy='words'
            direction='top'
            as='h1'
            className='moodmind-hero__title'
          />
          <BlurText
            text={t('moodmindHero.title2')}
            delay={50}
            animateBy='words'
            direction='top'
            as='h1'
            className='moodmind-hero__title moodmind-hero__title-light'
          />
        </div>

        {/* 2. Sección media: Botón y descripción corta */}
        <div className='moodmind-hero__middle'>
          <button
            className='moodmind-hero__scroll-btn'
            aria-label={t('moodmindHero.ariaScroll')}
            onClick={handleScroll}
          >
            <ChevronDown size={24} />
          </button>

          <div className='moodmind-hero__paragraph-wrapper'>
            <BlurText
              text={t('moodmindHero.paragraph')}
              delay={40}
              animateBy='words'
              direction='top'
              as='p'
              className='moodmind-hero__paragraph'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodMindHero;
