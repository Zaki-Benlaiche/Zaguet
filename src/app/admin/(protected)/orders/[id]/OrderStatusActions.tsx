'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/lib/orders/admin-actions';
import type { OrderStatus } from '@/lib/supabase/types';
import styles from './detail.module.css';

const STATUS_FLOW: OrderStatus[] = [
  'new',
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
];

const LABELS: Record<OrderStatus, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmer',
  preparing: 'En préparation',
  on_the_way: 'En route',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export default function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(currentStatus);

  const setStatus = (next: OrderStatus) => {
    setOptimistic(next);
    startTransition(async () => {
      await updateOrderStatus(orderId, next);
    });
  };

  return (
    <div className={styles.timeline}>
      {STATUS_FLOW.map((s, idx) => {
        const reachedIndex = STATUS_FLOW.indexOf(optimistic);
        const isReached = reachedIndex >= 0 && idx <= reachedIndex;
        const isCurrent = optimistic === s;
        const isCancelled = optimistic === 'cancelled';
        return (
          <button
            key={s}
            className={`${styles.step} ${isReached ? styles.stepReached : ''} ${isCurrent ? styles.stepCurrent : ''}`}
            onClick={() => setStatus(s)}
            disabled={pending || isCancelled}
          >
            <span className={styles.stepDot}>{idx + 1}</span>
            <span className={styles.stepLabel}>{LABELS[s]}</span>
          </button>
        );
      })}
      <button
        className={`${styles.step} ${styles.stepCancel} ${optimistic === 'cancelled' ? styles.stepCurrent : ''}`}
        onClick={() => setStatus('cancelled')}
        disabled={pending || optimistic === 'cancelled' || optimistic === 'delivered'}
      >
        <span className={styles.stepDot}>×</span>
        <span className={styles.stepLabel}>Annuler</span>
      </button>
    </div>
  );
}
