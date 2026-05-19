export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};

export const rtlLocales: Locale[] = ['ar'];

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
