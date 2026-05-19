import {
  Palette,
  Monitor,
  TrendingUp,
  Share2,
  Video,
  MessageCircle,
  Briefcase,
} from 'lucide-react';
import BlurText from '../BlurText/BlurText';
import Facebook from '../Icons/Facebook';
import Instagram from '../Icons/Instagram';
import Linkedin from '../Icons/Linkedin';
import './Hero.scss';

const Hero = () => {
  const skills = [
    { name: 'Branding', icon: Palette },
    { name: 'Diseño Web', icon: Monitor },
    { name: 'Marketing Digital', icon: TrendingUp },
    { name: 'Social Media', icon: Share2 },
    { name: 'Contenido AudioVisual', icon: Video },
  ];

  return (
    <section className='hero'>
      <div className='hero__container'>
        <BlurText
          text='Diseñamos experiencias con proposito'
          delay={100}
          animateBy='words'
          direction='top'
          as='h1'
          highlightWords={['experiencias']}
          className='hero__title'
        />

        <BlurText
          text='La agencia de comunicación que revoluciona el marketing. Especialistas en ATL, Digital, PR y BTL, ofrecemos soluciones para potenciar tu marca.'
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
              <span className='hero__skill-text'>{skill.name}</span>
            </div>
          ))}
        </div>

        <div className='hero__actions'>
          <button className='btn-hero btn-hero--primary'>
            <span>Hablemos</span>
            <MessageCircle
              size={20}
              strokeWidth={2}
            />
          </button>
          <button className='btn-hero btn-hero--secondary'>
            <span>Ver Proyectos</span>
            <Briefcase
              size={20}
              strokeWidth={2}
            />
          </button>
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
