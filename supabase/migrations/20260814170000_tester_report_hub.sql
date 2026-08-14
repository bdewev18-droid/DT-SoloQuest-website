create table if not exists public.tester_public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 32),
  avatar_key text not null,
  updated_at timestamptz not null default now()
);

alter table public.tester_public_profiles enable row level security;

create policy "approved testers read public profiles"
on public.tester_public_profiles for select to authenticated
using (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
  or exists (select 1 from public.site_testers st where st.user_id = (select auth.uid()) and st.status = 'active')
  )
);

create policy "testers create own public profile"
on public.tester_public_profiles for insert to authenticated
with check (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and
  user_id = (select auth.uid())
  and exists (select 1 from public.site_testers st where st.user_id = (select auth.uid()) and st.status = 'active')
);

create policy "testers update own public profile"
on public.tester_public_profiles for update to authenticated
using (user_id = (select auth.uid()) and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false')
with check (user_id = (select auth.uid()) and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false');

alter table public.tester_feedback add column if not exists admin_comment text;
alter table public.tester_feedback add column if not exists screenshot_url text;
alter table public.tester_feedback add column if not exists updated_at timestamptz not null default now();

update public.tester_feedback set status = 'en_attente'
where status not in ('en_attente','consulte','valide','rejete','en_cours_dev','a_tester','cloture');

alter table public.tester_feedback drop constraint if exists tester_feedback_status_check;
alter table public.tester_feedback add constraint tester_feedback_status_check
check (status in ('en_attente','consulte','valide','rejete','en_cours_dev','a_tester','cloture'));
alter table public.tester_feedback alter column status set default 'en_attente';

drop policy if exists "authorized users read feedback" on public.tester_feedback;
create policy "approved testers read feedback"
on public.tester_feedback for select to authenticated
using (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and (
  lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
  or exists (select 1 from public.site_testers st where st.user_id = (select auth.uid()) and st.status = 'active')
  )
);

drop policy if exists "testers submit feedback" on public.tester_feedback;
create policy "testers submit feedback"
on public.tester_feedback for insert to authenticated
with check (
  user_id = (select auth.uid())
  and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and (
    lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
    or exists (select 1 from public.site_testers st where st.user_id = (select auth.uid()) and st.status = 'active')
  )
);

create table if not exists public.tester_feedback_votes (
  feedback_id uuid not null references public.tester_feedback(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (feedback_id, user_id)
);

alter table public.tester_feedback_votes enable row level security;
create policy "approved testers read votes" on public.tester_feedback_votes for select to authenticated
using (coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false' and exists (select 1 from public.tester_feedback f where f.id = feedback_id));
create policy "testers vote as themselves" on public.tester_feedback_votes for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.tester_feedback f where f.id = feedback_id));
create policy "testers remove own vote" on public.tester_feedback_votes for delete to authenticated
using (user_id = (select auth.uid()) and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false');

create table if not exists public.tester_feedback_comments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.tester_feedback(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1500),
  created_at timestamptz not null default now()
);

alter table public.tester_feedback_comments enable row level security;
create policy "approved testers read comments" on public.tester_feedback_comments for select to authenticated
using (coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false' and exists (select 1 from public.tester_feedback f where f.id = feedback_id));
create policy "testers comment as themselves" on public.tester_feedback_comments for insert to authenticated
with check (user_id = (select auth.uid()) and exists (select 1 from public.tester_feedback f where f.id = feedback_id));
create policy "users delete own comments" on public.tester_feedback_comments for delete to authenticated
using (coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false' and (user_id = (select auth.uid()) or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-screenshots', 'report-screenshots', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "testers upload own report screenshots" on storage.objects for insert to authenticated
with check (
  bucket_id = 'report-screenshots'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and (
    exists (
      select 1 from public.site_testers tester
      where tester.user_id = (select auth.uid()) and tester.status = 'active'
    )
    or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
  )
);
create policy "users delete own report screenshots" on storage.objects for delete to authenticated
using (bucket_id = 'report-screenshots' and owner_id = (select auth.uid())::text and coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false');

grant select, insert, update on public.tester_public_profiles to authenticated;
grant select, insert, delete on public.tester_feedback_votes to authenticated;
grant select, insert, delete on public.tester_feedback_comments to authenticated;
create index if not exists tester_feedback_created_at_idx on public.tester_feedback(created_at desc);
create index if not exists tester_feedback_comments_feedback_idx on public.tester_feedback_comments(feedback_id, created_at);
create index if not exists tester_feedback_comments_user_id_idx on public.tester_feedback_comments(user_id);
create index if not exists tester_feedback_votes_user_id_idx on public.tester_feedback_votes(user_id);
