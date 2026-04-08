import { ar } from './ar';
import { en } from './en';

export type Language = 'ar' | 'en';
export type Translations = typeof ar;

export const translations = { ar, en } as const;

export function getTranslations(lang: Language): Translations {
  return translations[lang] as Translations;
}

export { ar, en };
