'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { locales, localeLabels, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const switchLocale = (next: Locale) => {
    const segments = pathname.split('/');
    segments[1] = next;
    const newPath = segments.join('/') || `/${next}`;
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.nav.language}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={20} />
        <span className={styles.code}>{locale.toUpperCase()}</span>
      </button>
      {open && (
        <ul className={`${styles.menu} glass-panel`} role="listbox">
          {locales.map((l) => (
            <li key={l}>
              <button
                className={styles.option}
                onClick={() => switchLocale(l)}
                role="option"
                aria-selected={l === locale}
              >
                <span>{localeLabels[l]}</span>
                {l === locale && <Check size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
