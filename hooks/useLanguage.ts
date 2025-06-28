import { useState, useEffect } from 'react';
import { translations } from '@/constants/Languages';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi' | 'pa'>('en');

  const t = (key: keyof typeof translations.en) => {
    return translations[currentLanguage][key] || translations.en[key];
  };

  const changeLanguage = (lang: 'en' | 'hi' | 'pa') => {
    setCurrentLanguage(lang);
  };

  return { currentLanguage, t, changeLanguage };
}