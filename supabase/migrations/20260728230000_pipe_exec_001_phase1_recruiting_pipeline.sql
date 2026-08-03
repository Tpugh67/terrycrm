-- PIPE-EXEC-001 Phase 1: Executive recruiting pipeline foundation
-- Tables: exec_candidates, exec_communications, exec_tasks, exec_notes, exec_activities
-- Scope: Candidate List, Kanban Pipeline, Candidate Detail (no Equity/Offer tabs), basic Dashboard funnel
-- RLS: admin-only for now (Recruiting Lead / Interviewer roles not yet in profiles.role)

create table public.exec_candidates (
  id bigint generated always as identity primary key,
  name text not null,
  email text,
  phone text,
  role_title text not null,
  current_company text,
  linkedin_url text,
  stage text not null default 'Prospect'
    check (stage in (
      'Prospect','Contacted','Discovery Call','NDA','Executive Interview',
      'Founder Interview','Due Diligence','Reference Checks','Offer',
      'Negotiation','Accepted','Active Executive'
    )),
  source text,
  owner uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exec_communications (
  id bigint generated always as identity primary key,
  candidate_id bigint not null references public.exec_candidates(id) on delete cascade,
  type text not null check (type in ('email','call','meeting','other')),
  direction text check (direction in ('inbound','outbound')),
  subject text,
  content text,
  occurred_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.exec_tasks (
  id bigint generated always as identity primary key,
  candidate_id bigint not null references public.exec_candidates(id) on delete cascade,
  title text not null,
  due_date date,
  assigned_to uuid references public.profiles(id),
  status text not null default 'open' check (status in ('open','completed')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.exec_notes (
  id bigint generated always as identity primary key,
  candidate_id bigint not null references public.exec_candidates(id) on delete cascade,
  content text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.exec_activities (
  id bigint generated always as identity primary key,
  candidate_id bigint not null references public.exec_candidates(id) on delete cascade,
  activity_type text not null,
  detail text,
  actor uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index exec_communications_candidate_id_idx on public.exec_communications(candidate_id);
create index exec_tasks_candidate_id_idx on public.exec_tasks(candidate_id);
create index exec_notes_candidate_id_idx on public.exec_notes(candidate_id);
create index exec_activities_candidate_id_idx on public.exec_activities(candidate_id);
create index exec_candidates_stage_idx on public.exec_candidates(stage);

alter table public.exec_candidates enable row level security;
alter table public.exec_communications enable row level security;
alter table public.exec_tasks enable row level security;
alter table public.exec_notes enable row level security;
alter table public.exec_activities enable row level security;

create policy "Admin can manage exec candidates" on public.exec_candidates
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage exec communications" on public.exec_communications
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage exec tasks" on public.exec_tasks
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage exec notes" on public.exec_notes
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage exec activities" on public.exec_activities
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
