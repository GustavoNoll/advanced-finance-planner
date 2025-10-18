import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ptBR } from '@/locales/pt-BR';
import { enUS } from '@/locales/en-US';
import { detectLanguage } from './locale-detection';

const detectedLanguage = detectLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: ptBR
      },
      'en-US': {
        translation: enUS
      }
    },
    lng: detectedLanguage,
    fallbackLng: detectedLanguage,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 