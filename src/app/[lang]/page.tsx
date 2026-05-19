import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { pizzas } from '@/data/pizzas';
import PizzaCard from '@/components/PizzaCard';
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
          <div className={styles.overlay}></div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
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
              src="/pizza-item.png"
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

      {/* About Section */}
      <section
        id="about"
        className={`container ${styles.aboutSection} glass-panel`}
      >
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
      </section>
    </div>
  );
}
