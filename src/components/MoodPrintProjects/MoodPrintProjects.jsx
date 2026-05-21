import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import FadeContent from '../FadeContent/FadeContent';
import Masonry from '../Masonry/Masonry';
import ProjectModal from '../ProjectModal/ProjectModal';
import './MoodPrintProjects.scss';

// Mantenemos la estructura de datos, pero quitamos el título y descripción fijos.
const PROJECTS_DATA = [
  {
    id: '1',
    category: 'Branding', // <-- La llave de filtrado no cambia
    client: 'AutoStar Motors',
    date: 'Octubre 2023', // Podrías traducir esto también si lo deseas
    img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    height: 700,
    url: 'https://ejemplo.com',
  },
  {
    id: '2',
    category: 'Diseño Web',
    client: 'Grupo Bahía',
    date: 'Enero 2024',
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    height: 500,
    url: 'https://ejemplo.com',
  },
  {
    id: '3',
    category: 'Marketing Digital',
    client: 'Marcan',
    date: 'Marzo 2024',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    height: 900,
    url: 'https://ejemplo.com',
  },
  {
    id: '4',
    category: 'Social Media',
    client: 'Santa Ana',
    date: 'Diciembre 2023',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    height: 600,
    url: 'https://ejemplo.com',
  },
  {
    id: '5',
    category: 'Contenido Audiovisual',
    client: 'iShop',
    date: 'Noviembre 2023',
    img: 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&w=800&q=80',
    height: 800,
    url: 'https://ejemplo.com',
  },
  {
    id: '6',
    category: 'Branding',
    client: 'Café Orígenes',
    date: 'Julio 2023',
    img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80',
    height: 550,
    url: 'https://ejemplo.com',
  },
  {
    id: '7',
    category: 'Diseño Web',
    client: 'Fintech Solutions',
    date: 'Mayo 2024',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    height: 750,
    url: 'https://ejemplo.com',
  },
];

const MoodPrintProjects = ({ selectedCategory }) => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK
  const [selectedProject, setSelectedProject] = useState(null);

  // 1. Filtramos los proyectos usando la categoría base en español
  const baseFilteredProjects =
    selectedCategory === 'Todos'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter(
          (project) => project.category === selectedCategory,
        );

  // 2. Inyectamos la traducción del título, descripción y categoría a cada proyecto filtrado
  const filteredProjects = baseFilteredProjects.map((project) => ({
    ...project,
    title: t(`moodPrintProjects.projects.${project.id}.title`),
    description: t(`moodPrintProjects.projects.${project.id}.description`),
    categoryTranslated: t(`moodPrintHero.categories.${project.category}`), // Traduce "Diseño Web" -> "Web Design" para el modal
  }));

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section className='mood-projects'>
      <div className='mood-projects__container'>
        <div className='mood-projects__header'>
          <FadeContent
            key={selectedCategory} // <-- Cambiado para forzar la re-animación de título
            duration={0.8}
            delay={0.1}
            direction='bottom'
          >
            <h2 className='mood-projects__title'>
              {t(`moodPrintProjects.categoryInfo.${selectedCategory}.title`)}{' '}
              {/* <-- Traducción dinámica */}
            </h2>
            <p className='mood-projects__description'>
              {t(`moodPrintProjects.categoryInfo.${selectedCategory}.desc`)}{' '}
              {/* <-- Traducción dinámica */}
            </p>
          </FadeContent>
        </div>

        <div className='mood-projects__grid'>
          {filteredProjects.length > 0 ? (
            <Masonry
              key={selectedCategory}
              items={filteredProjects}
              ease='power3.out'
              duration={0.8}
              stagger={0.08}
              animateFrom='bottom'
              scaleOnHover={true}
              hoverScale={0.96}
              blurToFocus={true}
              colorShiftOnHover={false}
              onItemClick={(project) => setSelectedProject(project)}
            />
          ) : (
            <p
              style={{ textAlign: 'center', marginTop: '4rem', color: 'gray' }}
            >
              {t('moodPrintProjects.emptyState')}{' '}
              {/* <-- Traducción dinámica */}
            </p>
          )}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default MoodPrintProjects;
