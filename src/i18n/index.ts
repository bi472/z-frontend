import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';

const resources = {
  en: {
    translation: en
  },
  ru: {
    translation: ru
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    // specify supported languages
    supportedLngs: ['en', 'ru'],
    load: 'languageOnly',
    
    // additional options
    react: {
      useSuspense: false // prevent issues with server-side rendering
    },
    
    // ensure consistent initialization
    initImmediate: false
  });

export default i18n;
