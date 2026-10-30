-- Sammex Imports starter schema. Apply in Supabase SQL editor after creating a project.
create extension if not exists pgcrypto;
create type public.product_status as enum ('ready_stock','pre_order');
create type public.order_status as enum ('pending','payment_pending','paid','processing','in_transit','arrived','completed','cancelled');
create table public.products (
 id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null,
 description text, category text not null, status public.product_status not null,
 price_ghs numeric(12,2), price_usd numeric(12,2), stock_quantity integer not null default 0,
 image_urls text[] not null default '{}', active boolean not null default true,
 created_at timestamptz not null default now(),
 constraint at_least_one_price check (price_ghs is not null or price_usd is not null)
);
create table public.orders (
 id uuid primary key default gen_random_uuid(), order_number text unique not null,
 customer_name text not null, email text, phone text not null,
 currency text not null check(currency in ('GHS','USD')),
 subtotal numeric(12,2) not null, shipping_fee numeric(12,2) not null default 0,
 shipping_status text not null default 'calculated_after_arrival',
 status public.order_status not null default 'pending',
 notes text, created_at timestamptz not null default now()
);
create table public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id), product_name text not null,
 product_status public.product_status not null, quantity integer not null check(quantity > 0),
 unit_price numeric(12,2) not null, currency text not null check(currency in ('GHS','USD'))
);
create table public.importer_leads (
 id uuid primary key default gen_random_uuid(), name text not null, business_name text,
 phone text not null, email text, product_request text not null,
 target_quantity text, notes text, created_at timestamptz not null default now()
);
-- Enable RLS. Public catalogue is readable; all mutations must be performed by trusted server/admin.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.importer_leads enable row level security;
create policy "Public can view active products" on public.products for select using (active = true);
-- Do not add public write policies for orders, order_items or importer_leads.
-- Create an owner account in Supabase Auth and implement server-side owner role checks before admin mutations.
