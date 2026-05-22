import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- 1. IMPORTAMOS EL HOOK
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import AdnMood from './pages/AdnMood/AdnMood';
import MoodPrint from './pages/MoodPrint/MoodPrint';
import Contact from './pages/Contact/Contact';

const App = () => {
  const { t } = useTranslation(); // <-- 2. INICIALIZAMOS LA TRADUCCIÓN

  // 3. Lógica para cambiar el título de la pestaña
  useEffect(() => {
    // Guardamos el título original de la página para restaurarlo
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Cuando el usuario cambia de pestaña
        document.title = t('tab.hidden');
      } else {
        // Cuando el usuario regresa a nuestra pestaña
        document.title = t('tab.visible') || originalTitle;
      }
    };

    // Escuchamos el evento nativo del navegador
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Limpieza del evento cuando se desmonta el componente
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [t]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/adn-mood'
          element={<AdnMood />}
        />
        <Route
          path='/mood-print'
          element={<MoodPrint />}
        />
        <Route
          path='/contacto'
          element={<Contact />}
        />
      </Routes>
    </>
  );
};

export default App;
