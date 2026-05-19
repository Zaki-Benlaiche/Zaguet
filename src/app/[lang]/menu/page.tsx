import { notFound } from 'next/navigation';
import { pizzas, type MenuCategory } from '@/data/pizzas';
import PizzaCard from '@/components/PizzaCard';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
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

      <div className={styles.categoriesWrapper}>
        {CATEGORIES.map((category) => {
          const categoryPizzas = pizzas.filter((p) => p.category === category);
          if (categoryPizzas.length === 0) return null;

          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h2>{dict.menu.category[category]}</h2>
                <div className={styles.divider}></div>
              </div>

              <div className={styles.pizzaGrid}>
                {categoryPizzas.map((pizza) => (
                  <PizzaCard key={pizza.id} pizza={pizza} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
