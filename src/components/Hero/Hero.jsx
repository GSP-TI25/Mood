import {
  Palette,
  Monitor,
  TrendingUp,
  Share2,
  Video,
  MessageCircle,
  Briefcase,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BlurText from '../BlurText/BlurText';
import Facebook from '../Icons/Facebook';
import Instagram from '../Icons/Instagram';
import Linkedin from '../Icons/Linkedin';
import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();

  const skills = [
    { nameKey: 'branding', icon: Palette },
    { nameKey: 'web', icon: Monitor },
    { nameKey: 'marketing', icon: TrendingUp },
    { nameKey: 'social', icon: Share2 },
    { nameKey: 'av', icon: Video },
  ];

  return (
    <section className='hero'>
      <div className='hero__container'>
        <BlurText
          text={t('hero.title')}
          delay={100}
          animateBy='words'
          direction='top'
          as='h1'
          highlightWords={[t('hero.highlight')]}
          className='hero__title hero__title-text' // 🌟 Añadida clase extra
        />

        <BlurText
          text={t('hero.paragraph')}
          delay={40}
          animateBy='words'
          direction='top'
          as='p'
          className='hero__paragraph'
        />

        <div className='hero__skills'>
          {skills.map((skill, index) => (
            <div
              key={index}
              className='hero__skill-item'
            >
              <skill.icon
                size={18}
                className='hero__skill-icon'
                strokeWidth={1.5}
              />
              <span className='hero__skill-text'>
                {t(`hero.skills.${skill.nameKey}`)}
              </span>
            </div>
          ))}
        </div>

        <div className='hero__actions'>
          <Link
            to='/contacto'
            className='btn-hero btn-hero--primary'
          >
            <span>{t('hero.buttons.talk')}</span>
            <MessageCircle
              size={20}
              strokeWidth={2}
            />
          </Link>
          <Link
            to='/mood-print'
            className='btn-hero btn-hero--secondary'
          >
            <span>{t('hero.buttons.projects')}</span>
            <Briefcase
              size={20}
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>

      <aside className='hero__socials-float'>
        <a
          href='https://www.facebook.com/moodper'
          target='_blank'
          rel='noreferrer'
          className='hero__social-link'
          aria-label='Facebook'
        >
          <Facebook
            size={22}
            className='hero__social-icon'
          />
        </a>
        <a
          href='https://www.instagram.com/mood.advertising/'
          target='_blank'
          rel='noreferrer'
          className='hero__social-link'
          aria-label='Instagram'
        >
          <Instagram
            size={22}
            className='hero__social-icon'
          />
        </a>
        <a
          href='https://www.linkedin.com/company/moodagenciacreativa/'
          target='_blank'
          rel='noreferrer'
          className='hero__social-link'
          aria-label='LinkedIn'
        >
          <Linkedin
            size={22}
            className='hero__social-icon'
          />
        </a>
      </aside>
    </section>
  );
};

export default Hero;
