alter table public.tester_feedback
add column if not exists admin_screenshot_urls text[] not null default '{}'::text[];

drop policy if exists "admin updates feedback" on public.tester_feedback;
create policy "admin updates feedback"
on public.tester_feedback for update to authenticated
using (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
)
with check (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
);

drop policy if exists "admin deletes feedback" on public.tester_feedback;
create policy "admin deletes feedback"
on public.tester_feedback for delete to authenticated
using (
  coalesce((select auth.jwt()) ->> 'is_anonymous', 'false') = 'false'
  and lower(coalesce((select auth.jwt()) ->> 'email', '')) = 'bdewev18@gmail.com'
);
