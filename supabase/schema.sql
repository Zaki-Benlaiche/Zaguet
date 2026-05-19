-- ============================================================
-- Zaguette family — Pizza italienne au feu de bois (Annaba)
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
-- SEED DATA — Zaguette family menu (pizza italienne, prix DZD)
-- Note: la colonne `price_mad` reste nommée ainsi pour des raisons
-- historiques ; elle stocke en réalité des Dinars Algériens (DA).
-- ============================================================
insert into public.categories (slug, name_fr, name_ar, name_en, sort_order) values
  ('classic',     'Classique',             'كلاسيكية',          'Classic',           1),
  ('signature',   'Signature Zaguette',    'تخصصات Zaguette',    'Zaguette Signature',2),
  ('vegetarian',  'Végétarienne',          'نباتية',             'Vegetarian',        3)
on conflict (slug) do nothing;

insert into public.pizzas
  (slug, category_id, image_url, price_mad,
   name_fr, name_ar, name_en,
   description_fr, description_ar, description_en, sort_order, is_featured)
select v.* from (values
  ('margherita', (select id from public.categories where slug='classic'), '/pizza-item.png', 700.00,
    'Margherita', 'مارغريتا', 'Margherita',
    'Sauce tomate San Marzano, mozzarella fior di latte, basilic frais, huile d''olive extra vierge.',
    'صلصة طماطم سان مارزانو، موزاريلا فيور دي لاتي، ريحان طازج، زيت زيتون بكر ممتاز.',
    'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    1, true),
  ('pepperoni', (select id from public.categories where slug='classic'), '/pizza-item.png', 950.00,
    'Pepperoni', 'بيبروني', 'Pepperoni',
    'Pepperoni épicé, mozzarella, sauce tomate, flocons de piment rouge.',
    'بيبروني حار، موزاريلا، صلصة طماطم، فليفلة حمراء.',
    'Spicy pepperoni, mozzarella, tomato sauce, red chili flakes.',
    2, true),
  ('quattro-formaggi', (select id from public.categories where slug='classic'), '/pizza-item.png', 1100.00,
    'Quattro Formaggi', 'الأجبان الأربعة', 'Quattro Formaggi',
    'Mozzarella, gorgonzola, parmesan affiné, chèvre frais. Pour les amoureux de fromage.',
    'موزاريلا، غورغونزولا، بارميزان معتق، جبن الماعز الطازج. للي يحب الجبن.',
    'Mozzarella, gorgonzola, aged parmesan, fresh goat cheese. For cheese lovers.',
    3, false),
  ('diavola', (select id from public.categories where slug='classic'), '/pizza-item.png', 1000.00,
    'Diavola', 'ديافولا', 'Diavola',
    'Salami calabrais épicé, mozzarella, sauce tomate, olives noires, miel pimenté.',
    'سلامي كالابري حار، موزاريلا، صلصة طماطم، زيتون أسود، عسل حار.',
    'Spicy calabrese salami, mozzarella, tomato sauce, black olives, hot honey.',
    4, false),
  ('zaguette-speciale', (select id from public.categories where slug='signature'), '/pizza-item.png', 1300.00,
    'Zaguette Spéciale', 'Zaguette الخاصة', 'Zaguette Special',
    'La signature de la maison : merguez maison, poivrons grillés, oignons confits, mozzarella, touche d''harissa.',
    'تخصص البيت: مرقاز بيتي، فلفل مشوي، بصل مكرمل، موزاريلا، لمسة من الهريسة.',
    'The house signature: homemade merguez, grilled peppers, caramelized onions, mozzarella, a touch of harissa.',
    1, true),
  ('capricciosa', (select id from public.categories where slug='signature'), '/pizza-item.png', 1200.00,
    'Capricciosa', 'كابريتشوزا', 'Capricciosa',
    'Jambon, champignons, artichauts, olives, œuf, mozzarella. La classique italienne par excellence.',
    'لحم مدخن، فطر، خرشوف، زيتون، بيضة، موزاريلا. الكلاسيكية الإيطالية بامتياز.',
    'Ham, mushrooms, artichokes, olives, egg, mozzarella. The Italian classic at its best.',
    2, false),
  ('quattro-stagioni', (select id from public.categories where slug='signature'), '/pizza-item.png', 1200.00,
    'Quattro Stagioni', 'الفصول الأربعة', 'Quattro Stagioni',
    'Quatre saisons dans une pizza : jambon, champignons, artichauts, olives — chacun dans son quartier.',
    'أربع فصول في بيتزا وحدة: لحم مدخن، فطر، خرشوف، زيتون — كل فصل في ركن.',
    'Four seasons in one pizza: ham, mushrooms, artichokes, olives — each in its own quarter.',
    3, false),
  ('saumon-fume', (select id from public.categories where slug='signature'), '/pizza-item.png', 1600.00,
    'Saumon Fumé', 'السلمون المدخن', 'Smoked Salmon',
    'Base crème fraîche, mozzarella, saumon fumé, roquette, câpres, citron.',
    'قاعدة كريمة طازجة، موزاريلا، سلمون مدخن، جرجير، كبر، ليمون.',
    'Crème fraîche base, mozzarella, smoked salmon, arugula, capers, lemon.',
    4, false),
  ('ortolana', (select id from public.categories where slug='vegetarian'), '/pizza-item.png', 850.00,
    'Ortolana', 'أورتولانا', 'Ortolana',
    'Tomates fraîches, courgettes, aubergines grillées, poivrons, oignons rouges, olives noires.',
    'طماطم طازجة، كوسة، باذنجان مشوي، فلفل، بصل أحمر، زيتون أسود.',
    'Fresh tomatoes, zucchini, grilled eggplant, peppers, red onions, black olives.',
    1, false),
  ('funghi-tartufo', (select id from public.categories where slug='vegetarian'), '/pizza-item.png', 1400.00,
    'Funghi Tartufo', 'فطر الكمأة', 'Funghi Tartufo',
    'Crème truffée, champignons sauvages, mozzarella, parmesan, persil frais.',
    'كريمة الكمأة، فطر بري، موزاريلا، بارميزان، معدنوس طازج.',
    'Truffle cream, wild mushrooms, mozzarella, parmesan, fresh parsley.',
    2, false)
) as v(slug, category_id, image_url, price_mad,
       name_fr, name_ar, name_en,
       description_fr, description_ar, description_en, sort_order, is_featured)
on conflict (slug) do nothing;
