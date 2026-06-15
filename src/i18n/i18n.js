// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";

/**
 * Configuración global de internacionalización (i18n).
 * Inicializa la instancia principal de i18next e inyecta los diccionarios
 * estáticos de traducción para los idiomas soportados.
 */
i18n.use(initReactI18next).init({
	resources: {
		EN: { translation: enTranslations },
		ES: { translation: esTranslations },
	},
	lng: "ES",
	fallbackLng: "ES",
	interpolation: {
		escapeValue: false, // React ya protege contra inyecciones XSS por defecto
	},
});

export default i18n;
