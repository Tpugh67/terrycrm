-- Demo Mode data layer (Phase 1 of PIPE-DEMO — Dashboard scope only)
-- Tables: demo_mode_settings (singleton toggle), demo_deals, demo_tasks
-- Dates are stored as day-offsets from "today", computed at render time
-- in the app — so a screenshot taken today or in six months both look
-- current, rather than a hardcoded date slowly going stale.
-- RLS: admin-only, matching the decision that Demo Mode is an
-- admin-facing marketing tool, not something regular users toggle or see.

create table public.demo_mode_settings (
  id integer primary key default 1,
  enabled boolean not null default false,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  constraint demo_mode_settings_singleton check (id = 1)
);

insert into public.demo_mode_settings (id, enabled) values (1, false);

create table public.demo_deals (
  id bigint generated always as identity primary key,
  title text not null,
  stage text not null,
  arv text not null,
  created_offset_days integer not null default 0,
  follow_up_offset_days integer
);

create table public.demo_tasks (
  id bigint generated always as identity primary key,
  title text not null,
  due_offset_days integer not null,
  status text not null default 'open'
);

alter table public.demo_mode_settings enable row level security;
alter table public.demo_deals enable row level security;
alter table public.demo_tasks enable row level security;

create policy "Admin can manage demo mode settings" on public.demo_mode_settings
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage demo deals" on public.demo_deals
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

create policy "Admin can manage demo tasks" on public.demo_tasks
  for all using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));

-- 17 open deals summing to exactly $387,450 (active pipeline value)
insert into public.demo_deals (title, stage, arv, created_offset_days, follow_up_offset_days) values
  ('Johnson Roofing Website Redesign', 'Lead Qualified', '$8,500', 3, 4),
  ('TechFlow Solutions CRM Setup', 'Lead Qualified', '$9,750', 5, 6),
  ('Riverside Auto Body Growth Plan', 'Lead Qualified', '$6,400', 2, 7),
  ('Union Square Legal Services', 'Lead Qualified', '$11,900', 7, 3),
  ('BrightPath Financial Consulting', 'Lead Qualified', '$14,300', 1, 10),
  ('Parker Family Dental Marketing', 'Lead Qualified', '$7,200', 4, 5),
  ('Summit Realty CRM Migration', 'Demo Scheduled', '$13,200', 9, 2),
  ('Lakeside Family Dental Marketing', 'Demo Scheduled', '$16,400', 11, -2),
  ('Horizon Construction Partners', 'Demo Scheduled', '$28,000', 14, 6),
  ('Meridian Insurance Group', 'Demo Scheduled', '$19,850', 8, 4),
  ('Elite Auto Detailing Expansion', 'Demo Scheduled', '$22,600', 12, 3),
  ('Elite Insurance CRM Setup', 'Proposal Sent', '$24,400', 16, 5),
  ('Pinnacle Construction Group', 'Proposal Sent', '$31,500', 19, 8),
  ('Westfield Manufacturing CRM', 'Proposal Sent', '$28,800', 15, 4),
  ('Golden Gate Consulting Setup', 'Proposal Sent', '$26,600', 18, 6),
  ('Apex Construction Enterprise', 'Negotiation', '$45,000', 24, 3),
  ('Vanguard Property Management Portfolio', 'Negotiation', '$73,050', 27, 5);

-- 7 closed-won deals summing to exactly $84,250 (closed revenue)
insert into public.demo_deals (title, stage, arv, created_offset_days, follow_up_offset_days) values
  ('Green Valley Dental', 'Closed Won', '$9,800', 38, null),
  ('Johnson Roofing LLC', 'Closed Won', '$6,200', 52, null),
  ('Coastal Auto Group', 'Closed Won', '$14,500', 29, null),
  ('Bright Smile Orthodontics', 'Closed Won', '$7,750', 44, null),
  ('Midwest Logistics Co', 'Closed Won', '$18,000', 61, null),
  ('Sunrise Realty Partners', 'Closed Won', '$11,000', 33, null),
  ('Apex Fitness Studios', 'Closed Won', '$17,000', 25, null);

-- Tasks — 3 due today (offset 0), matching the "Tasks Due Today" stat
insert into public.demo_tasks (title, due_offset_days, status) values
  ('Call Michael Johnson', 0, 'open'),
  ('Follow up after Demo — Elite Insurance', 0, 'open'),
  ('Schedule Installation — Green Valley Dental', 0, 'open'),
  ('Send Proposal to Summit Realty', 1, 'open'),
  ('Renew Annual Subscription', 5, 'open');
