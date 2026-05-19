'use client';

import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n/I18nProvider';
import {
  getPizzaName,
  getPizzaDescription,
  type PizzaData,
} from '@/data/pizzas';
import styles from './PizzaCard.module.css';

export default function PizzaCard({ pizza }: { pizza: PizzaData }) {
  const { addToCart } = useCart();
  const { locale, dict } = useI18n();

  const name = getPizzaName(pizza, locale);
  const description = getPizzaDescription(pizza, locale);
  const categoryLabel = dict.menu.category[pizza.category];

  const handleAdd = () => {
    addToCart({
      id: pizza.id,
      name,
      price: pizza.price,
      quantity: 1,
      image: pizza.image,
    });
  };

  return (
    <div className={`${styles.card} glass-panel`}>
      <div className={styles.imageContainer}>
        <img src={pizza.image} alt={name} className={styles.pizzaImage} />
        <span className={styles.categoryBadge}>{categoryLabel}</span>
      </div>

      <div className={styles.cardContent}>
        <h3>{name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>
            {pizza.price} {dict.menu.currency}
          </span>
          <button
            className={`btn btn-primary ${styles.addBtn}`}
            onClick={handleAdd}
            aria-label={`${dict.menu.add} — ${name}`}
          >
            <Plus size={20} />
            <span>{dict.menu.add}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
