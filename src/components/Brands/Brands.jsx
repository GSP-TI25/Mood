import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import LogoLoop from '../LogoLoop/LogoLoop';
import './Brands.scss';

const brandLogos = [
  { src: '/Logos/Amarillo.webp', alt: 'Amarillo' },
  { src: '/Logos/Autostar.webp', alt: 'AutoStar' },
  { src: '/Logos/Bahia.webp', alt: 'Bahia' },
  { src: '/Logos/Burger_king.webp', alt: 'Burger King' },
  { src: '/Logos/Chevron.webp', alt: 'Chevron' },
  { src: '/Logos/Chilis.webp', alt: 'Chilis' },
  { src: '/Logos/Comapan.webp', alt: 'Comapan' },
  { src: '/Logos/Corporacion_grupo_romero.webp', alt: 'Grupo Romero' },
  { src: '/Logos/Crocs.webp', alt: 'Crocs' },
  { src: '/Logos/Ferreyros.webp', alt: 'Ferreyros' },
  { src: '/Logos/Fiat.webp', alt: 'Fiat' },
  { src: '/Logos/Generade.webp', alt: 'Generade' },
  { src: '/Logos/Havoline.webp', alt: 'Havoline' },
  { src: '/Logos/Ishop.webp', alt: 'iShop' },
  { src: '/Logos/Jeep.webp', alt: 'Jeep' },
  { src: '/Logos/Jose_cuervo.webp', alt: 'Jose Cuervo' },
  { src: '/Logos/Kr.webp', alt: 'KR' },
  { src: '/Logos/Madam_tusan.webp', alt: 'Madam Tusan' },
  { src: '/Logos/Marcan.webp', alt: 'Marcan' },
  { src: '/Logos/Maxus.webp', alt: 'Maxus' },
  { src: '/Logos/Mercedez_benz.webp', alt: 'Mercedes Benz' },
  { src: '/Logos/Pinkberry.webp', alt: 'Pinkberry' },
  { src: '/Logos/Ram.webp', alt: 'Ram' },
  { src: '/Logos/Ron_cartavio.webp', alt: 'Ron Cartavio' },
  { src: '/Logos/Ron_viejo_de_caldas.webp', alt: 'Ron Viejo de Caldas' },
  { src: '/Logos/Oro.webp', alt: 'Sabor de Oro' },
  { src: '/Logos/Santa_ana.webp', alt: 'Santa Ana' },
  { src: '/Logos/Virutex.webp', alt: 'Virutex' },
];

const Brands = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
  const half = Math.ceil(brandLogos.length / 2);
  const firstRowLogos = brandLogos.slice(0, half);
  const secondRowLogos = brandLogos.slice(half);

  return (
    <section className='brands'>
      <div className='brands__container'>
        <p className='brands__subtitle'>{t('brands.subtitle')}</p>{' '}
        {/* <-- Traducción dinámica */}
        <div className='brands__carousel-wrapper'>
          <LogoLoop
            logos={firstRowLogos}
            speed={30}
            direction='left'
            logoHeight={45}
            gap={60}
            hoverSpeed={10}
            scaleOnHover={true}
            fadeOut={false}
          />

          <LogoLoop
            logos={secondRowLogos}
            speed={30}
            direction='right'
            logoHeight={45}
            gap={60}
            hoverSpeed={10}
            scaleOnHover={true}
            fadeOut={false}
          />
        </div>
      </div>
    </section>
  );
};

export default Brands;
