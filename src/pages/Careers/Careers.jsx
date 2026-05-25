import Navbar from '../../components/Navbar/Navbar'; // <-- Ajusta la ruta según dónde guardas tu Navbar
import CareersHero from '../../components/Careers/CareersHero';
import CareersJobs from '../../components/Careers/CareersJobs';
import Footer from '../../components/Footer/Footer'; // <-- Opcional por si deseas asegurar el Footer aquí también
import './Careers.scss';

const Careers = () => {
  return (
    <>
      <Navbar /> {/* <-- El Navbar ya está integrado en la parte superior */}
      <main className='careers-page'>
        <CareersHero />
        <CareersJobs />
      </main>
      <div className='mood-print__footer-area'>
        <Footer />
      </div>
    </>
  );
};

export default Careers;
