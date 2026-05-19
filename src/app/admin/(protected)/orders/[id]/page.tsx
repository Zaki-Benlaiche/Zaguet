import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, MapPin, Mail, Clock, MessageSquare } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { OrderRow, OrderItemRow } from '@/lib/supabase/types';
import OrderStatusActions from './OrderStatusActions';
import styles from './detail.module.css';

const STATUS_LABELS: Record<string, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  on_the_way: 'En route',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default async function OrderDetailPage({
  params,
}: PageProps<'/admin/orders/[id]'>) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: true });

  const o = order as OrderRow;
  const lineItems = (items ?? []) as OrderItemRow[];

  return (
    <div className={styles.page}>
      <Link href="/admin/orders" className={styles.back}>
        <ArrowLeft size={18} /> Retour aux commandes
      </Link>

      <header className={styles.header}>
        <div>
          <h1>
            Commande <span className={styles.orderNum}>#{o.order_number}</span>
          </h1>
          <p>{new Date(o.created_at).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
        <span className={`${styles.badge} ${styles[`status_${o.status}`] ?? ''}`}>
          {STATUS_LABELS[o.status]}
        </span>
      </header>

      <OrderStatusActions orderId={o.id} currentStatus={o.status} />

      <div className={styles.grid}>
        <section className={`${styles.card} glass-panel`}>
          <h3>Client</h3>
          <ul>
            <li><span className={styles.label}>Nom</span><strong>{o.customer_name}</strong></li>
            <li>
              <span className={styles.label}><Phone size={14} /> Téléphone</span>
              <a href={`tel:${o.customer_phone}`}>{o.customer_phone}</a>
            </li>
            {o.customer_email && (
              <li>
                <span className={styles.label}><Mail size={14} /> Email</span>
                <a href={`mailto:${o.customer_email}`}>{o.customer_email}</a>
              </li>
            )}
            <li>
              <span className={styles.label}>Service</span>
              <strong>
                {o.delivery_type === 'delivery' ? 'Livraison' : o.delivery_type === 'pickup' ? 'À emporter' : 'Sur place'}
              </strong>
            </li>
            {o.delivery_address && (
              <li>
                <span className={styles.label}><MapPin size={14} /> Adresse</span>
                <strong>{o.delivery_address}</strong>
              </li>
            )}
            {o.delivery_notes && (
              <li>
                <span className={styles.label}><MessageSquare size={14} /> Notes</span>
                <em>{o.delivery_notes}</em>
              </li>
            )}
            <li>
              <span className={styles.label}>Paiement</span>
              <strong>
                {o.payment_method === 'cash' ? 'Espèces à la livraison' : o.payment_method === 'card_on_delivery' ? 'Carte à la livraison' : 'En ligne'}
              </strong>
            </li>
            <li>
              <span className={styles.label}><Clock size={14} /> Langue</span>
              <strong>{o.locale.toUpperCase()}</strong>
            </li>
          </ul>
        </section>

        <section className={`${styles.card} glass-panel`}>
          <h3>Articles</h3>
          <table className={styles.itemsTable}>
            <thead>
              <tr><th>Article</th><th>Qté</th><th>P.U.</th><th>Total</th></tr>
            </thead>
            <tbody>
              {lineItems.map((i) => (
                <tr key={i.id}>
                  <td>{i.pizza_name}</td>
                  <td>{i.quantity}</td>
                  <td>{Number(i.unit_price_mad).toFixed(2)}</td>
                  <td>{Number(i.line_total_mad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className={styles.totals}>
            <div><dt>Sous-total</dt><dd>{Number(o.subtotal_mad).toFixed(2)} MAD</dd></div>
            {Number(o.delivery_fee_mad) > 0 && (
              <div><dt>Livraison</dt><dd>{Number(o.delivery_fee_mad).toFixed(2)} MAD</dd></div>
            )}
            <div className={styles.totalRow}>
              <dt>Total</dt><dd>{Number(o.total_mad).toFixed(2)} MAD</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
