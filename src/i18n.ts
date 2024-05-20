import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'vi'],
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    fallbackLng: ['en', 'vi'],
  });

export { default as i18next } from 'i18next';
