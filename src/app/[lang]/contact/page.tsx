import { notFound } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import { RESTAURANT } from '@/config/restaurant';
import { WhatsAppIcon } from '@/components/icons/Brand';
import styles from './contact.module.css';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({
  params,
}: PageProps<'/[lang]/contact'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const phoneClean = RESTAURANT.phone.replace(/\s/g, '');
  const waClean = RESTAURANT.whatsapp.replace(/[^\d]/g, '');
  const addressEncoded = encodeURIComponent(RESTAURANT.address.fr);

  return (
    <div className={`container ${styles.contactContainer}`}>
      <div className={styles.header}>
        <h1>
          <span className="text-gradient">{dict.contact.title}</span>
        </h1>
        <p>{dict.contact.subtitle}</p>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.infoCard} glass-panel`}>
          <ul className={styles.infoList}>
            <li>
              <span className={styles.icon}>
                <MapPin size={22} />
              </span>
              <div>
                <h4>{dict.contact.addressLabel}</h4>
                <p>{RESTAURANT.address[lang]}</p>
              </div>
            </li>
            <li>
              <span className={styles.icon}>
                <Phone size={22} />
              </span>
              <div>
                <h4>{dict.contact.phoneLabel}</h4>
                <a href={`tel:${phoneClean}`}>{RESTAURANT.phone}</a>
              </div>
            </li>
            <li>
              <span className={styles.icon}>
                <Mail size={22} />
              </span>
              <div>
                <h4>{dict.contact.emailLabel}</h4>
                <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
              </div>
            </li>
            <li>
              <span className={styles.icon}>
                <Clock size={22} />
              </span>
              <div>
                <h4>{dict.contact.hoursLabel}</h4>
                <p>{RESTAURANT.hours[lang]}</p>
              </div>
            </li>
          </ul>

          <div className={styles.ctaRow}>
            <a
              href={`tel:${phoneClean}`}
              className={`btn btn-primary ${styles.cta}`}
            >
              <Phone size={18} />
              {dict.contact.callNow}
            </a>
            <a
              href={`https://wa.me/${waClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-outline ${styles.cta}`}
            >
              <WhatsAppIcon size={18} />
              {dict.contact.whatsapp}
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${addressEncoded}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-outline ${styles.cta}`}
            >
              <Navigation size={18} />
              {dict.contact.getDirections}
            </a>
          </div>
        </div>

        <div className={`${styles.mapCard} glass-panel`}>
          <iframe
            src={RESTAURANT.mapsEmbedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${dict.brand.name} — ${dict.contact.addressLabel}`}
          />
        </div>
      </div>
    </div>
  );
}
