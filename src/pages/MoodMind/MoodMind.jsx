//src/pages/MoodMind/MoodMind.jsx
import Navbar from '../../components/Navbar/Navbar';
import MoodMindHero from '../../components/MoodMindHero/MoodMindHero';
import MoodMindFeatures from '../../components/MoodMindFeatures/MoodMindFeatures';
import MoodMindWorkflow from '../../components/MoodMindWorkflow/MoodMindWorkflow';
import MoodApproach from '../../components/MoodApproach/MoodApproach';
import Footer from '../../components/Footer/Footer';
import './MoodMind.scss';

const MoodMind = () => {
  return (
    <main className='mood-mind'>
      <Navbar />

      <MoodMindHero />
      <MoodMindFeatures />
      <MoodMindWorkflow />
      <MoodApproach />

      {/* 🌟 AQUÍ DEBAJO PUEDES AGREGAR EL RESTO DE SECCIONES DE LA PÁGINA EN EL FUTURO */}

      <div className='mood-mind__footer-area'>
        <Footer />
      </div>
    </main>
  );
};

export default MoodMind;
