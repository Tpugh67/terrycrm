# PIPE-LEAD-001 — Lead Generation Center Specification v1.0

Status: Draft — not yet built (reconstructed as canonical spec)
Owner: Terry Pugh
Related specs: Sales & Marketing Center Spec v1.0, PIPE-EXEC-001 Executive
Leadership Center Spec v2.0, AI Output Integrity Policy

## 0. Note on This Document's Origin

This specification was reconstructed from an approved concept set (module
list, difficulty-tiering approach, and phased build intent) after the
original working draft was lost before being saved to the repository.
It is written to the same standard as PIPE-EXEC-001 v2.0 and is intended
to be treated as the new official version going forward — this is not a
summary or placeholder, it is a complete engineering specification
suitable for implementation.

## 1. Vision

### Purpose

The Lead Generation Center is PipeDesk's system for finding, capturing,
qualifying, and nurturing leads before they become deals in the core
CRM pipeline. It sits upstream of the existing sales pipeline: a lead
enters through one of several acquisition channels (inbound form,
outbound prospecting, referral, affiliate), gets scored and enriched,
and — once qualified — converts into a CRM contact/deal, handing off to
the existing sales workflow rather than duplicating it.

### Goals

1. Give reps and SDRs one place to find, track, and qualify leads
   instead of spreadsheets, scattered outbound lists, and disconnected
   form tools.
2. Make lead capture (forms, landing pages) self-serve for marketing/
   admin users, without needing an engineer to ship a new form.
3. Support multiple acquisition channels — inbound, outbound/AI-
   assisted prospecting, referral, and affiliate — under one lead
   record and one scoring model, rather than siloed systems per
   channel.
4. Apply the same AI-integrity discipline used elsewhere in PipeDesk
   (DealAI, Executive AI Assistant) to every AI feature here: grounded
   scoring and recommendations, no fabricated confidence numbers.
5. Be explicit up front about which parts of this system are
   straightforward to build and which carry real infrastructure or
   legal complexity — see §2 — so build sequencing reflects actual
   effort and risk, not just feature wishlist order.

### User roles

- **Admin** — full access to all modules, including affiliate payout
  configuration and campaign-level analytics.
- **Sales Rep** — sees and works their assigned leads, can enroll leads
  in campaigns, cannot edit lead-scoring rules or affiliate program
  settings.
- **SDR** — works an assigned outbound queue, logs outreach activity,
  same lead visibility as Sales Rep but organized around prospecting
  workflow rather than an existing book of deals.
- **Marketing** — builds/edits lead capture forms and landing pages,
  manages campaigns, sees aggregate analytics; does not need per-lead
  compensation-style restricted data (there isn't any here, unlike the
  exec spec — this system has no restricted-data tier the way
  compensation/equity does).
- **Affiliate** (external-facing, limited) — sees only their own
  referral links, referred leads (status-level only, not full lead
  detail), and their own commission history.
- **Referral partner** (lighter than Affiliate) — submits referrals via
  a simple form, sees only submission confirmation and, optionally, a
  coarse status ("in progress" / "converted"), not full lead data.

### Business objectives

- Shorten time from first touch to qualified lead by consolidating
  capture, scoring, and initial outreach in one system.
- Reduce leads lost to inconsistent follow-up by giving every lead an
  owner and a campaign/sequence state.
- Create a single source of truth for channel performance (which
  source, campaign, or affiliate actually produces qualified leads)
  instead of reconciling numbers across separate tools.
- Avoid building compliance-risk features (e.g. unrestricted scraping)
  without deliberate legal review — see §2's Tier 3 category.

## 2. Difficulty Tiering

Every module below is tagged with a tier. This tiering exists so build
sequencing is honest about effort and risk, not just feature priority.

- **Tier 1 — UI-only / straightforward CRUD.** Standard forms, lists,
  detail views, and relational data over existing infrastructure
  (Supabase, existing auth, existing Resend integration). No new
  infrastructure risk, no legal review needed. Comparable effort to
  work already shipped (Sales & Marketing Center pages).
- **Tier 2 — Real infrastructure.** Requires new backend
  infrastructure beyond standard CRUD: background jobs, external API
  integrations with rate limits/cost, webhook handling, scheduled
  sends, or non-trivial data pipelines. Higher effort and more moving
  parts, but no unusual legal exposure.
- **Tier 3 — Needs legal review before build.** Involves web scraping,
  data collection about third parties who haven't opted in,
  compliance-sensitive outreach (e.g. cold email/SMS regulations —
  CAN-SPAM, TCPA, GDPR depending on target markets), or anything where
  "how we got this data" or "how we're allowed to contact this person"
  is a real legal question, not just an engineering one. **Do not
  build Tier 3 features without explicit legal sign-off first** — this
  mirrors the caution already applied to Investor Management in the
  Executive Leadership Center spec (build-vs-integrate, review before
  build).

Each module section in §4 states its tier explicitly.

## 3. Database Design

### Core lead tables (Tier 1)

**`leads`** — the central record: name, contact info, company, source
channel (inbound/outbound/referral/affiliate), source detail (which
form/campaign/affiliate/SDR), status (new/contacted/qualified/
disqualified/converted), score (see `lead_scores`), owner (assigned
rep/SDR), created date, converted-to-contact reference (nullable, set
on conversion to core CRM).

**`lead_sources`** — catalog of acquisition channels and their
sub-sources: type (form/landing-page/campaign/referral/affiliate/
manual), name, active status. Referenced by `leads.source_detail`.

**`lead_scores`** — scoring record per lead: score value, scoring
factors (structured breakdown — see §10 for AI-integrity requirements
on how this is computed and explained), last updated, manual override
flag (a rep can override an AI/rules-based score, with a reason).

**`lead_activities`** — activity timeline per lead: activity type
(form submission, email sent/opened, call logged, status change),
timestamp, actor (user or "system" for automated actions), detail.

**`lead_notes`** — free-text notes per lead, author, timestamp.

**`lead_tasks`** — follow-up tasks per lead: title, due date, assigned
to, status, linked lead.

### AI prospect research tables (Tier 2)

**`prospect_research_requests`** — a request to research a
prospect/company: target (name/company/URL), requested by, status
(queued/running/complete/failed), created date.

**`prospect_research_results`** — the output of a research request:
structured findings (company size, industry, recent news, relevant
signals), source citations for each finding (see §10 — AI research
output must cite what it found, not assert unsourced facts), linked
request, generated date. Feeds into `lead_scores` as one scoring input
when the prospect becomes a lead.

### Website scanner tables (Tier 2, with Tier 3 caveat)

**`website_scans`** — a scan job against a target URL: target URL,
requested by, status, started/completed timestamps, summary result
(tech stack detected, contact info found via genuinely public means
e.g. an on-site "Contact Us" page, general company signals).

**`website_scan_findings`** — structured findings per scan: finding
type, value, confidence, source location (e.g. which page the finding
came from). **Tier 3 caveat:** scanning a company's own public
marketing site for genuinely public signals (tech stack, publicly
listed contact info) is materially different from scraping personal
data at scale or bypassing access controls — the latter needs legal
review before any build work starts. This module's scope should be
explicitly limited to public, non-personal, non-authenticated content
unless and until that review happens.

### Lead capture tables (Tier 1)

**`lead_capture_forms`** — form definitions: name, fields (structured
list — field type, label, required), target landing page or embed
context, active status, created by.

**`form_submissions`** — raw submissions: form reference, submitted
data (matches form's field schema), submitted date, resulting lead
reference (a submission creates or updates a `leads` row).

### Landing page builder tables (Tier 1, editor itself is Tier 2)

**`landing_pages`** — page definitions: name, slug/URL, published
status, embedded form reference (`lead_capture_forms`), content blocks
(structured — headline, body sections, images, CTA), created/updated
by. **Note:** the data model here is Tier 1 (it's just structured
content), but a true drag-and-drop visual page editor is a Tier 2 UI
effort — the spec allows for a simpler structured-block editor first
(Tier 1) with a more advanced visual builder as a later iteration if
needed.

**`landing_page_analytics`** — aggregated visit/conversion stats per
page: date, visits, form submissions, conversion rate. Populated by a
lightweight tracking pixel/event log (Tier 2 — needs a tracking
endpoint, even if simple).

### Campaign manager tables (Tier 2)

**`campaigns`** — outbound/nurture campaign definitions: name, type
(email sequence, mixed), status (draft/active/paused/completed),
target audience definition (which leads/segments), created by.

**`campaign_steps`** — ordered steps in a campaign: step order,
delay (days/hours after previous step or enrollment), channel (email
for v1 — SMS explicitly out of scope for v1 given Tier 3 compliance
weight, see §9), content/template reference.

**`campaign_enrollments`** — a lead's participation in a campaign:
lead reference, campaign reference, current step, enrolled date,
status (active/completed/removed), removal reason if applicable.

**`campaign_step_sends`** — individual send records: enrollment
reference, step reference, sent date, delivery status, open/click
tracking (via Resend, which PipeDesk already integrates).

### Referral, SDR, and affiliate tables (Tier 1 for CRUD, Tier 2 for payouts)

**`referral_partners`** — lightweight external referrer records: name,
contact info, referral link/code, status (active/inactive).

**`referrals`** — individual referral submissions: referring partner,
referred lead (links to `leads`), submitted date, status (mirrors the
lead's status at a coarse level, per the Referral partner role's
limited visibility in §1).

**`sdr_queues`** — outbound queue assignment: SDR (user), assigned
leads/prospects, priority, assigned date.

**`affiliates`** — affiliate program participants: name, contact info,
unique referral link/code, commission rate, status, payout method
reference. **Tier 2** once real payout processing is involved (see
below) — the roster/link itself is Tier 1.

**`affiliate_referrals`** — leads attributed to an affiliate link:
affiliate reference, lead reference, attribution date.

**`affiliate_commissions`** — commission records: affiliate reference,
referral reference, amount, status (pending/approved/paid), approved
by, paid date. **Tier 2 — real infrastructure**, since this implies
either a payout mechanism (manual-approve-and-pay-outside-system is a
reasonable v1 scope, avoiding a Tier 2/3 payment-processor
integration) or, if automated payouts are wanted later, a Stripe
Connect–style integration, which is a materially larger and separate
effort worth its own spec section when it's actually prioritized.

### AI outreach assistant tables (Tier 2)

**`outreach_sequences`** — AI-assisted personalized outreach
sequences, distinct from `campaigns` (which are more templated/bulk):
target lead, sequence steps (structured), status, created by.

**`outreach_ai_drafts`** — AI-generated draft messages: sequence
reference, step, draft content, grounding data used (see §10 — must
reference what real lead/research data informed the draft), status
(draft/edited/sent), reviewed-and-sent-by (a human must approve/send,
not full autopilot — see §9's compliance note).

### Analytics tables (Tier 1, aggregation logic is Tier 2)

**`lead_funnel_snapshots`** — periodic snapshots of funnel counts by
stage, for trend reporting without expensive live aggregation on every
dashboard load.

**`channel_performance`** — aggregated performance by source channel:
period, source, leads generated, leads qualified, leads converted,
conversion rate.

### AI recommendations tables (Tier 2)

**`ai_recommendations`** — system-generated suggestions: type (e.g.
"re-engage stalled lead," "high-score lead needs owner," "campaign
underperforming"), target entity (lead/campaign/channel), rationale
(must cite the specific data behind the suggestion, per §10),
status (active/dismissed/acted-on), generated date.

## 4. Complete UI

### Lead Database — Tier 1
Purpose: central lead list and detail view. Components: filterable/
sortable Lead List (by status, source, score, owner), Lead Detail
(contact info, score breakdown, activity timeline, notes, tasks,
linked campaign enrollments), bulk actions (assign owner, add to
campaign).

### AI Prospect Research — Tier 2
Purpose: request and review AI-assisted research on a prospect before
or after they become a lead. Components: research request form (name/
company/URL), results view with cited findings (§10), "convert to
lead" action that seeds a new lead record with research findings
attached.

### Website Scanner — Tier 2 (scope-limited per §3's Tier 3 caveat)
Purpose: surface public signals about a prospect's company website.
Components: scan request (URL input), scan results view (tech stack,
publicly listed contact info, general signals), explicit labeling of
what was and wasn't found — no fabricated findings (§10).

### Lead Capture Forms — Tier 1
Purpose: build and manage forms that create leads. Components: form
builder (add/reorder/configure fields), form list, embed code/link
generator, submission list per form.

### Landing Page Builder — Tier 1 (structured-block editor first)
Purpose: build simple landing pages tied to lead capture forms.
Components: page list, structured content-block editor (headline, body
sections, image, embedded form, CTA), publish/unpublish toggle, basic
analytics view (`landing_page_analytics`).

### Campaign Manager — Tier 2
Purpose: build and run nurture/outbound email sequences. Components:
campaign list, campaign builder (steps, delays, templates), audience
selector, enrollment list with per-lead step progress, send-performance
view (open/click rates via Resend).

### Referral Dashboard — Tier 1
Purpose: partner-facing referral submission and status. Components:
simple referral submission form (external-facing, minimal fields),
partner's own referral list with coarse status only (per §1's role
scoping).

### SDR Dashboard — Tier 1
Purpose: an SDR's daily working view. Components: assigned queue
(prioritized list), quick-log activity actions (call, email, note),
daily/weekly activity summary.

### Affiliate Dashboard — Tier 1 UI / Tier 2 for payout data
Purpose: affiliate-facing view of their own referrals and earnings.
Components: referral link/code display, referred-lead list (status-
level only), commission history, payout status.

### AI Outreach Assistant — Tier 2
Purpose: AI-assisted personalized outreach drafting. Components: draft
generator (pulls lead + research data), draft review/edit screen
(human-in-the-loop — see §9), send action, sequence status view.

### Analytics — Tier 1 UI over Tier 2 aggregation
Purpose: channel and funnel performance reporting. Components: funnel
visualization (stage-by-stage counts), channel performance table/
chart (leads generated/qualified/converted by source), trend view over
time using `lead_funnel_snapshots`.

### AI Recommendations — Tier 2
Purpose: surfaced, actionable suggestions. Components: recommendation
feed (dismissable, actionable cards), each showing its cited rationale
(§10), link-through to the relevant lead/campaign/channel.

## 5. Lead Scoring — Detail

Scoring combines rules-based factors (explicit, inspectable) and
AI-assisted factors (research findings, engagement signals):

- Rules-based factors: form completeness, company size (if known),
  engagement events (opens/clicks/replies), source channel quality
  (historical conversion rate of that channel).
- AI-assisted factors: prospect research findings (§3), qualitative
  fit assessment — framed as a qualitative signal, not a fabricated
  percentage, consistent with the DealAI integrity fix already shipped
  elsewhere in PipeDesk (`docs/AI_OUTPUT_INTEGRITY.md`) and the same
  standard applied in PIPE-EXEC-001.
- Every score must show its breakdown on the Lead Detail view — a rep
  should be able to see *why* a lead scored the way it did, not just
  the number.
- Manual override is always available, with a required reason, logged
  to `lead_activities`.

## 6. Lead Conversion to Core CRM

When a lead is marked qualified and a rep chooses to convert it: a new
Contact (and optionally Deal) is created in the existing core CRM,
`leads.converted_to_contact` is set, and the lead's activity/note
history is either copied forward or linked (not lost) so context isn't
dropped at the handoff point. This is the seam between the Lead
Generation Center and PipeDesk's existing sales pipeline — it should
reuse existing Contact/Deal creation logic rather than duplicating it.

## 7. Campaign & Outreach — Compliance Notes

- All campaign and outreach sends in v1 are **email only**, via the
  existing Resend integration. SMS outreach is explicitly out of scope
  for v1 — TCPA and similar regulations make SMS meaningfully higher
  legal risk (Tier 3) and it should get its own review before any
  build work starts, not be bundled into this spec's v1 scope.
- Every campaign and AI-drafted outreach message must respect
  unsubscribe/opt-out status — an `unsubscribed` flag on `leads`
  (or a dedicated suppression list) should gate all sends, checked at
  send time, not just at enrollment time.
- AI-drafted outreach (`outreach_ai_drafts`) is always human-reviewed
  before sending in v1 — no fully autonomous AI sending. This is a
  deliberate scope limit, not just a nice-to-have: it keeps a human
  accountable for outbound compliance and tone, consistent with this
  spec's broader AI-integrity stance (§10).

## 8. Difficulty Tier Summary (Cross-Reference)

| Module | Tier |
|---|---|
| Lead Database | 1 |
| AI Prospect Research | 2 |
| Website Scanner | 2 (scope-limited; broader scraping is 3) |
| Lead Capture Forms | 1 |
| Landing Page Builder | 1 (structured editor) |
| Campaign Manager | 2 |
| Referral Dashboard | 1 |
| SDR Dashboard | 1 |
| Affiliate Dashboard | 1 (UI) / 2 (payout data) |
| AI Outreach Assistant | 2 |
| Analytics | 1 (UI) / 2 (aggregation) |
| AI Recommendations | 2 |
| SMS Outreach | 3 — explicitly deferred, see §7 |
| Broad/authenticated web scraping | 3 — explicitly deferred, see §3 |

## 9. AI Integrity Constraints

Every AI feature in this module — Prospect Research, Website Scanner
findings, Lead Scoring's AI-assisted factors, AI Outreach Assistant
drafts, AI Recommendations — must follow `docs/AI_OUTPUT_INTEGRITY.md`,
matching the standard already applied to DealAI and the Executive AI
Assistant (PIPE-EXEC-001 §10):

- No fabricated confidence scores, close-probability-style percentages,
  or "likelihood to convert" numbers without a real statistical basis.
- Research findings and recommendations must cite the specific data
  that produced them (a source page, a real engagement event, an
  actual field value) — never invented facts dressed up as insight.
- Where there isn't enough real data to say something useful, the
  feature should say that explicitly rather than generating a
  plausible-sounding but ungrounded output.
- AI-drafted outreach must be clearly labeled as a draft requiring
  human review before send (§7) — never presented as already sent or
  as the system's own communication without human accountability.

## 10. Security

- Lead data is broadly visible to Sales Rep/SDR/Marketing/Admin roles
  (unlike the Executive Leadership Center, this module has no
  compensation-style restricted-data tier) — but per-role scoping
  still applies: Affiliates and Referral partners see only their own
  attributed leads, and only at a coarse status level, never full lead
  detail or other leads' data.
- Affiliate commission data (`affiliate_commissions`) is visible to the
  affiliate themselves and Admins only — not to other affiliates, reps,
  or SDRs.
- Audit logging on lead status changes, score overrides, and campaign
  sends — enough to reconstruct "who did what and when" for a given
  lead, consistent with the audit-logging principle already applied in
  PIPE-EXEC-001 §11.

## 11. Phased Build Plan

**Phase 1 — Core lead database (Tier 1)**
- `leads`, `lead_sources`, `lead_scores` (rules-based only, no AI yet),
  `lead_activities`, `lead_notes`, `lead_tasks`
- Lead List, Lead Detail

**Phase 2 — Lead capture (Tier 1)**
- `lead_capture_forms`, `form_submissions`
- Form Builder, embed/link generation, submission-to-lead pipeline

**Phase 3 — Landing pages (Tier 1)**
- `landing_pages`, `landing_page_analytics`
- Structured-block Landing Page editor, publish flow, basic analytics

**Phase 4 — Referral & SDR (Tier 1)**
- `referral_partners`, `referrals`, `sdr_queues`
- Referral Dashboard, SDR Dashboard

**Phase 5 — Lead conversion to core CRM (Tier 1, depends on Phase 1)**
- Conversion action and Contact/Deal creation handoff (§6)

**Phase 6 — Campaign manager (Tier 2)**
- `campaigns`, `campaign_steps`, `campaign_enrollments`,
  `campaign_step_sends`
- Campaign Builder, enrollment tracking, send performance — requires
  §7's suppression/unsubscribe gating in place before any sends go
  live

**Phase 7 — AI prospect research (Tier 2)**
- `prospect_research_requests`, `prospect_research_results`
- Research request/results UI, feeds into Lead Scoring (§5)

**Phase 8 — Website scanner (Tier 2, scope-limited per §3)**
- `website_scans`, `website_scan_findings`
- Scan request/results UI, explicitly limited to public,
  non-authenticated content

**Phase 9 — AI-assisted lead scoring (Tier 2)**
- Extend `lead_scores` with AI-assisted factors (§5), score breakdown
  UI — requires §9 integrity constraints enforced first

**Phase 10 — AI outreach assistant (Tier 2)**
- `outreach_sequences`, `outreach_ai_drafts`
- Draft generation, human-review/send flow — requires §7's compliance
  gating and §9's integrity constraints first

**Phase 11 — Affiliate program (Tier 1 UI / Tier 2 payouts)**
- `affiliates`, `affiliate_referrals`, `affiliate_commissions`
- Affiliate Dashboard; payout handling scoped to manual-approve-and-
  pay-outside-system for v1 (see §3) — automated payout processing is
  a separate, later effort if actually needed

**Phase 12 — Analytics and AI recommendations (Tier 1 UI / Tier 2
aggregation)**
- `lead_funnel_snapshots`, `channel_performance`, `ai_recommendations`
- Funnel/channel analytics views, Recommendations feed

**Not phased — explicitly deferred, needs legal review first**
- SMS outreach (§7)
- Broad or authenticated-content web scraping beyond the scope-limited
  Website Scanner (§3)
- Automated affiliate payout processing via a payment-processor
  integration (Phase 11 note)

## 12. Open Questions Before Build

- Should `lead_scores`' rules-based factors be configurable by Admins
  (a weights/rules editor), or hardcoded initially and made
  configurable later once real usage data exists?
- What's the actual mechanism for lead-to-Contact conversion (§6) —
  does it need a review/confirmation step, or is a one-click convert
  sufficient for v1?
- Should Referral and Affiliate be merged into a single underlying
  model with different visibility tiers, given their structural
  similarity, or kept as genuinely separate systems (they currently
  are, per §3) because their real-world relationships differ enough
  (informal partner vs. formal paid affiliate)?
- Does the Website Scanner (§3, §8) need a formal legal sign-off
  before even the scope-limited public-data version ships, or is the
  public/non-authenticated limitation sufficient without a separate
  review pass? Worth confirming rather than assuming.
- What email-sending volume/rate limits does the existing Resend
  integration support, and does Campaign Manager (Phase 6) need queue/
  throttling logic to stay within them?
- Is there a real near-term need for SMS outreach, or should §7's
  deferral simply stand indefinitely until a concrete business reason
  arises?
