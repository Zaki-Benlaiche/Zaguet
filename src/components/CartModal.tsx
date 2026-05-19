'use client';

import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useI18n } from '@/i18n/I18nProvider';
import styles from './CartModal.module.css';

export default function CartModal() {
  const router = useRouter();
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();
  const { locale, dict } = useI18n();

  if (!isCartOpen) return null;

  const goToCheckout = () => {
    setIsCartOpen(false);
    router.push(`/${locale}/checkout`);
  };

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className={`${styles.cartPanel} glass-panel`}>
        <div className={styles.header}>
          <h2>{dict.cart.title}</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsList}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>{dict.cart.empty}</p>
              <button
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
                onClick={() => setIsCartOpen(false)}
              >
                {dict.cart.browseMenu}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} width={60} height={60} />
                </div>
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p className={styles.price}>
                    {item.price.toFixed(2)} {dict.menu.currency}
                  </p>

                  <div className={styles.quantityControls}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={dict.cart.decrease}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={dict.cart.increase}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  aria-label={dict.cart.remove}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalDisplay}>
              <span>{dict.cart.total}:</span>
              <span className={styles.totalPrice}>
                {totalPrice.toFixed(2)} {dict.menu.currency}
              </span>
            </div>
            <button
              className={`btn btn-primary ${styles.checkoutBtn}`}
              onClick={goToCheckout}
            >
              {dict.checkout.submit}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
