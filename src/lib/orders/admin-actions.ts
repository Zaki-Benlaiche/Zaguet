'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/guard';
import type { OrderStatus } from '@/lib/supabase/types';

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
