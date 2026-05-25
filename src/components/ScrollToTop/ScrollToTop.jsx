import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🌟 NUEVO: Limpiamos inmediatamente cualquier altura remanente retenida por el DOM
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';

    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
