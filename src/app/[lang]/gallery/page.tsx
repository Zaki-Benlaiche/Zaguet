import { notFound } from 'next/navigation';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import styles from './gallery.module.css';

interface GalleryItem {
  src: string;
  captionKey: keyof Awaited<ReturnType<typeof getDictionary>>['gallery']['captions'];
  size: 'large' | 'tall' | 'wide' | 'normal';
}

const ITEMS: GalleryItem[] = [
  { src: '/terrace-sea.png', captionKey: 'terraceSea', size: 'large' },
  { src: '/restaurant-sign.png', captionKey: 'restaurantSign', size: 'tall' },
  { src: '/pizza-duo.png', captionKey: 'pizzaDuo', size: 'normal' },
  { src: '/terrace-evening.png', captionKey: 'terraceEvening', size: 'wide' },
  { src: '/pizzas-table.png', captionKey: 'pizzasTable', size: 'normal' },
];

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/gallery'>) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.gallery.title, description: dict.gallery.subtitle };
}

export default async function GalleryPage({
  params,
}: PageProps<'/[lang]/gallery'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className={`container ${styles.galleryContainer}`}>
      <div className={styles.header}>
        <h1>
          <span className="text-gradient">{dict.gallery.title}</span>
        </h1>
        <p>{dict.gallery.subtitle}</p>
      </div>

      <div className={styles.masonry}>
        {ITEMS.map((item) => (
          <figure
            key={item.src}
            className={`${styles.tile} ${styles[item.size]}`}
          >
            <img
              src={item.src}
              alt={dict.gallery.captions[item.captionKey]}
              loading="lazy"
            />
            <figcaption>{dict.gallery.captions[item.captionKey]}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
