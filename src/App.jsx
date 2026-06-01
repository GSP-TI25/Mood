import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// --- Páginas Públicas ---
import Home from './pages/Home/Home';
import AdnMood from './pages/AdnMood/AdnMood';
import MoodPrint from './pages/MoodPrint/MoodPrint';
import MoodMind from './pages/MoodMind/MoodMind'; // 🌟 Importamos la nueva página
import Contact from './pages/Contact/Contact';
import Careers from './pages/Careers/Careers';
import JobDetail from './pages/Careers/JobDetail';
import JobApplication from './pages/Careers/JobApplication';

// --- Archivos del CMS ---
import CmsLogin from './pages/Cms/CmsLogin';
import CmsDashboard from './pages/Cms/CmsDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = t('tab.hidden');
      } else {
        document.title = t('tab.visible') || originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [t]);

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* =========================================
              RUTAS PÚBLICAS (ACCESIBLES PARA TODOS)
              ========================================= */}
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

          {/* 🌟 NUEVA RUTA PARA MOOD MIND */}
          <Route
            path='/mood-mind'
            element={<MoodMind />}
          />

          <Route
            path='/contacto'
            element={<Contact />}
          />
          <Route
            path='/trabaja_con_nosotros'
            element={<Careers />}
          />
          <Route
            path='/trabaja_con_nosotros/:jobId'
            element={<JobDetail />}
          />
          <Route
            path='/trabaja_con_nosotros/:jobId/postular'
            element={<JobApplication />}
          />

          {/* =========================================
              RUTAS DEL CMS (ÁREA DE ADMINISTRACIÓN)
              ========================================= */}
          <Route
            path='/cms/login'
            element={<CmsLogin />}
          />
          <Route
            path='/cms/dashboard'
            element={
              <ProtectedRoute>
                <CmsDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
