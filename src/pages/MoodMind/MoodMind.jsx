import Navbar from '../../components/Navbar/Navbar';
import MoodMindHero from '../../components/MoodMindHero/MoodMindHero';
// Importa el Footer si deseas que esta página también lo tenga
// import Footer from '../../components/Footer/Footer';
import './MoodMind.scss';
import Footer from '../../components/Footer/Footer';
import MoodMindFeatures from '../../components/MoodMindFeatures/MoodMindFeatures';

const MoodMind = () => {
  return (
    <main className='mood-mind'>
      <Navbar />

      <MoodMindHero />
      <MoodMindFeatures />

      {/* 🌟 AQUÍ DEBAJO PUEDES AGREGAR EL RESTO DE SECCIONES DE LA PÁGINA EN EL FUTURO */}

      <div className='mood-mind__footer-area'>
        <Footer />
      </div>
    </main>
  );
};

export default MoodMind;
