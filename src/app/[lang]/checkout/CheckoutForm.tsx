'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Truck, Store, Utensils } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { submitOrder } from '@/lib/orders/actions';
import { RESTAURANT } from '@/config/restaurant';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { DeliveryType, PaymentMethod } from '@/lib/supabase/types';
import { WhatsAppIcon } from '@/components/icons/Brand';
import styles from './checkout.module.css';

const DELIVERY_FEE = 200; // DZD

export default function CheckoutForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [alsoWhatsapp, setAlsoWhatsapp] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    orderNumber?: number;
    whatsappUrl?: string;
  } | null>(null);

  const deliveryFee = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const total = totalPrice + deliveryFee;
  const currency = dict.menu.currency;

  const buildWhatsappUrl = (orderNumber?: number) => {
    const lines: string[] = [
      dict.cart.messageGreeting,
      '',
      orderNumber
        ? `*${dict.checkout.orderNumber} #${orderNumber}*`
        : '',
      '',
    ];
    items.forEach((item) => {
      lines.push(
        `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toFixed(
          2,
        )} ${currency})`,
      );
    });
    lines.push(
      '',
      `${dict.checkout.subtotal}: ${totalPrice.toFixed(2)} ${currency}`,
    );
    if (deliveryFee > 0) {
      lines.push(
        `${dict.checkout.deliveryFee}: ${deliveryFee.toFixed(2)} ${currency}`,
      );
    }
    lines.push(`*${dict.checkout.total}: ${total.toFixed(2)} ${currency}*`, '');
    lines.push(`${dict.checkout.name}: ${name}`);
    lines.push(`${dict.checkout.phone}: ${phone}`);
    lines.push(
      `${dict.checkout.deliveryType}: ${
        deliveryType === 'delivery'
          ? dict.checkout.delivery
          : deliveryType === 'pickup'
            ? dict.checkout.pickup
            : dict.checkout.dineIn
      }`,
    );
    if (deliveryType === 'delivery' && address) {
      lines.push(`${dict.checkout.address}: ${address}`);
    }
    if (notes) lines.push(`${dict.checkout.notes}: ${notes}`);
    lines.push('', dict.cart.messageEnd);

    const text = encodeURIComponent(lines.filter((l) => l !== '').length ? lines.join('\n') : '');
    const phoneClean = RESTAURANT.whatsapp.replace(/[^\d]/g, '');
    return `https://wa.me/${phoneClean}?text=${text}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError(dict.checkout.errorEmptyCart);
      return;
    }
    setSubmitting(true);

    const result = await submitOrder({
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      delivery_type: deliveryType,
      delivery_address: deliveryType === 'delivery' ? address : null,
      delivery_notes: notes || null,
      payment_method: payment,
      delivery_fee: deliveryFee,
      locale,
      items: items.map((i) => ({
        pizza_id: i.id,
        pizza_name: i.name,
        unit_price: i.price,
        quantity: i.quantity,
      })),
    });

    setSubmitting(false);

    if (!result.ok) {
      const raw = result.error ?? 'errorSubmit';
      // Real key, with optional " (detail)" suffix in dev
      const [key, ...rest] = raw.split(' ');
      const suffix = rest.join(' ');
      const base =
        (dict.checkout[key as keyof typeof dict.checkout] as
          | string
          | undefined) ?? dict.checkout.errorSubmit;
      setError(suffix ? `${base} ${suffix}` : base);
      return;
    }

    const whatsappUrl = buildWhatsappUrl(result.orderNumber);
    setSuccess({ orderNumber: result.orderNumber, whatsappUrl });
    clearCart();
    if (alsoWhatsapp) {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (success) {
    return (
      <div className={`container ${styles.successWrapper}`}>
        <div className={`${styles.successCard} glass-panel`}>
          <ShoppingBag size={64} className={styles.successIcon} />
          <h1>{dict.checkout.successTitle}</h1>
          {success.orderNumber && (
            <p className={styles.orderNumber}>
              {dict.checkout.orderNumber}{' '}
              <strong>#{success.orderNumber}</strong>
            </p>
          )}
          <p className={styles.successSub}>{dict.checkout.successSubtitle}</p>
          <div className={styles.successActions}>
            {success.whatsappUrl && (
              <a
                href={success.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <WhatsAppIcon size={18} />
                {dict.checkout.openWhatsapp}
              </a>
            )}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.push(`/${locale}/menu`)}
            >
              {dict.checkout.newOrder}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`container ${styles.emptyWrapper}`}>
        <div className={`${styles.emptyCard} glass-panel`}>
          <ShoppingBag size={48} />
          <h2>{dict.cart.empty}</h2>
          <Link href={`/${locale}/menu`} className="btn btn-primary">
            {dict.cart.browseMenu}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutContainer}`}>
      <Link href={`/${locale}/menu`} className={styles.backLink}>
        <ArrowLeft size={18} /> {dict.checkout.back}
      </Link>

      <div className={styles.header}>
        <h1>
          <span className="text-gradient">{dict.checkout.title}</span>
        </h1>
        <p>{dict.checkout.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.grid}>
        <div className={styles.formSide}>
          <section className={`${styles.section} glass-panel`}>
            <h3>{dict.checkout.yourInfo}</h3>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>{dict.checkout.name} *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.checkout.namePlaceholder}
                  autoComplete="name"
                />
              </label>
              <label className={styles.field}>
                <span>{dict.checkout.phone} *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={dict.checkout.phonePlaceholder}
                  autoComplete="tel"
                  dir="ltr"
                />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>{dict.checkout.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.checkout.emailPlaceholder}
                  autoComplete="email"
                  dir="ltr"
                />
              </label>
            </div>
          </section>

          <section className={`${styles.section} glass-panel`}>
            <h3>{dict.checkout.deliveryType}</h3>
            <div className={styles.choiceRow}>
              {(
                [
                  ['delivery', Truck, dict.checkout.delivery],
                  ['pickup', Store, dict.checkout.pickup],
                  ['dine_in', Utensils, dict.checkout.dineIn],
                ] as const
              ).map(([value, Icon, label]) => (
                <label
                  key={value}
                  className={`${styles.choice} ${
                    deliveryType === value ? styles.choiceActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    value={value}
                    checked={deliveryType === value}
                    onChange={() => setDeliveryType(value)}
                  />
                  <Icon size={24} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {deliveryType === 'delivery' && (
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>{dict.checkout.address} *</span>
                <input
                  type="text"
                  required={deliveryType === 'delivery'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={dict.checkout.addressPlaceholder}
                  autoComplete="street-address"
                />
              </label>
            )}

            <label className={`${styles.field} ${styles.fieldFull}`}>
              <span>{dict.checkout.notes}</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={dict.checkout.notesPlaceholder}
              />
            </label>
          </section>

          <section className={`${styles.section} glass-panel`}>
            <h3>{dict.checkout.payment}</h3>
            <div className={styles.choiceRow}>
              {(
                [
                  ['cash', dict.checkout.cash],
                  ['card_on_delivery', dict.checkout.cardOnDelivery],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`${styles.choice} ${
                    payment === value ? styles.choiceActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={payment === value}
                    onChange={() => setPayment(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className={`${styles.summarySide} glass-panel`}>
          <h3>{dict.checkout.yourOrder}</h3>
          <ul className={styles.itemsList}>
            {items.map((item) => (
              <li key={item.id}>
                <span className={styles.itemName}>
                  {item.quantity}× {item.name}
                </span>
                <span className={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(2)} {currency}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.summaryRows}>
            <div>
              <span>{dict.checkout.subtotal}</span>
              <span>
                {totalPrice.toFixed(2)} {currency}
              </span>
            </div>
            {deliveryFee > 0 && (
              <div>
                <span>{dict.checkout.deliveryFee}</span>
                <span>
                  {deliveryFee.toFixed(2)} {currency}
                </span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>{dict.checkout.total}</span>
              <span className={styles.totalValue}>
                {total.toFixed(2)} {currency}
              </span>
            </div>
          </div>

          <label className={styles.alsoWa}>
            <input
              type="checkbox"
              checked={alsoWhatsapp}
              onChange={(e) => setAlsoWhatsapp(e.target.checked)}
            />
            <span>{dict.checkout.alsoSendWhatsapp}</span>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={submitting}
          >
            {submitting ? dict.checkout.submitting : dict.checkout.submit}
          </button>
        </aside>
      </form>
    </div>
  );
}
