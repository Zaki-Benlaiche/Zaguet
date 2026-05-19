import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { OrderRow } from '@/lib/supabase/types';
import OrdersClient from './OrdersClient';

export const metadata = {
  title: 'Commandes — Admin Zaguet',
};

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const initialOrders = (data ?? []) as OrderRow[];

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.25rem' }}>Commandes</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Les nouvelles commandes apparaissent automatiquement.
        </p>
        {error && (
          <p style={{ color: '#ff6b6b', marginTop: '0.5rem' }}>
            {error.message}
          </p>
        )}
      </header>
      <OrdersClient initialOrders={initialOrders} />
    </div>
  );
}
