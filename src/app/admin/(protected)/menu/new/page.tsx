import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CategoryRow } from '@/lib/supabase/types';
import PizzaForm from '../PizzaForm';

export const metadata = { title: 'Nouvelle pizza — Admin Zaguet' };
export const dynamic = 'force-dynamic';

export default async function NewPizzaPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  const categories = (data ?? []) as CategoryRow[];

  return <PizzaForm categories={categories} mode="create" />;
}
