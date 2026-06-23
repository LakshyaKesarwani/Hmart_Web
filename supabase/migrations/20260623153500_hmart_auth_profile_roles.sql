begin;

insert into public.roles (code, name, description)
values
  ('admin', 'Admin', 'Full HMART administration access.'),
  ('buyer', 'Buyer', 'Default HMART customer role.'),
  ('delivery_partner', 'Delivery Partner', 'Delivery operations access.')
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  buyer_role_id uuid;
  profile_full_name text;
begin
  /*
    Supabase Auth owns auth.users. This trigger keeps application identity in
    public.profiles and assigns the safe default Buyer role without requiring
    an unauthenticated client insert into RLS-protected tables.
  */
  profile_full_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(split_part(new.email, '@', 1), ''),
    'HMART User'
  );

  insert into public.profiles (id, full_name, email, phone, status)
  values (
    new.id,
    profile_full_name,
    new.email,
    new.phone,
    'active'
  )
  on conflict (id) do update
  set
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    email = excluded.email,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now(),
    deleted_at = null;

  select id
  into buyer_role_id
  from public.roles
  where code = 'buyer';

  if buyer_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (new.id, buyer_role_id)
    on conflict (user_id, role_id) do nothing;
  end if;

  return new;
end;
$$;

comment on function public.handle_new_auth_user() is
'Creates a profile and assigns the Buyer role whenever Supabase Auth creates a user.';

revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.handle_new_auth_user() from anon;
revoke all on function public.handle_new_auth_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

grant select on public.roles to authenticated;
grant select on public.profiles to authenticated;
grant select on public.user_roles to authenticated;

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'roles'
      and policyname = 'Authenticated users can read roles'
  ) then
    create policy "Authenticated users can read roles"
    on public.roles
    for select
    to authenticated
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can read their own profile'
  ) then
    create policy "Users can read their own profile"
    on public.profiles
    for select
    to authenticated
    using ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
    on public.profiles
    for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can read their own role assignments'
  ) then
    create policy "Users can read their own role assignments"
    on public.user_roles
    for select
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;
end;
$$;

commit;
