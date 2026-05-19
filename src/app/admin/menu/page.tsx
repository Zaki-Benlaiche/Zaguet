import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CategoryRow, PizzaRow } from '@/lib/supabase/types';
import MenuTable from './MenuTable';
import styles from './menu.module.css';

export const metadata = { title: 'Menu — Admin Zaguet' };
export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const supabase = await createSupabaseServerClient();

  const [pizzasResp, catsResp] = await Promise.all([
    supabase
      .from('pizzas')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  const pizzas = (pizzasResp.data ?? []) as PizzaRow[];
  const categories = (catsResp.data ?? []) as CategoryRow[];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Menu</h1>
          <p>Gérez les pizzas affichées sur le site.</p>
        </div>
        <Link href="/admin/menu/new" className="btn btn-primary">
          <Plus size={18} /> Nouvelle pizza
        </Link>
      </header>

      <MenuTable pizzas={pizzas} categories={categories} />
    </div>
  );
}
