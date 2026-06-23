begin;

create table if not exists public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  description text,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists inventory_locations_code_unique_idx
  on public.inventory_locations (code)
  where deleted_at is null;

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.inventory_locations (id),
  variant_id uuid not null references public.product_variants (id),
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  reorder_threshold integer not null default 10 check (reorder_threshold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location_id, variant_id),
  check (quantity_reserved <= quantity_on_hand)
);

create index if not exists inventory_location_id_idx
  on public.inventory (location_id);

create index if not exists inventory_variant_id_idx
  on public.inventory (variant_id);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  movement_type text not null check (
    movement_type in ('incoming', 'outgoing', 'transfer', 'adjustment')
  ),
  variant_id uuid not null references public.product_variants (id),
  location_id uuid not null references public.inventory_locations (id),
  to_location_id uuid references public.inventory_locations (id),
  quantity integer not null check (quantity > 0),
  quantity_before integer not null check (quantity_before >= 0),
  quantity_after integer not null check (quantity_after >= 0),
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists inventory_movements_created_at_idx
  on public.inventory_movements (created_at desc);

create index if not exists inventory_movements_movement_type_idx
  on public.inventory_movements (movement_type);

alter table public.inventory_locations enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_movements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_locations'
      and policyname = 'Anyone can read inventory locations'
  ) then
    create policy "Anyone can read inventory locations"
    on public.inventory_locations
    for select
    to anon, authenticated
    using (deleted_at is null);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_locations'
      and policyname = 'Admins can insert inventory locations'
  ) then
    create policy "Admins can insert inventory locations"
    on public.inventory_locations
    for insert
    to authenticated
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_locations'
      and policyname = 'Admins can update inventory locations'
  ) then
    create policy "Admins can update inventory locations"
    on public.inventory_locations
    for update
    to authenticated
    using (public.user_has_role('admin'))
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_locations'
      and policyname = 'Admins can delete inventory locations'
  ) then
    create policy "Admins can delete inventory locations"
    on public.inventory_locations
    for delete
    to authenticated
    using (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory'
      and policyname = 'Anyone can read inventory'
  ) then
    create policy "Anyone can read inventory"
    on public.inventory
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory'
      and policyname = 'Admins can insert inventory'
  ) then
    create policy "Admins can insert inventory"
    on public.inventory
    for insert
    to authenticated
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory'
      and policyname = 'Admins can update inventory'
  ) then
    create policy "Admins can update inventory"
    on public.inventory
    for update
    to authenticated
    using (public.user_has_role('admin'))
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory'
      and policyname = 'Admins can delete inventory'
  ) then
    create policy "Admins can delete inventory"
    on public.inventory
    for delete
    to authenticated
    using (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_movements'
      and policyname = 'Anyone can read inventory movements'
  ) then
    create policy "Anyone can read inventory movements"
    on public.inventory_movements
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inventory_movements'
      and policyname = 'Admins can insert inventory movements'
  ) then
    create policy "Admins can insert inventory movements"
    on public.inventory_movements
    for insert
    to authenticated
    with check (public.user_has_role('admin'));
  end if;
end;
$$;

commit;
