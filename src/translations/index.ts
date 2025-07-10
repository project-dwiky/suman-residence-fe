import { en, TranslationKeys } from './en';
import { id } from './id';

export type Language = 'en' | 'id';

export const translations = {
  en,
  id
} as const;

export const getTranslation = (language: Language): TranslationKeys => {
  return translations[language] || translations.en;
};

export const defaultLanguage: Language = 'id';
export const supportedLanguages: Language[] = ['en', 'id'];

export * from './en';
export * from './id'; 