-- Migration: Community Monsters Proposals & Boss Monthly Votes
-- Table pour stocker les propositions de minions et boss faites par la communauté
create table if not exists public.community_proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  creator_name text not null,
  creator_email text not null,
  type text not null check (type in ('minion', 'boss')),
  monster_name text not null,
  minion_rank text check (minion_rank in ('green', 'blue', 'purple', 'orange')),
  concept_description text not null,
  roll_objective text not null,
  attacks jsonb not null default '[]'::jsonb,
  passive_description text,
  health integer not null default 10,
  cp integer not null default 0,
  defense_description text,
  defense_dice integer default 1,
  special_constraints text,
  image_url text,
  status text not null default 'unseen' check (status in ('unseen', 'in_review', 'validated', 'voting', 'rejected')),
  admin_notes text,
  is_featured_vote boolean not null default false
);

-- Table pour stocker les votes communautaires sur les boss du mois
create table if not exists public.community_boss_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  proposal_id uuid not null references public.community_proposals(id) on delete cascade,
  vote_type text not null check (vote_type in ('for', 'against')),
  balance_rating integer not null check (balance_rating between 1 and 5),
  feedback text,
  voter_email text,
  voter_fingerprint text
);

-- Activation de Row Level Security (RLS)
alter table public.community_proposals enable row level security;
alter table public.community_boss_votes enable row level security;

-- Politiques RLS pour community_proposals
-- 1. Tout visiteur peut proposer un monstre
drop policy if exists "anyone can submit monster proposal" on public.community_proposals;
create policy "anyone can submit monster proposal"
on public.community_proposals for insert
with check (true);

-- 2. Tout le monde peut lire les boss soumis au vote public
drop policy if exists "public can view voting proposals" on public.community_proposals;
create policy "public can view voting proposals"
on public.community_proposals for select
using (status = 'voting' or is_featured_vote = true);

-- 3. L'administrateur a tous les droits sur les propositions
drop policy if exists "admin full access to monster proposals" on public.community_proposals;
create policy "admin full access to monster proposals"
on public.community_proposals for all to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com');

-- Politiques RLS pour community_boss_votes
-- 1. Tout visiteur peut voter pour un boss
drop policy if exists "anyone can vote for a boss" on public.community_boss_votes;
create policy "anyone can vote for a boss"
on public.community_boss_votes for insert
with check (true);

-- 2. Tout le monde peut lire les votes pour afficher les scores
drop policy if exists "public can view boss votes" on public.community_boss_votes;
create policy "public can view boss votes"
on public.community_boss_votes for select
using (true);

-- 3. L'administrateur a tous les droits sur les votes
drop policy if exists "admin full access to boss votes" on public.community_boss_votes;
create policy "admin full access to boss votes"
on public.community_boss_votes for all to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'bdewev18@gmail.com');
