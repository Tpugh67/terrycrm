Internally, `callAI` is responsible for: selecting the provider (config-
driven, defaulting to Anthropic), making the request, logging the
resulting `ai_usage_events` row (success or failure), and enforcing the
`ai_rate_limits` check before calling out.

`/api/ai/route.ts` is refactored to call `callAI(...)` instead of
containing the Anthropic fetch inline. Its existing auth/session logic
(§1.2) is preserved — this is a refactor of *what happens after* auth
passes, not a change to authentication itself.

### 4.2 Provider swap mechanism

A provider is a small adapter conforming to a shared interface (prompt
in, text + token usage out). Anthropic's adapter is the only one built
in v1. Adding OpenAI or another provider later means writing one new
adapter file and a config switch — not touching `DealAI.tsx`, `/api/ai`,
or any future feature that calls `callAI`.

### 4.3 Where future AI features plug in

Per PIPE-LEAD-001 §9 (AI Prospect Research, Website Scanner, AI-assisted
Lead Scoring, AI Outreach Assistant, AI Recommendations) and
PIPE-EXEC-001 §10 (Executive AI Assistant's various briefing/summary
features): every one of these, when built, calls `callAI(...)` with its
own `feature` string. None of them need their own usage-tracking or
rate-limiting logic — that's the entire point of centralizing this now,
before those features exist, rather than after.

## 5. Cost Estimation

A small static rate table (cost per 1M input/output tokens, per model)
lives alongside `callAI`, used to compute `estimated_cost_usd` at write
time. This is deliberately simple — a lookup table, not a live pricing
API call — and should be manually updated if Anthropic's published
pricing changes. Documented as a known maintenance item, not automated
in v1.

## 6. Rate Limiting — Replacing the In-Memory Stopgap

- Authenticated users get a real per-user limit (exact threshold TBD —
  §8 open question — informed by actual `DealAI` usage patterns once
  logged, rather than guessed upfront).
- Anonymous requests keep IP-based limiting, but backed by
  `ai_rate_limits` instead of the in-memory `Map`, so it's consistent
  across serverless instances and survives cold starts — closing the
  exact gap the current code's own comments flag as a known limitation.
- Rate-limit rejections are themselves logged to `ai_usage_events` with
  `status = "rate_limited"` — so "how often are we hitting limits" is
  itself visible, not just the limiting behavior.

## 7. Security

- `ANTHROPIC_API_KEY` (and any future provider keys) remain server-side
  only — no change from current practice, which is already correct.
- `ai_usage_events` and `ai_rate_limits` are queried only from
  server-side code (the `/api/ai` route and any future admin usage
  view) — not exposed to arbitrary client-side Supabase queries. Given
  this data could reveal usage patterns per user, RLS should restrict
  direct table access to admin roles only, matching the
  `profiles.role = 'admin'` pattern used throughout PIPE-EXEC-001.
- Prompts themselves are not stored in `ai_usage_events` in v1 — only
  metadata (tokens, feature, cost). Storing full prompt/response content
  would create a larger data-sensitivity surface (deal details, PII in
  prospect research, etc.) than this spec's cost-tracking goal actually
  requires. If a future need arises for prompt-level auditing, that
  should be its own deliberate decision, not a default.

## 8. Open Questions Before Build

- What's a reasonable per-user authenticated rate limit? No real usage
  data exists yet to base this on — a conservative starting number
  (e.g. 50/hour) with room to adjust once `ai_usage_events` is actually
  collecting data seems safer than guessing precisely now.
- Should `estimated_cost_usd` be visible anywhere in the admin UI in v1,
  or is raw data collection (queryable via Supabase directly) sufficient
  until there's a concrete reason to build a dashboard?
- Given PipeDesk doesn't have a formal `organizations` table today,
  should this spec's `org_id` concept be deferred entirely (just track
  `user_id`) until multi-user organizations are a real product feature,
  rather than half-building an org concept here first?
- Should the existing anonymous Help Center rate limit (§1.2, currently
  in-memory) be migrated to `ai_rate_limits` in the same phase as the
  authenticated-user limit, or treated as a separate, smaller follow-up
  since it already technically functions (just imperfectly)?
- Is a static cost-per-model rate table (§5) acceptable long-term, or
  should this eventually pull from a maintained pricing source? No need
  to decide now — flagging so it isn't forgotten as a v1 simplification.

## 9. Phased Build Plan

**Phase 1 — Usage tracking + feature flags foundation (Tier 1)**
- `ai_usage_events` table, RLS admin-only
- `ai_feature_flags` table, seeded with one row (`deal_ai`, enabled) for
  the only module that exists today
- `src/lib/ai.ts` abstraction layer wrapping the existing Anthropic call
  (functionally identical behavior to today when flags are enabled, but
  now logging every call and respecting the flag)
- Refactor `/api/ai/route.ts` to call `callAI(...)` instead of
  hardcoding the fetch — no behavior change for `DealAI.tsx`, which
  keeps working exactly as it does today
- Small admin settings page: list of AI modules with enable/disable
  toggles
- Verify the `"claude-sonnet-5"` model string against a live key (§1.1)
  as part of this phase, since it's touched anyway

**Phase 2 — Real rate limiting (Tier 1)**
- `ai_rate_limits` table
- Authenticated per-user limit, replacing "no limit at all" for
  logged-in users
- Migrate anonymous IP limiting from in-memory to persistent, closing
  the cold-start/multi-instance gap

**Phase 3 — Cost estimation (Tier 1)**
- Static rate table, `estimated_cost_usd` computed and stored per event

**Phase 4 — Basic internal usage visibility (Tier 1)**
- A simple admin-only view (list/aggregate query, not necessarily a
  polished dashboard) showing usage by feature and by user/time period
  — enough to actually answer "what is this costing us" without a
  direct SQL query, without over-building a v1 UI no one has asked for
  yet

**Phase 5 — AI Admin Dashboard (Tier 2, future — documented now so it
isn't forgotten, not built as part of this spec's initial rollout)**

Once Phases 1-4 are live and `ai_usage_events` has real data accumulated,
a dedicated internal dashboard becomes valuable rather than premature.
Recommended metrics, all derivable from data Phases 1-4 already collect
— this phase is aggregation and visualization, not new instrumentation:
- Total AI requests today / this month
- Estimated AI cost today / this month
- Most-used AI features/modules
- Average response time per feature
- Failed request count and rate
- Top customers/users by AI usage
- AI cost per customer, AI cost per organization (contingent on §8's
  open question about whether a real `org_id` concept exists by the
  time this phase is built)

This is explicitly sequenced *after* Phase 4, not folded into it —
building a dashboard before there's meaningful usage data to show would
be premature polish ahead of substance.

**Not phased — explicitly deferred**
- Multi-provider support beyond Anthropic (§4.2's adapter pattern makes
  this possible later; no second provider is built until there's a real
  reason to)
- Customer-facing usage dashboards or AI-specific billing/quotas (this
  spec's non-goals, §2) — Phase 5 above is an *internal* admin dashboard,
  not a customer-facing one
- Prompt-content logging (§7) — deferred pending a specific need
