import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './icons/Brand';
import { getDictionary } from '@/i18n/dictionaries';
import { type Locale } from '@/i18n/config';
import { RESTAURANT } from '@/config/restaurant';
import styles from './Footer.module.css';

export default async function Footer({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <h3 className={styles.brand}>
            <span className="text-gradient">{dict.brand.name}</span>
          </h3>
          <p className={styles.desc}>{dict.footer.description}</p>
          <div className={styles.social}>
            <a
              href={RESTAURANT.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href={RESTAURANT.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon size={20} />
            </a>
            <a
              href={RESTAURANT.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <TikTokIcon size={20} />
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>{dict.footer.quickLinks}</h4>
          <ul>
            <li>
              <Link href={`/${locale}`}>{dict.nav.home}</Link>
            </li>
            <li>
              <Link href={`/${locale}/menu`}>{dict.nav.menu}</Link>
            </li>
            <li>
              <Link href={`/${locale}#about`}>{dict.nav.about}</Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>{dict.footer.contact}</h4>
          <ul>
            <li>
              <MapPin size={16} />
              <span>{RESTAURANT.address[locale]}</span>
            </li>
            <li>
              <Phone size={16} />
              <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`}>
                {RESTAURANT.phone}
              </a>
            </li>
            <li>
              <Mail size={16} />
              <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>{dict.footer.hours}</h4>
          <ul>
            <li>
              <Clock size={16} />
              <span>{RESTAURANT.hours[locale]}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>
            © {new Date().getFullYear()} {dict.brand.name}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
