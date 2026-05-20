'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PizzaCard from '@/components/PizzaCard';
import { useI18n } from '@/i18n/I18nProvider';
import {
  getPizzaName,
  getPizzaDescription,
  type PizzaData,
  type MenuCategory,
} from '@/data/pizzas';
import styles from './menu.module.css';

export default function MenuBrowser({
  items,
  categories,
}: {
  items: PizzaData[];
  categories: MenuCategory[];
}) {
  const { locale, dict } = useI18n();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<MenuCategory | 'all'>('all');

  const query = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeCat !== 'all' && item.category !== activeCat) return false;
      if (!query) return true;
      const name = getPizzaName(item, locale).toLowerCase();
      const desc = getPizzaDescription(item, locale).toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [items, activeCat, query, locale]);

  const visibleCategories =
    activeCat === 'all' ? categories : [activeCat];

  return (
    <div>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.menu.searchPlaceholder}
            aria-label={dict.menu.searchPlaceholder}
          />
        </div>

        <div className={styles.chips}>
          <button
            className={`${styles.chip} ${activeCat === 'all' ? styles.chipActive : ''}`}
            onClick={() => setActiveCat('all')}
          >
            {dict.menu.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${activeCat === cat ? styles.chipActive : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {dict.menu.category[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className={styles.noResults}>{dict.menu.noResults}</p>
      ) : (
        <div className={styles.categoriesWrapper}>
          {visibleCategories.map((category) => {
            const catItems = filtered.filter((p) => p.category === category);
            if (catItems.length === 0) return null;
            return (
              <div key={category} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2>{dict.menu.category[category]}</h2>
                  <div className={styles.divider}></div>
                </div>
                <div className={styles.pizzaGrid}>
                  {catItems.map((pizza) => (
                    <PizzaCard key={pizza.id} pizza={pizza} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
