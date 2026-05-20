'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Dictionary } from '@/i18n/dictionaries';
import styles from './Faq.module.css';

export default function Faq({ t }: { t: Dictionary['faq'] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={`container ${styles.section}`}>
      <div className={styles.header}>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>

      <div className={styles.list}>
        {t.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`${styles.item} ${isOpen ? styles.itemOpen : ''} glass-panel`}
            >
              <button
                className={styles.question}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                />
              </button>
              <div
                className={styles.answerWrap}
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className={styles.answerInner}>
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
