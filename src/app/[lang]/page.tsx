import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin, Flame } from 'lucide-react';
import { pizzas } from '@/data/pizzas';
import PizzaCard from '@/components/PizzaCard';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import { getDictionary } from '@/i18n/dictionaries';
import { isLocale } from '@/i18n/config';
import styles from './page.module.css';

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const featuredPizzas = pizzas.slice(0, 3);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img
            src="/terrace-sea.png"
            alt=""
            className={styles.heroBgImage}
            aria-hidden="true"
          />
          <div className={styles.overlay}></div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <MapPin size={14} /> Aïn Achir · Annaba
            </div>
            <h1 className="animate-fade-in">
              {dict.home.heroTitle}
              <br />
              <span className="text-gradient">{dict.home.heroTitleAccent}</span>
            </h1>
            <p className={`animate-fade-in ${styles.subheadline}`}>
              {dict.home.heroSubtitle}
            </p>
            <div className={`animate-fade-in ${styles.ctaGroup}`}>
              <Link href={`/${lang}/menu`} className="btn btn-primary">
                {dict.home.ctaOrder} <ArrowRight size={20} />
              </Link>
              <Link href={`/${lang}#about`} className="btn btn-outline">
                {dict.home.ctaStory}
              </Link>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <img
              src="/pizza-duo.png"
              alt={dict.brand.name}
              className={`${styles.heroPizza} animate-float`}
            />
          </div>
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className={`container ${styles.featuredSection}`}>
        <div className={styles.sectionHeader}>
          <h2>{dict.home.popularTitle}</h2>
          <Link href={`/${lang}/menu`} className={styles.viewAll}>
            {dict.home.viewMenu} <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.pizzaGrid}>
          {featuredPizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>

      {/* Ambiance Section — NEW */}
      <section className={`container ${styles.ambianceSection}`}>
        <div className={styles.ambianceHeader}>
          <h2>
            <Flame size={28} className={styles.flameIcon} />{' '}
            {dict.home.ambianceTitle}
          </h2>
          <p>{dict.home.ambianceSubtitle}</p>
        </div>

        <div className={styles.ambianceGrid}>
          <figure className={`${styles.ambianceTile} ${styles.tileLarge}`}>
            <img src="/terrace-sea.png" alt={dict.home.ambianceSeaCaption} />
            <figcaption>{dict.home.ambianceSeaCaption}</figcaption>
          </figure>
          <figure className={styles.ambianceTile}>
            <img
              src="/restaurant-sign.png"
              alt={dict.home.ambianceOvenCaption}
            />
            <figcaption>{dict.home.ambianceOvenCaption}</figcaption>
          </figure>
          <figure className={styles.ambianceTile}>
            <img
              src="/terrace-evening.png"
              alt={dict.home.ambianceEveningCaption}
            />
            <figcaption>{dict.home.ambianceEveningCaption}</figcaption>
          </figure>
          <figure className={styles.ambianceTile}>
            <img
              src="/pizzas-table.png"
              alt={dict.home.ambianceFoodCaption}
            />
            <figcaption>{dict.home.ambianceFoodCaption}</figcaption>
          </figure>
        </div>

        <div className={styles.ambianceFooter}>
          <Link href={`/${lang}/gallery`} className="btn btn-outline">
            {dict.home.viewGallery} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Testimonials — NEW */}
      <Testimonials t={dict.testimonials} />

      {/* About Section */}
      <section
        id="about"
        className={`container ${styles.aboutSection} glass-panel`}
      >
        <div className={styles.aboutGrid}>
          <div className={styles.aboutContent}>
            <h2>
              {dict.home.aboutTitle}{' '}
              <span className="text-gradient">{dict.brand.name}</span>
              {' ?'}
            </h2>
            <p>{dict.home.aboutText}</p>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <h3>{dict.home.stat1Value}</h3>
                <span>{dict.home.stat1Label}</span>
              </div>
              <div className={styles.statBox}>
                <h3>{dict.home.stat2Value}</h3>
                <span>{dict.home.stat2Label}</span>
              </div>
              <div className={styles.statBox}>
                <h3>{dict.home.stat3Value}</h3>
                <span>{dict.home.stat3Label}</span>
              </div>
            </div>
          </div>
          <div className={styles.aboutImageWrap}>
            <img
              src="/restaurant-sign.png"
              alt={dict.brand.name}
              className={styles.aboutImage}
            />
          </div>
        </div>
      </section>

      {/* FAQ — NEW */}
      <Faq t={dict.faq} />
    </div>
  );
}
