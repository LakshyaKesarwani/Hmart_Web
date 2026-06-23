begin;

alter table public.product_variants
  add column if not exists unit text;

create index if not exists product_variants_product_id_idx
  on public.product_variants (product_id);

create unique index if not exists product_variants_sku_unique_idx
  on public.product_variants (sku);

alter table public.product_variants enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_variants'
      and policyname = 'Anyone can read product variants'
  ) then
    create policy "Anyone can read product variants"
    on public.product_variants
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_variants'
      and policyname = 'Admins can insert product variants'
  ) then
    create policy "Admins can insert product variants"
    on public.product_variants
    for insert
    to authenticated
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_variants'
      and policyname = 'Admins can update product variants'
  ) then
    create policy "Admins can update product variants"
    on public.product_variants
    for update
    to authenticated
    using (public.user_has_role('admin'))
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_variants'
      and policyname = 'Admins can delete product variants'
  ) then
    create policy "Admins can delete product variants"
    on public.product_variants
    for delete
    to authenticated
    using (public.user_has_role('admin'));
  end if;
end;
$$;

commit;
