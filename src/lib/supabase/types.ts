// Hand-maintained Supabase types. Once you have CLI access, regenerate via:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
// and replace this file's imports.

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'cash' | 'card_on_delivery' | 'online';

export type CategoryRow = {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type PizzaRow = {
  id: string;
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
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_type: DeliveryType;
  delivery_address: string | null;
  delivery_notes: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  subtotal_mad: number;
  delivery_fee_mad: number;
  total_mad: number;
  locale: string;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  pizza_id: string | null;
  pizza_name: string;
  unit_price_mad: number;
  quantity: number;
  line_total_mad: number;
  created_at: string;
};

export type AdminProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'admin' | 'staff';
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      pizzas: {
        Row: PizzaRow;
        Insert: Omit<PizzaRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<PizzaRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<
          OrderRow,
          'id' | 'order_number' | 'created_at' | 'updated_at'
        > & {
          id?: string;
          order_number?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      admin_profiles: {
        Row: AdminProfileRow;
        Insert: Omit<AdminProfileRow, 'created_at'> & { created_at?: string };
        Update: Partial<AdminProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      delivery_type: DeliveryType;
      payment_method: PaymentMethod;
    };
    CompositeTypes: Record<string, never>;
  };
};
