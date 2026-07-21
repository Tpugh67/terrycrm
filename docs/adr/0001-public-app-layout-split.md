# ADR 0001: Split public and authenticated layouts via route groups

**Status:** Accepted
**Date:** 2026-07-19

## The problem

`src/app/layout.tsx` (the Next.js root layout) wraps every route — public
marketing pages and authenticated app pages alike — in `AuthGate` and
`AppLayout`. Both are `"use client"` components. `AuthGate` imports the
Supabase SDK; `AppLayout` imports it too and additionally defines the
entire authenticated sidebar, role-based navigation, and the 18-industry
list.

All of that ships to the browser on every page load, including the public
homepage — measured in the Pass 4 performance review at ~797KB of client
JS referenced by the homepage, nearly all of it code the homepage never
executes (`AppLayout` immediately no-ops for public paths via
`if (isPublic) return <>{children}</>`, but the JS still has to be
downloaded and parsed before that check can even run).

Membership in "public" vs. "protected" was also determined by two
separately-maintained string arrays (`AuthGate`'s `PUBLIC_PATHS` and
`AppLayout`'s `PUBLIC_PATHS`), which had already drifted from each other
before this change (e.g. `/rep-portal` and `/affiliate/dashboard` were
classified inconsistently between the two).

## The decision

Split routing into two Next.js route groups, which change nothing about
the URLs but let each group have its own layout and its own JS payload:

- **`src/app/(marketing)/`** — all public content pages. Layout renders
  `PublicHeader` + `<main>` + `PublicFooter`. No Supabase import, no auth
  check, no role logic. `login` and `logout` deliberately stay *outside*
  this group (see Alternatives Considered) since they're auth utility
  pages, not marketing content, and already have their own full-page
  designs that a forced header/footer would work against.
- **`src/app/(app)/`** — all authenticated pages. Layout wraps children in
  `AuthGate` (auth/trial check) and `AppLayout` (sidebar, role-based nav).

Route membership is now determined by **file location**, not a
string-matching array. `AuthGate`'s `PUBLIC_PATHS` array is no longer
needed at all — a page under `(app)/` is protected simply by being there,
and a page under `(marketing)/` never mounts `AuthGate` in the first
place, so there's nothing to bypass.

## Why this was chosen over alternatives

**Alternative 1 — keep one layout, refine the `PUBLIC_PATHS` arrays.**
Rejected. This was the status quo, and it's what caused the actual bug
found in the Pass 4 accessibility review (the skip link had no target on
public pages because the two arrays disagreed about what counted as
"public"). Fixing the arrays doesn't fix the underlying issue: the JS
still ships regardless of which array says what, since the import happens
at module scope in the root layout, before any runtime path check runs.

**Alternative 2 — `next/dynamic` to lazy-load `AppLayout` only when
needed.** Rejected as the primary fix. This would reduce *parse/execute*
cost somewhat but the code would still be in the client bundle graph
reachable from every page, and it doesn't fix the maintainability problem
of two independently-drifting path arrays. Worth revisiting as a
secondary optimization inside `(app)` itself later, but it doesn't
address the actual problem here.

**Alternative 3 — middleware-based auth instead of a client component.**
Rejected for this pass. Genuinely worth considering long-term (moves the
auth check to the edge, before any client JS ships at all), but it's a
bigger change to `AuthGate`'s trial/subscription-status logic than this
ADR's scope, and mixing "fix the layout split" with "rearchitect how auth
itself works" in one change is harder to verify safely. Flagged as a
candidate for a future ADR.

## Consequences

**Positive:**
- Public pages no longer download `AppLayout`'s sidebar/nav/Supabase
  bundle at all — the actual fix for the Pass 4 performance finding.
- One source of truth for "is this page protected" (folder location) —
  the two-array drift bug class can't recur.
- `AuthGate` gets simpler (no more `PUBLIC_PATHS` list to maintain).

**Negative / risks accepted:**
- This is an atomic, all-or-nothing migration. Every existing route had
  to move in the same change — partially migrating would mean some
  currently-protected pages lose `AuthGate` coverage the moment it's
  removed from the root layout, which is a real security regression, not
  just a visual bug. That's why this ADR covers the full migration, not
  an incremental one.
- Every moved file's relative imports (`../../lib/...`) shift by one
  directory level, since route groups add a filesystem folder even though
  they don't add a URL segment. Fixed programmatically across every moved
  file, then verified with a full `tsc --noEmit` and `next build`, not
  spot-checked.
- `/join` (an orphan duplicate of `/reps`, flagged in the Pass 1 audit)
  was moved into `(marketing)` as-is, not deleted or merged — removing a
  live route is a routing/content decision, not an architecture one, and
  stays out of scope here.

## Follow-ups this ADR intentionally does not resolve

- `/join` vs `/reps` duplication (Pass 1 finding, still open).
- Whether `login`/`logout` should eventually get a third, minimal layout
  of their own rather than sitting ungrouped at the app root.
- Middleware-based auth (Alternative 3 above) — worth its own ADR if
  pursued.
