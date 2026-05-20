import { notFound } from 'next/navigation';
import { pizzas, type MenuCategory } from '@/data/pizzas';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import MenuBrowser from './MenuBrowser';
import styles from './menu.module.css';

const CATEGORIES: MenuCategory[] = [
  'classic',
  'signature',
  'vegetarian',
  'pasta',
  'antipasti',
  'dessert',
  'drink',
];

export async function generateMetadata({ params }: PageProps<'/[lang]/menu'>) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${dict.nav.menu}`,
    description: dict.menu.subtitle,
  };
}

export default async function MenuPage({ params }: PageProps<'/[lang]/menu'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className={`container ${styles.menuContainer}`}>
      <div className={styles.header}>
        <h1>
          {dict.menu.title}{' '}
          {dict.menu.titleAccent && (
            <span className="text-gradient">{dict.menu.titleAccent}</span>
          )}
        </h1>
        <p>{dict.menu.subtitle}</p>
      </div>

      <MenuBrowser items={pizzas} categories={CATEGORIES} />
    </div>
  );
}
