import { useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MoodPrintHero from '../../components/MoodPrintHero/MoodPrintHero';
import MoodPrintProjects from '../../components/MoodPrintProjects/MoodPrintProjects';
import './MoodPrint.scss';

const MoodPrint = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const projectsRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    if (projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className='mood-print'>
      <Navbar />

      <MoodPrintHero
        activeCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />

      {/* MANTENEMOS TU ESTRUCTURA ORIGINAL AQUÍ */}
      <div className='mood-print__footer-area'>
        <div ref={projectsRef}>
          <MoodPrintProjects selectedCategory={selectedCategory} />
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default MoodPrint;
