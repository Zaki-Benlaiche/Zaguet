'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import type { CategoryRow, PizzaRow } from '@/lib/supabase/types';
import {
  togglePizzaAvailability,
  deletePizza,
} from '@/lib/menu/admin-actions';
import styles from './menu.module.css';

export default function MenuTable({
  pizzas: initialPizzas,
  categories,
}: {
  pizzas: PizzaRow[];
  categories: CategoryRow[];
}) {
  const [pizzas, setPizzas] = useState(initialPizzas);
  const [, startTransition] = useTransition();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name_fr]));

  const toggle = (id: string, current: boolean) => {
    setPizzas((p) =>
      p.map((x) => (x.id === id ? { ...x, is_available: !current } : x)),
    );
    startTransition(async () => {
      await togglePizzaAvailability(id, !current);
    });
  };

  const remove = (id: string) => {
    if (!confirm('Supprimer cette pizza ?')) return;
    setPizzas((p) => p.filter((x) => x.id !== id));
    startTransition(async () => {
      await deletePizza(id);
    });
  };

  if (pizzas.length === 0) {
    return (
      <div className={`${styles.empty} glass-panel`}>
        <p>Aucune pizza pour l'instant.</p>
        <Link href="/admin/menu/new" className="btn btn-primary">
          Créer la première
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.tableWrap} glass-panel`}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Disponible</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pizzas.map((p) => (
            <tr key={p.id}>
              <td>
                <div className={styles.pizzaCell}>
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name_fr} width={40} height={40} />
                  )}
                  <div>
                    <strong>{p.name_fr}</strong>
                    <small>{p.slug}</small>
                  </div>
                </div>
              </td>
              <td>{p.category_id ? catMap[p.category_id] ?? '—' : '—'}</td>
              <td><strong>{Number(p.price_mad).toFixed(2)} MAD</strong></td>
              <td>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={p.is_available}
                    onChange={() => toggle(p.id, p.is_available)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </td>
              <td>
                <div className={styles.rowActions}>
                  <Link href={`/admin/menu/${p.id}`} className={styles.iconBtn} aria-label="Modifier">
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => remove(p.id)}
                    className={`${styles.iconBtn} ${styles.danger}`}
                    aria-label="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
