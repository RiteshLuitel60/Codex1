export const locales = ['en', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const dictionary = {
  en: {
    heroTitle: 'Leadership intelligence for every sovereign nation',
    heroSubtitle:
      'Verified leader profiles, confidence scoring, and transparent citations in one editorial-grade atlas.'
  },
  fr: {
    heroTitle: 'Intelligence politique pour chaque nation souveraine',
    heroSubtitle:
      'Profils vérifiés, scores de confiance et citations transparentes dans un atlas éditorial.'
  },
  es: {
    heroTitle: 'Inteligencia de liderazgo para cada nación soberana',
    heroSubtitle:
      'Perfiles verificados, puntuación de confianza y citas transparentes en un atlas editorial.'
  }
};
