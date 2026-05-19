'use client';

import { ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n/I18nProvider';
import CartModal from './CartModal';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { locale, dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          <Link href={`/${locale}`} className={styles.logo} onClick={close}>
            {dict.brand.name}
          </Link>

          <nav
            className={`${styles.navLinks} ${
              mobileMenuOpen ? styles.mobileOpen : ''
            }`}
          >
            <Link href={`/${locale}`} onClick={close}>
              {dict.nav.home}
            </Link>
            <Link href={`/${locale}/menu`} onClick={close}>
              {dict.nav.menu}
            </Link>
            <Link href={`/${locale}/gallery`} onClick={close}>
              {dict.nav.gallery}
            </Link>
            <Link href={`/${locale}#about`} onClick={close}>
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} onClick={close}>
              {dict.nav.contact}
            </Link>
          </nav>

          <div className={styles.actions}>
            <LanguageSwitcher />
            <button
              className={styles.cartBtn}
              onClick={() => setIsCartOpen(true)}
              aria-label={dict.nav.openCart}
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </button>
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={dict.nav.openCart}
            >
              {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>
      </header>

      <CartModal />
    </>
  );
}
