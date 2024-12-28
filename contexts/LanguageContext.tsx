'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, translations } from '@/lib/i18n/translations';
import { ConfigProvider } from 'antd';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k as keyof typeof translation];
      if (!translation) return key;
    }

    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`{{${key}}}`, String(value));
      }, translation);
    }

    return translation as string || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ConfigProvider direction={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
          {children}
        </div>
      </ConfigProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};