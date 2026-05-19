'use client';

import { useI18n } from '@/i18n/I18nProvider';
import { RESTAURANT } from '@/config/restaurant';
import { WhatsAppIcon } from './icons/Brand';
import styles from './FloatingWhatsApp.module.css';

export default function FloatingWhatsApp() {
  const { dict } = useI18n();
  const phone = RESTAURANT.whatsapp.replace(/[^\d]/g, '');

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="WhatsApp"
      title={dict.cart.checkout}
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
