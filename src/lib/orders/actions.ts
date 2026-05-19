'use server';

import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { DeliveryType, PaymentMethod } from '@/lib/supabase/types';
import { isLocale, type Locale } from '@/i18n/config';

export interface OrderItemInput {
  pizza_id?: string | null;
  pizza_name: string;
  unit_price: number;
  quantity: number;
}

export interface SubmitOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_type: DeliveryType;
  delivery_address?: string | null;
  delivery_notes?: string | null;
  payment_method: PaymentMethod;
  delivery_fee: number;
  locale: Locale;
  items: OrderItemInput[];
}

export interface SubmitOrderResult {
  ok: boolean;
  orderNumber?: number;
  orderId?: string;
  error?: string;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function validate(input: SubmitOrderInput): string | null {
  if (!input.customer_name?.trim()) return 'errorRequired';
  if (!input.customer_phone?.trim()) return 'errorRequired';
  if (input.customer_phone.replace(/\D/g, '').length < 9) return 'errorPhone';
  if (input.delivery_type === 'delivery' && !input.delivery_address?.trim()) {
    return 'errorRequired';
  }
  if (!input.items.length) return 'errorEmptyCart';
  if (!isLocale(input.locale)) return 'errorRequired';
  return null;
}

export async function submitOrder(
  input: SubmitOrderInput,
): Promise<SubmitOrderResult> {
  const validationError = validate(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.unit_price * i.quantity,
    0,
  );
  const total = subtotal + (input.delivery_fee || 0);

  if (!isSupabaseConfigured()) {
    // Fallback: pretend success so the WhatsApp flow still works.
    // The user must configure Supabase to actually persist orders.
    console.warn('[orders] Supabase not configured — skipping DB write.');
    return { ok: true, orderNumber: Date.now() % 100000 };
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: input.customer_name.trim(),
        customer_phone: input.customer_phone.trim(),
        customer_email: input.customer_email?.trim() || null,
        delivery_type: input.delivery_type,
        delivery_address: input.delivery_address?.trim() || null,
        delivery_notes: input.delivery_notes?.trim() || null,
        payment_method: input.payment_method,
        subtotal_mad: subtotal,
        delivery_fee_mad: input.delivery_fee || 0,
        total_mad: total,
        locale: input.locale,
        status: 'new',
      })
      .select('id, order_number')
      .single();

    if (orderError || !order) {
      console.error('[orders] insert failed', orderError);
      return { ok: false, error: 'errorSubmit' };
    }

    const itemRows = input.items.map((i) => ({
      order_id: order.id,
      pizza_id: i.pizza_id ?? null,
      pizza_name: i.pizza_name,
      unit_price_mad: i.unit_price,
      quantity: i.quantity,
      line_total_mad: i.unit_price * i.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemRows);

    if (itemsError) {
      console.error('[orders] items insert failed', itemsError);
      // Best-effort cleanup
      await supabase.from('orders').delete().eq('id', order.id);
      return { ok: false, error: 'errorSubmit' };
    }

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.order_number,
    };
  } catch (err) {
    console.error('[orders] unexpected error', err);
    return { ok: false, error: 'errorSubmit' };
  }
}
