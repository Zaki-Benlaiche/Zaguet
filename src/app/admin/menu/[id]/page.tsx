import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { CategoryRow, PizzaRow } from '@/lib/supabase/types';
import PizzaForm from '../PizzaForm';

export const metadata = { title: 'Modifier pizza — Admin Zaguet' };
export const dynamic = 'force-dynamic';

export default async function EditPizzaPage({
  params,
}: PageProps<'/admin/menu/[id]'>) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [pizzaResp, catsResp] = await Promise.all([
    supabase.from('pizzas').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
  ]);

  if (!pizzaResp.data) notFound();

  return (
    <PizzaForm
      initial={pizzaResp.data as PizzaRow}
      categories={(catsResp.data ?? []) as CategoryRow[]}
      mode="edit"
    />
  );
}
