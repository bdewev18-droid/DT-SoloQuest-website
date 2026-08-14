create table if not exists public.site_testers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(trim(email))),
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  added_by text not null default 'bdewev18@gmail.com',
  added_at timestamptz not null default now(),
  last_login_at timestamptz
);

alter table public.site_testers enable row level security;

create policy "admin manages tester allowlist"
on public.site_testers
for all
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com');

create policy "testers read their own access"
on public.site_testers
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create or replace function public.claim_tester_access()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  current_name text := coalesce(auth.jwt() -> 'user_metadata' ->> 'full_name', auth.jwt() -> 'user_metadata' ->> 'name');
  claimed_count integer;
begin
  if auth.uid() is null or current_email = '' then
    return false;
  end if;

  update public.site_testers
  set user_id = auth.uid(),
      display_name = coalesce(current_name, display_name),
      last_login_at = now()
  where email = current_email and status = 'active';

  get diagnostics claimed_count = row_count;
  return claimed_count > 0;
end;
$$;

revoke all on function public.claim_tester_access() from public;
grant execute on function public.claim_tester_access() to authenticated;
grant select on public.site_testers to authenticated;
grant insert, update, delete on public.site_testers to authenticated;

create table if not exists public.tester_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  mode text not null,
  subject text not null,
  details text not null,
  status text not null default 'recu',
  created_at timestamptz not null default now()
);

alter table public.tester_feedback enable row level security;

create policy "testers manage their own feedback"
on public.tester_feedback
for select
to authenticated
using (user_id = auth.uid() or lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com');

create policy "testers submit their own feedback"
on public.tester_feedback
for insert
to authenticated
with check (user_id = auth.uid());

create policy "admin manages all feedback"
on public.tester_feedback
for all
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com');

grant select, insert, update, delete on public.tester_feedback to authenticated;
