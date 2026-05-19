import Link from 'next/link';
import { ShoppingBag, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { OrderRow } from '@/lib/supabase/types';
import styles from './admin.module.css';

interface Stats {
  todayCount: number;
  todayRevenue: number;
  weekCount: number;
  weekRevenue: number;
  pendingCount: number;
  recent: Array<Pick<OrderRow, 'id' | 'order_number' | 'customer_name' | 'total_mad' | 'status' | 'created_at'>>;
}

async function loadStats(): Promise<Stats> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [today, week, pending, recent] = await Promise.all([
    supabase
      .from('orders')
      .select('total_mad', { count: 'exact' })
      .gte('created_at', startOfDay)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('total_mad', { count: 'exact' })
      .gte('created_at', weekAgo)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .in('status', ['new', 'confirmed', 'preparing', 'on_the_way']),
    supabase
      .from('orders')
      .select('id, order_number, customer_name, total_mad, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const sum = (rows: { total_mad: number }[] | null) =>
    rows?.reduce((s, r) => s + Number(r.total_mad ?? 0), 0) ?? 0;

  return {
    todayCount: today.count ?? 0,
    todayRevenue: sum(today.data),
    weekCount: week.count ?? 0,
    weekRevenue: sum(week.data),
    pendingCount: pending.count ?? 0,
    recent: (recent.data ?? []) as Stats['recent'],
  };
}

export default async function AdminDashboardPage() {
  let stats: Stats | null = null;
  let errorMessage: string | null = null;
  try {
    stats = await loadStats();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Erreur de chargement';
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de l'activité du restaurant.</p>
      </header>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {stats && (
        <>
          <div className={styles.statsGrid}>
            <StatCard
              icon={<ShoppingBag size={22} />}
              label="Commandes du jour"
              value={stats.todayCount}
            />
            <StatCard
              icon={<TrendingUp size={22} />}
              label="CA du jour"
              value={`${stats.todayRevenue.toFixed(0)} MAD`}
            />
            <StatCard
              icon={<Clock size={22} />}
              label="En cours"
              value={stats.pendingCount}
              accent
            />
            <StatCard
              icon={<CheckCircle size={22} />}
              label="CA 7 jours"
              value={`${stats.weekRevenue.toFixed(0)} MAD`}
            />
          </div>

          <section className={`${styles.section} glass-panel`}>
            <div className={styles.sectionHeader}>
              <h2>Dernières commandes</h2>
              <Link href="/admin/orders" className={styles.link}>
                Voir tout →
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <p className={styles.muted}>Aucune commande pour l'instant.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/admin/orders/${o.id}`}>#{o.order_number}</Link>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>{Number(o.total_mad).toFixed(2)} MAD</td>
                      <td>
                        <StatusBadge status={o.status} />
                      </td>
                      <td>{new Date(o.created_at).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className={`${styles.statCard} glass-panel ${accent ? styles.accent : ''}`}>
      <div className={styles.statIcon}>{icon}</div>
      <div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    new: 'Nouvelle',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    on_the_way: 'En route',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };
  return (
    <span className={`${styles.badge} ${styles[`status_${status}`] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
}
