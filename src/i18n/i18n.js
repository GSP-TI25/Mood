import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importamos los diccionarios
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n.use(initReactI18next).init({
  resources: {
    EN: { translation: enTranslations },
    ES: { translation: esTranslations },
  },
  lng: 'ES', // Idioma por defecto al entrar a la web
  fallbackLng: 'ES', // Si falta una traducción en inglés, usa español
  interpolation: {
    escapeValue: false, // React ya protege contra inyecciones XSS
  },
});

export default i18n;
