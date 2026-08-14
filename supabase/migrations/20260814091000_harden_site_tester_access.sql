revoke execute on function public.claim_tester_access() from anon;

drop policy if exists "admin manages tester allowlist" on public.site_testers;
drop policy if exists "testers read their own access" on public.site_testers;

create policy "authorized users read tester access"
on public.site_testers
for select
to authenticated
using (
  lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''))
  or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
);

create policy "admin inserts tester access"
on public.site_testers
for insert
to authenticated
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com');

create policy "admin updates tester access"
on public.site_testers
for update
to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com');

create policy "admin deletes tester access"
on public.site_testers
for delete
to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com');

drop policy if exists "testers manage their own feedback" on public.tester_feedback;
drop policy if exists "testers submit their own feedback" on public.tester_feedback;
drop policy if exists "admin manages all feedback" on public.tester_feedback;

create policy "authorized users read feedback"
on public.tester_feedback
for select
to authenticated
using (
  user_id = (select auth.uid())
  or lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
);

create policy "testers submit feedback"
on public.tester_feedback
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "admin updates feedback"
on public.tester_feedback
for update
to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com');

create policy "admin deletes feedback"
on public.tester_feedback
for delete
to authenticated
using (lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com');

create index if not exists tester_feedback_user_id_idx on public.tester_feedback(user_id);
