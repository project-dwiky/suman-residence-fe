import { cookies } from 'next/headers';
import { Language, defaultLanguage, supportedLanguages } from '@/translations';


export async function getLanguageFromCookies(): Promise<Language> {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  
  if (languageCookie && supportedLanguages.includes(languageCookie.value as Language)) {
    return languageCookie.value as Language;
  }
  
  return defaultLanguage;
}

export function setLanguageCookie(language: Language) {
  // This would be used client-side to set the cookie
  document.cookie = `language=${language}; path=/; max-age=31536000`; // 1 year
} 