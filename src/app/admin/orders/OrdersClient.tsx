'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import type { OrderRow, OrderStatus } from '@/lib/supabase/types';
import { updateOrderStatus } from '@/lib/orders/admin-actions';
import styles from './orders.module.css';

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  on_the_way: 'En route',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_FLOW: OrderStatus[] = [
  'new',
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
];

const FILTER_OPTIONS: Array<{ value: OrderStatus | 'all' | 'active'; label: string }> = [
  { value: 'active', label: 'Actives' },
  { value: 'all', label: 'Toutes' },
  { value: 'new', label: 'Nouvelles' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'on_the_way', label: 'En route' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
];

function playBeep() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
    setTimeout(() => ctx.close(), 400);
  } catch {
    /* noop */
  }
}

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: OrderRow[];
}) {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]['value']>('active');
  const [sound, setSound] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const soundRef = useRef(sound);
  soundRef.current = sound;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel('orders-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const next = payload.new as OrderRow;
          setOrders((prev) =>
            prev.some((o) => o.id === next.id) ? prev : [next, ...prev],
          );
          if (soundRef.current) playBeep();
          if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('Nouvelle commande Zaguet', {
                body: `#${next.order_number} — ${next.customer_name}`,
              });
            }
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const next = payload.new as OrderRow;
          setOrders((prev) =>
            prev.map((o) => (o.id === next.id ? next : o)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const setStatus = async (id: string, status: OrderStatus) => {
    setBusy((b) => ({ ...b, [id]: true }));
    const result = await updateOrderStatus(id, status);
    if (result.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    }
    setBusy((b) => ({ ...b, [id]: false }));
  };

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return !['delivered', 'cancelled'].includes(o.status);
    }
    return o.status === filter;
  });

  const nextStatusOf = (status: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(status);
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.filterChip} ${filter === opt.value ? styles.filterChipActive : ''}`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          className={styles.soundToggle}
          onClick={() => setSound((s) => !s)}
          aria-label={sound ? 'Couper le son' : 'Activer le son'}
        >
          {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={`${styles.empty} glass-panel`}>
          <Bell size={32} />
          <p>Aucune commande dans cette catégorie.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((o) => {
            const next = nextStatusOf(o.status);
            return (
              <li key={o.id} className={`${styles.card} glass-panel`}>
                <div className={styles.cardTop}>
                  <div>
                    <Link href={`/admin/orders/${o.id}`} className={styles.orderNum}>
                      #{o.order_number}
                    </Link>
                    <span className={styles.customer}>{o.customer_name}</span>
                  </div>
                  <span
                    className={`${styles.badge} ${styles[`status_${o.status}`] ?? ''}`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <span>{o.customer_phone}</span>
                  <span>·</span>
                  <span>
                    {o.delivery_type === 'delivery'
                      ? 'Livraison'
                      : o.delivery_type === 'pickup'
                        ? 'À emporter'
                        : 'Sur place'}
                  </span>
                  <span>·</span>
                  <span>{new Date(o.created_at).toLocaleString('fr-FR')}</span>
                </div>

                <div className={styles.cardFooter}>
                  <strong>{Number(o.total_mad).toFixed(2)} MAD</strong>
                  <div className={styles.actions}>
                    {next && o.status !== 'cancelled' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setStatus(o.id, next)}
                        disabled={busy[o.id]}
                      >
                        → {STATUS_LABELS[next]}
                      </button>
                    )}
                    {!['delivered', 'cancelled'].includes(o.status) && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => setStatus(o.id, 'cancelled')}
                        disabled={busy[o.id]}
                      >
                        Annuler
                      </button>
                    )}
                    <Link href={`/admin/orders/${o.id}`} className="btn btn-outline">
                      Détails
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
