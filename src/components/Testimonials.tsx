import { Star, Quote } from 'lucide-react';
import type { Dictionary } from '@/i18n/dictionaries';
import styles from './Testimonials.module.css';

export default function Testimonials({
  t,
}: {
  t: Dictionary['testimonials'];
}) {
  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.header}>
        <h2>{t.title}</h2>
        <div className={styles.ratingBadge}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <span className={styles.ratingValue}>{t.rating}</span>
          <span className={styles.ratingLabel}>{t.ratingLabel}</span>
        </div>
      </div>

      <div className={styles.grid}>
        {t.items.map((item, i) => (
          <figure key={i} className={`${styles.card} glass-panel`}>
            <Quote size={28} className={styles.quoteIcon} />
            <blockquote>{item.text}</blockquote>
            <figcaption>
              <span className={styles.avatar}>{item.name.charAt(0)}</span>
              <div>
                <strong>{item.name}</strong>
                <div className={styles.miniStars}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
