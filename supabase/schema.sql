-- ============================================================
-- Zaguet — Pizza au feu de bois
-- Supabase schema
-- ============================================================
-- Run this once in the Supabase SQL editor (or via supabase CLI).
-- Safe to re-run: uses IF NOT EXISTS / IF NOT EXISTS guards.
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin
  create type order_status as enum (
    'new',
    'confirmed',
    'preparing',
    'on_the_way',
    'delivered',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_type as enum ('delivery', 'pickup', 'dine_in');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cash', 'card_on_delivery', 'online');
exception when duplicate_object then null; end $$;

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name_fr text not null,
  name_ar text not null,
  name_en text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PIZZAS
-- ============================================================
create table if not exists public.pizzas (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  price_mad numeric(8,2) not null check (price_mad >= 0),
  name_fr text not null,
  name_ar text not null,
  name_en text not null,
  description_fr text not null,
  description_ar text not null,
  description_en text not null,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pizzas_category_idx on public.pizzas (category_id);
create index if not exists pizzas_available_idx on public.pizzas (is_available);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number bigserial unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_type delivery_type not null default 'delivery',
  delivery_address text,
  delivery_notes text,
  payment_method payment_method not null default 'cash',
  status order_status not null default 'new',
  subtotal_mad numeric(10,2) not null check (subtotal_mad >= 0),
  delivery_fee_mad numeric(8,2) not null default 0,
  total_mad numeric(10,2) not null check (total_mad >= 0),
  locale text not null default 'fr',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  pizza_id uuid references public.pizzas(id) on delete set null,
  pizza_name text not null,
  unit_price_mad numeric(8,2) not null check (unit_price_mad >= 0),
  quantity int not null check (quantity > 0),
  line_total_mad numeric(10,2) not null check (line_total_mad >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ============================================================
-- ADMIN PROFILES (linked to auth.users)
-- ============================================================
create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_pizzas_updated_at on public.pizzas;
create trigger trg_pizzas_updated_at before update on public.pizzas
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.categories enable row level security;
alter table public.pizzas enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;

-- Public read for menu data (active categories + available pizzas)
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (is_active = true);

drop policy if exists "pizzas_public_read" on public.pizzas;
create policy "pizzas_public_read" on public.pizzas
  for select using (is_available = true);

-- Public can INSERT orders (place an order) — but cannot read/update/delete
drop policy if exists "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert with check (true);

drop policy if exists "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert with check (true);

-- Admins (authenticated users with profile) can do everything
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all using (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  );

drop policy if exists "pizzas_admin_all" on public.pizzas;
create policy "pizzas_admin_all" on public.pizzas
  for all using (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  );

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all using (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all" on public.order_items
  for all using (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_profiles where user_id = auth.uid())
  );

drop policy if exists "admin_profiles_self_read" on public.admin_profiles;
create policy "admin_profiles_self_read" on public.admin_profiles
  for select using (user_id = auth.uid());

-- ============================================================
-- REALTIME (admin dashboard notifications)
-- ============================================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;

-- ============================================================
-- SEED DATA — Zaguet menu
-- ============================================================
insert into public.categories (slug, name_fr, name_ar, name_en, sort_order) values
  ('classic',     'Classique',          'كلاسيكية',            'Classic',          1),
  ('signature',   'Signature Zaguet',   'تخصصات زاكيت',         'Zaguet Signature', 2),
  ('vegetarian',  'Végétarienne',       'نباتية',              'Vegetarian',       3)
on conflict (slug) do nothing;

insert into public.pizzas
  (slug, category_id, image_url, price_mad,
   name_fr, name_ar, name_en,
   description_fr, description_ar, description_en, sort_order, is_featured)
select v.* from (values
  ('margherita-royale', (select id from public.categories where slug='classic'),    '/pizza-item.png', 65.00,
    'Margherita Royale', 'مارغريتا رويال', 'Royal Margherita',
    'Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d''olive extra vierge.',
    'صلصة طماطم سان مارزانو، موزاريلا فيور دي لاتي، ريحان طازج، زيت زيتون بكر ممتاز.',
    'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    1, true),
  ('pepperoni-feu', (select id from public.categories where slug='classic'),        '/pizza-item.png', 85.00,
    'Pepperoni Feu', 'بيبروني الجمر', 'Fire Pepperoni',
    'Double pepperoni, mozzarella, miel pimenté, flocons de piment rouge.',
    'بيبروني مضاعف، موزاريلا، عسل حار، فليفلة حمراء.',
    'Double pepperoni, mozzarella, spicy honey drizzle, red chili flakes.',
    2, true),
  ('quatre-fromages', (select id from public.categories where slug='classic'),      '/pizza-item.png', 90.00,
    'Quatre Fromages', 'الأجبان الأربعة', 'Four Cheese',
    'Mozzarella, gorgonzola doux, parmesan affiné, chèvre frais.',
    'موزاريلا، غورغونزولا، بارميزان معتق، جبن الماعز الطازج.',
    'Mozzarella, mild gorgonzola, aged parmesan, fresh goat cheese.',
    3, false),
  ('zaguet-speciale', (select id from public.categories where slug='signature'),    '/pizza-item.png', 95.00,
    'Zaguet Spéciale', 'زاكيت الخاصة', 'Zaguet Special',
    'Merguez maison, poivrons grillés, oignons confits, harissa douce.',
    'مرقاز بيتي، فلفل مشوي، بصل مكرمل، هريسة خفيفة.',
    'Homemade merguez sausage, grilled peppers, caramelized onions, mild harissa.',
    1, true),
  ('tajine-berbere', (select id from public.categories where slug='signature'),     '/pizza-item.png', 100.00,
    'Tajine Berbère', 'الطاجين الأمازيغي', 'Berber Tagine',
    'Poulet mariné aux épices, olives violettes, citron confit, oignons, persil frais.',
    'دجاج متبل بالتوابل، زيتون أرجواني، ليمون مصبر، بصل، معدنوس طازج.',
    'Spice-marinated chicken, purple olives, preserved lemon, onions, fresh parsley.',
    2, false),
  ('kefta-marocaine', (select id from public.categories where slug='signature'),    '/pizza-item.png', 95.00,
    'Kefta Marocaine', 'الكفتة المغربية', 'Moroccan Kefta',
    'Bœuf haché épicé, œuf, oignons doux, cumin, coriandre fraîche.',
    'لحم بقري مفروم متبل، بيضة، بصل، كمون، قزبر طازج.',
    'Spiced minced beef, egg, sweet onions, cumin, fresh coriander.',
    3, false),
  ('saumon-fume', (select id from public.categories where slug='signature'),        '/pizza-item.png', 120.00,
    'Saumon Fumé', 'السلمون المدخن', 'Smoked Salmon',
    'Saumon fumé, mozzarella, roquette, citron, câpres, crème fraîche.',
    'سلمون مدخن، موزاريلا، جرجير، ليمون، كبر، كريمة طازجة.',
    'Smoked salmon, mozzarella, arugula, lemon, capers, crème fraîche.',
    4, false),
  ('jardin-du-souss', (select id from public.categories where slug='vegetarian'),   '/pizza-item.png', 70.00,
    'Jardin du Souss', 'حديقة سوس', 'Souss Garden',
    'Tomates fraîches, courgettes, aubergines grillées, poivrons, olives noires.',
    'طماطم طازجة، كوسة، باذنجان مشوي، فلفل، زيتون أسود.',
    'Fresh tomatoes, zucchini, grilled eggplant, peppers, black olives.',
    1, false),
  ('champignons-truffe', (select id from public.categories where slug='vegetarian'),'/pizza-item.png', 110.00,
    'Champignons Truffe', 'فطر الكمأة', 'Truffle Mushroom',
    'Champignons sauvages, crème truffée, oignons caramélisés, thym frais.',
    'فطر بري، كريمة الكمأة، بصل مكرمل، زعتر طازج.',
    'Wild mushrooms, truffle cream, caramelized onions, fresh thyme.',
    2, false)
) as v(slug, category_id, image_url, price_mad,
       name_fr, name_ar, name_en,
       description_fr, description_ar, description_en, sort_order, is_featured)
on conflict (slug) do nothing;
