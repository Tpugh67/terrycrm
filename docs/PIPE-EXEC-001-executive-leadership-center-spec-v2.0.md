# PIPE-EXEC-001 — Executive Leadership Center Specification v2.0
## (Supersedes v1.0 "Executive Recruitment Center")

Status: Draft — not yet built
Owner: Terry Pugh
Related specs: Sales & Marketing Center Spec v1.0, Lead Generation Center
Spec v1.0, AI Output Integrity Policy, PIPE-EXEC-001 v1.0 (recruitment
foundation, retained and expanded below)

## 0. What Changed From v1.0

v1.0 covered executive **recruiting** — sourcing through signed offer.
This version keeps that entire pipeline intact (§4-6 below map directly
to v1.0's §2-6) and adds what happens **after** the offer is accepted:
ongoing executive management, company strategy, board/investor
relations, and equity administration over years, not just during a
search. Recruiting is now one section of a larger system, not the whole
system.

## 1. Vision

### Purpose

The Executive Leadership Center is the operating system for building and
managing PipeDesk's leadership — from the first outreach message to a
prospective executive, through years of that person's tenure, board
governance, and (eventually) investor relations. It replaces a
collection of disconnected tools (spreadsheets, email threads, a
separate cap table tool, ad hoc board decks) with one system that
understands the full lifecycle of a leadership relationship.

### Goals

1. Everything from v1.0 (time-to-hire, equity accuracy, restricted
   compensation access, AI-assisted screening).
2. Give an Active Executive a real home in the system after hire — goals,
   reviews, meeting history — instead of the record going stale the
   moment recruiting ends.
3. Give founders a single strategy workspace tying company goals to the
   people responsible for them.
4. Support board and (eventually) investor relationships with the same
   rigor as executive data — these are equally consequential
   relationships.
5. Prepare, but do not fully build, the investor/cap-table layer — this
   is explicitly **future-ready architecture**, not a Phase 1-5 build
   target (see §9 and §12).

### User roles (expanded from v1.0 §1)

- **Admin / Founder** — full access, including compensation, equity,
  cap table (when built), and board materials.
- **Recruiting Lead** — unchanged from v1.0: pipeline and interview
  access, not compensation/equity.
- **Interviewer** — unchanged from v1.0.
- **Executive** (new) — the hired person's own view: their own OKRs,
  tasks, meeting history, and (for themselves only) their own
  compensation/equity/vesting status. Cannot see other executives'
  compensation.
- **Board Member / Advisor** (new) — sees board materials, strategic
  summaries, and whatever is explicitly shared with them; does not see
  day-to-day operational data (tasks, individual performance reviews)
  unless specifically granted.
- **Investor** (future) — scoped narrowly to data-room documents and
  whatever reporting is explicitly shared; not a near-term build target.

### Business objectives

Everything in v1.0's business objectives, plus:
- Reduce the chance that a company goal has no clear owner, by tying
  Strategic Initiatives (§7) directly to named executives.
- Create one system of record for board governance, reducing scramble
  before board meetings.
- Build the architecture now so that investor relations and cap table
  management (§8) don't require a system migration later — even though
  they're not being built yet.

## 2. Database Design

### Retained from v1.0 (unchanged)
`exec_candidates`, `exec_communications`, `exec_tasks`, `exec_interviews`,
`exec_interview_feedback`, `exec_documents`, `exec_equity_proposals`,
`exec_offer_letters`, `exec_notes`, `exec_references`, `exec_activities`.
See v1.0 §2 for full field definitions — these still power the
recruiting pipeline (§4-6) unchanged.

### New: Executive Leadership tables

**`executives`** — created automatically when a candidate reaches
"Active Executive" (v1.0's final pipeline stage). Links back to the
originating `exec_candidates` row (so recruiting history isn't lost),
current title, department, start date, reporting-line reference (self-
referencing, for the org chart), status (active/departed), departure
date and reason if applicable.

**`exec_org_chart_positions`** — separate from `executives` so the org
structure can be edited independently of who currently holds a role:
title, reports_to (self-referencing), department, whether currently
filled (linked executive_id or null if open).

**`exec_okrs`** — quarterly OKRs per executive: objective (text), key
results (structured list with target/current values), quarter, year,
status (on-track/at-risk/missed/achieved), linked executive.

**`exec_annual_goals`** — same shape as OKRs but yearly, and can link to
a company-level goal in `strategy_annual_goals` (§7) rather than only an
individual executive.

**`exec_strategic_initiatives`** — company or department-level
initiatives: title, description, owner (executive), status, target
date, linked company goal.

**`exec_performance_reviews`** — review cycle records: executive,
reviewer(s), review period, structured feedback, rating/summary,
status (draft/finalized), visibility (self + admin only, by default —
see §11).

**`exec_leadership_meetings`** — separate from `exec_interviews`
(different purpose): meeting type (1:1, leadership team, board — cross-
referenced with `board_meetings` if it's a board meeting), attendees,
date, agenda reference, notes.

**`exec_meeting_agendas`** — agenda items per meeting: title, owner,
linked discussion notes, order.

**`exec_action_items`** — action items generated from a meeting: title,
owner, due date, status, linked meeting.

**`exec_decision_log`** — durable record of significant decisions:
decision, context/rationale, decided by, date, linked meeting (if
applicable), linked strategic initiative (if applicable). This is
explicitly a historical record, not a task list — decisions don't get
"completed," they get logged.

**`exec_board_communications`** — updates sent to the board outside of
formal meetings: subject, content/summary, sent date, sent by,
recipients (board members).

**`exec_compensation_history`** — historical record of compensation
changes per executive: effective date, base, bonus structure, change
reason, approved by. Append-only — never edit a past record, only add a
new one with a new effective date, so history is preserved. **Restricted
table.**

**`exec_equity_grants`** — expands `exec_equity_proposals` from v1.0 for
ongoing (not just initial-offer) equity events: executive, grant type
(initial/refresh/bonus), amount, grant date, vesting terms (see §8),
status. **Restricted table.**

**`exec_vesting_events`** — individual vesting tranches, generated from
an equity grant's vesting schedule: grant_id, vest_date, amount, vested
(boolean, flips as time passes or is confirmed). **Restricted table.**

### New: Strategy Center tables

**`strategy_annual_goals`** — company-level annual goals: title,
description, year, owner (executive), status.

**`strategy_quarterly_objectives`** — company-level quarterly
objectives, can link to `strategy_annual_goals`.

**`strategy_company_kpis`** — tracked company metrics: name, target,
current value, unit, update frequency, owner.

**`strategy_risks`** — risk register: description, severity, likelihood,
owner, mitigation plan, status.

**`strategy_opportunities`** — opportunity register: description,
potential impact, owner, status.

**`strategy_growth_initiatives`** — larger cross-functional initiatives,
similar shape to `exec_strategic_initiatives` but explicitly
company-growth-focused (could potentially be merged with that table
during implementation — flagged as an open question, §9).

**`strategy_product_roadmap_items`** — roadmap entries: title,
description, target quarter, status, owner.

**`strategy_partnership_opportunities`** — potential partnerships:
company name, contact, status, potential value/rationale, owner.

### New: Board & Advisors tables

**`board_members`** — name, contact info, role (board member/advisor),
joined date, status (active/former).

**`board_meetings`** — meeting date, attendees, agenda reference (shared
shape with `exec_meeting_agendas`), minutes/notes, materials reference.

**`board_documents`** — uploaded board materials: meeting reference (if
applicable), document type, uploaded by, visibility (board-level
restricted, see §11).

**`board_recommendations`** — formal recommendations made by the board:
description, related meeting, status (pending/adopted/declined).

**`board_votes`** (future-ready, not built in near-term phases) — motion
description, related meeting, vote results per board member, outcome.
Schema defined now so it exists when needed; no UI built until a real
governance need arises (see §9).

### New: Investor Management tables (future-ready only — see §9)

Schema sketched here so the architecture doesn't need to change later,
but **none of this is a near-term build target**:

- `investors` — name, firm, contact info, relationship status.
- `fundraising_rounds` — round name, target amount, status, timeline.
- `investor_communications` — same shape as `exec_communications`,
  scoped to investors.
- `investment_history` — round, investor, amount, date, instrument type.
- `data_room_documents` — document, visibility scope, access log.
- Cap table itself is explicitly **not** modeled yet — cap tables have
  real legal/compliance complexity (option pools, conversion terms,
  liquidation preferences) that deserves its own dedicated spec and
  likely a specialized integration (e.g. Carta) rather than a
  from-scratch build. See §9.

## 3. Complete UI

### Retained from v1.0 (unchanged)
Candidate List, Kanban Pipeline, Candidate Detail, Interview Center,
Interview Scheduling Modal, Interview Feedback Modal, Equity Center
(expanded, see below), Offer Center, Documents. See v1.0 §3 for detail.

### Executive Profile (new — replaces Candidate Detail after hire)
Purpose: the ongoing home for an Active Executive. Components: header
(name, title, department, start date), tabs for: OKRs & Goals,
Performance Reviews, Meetings, Compensation & Equity (restricted),
Documents, Notes, Activity Timeline. Recruiting history from their
`exec_candidates` record remains accessible but archival.

### Organizational Chart
Purpose: visual reporting-structure view. Components: hierarchical chart
rendered from `exec_org_chart_positions`, click-through to Executive
Profile, indicator for open/unfilled positions.

### Leadership Dashboard
Purpose: single view of the whole leadership function. Components:
current executive team roster, open executive searches (pulled from the
recruiting pipeline, §4-6), executive KPI progress, company objectives
snapshot, quarterly priorities, strategic initiatives status, executive
task completion rate, leadership analytics summary (§9 KPIs plus new
leadership-specific ones).

### Executive Meetings (Meeting Scheduler, Agenda, Action Items)
Purpose: plan and run leadership meetings. Components: scheduler
(candidate — sorry, executive/attendee picker, date/time, calendar
integration per v1.0 §11's open question, now applying more broadly),
agenda builder, post-meeting action item capture, AI meeting summary
(§10), decision tracking entry point (links to Decision Log).

### Strategy Center
Purpose: executive strategy workspace. Components: annual goals list,
quarterly objectives (linked to annual goals), company KPI dashboard,
risk register, opportunity register, growth initiatives, product
roadmap view, partnership opportunities list. Each item type gets a
simple list + detail view, consistent with patterns elsewhere in
PipeDesk (matching the Sales & Marketing Center's list-detail pattern).

### Board & Advisors
Purpose: manage board/advisor relationships and materials. Components:
board member/advisor roster, meeting scheduler (shared with Executive
Meetings where the meeting type is "board"), document library
(restricted per §11), recommendations tracker, voting history view
(schema-only per §2, UI not built until §9's future-ready criteria are
met).

### Investor Management (future-ready — no UI built in near-term phases)
Not designed in this version beyond the database sketch in §2. A real
UI spec should be written separately once this becomes an actual near-
term priority, given the legal/compliance weight of investor and cap
table data (see §9).

### Decision Log
Purpose: browsable historical record of significant decisions.
Components: chronological list, filter by initiative/meeting/date,
detail view showing context and rationale.

### AI Executive Assistant (expanded from v1.0's AI Executive Review)
Purpose: AI-assisted briefings and preparation. Components: weekly
leadership summary generator, meeting preparation view (pulls relevant
history before a scheduled meeting), suggested priorities, risk alerts,
opportunity detection surface, decision summaries. See §10 for integrity
constraints — every output here needs the same grounding discipline as
the rest of PipeDesk's AI features.

## 4-6. Recruiting Pipeline, Candidate Profile, Communication Center

**Unchanged from v1.0 §4, §5, §6.** The 12-stage pipeline (Prospect
through Active Executive) still governs how a candidate becomes an
executive. The moment a candidate reaches "Active Executive," a new row
is created in the `executives` table (§2) and the person's ongoing
record moves into the Executive Profile UI (§3) — recruiting history is
preserved, not deleted or replaced.

## 7. Strategy Center — Detail

Expanding on §3's UI description with the actual workflow:

- **Annual Company Goals** set at the year's start, each with a
  named executive owner.
- **Quarterly Objectives** roll up toward annual goals — same
  parent/child relationship pattern as OKRs (§2).
- **Company KPIs** are tracked metrics, updated at whatever cadence
  makes sense per metric (not necessarily real-time) — this is
  deliberately simple tracking, not a full BI/analytics platform.
- **Risks and Opportunities** are lightweight registers, not a formal
  risk-management framework — purpose is visibility and ownership, not
  compliance documentation (that would be a different, more rigorous
  spec if ever needed).
- **Growth Initiatives, Product Roadmap, Partnership Opportunities**
  are each simple tracked lists with an owner and status — the goal is
  a shared source of truth founders and executives can reference in
  leadership meetings, not a project-management replacement.

## 8. Executive Equity — Expanded

Retains v1.0 §7 in full (4-year vesting, 1-year cliff, monthly vesting,
performance acceleration, milestone tracking, equity calculator, vesting
timeline) and adds:

- **Additional equity grants** — an executive can receive more than one
  grant over their tenure (`exec_equity_grants`, §2), each with its own
  vesting schedule, tracked independently but summed for a total
  vested/unvested view on their Executive Profile.
- **Refresh grants** — a specific grant type (flagged in
  `exec_equity_grants.grant_type`) representing additional equity
  granted partway through tenure, typically to reset toward a full
  vesting horizon — same vesting mechanics apply, just a new grant
  record rather than modifying the original.
- **Bonus tracking** — cash bonus history, likely belongs in
  `exec_compensation_history` (§2) rather than the equity tables, since
  it's not equity — worth confirming during implementation which table
  this actually belongs in.

The same warning from v1.0 applies with more force now: this data
persists and compounds over years, across multiple grants per person.
An error here isn't a one-time mistake, it's a mistake that could
compound across years of vesting calculations. Extra scrutiny warranted
before this phase ships (see v1.0 §7's closing note, still true).

## 9. Investor Management — Explicitly Future-Ready, Not Near-Term

This section exists so the schema (§2) doesn't need to change later, but
it comes with a clear recommendation: **do not build the UI or workflow
for this until it's an actual near-term need**, for a few real reasons:

- Cap table data has genuine legal and compliance complexity (option
  pools, conversion terms, dilution, liquidation preferences) that
  deserves its own dedicated specification, written when it's actually
  being built — not bolted onto this one as an afterthought.
- Getting cap table math wrong has real legal exposure in a way that's
  arguably even higher-stakes than the equity vesting concerns already
  flagged in §8.
- Many companies use a specialized tool (e.g. Carta) for cap table
  management specifically because of this complexity — integrating with
  an existing tool may be a better path than building this from
  scratch, and that's a real build-vs-integrate decision that should be
  made deliberately, not by default.

Recommendation: keep the schema sketch in §2 as a placeholder, revisit
with a dedicated spec when this becomes a real, near-term priority.

## 10. AI Executive Assistant — Integrity Constraints

Every AI feature in this module — Executive Briefings, Weekly Leadership
Summaries, Suggested Priorities, Executive Risk Alerts, Strategic
Opportunity Detection, Meeting Preparation, Decision Summaries, plus
everything retained from v1.0 §8 (Executive scoring, Culture fit,
Resume analysis, Meeting summaries, Risk assessment, Suggested interview
questions, Strengths & weaknesses) — must follow
`docs/AI_OUTPUT_INTEGRITY.md`:

- No fabricated confidence scores, risk percentages, or "likelihood of
  success" numbers with no real statistical basis.
- Summaries and briefings must be grounded in real data already in the
  system (actual OKR progress, actual meeting notes, actual KPI values)
  — never invented facts dressed up as insight.
- Risk alerts and opportunity detection must cite the specific data
  that triggered them, so a human can verify the reasoning rather than
  just trusting a flagged alert at face value.
- Where there isn't enough real data to say something useful, the
  feature should say that explicitly rather than generating a
  plausible-sounding but ungrounded output — same standard as the
  DealAI fix already shipped elsewhere in PipeDesk.

## 11. Security — Expanded from v1.0 §10

Everything in v1.0 §10 (compensation/equity restricted to admin, role
permissions, document permissions, audit logs) still applies and now
extends to:

- **Performance reviews** — visible only to the reviewed executive
  themselves and admins by default, not to other executives or
  Recruiting Leads.
- **Board materials** — visible to board members/advisors and admins;
  not automatically visible to all executives unless explicitly shared.
- **Compensation history** — same restriction tier as v1.0's
  compensation rule, now covering an ongoing history, not just the
  initial offer.
- **Investor/cap table data** (whenever it's actually built) — this
  will need its own, likely even stricter, access tier — flagged now so
  it's not forgotten when that work eventually starts.
- **Audit logging** extends to every restricted table added in this
  version (`exec_compensation_history`, `exec_equity_grants`,
  `exec_vesting_events`, `board_documents`) — same principle as v1.0:
  enforced at the data layer, not just hidden in the UI.

## 12. Phased Build (draft — for review before use)

**Phases 1-4 unchanged from v1.0** (core recruiting pipeline through AI
recruiting features) — see v1.0 §12. These remain the actual near-term
build target.

**Phase 5 — Executive transition and profile**
- `executives`, `exec_org_chart_positions`
- Executive Profile page, Org Chart, automatic transition from
  "Active Executive" pipeline stage into an `executives` row

**Phase 6 — Goals and performance**
- `exec_okrs`, `exec_annual_goals`, `exec_strategic_initiatives`,
  `exec_performance_reviews`
- Relevant tabs on Executive Profile, Leadership Dashboard (basic
  version)

**Phase 7 — Meetings and decisions**
- `exec_leadership_meetings`, `exec_meeting_agendas`,
  `exec_action_items`, `exec_decision_log`, `exec_board_communications`
- Executive Meetings UI, Decision Log

**Phase 8 — Expanded equity and compensation**
- `exec_compensation_history`, `exec_equity_grants`,
  `exec_vesting_events` — requires §11 security fully enforced first,
  same principle as v1.0 Phase 3

**Phase 9 — Strategy Center**
- All `strategy_*` tables and the Strategy Center UI

**Phase 10 — Board & Advisors**
- `board_members`, `board_meetings`, `board_documents`,
  `board_recommendations` (schema for `board_votes` exists but no UI
  yet, per §2/§9)

**Phase 11 — Expanded AI features**
- Executive Briefings, Weekly Leadership Summaries, Suggested
  Priorities, Risk Alerts, Opportunity Detection, Meeting Preparation,
  Decision Summaries — each following §10

**Not phased — explicitly deferred**
- Investor Management (§9) — revisit with a dedicated spec when it's an
  actual near-term priority, not before.
- Board voting UI (`board_votes` schema exists, no workflow built) —
  same reasoning, build when there's a real governance need.

## 13. Open Questions Before Build

All of v1.0 §11's open questions still apply (calendar integration,
document storage, offer letter e-signature, performance acceleration
milestone definitions, Recruiting Lead/Interviewer role mechanics,
relationship to core CRM contacts). New ones from this expansion:

- Should `exec_strategic_initiatives` and `strategy_growth_initiatives`
  be merged into one table? They're described separately in the
  request but appear to serve overlapping purposes — worth deciding
  during implementation rather than building two similar tables.
- What defines a "board meeting" vs. a regular "leadership meeting" in
  `exec_leadership_meetings`? Is this a type field, or should board
  meetings live entirely in a separate flow tied to `board_meetings`
  instead?
- Who can create/edit company-level Strategy Center items (§7) —
  founders only, or any executive with an ownership assignment?
- What's the actual mechanism for an Executive to see only their own
  compensation/performance review (§11) while an Admin sees everyone's
  — same enforcement approach as v1.0's compensation restriction, or
  does this need its own row-level policy given the new "Executive"
  role?
- Is Investor Management (§9) something that should be scoped as an
  entirely separate spec (PIPE-INVESTOR-001, for example) when the time
  comes, rather than being treated as part of this document even in
  placeholder form?
