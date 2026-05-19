'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/guard';
import type { PizzaRow } from '@/lib/supabase/types';

export interface PizzaInput {
  slug: string;
  category_id: string | null;
  image_url: string | null;
  price_mad: number;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
}

export type PizzaActionResult = { ok: boolean; error?: string; id?: string };

function validate(input: PizzaInput): string | null {
  if (!input.slug?.trim()) return 'Slug requis.';
  if (!input.name_fr?.trim() || !input.name_ar?.trim() || !input.name_en?.trim()) {
    return 'Le nom est requis dans les 3 langues.';
  }
  if (!(input.price_mad >= 0)) return 'Prix invalide.';
  return null;
}

export async function createPizza(input: PizzaInput): Promise<PizzaActionResult> {
  await requireAdmin();
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pizzas')
    .insert(input)
    .select('id')
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/menu');
  return { ok: true, id: data.id };
}

export async function updatePizza(
  id: string,
  input: Partial<PizzaRow>,
): Promise<PizzaActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('pizzas').update(input).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/menu');
  return { ok: true, id };
}

export async function deletePizza(id: string): Promise<PizzaActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('pizzas').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/menu');
  return { ok: true };
}

export async function togglePizzaAvailability(
  id: string,
  is_available: boolean,
): Promise<PizzaActionResult> {
  return updatePizza(id, { is_available });
}
