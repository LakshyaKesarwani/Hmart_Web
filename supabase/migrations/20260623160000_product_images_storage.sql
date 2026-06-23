begin;

create or replace function public.user_has_role(role_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and r.code = role_code
  );
$$;

revoke all on function public.user_has_role(text) from public;
grant execute on function public.user_has_role(text) to authenticated;

alter table public.product_images
  add column if not exists storage_path text;

create index if not exists product_images_product_id_sort_order_idx
  on public.product_images (product_id, sort_order);

alter table public.product_images enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_images'
      and policyname = 'Anyone can read product images'
  ) then
    create policy "Anyone can read product images"
    on public.product_images
    for select
    to anon, authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_images'
      and policyname = 'Admins can insert product images'
  ) then
    create policy "Admins can insert product images"
    on public.product_images
    for insert
    to authenticated
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_images'
      and policyname = 'Admins can update product images'
  ) then
    create policy "Admins can update product images"
    on public.product_images
    for update
    to authenticated
    using (public.user_has_role('admin'))
    with check (public.user_has_role('admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'product_images'
      and policyname = 'Admins can delete product images'
  ) then
    create policy "Admins can delete product images"
    on public.product_images
    for delete
    to authenticated
    using (public.user_has_role('admin'));
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read access for product images'
  ) then
    create policy "Public read access for product images"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'product-images');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can upload product images'
  ) then
    create policy "Admins can upload product images"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'product-images'
      and public.user_has_role('admin')
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can update product images storage'
  ) then
    create policy "Admins can update product images storage"
    on storage.objects
    for update
    to authenticated
    using (
      bucket_id = 'product-images'
      and public.user_has_role('admin')
    )
    with check (
      bucket_id = 'product-images'
      and public.user_has_role('admin')
    );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can delete product images storage'
  ) then
    create policy "Admins can delete product images storage"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'product-images'
      and public.user_has_role('admin')
    );
  end if;
end;
$$;

commit;
