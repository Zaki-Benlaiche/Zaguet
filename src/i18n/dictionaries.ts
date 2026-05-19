import 'server-only';
import type { Locale } from './config';

const dictionaries = {
  fr: () => import('./dictionaries/fr.json').then((m) => m.default),
  ar: () => import('./dictionaries/ar.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
