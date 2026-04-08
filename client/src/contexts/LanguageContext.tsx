import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '@/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check URL param first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    if (urlLang === 'en' || urlLang === 'ar') return urlLang;
    // Then localStorage
    const stored = localStorage.getItem('xbolt-language') as Language;
    if (stored === 'en' || stored === 'ar') return stored;
    // Default to Arabic
    return 'ar';
  });

  const isRTL = language === 'ar';
  const t = getTranslations(language);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('xbolt-language', lang);
    // Update document direction and lang
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = lang === 'ar'
      ? "'Cairo', sans-serif"
      : "'Inter', 'Tektur', sans-serif";
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    // Apply on mount
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = language === 'ar'
      ? "'Cairo', sans-serif"
      : "'Inter', sans-serif";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
