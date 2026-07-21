# ADR 0003: Consolidate the broken `/join` route into `/reps`

**Status:** Accepted
**Date:** 2026-07-19

## The problem

`/join` and `/reps` were two separate, fully-built pages serving the same
purpose — applying to become a PipeDesk sales rep. Investigation found:

- **`/join` is not linked from anywhere in the app** — confirmed via a
  full-codebase search for the string `/join`; the only match was the
  route's own page file. No nav item, footer link, CTA, or other page
  references it. It's reachable only if someone has the exact URL.
- **`/join`'s form does not persist data.** Its `handleSubmit` calls
  `setSubmitted(true)` directly, with no Supabase call, no API request,
  nothing. A visitor who fills it out and submits sees "Application
  received!" — a real, working-looking success state — while nothing was
  saved anywhere. `/reps`, by contrast, has a real `supabase.from("reps").insert(...)`
  call that actually works.
- **`/join` is not simply worse, though.** It has real, legitimate
  content `/reps` lacked: a fuller 4-tier earnings calculator with annual
  figures, a 6-item "why this is different" section, and — most
  importantly — a mandatory agreement checkbox gate with the full legal
  agreement text inline, which `/reps` didn't have at all (`/reps` only
  linked to a downloadable PDF, with no in-app acknowledgment step).

## The decision

1. Merge `/join`'s legitimate unique content into `/reps`: the 4-tier
   earnings breakdown, the "why different" section (via `FeatureGrid`),
   and the agreement checkbox gate (added as a new reusable capability on
   `ApplicationForm` itself — `agreement?: { label, expandableContent }`
   — not a one-off for this page, since Agency applications will likely
   want the same gate).
2. Add an `industry` selection field to the merged form — legitimate,
   useful data (which vertical a prospective rep's network is strongest
   in) that `/join` collected but `/reps` didn't.
3. `/join` is removed as a route entirely and replaced with a permanent
   (308) redirect to `/reps`, configured in `next.config.ts`, so any
   external link or bookmark still pointing at the old URL lands
   somewhere real instead of 404ing.

## Why this was chosen over alternatives

**Alternative 1 — delete `/join`, redirect to `/reps`, done.** Rejected
as incomplete. This would have satisfied "stop the data loss" but thrown
away the agreement-gate functionality, which is a genuine compliance
improvement (an explicit, logged acknowledgment that the rep read and
agreed to the terms before applying) that `/reps` should arguably have
had regardless of `/join`'s existence.

**Alternative 2 — fix `/join`'s Supabase call in place, keep both pages
alive.** Rejected. Two pages that do the same thing is exactly the
duplication problem this whole pass has been eliminating elsewhere
(industry pages, pricing). Fixing the bug without consolidating the
routes would have left two application flows to maintain and keep in
sync going forward.

**Alternative 3 — add the `industry` field as a real new column on the
`reps` table.** Considered, not done. Checked the actual Supabase schema
(`Supabase:list_tables`) rather than assuming — confirmed `reps` has no
`industry` column. Adding one is a real schema migration with real
consequences (RLS policies, the admin rep-review UI, etc.) that's out of
scope for a page-consolidation pass. Instead, the value is folded into
the existing `sales_background` text field as a labeled prefix
(`"Primary industry: X\n\n..."`), which is honest about being an
unstructured workaround, not silently dropped or written to a column
that doesn't exist.

## Consequences

**Positive:**
- No more silent data loss — the only live "apply to be a rep" flow now
  actually saves applications.
- The agreement gate is now a real, reusable `ApplicationForm` capability,
  available to Agency applications (and any future application type)
  without rebuilding it.
- One route to maintain instead of two.

**Negative / risks accepted:**
- The `industry` field's value is unstructured (folded into a text
  column) until/unless a real schema migration adds a proper column —
  flagged explicitly in the code comment at the point of insertion, not
  hidden.
- Anyone with `/join` bookmarked or linked externally will be redirected
  rather than seeing the exact original page — acceptable given the
  original page was actively losing their submission anyway.
