import 'server-only';
import { type Locale } from './constants';

const dictionaries = {
  en: () => import('../dictionaries/en').then((module) => module.en),
  am: () => import('../dictionaries/am').then((module) => module.am),
  om: () => import('../dictionaries/om').then((module) => module.om),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
