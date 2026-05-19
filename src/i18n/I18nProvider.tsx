'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries';

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
