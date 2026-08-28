-- AI usage tracking + safety circuit breaker (PIPE-AI-001 Phase 1).
-- Applied live via Supabase MCP; this file is a documentation record,
-- not auto-applied, per project convention.

create table if not exists ai_usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('deal_assistant', 'help_center', 'rep_portal', 'affiliate')),
  action_id text,
  provider text not null default 'anthropic',
  model text not null default 'claude-sonnet-5',
  input_tokens int,
  output_tokens int,
  estimated_cost_usd numeric(10,6),
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_usage_events_user_created on ai_usage_events (user_id, created_at);
create index if not exists idx_ai_usage_events_created on ai_usage_events (created_at);
create index if not exists idx_ai_usage_events_feature on ai_usage_events (feature);

alter table ai_usage_events enable row level security;

-- Deliberately no policy for the authenticated or anon role. Customers
-- get their usage count through a dedicated, service-role-backed API
-- route (/api/ai/usage) that returns only a count + limit -- never raw
-- rows, action detail, or cost. There is no direct client read/write
-- path to this table at all; only the service-role key can touch it.
create policy "Admin can manage ai_usage_events"
  on ai_usage_events for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
