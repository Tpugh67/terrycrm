# Pass 5, Part 1 — Public/Application Layout Split

Implements ADR 0001. This covers the layout architecture only — the rest
of Pass 5's sequence (industry page system, remaining page rebuilds,
audits) is separate work, not started here.

## What changed

**New route structure** (URLs are 100% unchanged — route groups don't
affect paths):

```
src/app/
├── layout.tsx              trimmed to fonts + global CSS + skip link + ReferralCapture
├── login/, logout/          ungrouped — public, but not "marketing content"
├── api/                     untouched
├── (marketing)/             layout.tsx renders PublicHeader + <main> + PublicFooter
│   ├── page.tsx              (homepage)
│   ├── pricing/, partners/, reps/, help/, join/
│   ├── affiliate/apply/, agency/apply/
│   └── [18 industry pages]
└── (app)/                   layout.tsx = AuthGate only, no sidebar
    ├── rep-portal/           protected, own bespoke layout
    ├── affiliate/dashboard/  protected, own bespoke layout
    └── (shell)/              layout.tsx adds AppLayout (sidebar) on top
        ├── dashboard/, pipeline/, contacts/, tasks/, settings/
        └── admin/affiliates/, admin/reps/, reports/
```

The `(shell)` nesting exists because not every authenticated page wants
the generic sidebar — `rep-portal` and `affiliate/dashboard` have their
own full-page designs and only need `AuthGate`, not `AppLayout`. Missing
this distinction would have double-wrapped them in both their own custom
header and the generic sidebar chrome.

## Files touched

- `src/app/layout.tsx` — trimmed
- `src/app/(marketing)/layout.tsx` — new
- `src/app/(app)/layout.tsx` — new
- `src/app/(app)/(shell)/layout.tsx` — new
- `src/components/AuthGate.tsx` — simplified, `PUBLIC_PATHS` array removed
- `src/components/AppLayout.tsx` — simplified, `PUBLIC_PATHS`/`isPublic`
  removed; also fixed two pre-existing lint issues while substantially
  rewriting this file anyway (component-defined-in-render, two
  setState-in-effect instances) — flagged as backlog in the Pass 4
  accessibility review, fixed here rather than left for later since the
  file needed a full rewrite regardless
- `src/app/login/page.tsx` — gained the "already authenticated → redirect
  to /dashboard" check that `AuthGate` used to provide for it
- `src/app/(marketing)/page.tsx` — removed now-redundant
  `PublicHeader`/`PublicFooter`/`<main>` (the group layout provides them)
- Every moved page file — relative import paths corrected programmatically
  (verified by spot-checking several, including the double-nested cases)

## Verification (real, not asserted)

- `tsc --noEmit`: clean, on the full project, after clearing a stale
  `.next/types` artifact that briefly showed false errors referencing
  pre-migration file paths
- `next build`: succeeds end-to-end, all 52 routes prerender, **every URL
  identical to before** (confirmed by reading the build's route table —
  `/dashboard`, `/help`, `/pipeline`, etc., no `(app)` or `(marketing)`
  segments leak into the URL, as expected from Next.js route groups)
- **Real, measured performance win:** homepage JS payload dropped from
  ~797KB to ~571KB (28% reduction) — measured by comparing the actual
  chunk files referenced in the prerendered HTML before and after. The
  dashboard page, which legitimately needs the authenticated bundle,
  measures at 778KB — confirming the split correctly isolated
  authenticated-only code to authenticated-only pages rather than
  eliminating it everywhere indiscriminately.

## Found during this work, not fixed (reported per "measure it, don't assume")

Running `eslint` across the *whole* app (not just my own files, which is
what I'd scoped every previous lint check to) surfaced **40 pre-existing
errors and 9 warnings** in files I didn't write: `contacts/page.tsx`,
`pipeline/page.tsx` (a 700+ line file), `rep-portal/page.tsx`,
`pricing/page.tsx`, `CsvTools.tsx`, and most of the API routes. Patterns
include `setState`-in-effect (the same class of bug fixed in `Reveal.tsx`
back in Pass 3 and in `AppLayout.tsx` in this pass), `any` types
throughout the CSV import and API route handlers, unescaped apostrophes
in JSX, and one `<a>` tag that should be `<Link>`.

**None of this was introduced by the migration** — confirmed by checking
that the only change my import-path script made to these files was to
import statements, and by checking that the flagged lines are business
logic I never touched. This is real, pre-existing technical debt that
simply had never been measured before, because no one had run `eslint`
against the whole app.

**Not fixed in this pass.** Fixing 40 errors across business logic I
didn't write (CSV parsing, pipeline state management, Stripe checkout
handling) is a different, larger scope than "split the layout
architecture," and touching that logic without understanding its
intent risks introducing real bugs. Recommending this become its own
item in the audit sequence you outlined (fits naturally alongside the
"Final design audit / Performance audit / Accessibility audit" phase).

## One behavior change worth your explicit attention

`AppLayout`'s sidebar nav still links to `/help` and `/partners` for
logged-in users (e.g. the "Help Center" link in every role's nav). Those
pages now live in `(marketing)` and render with the public header/footer,
not the sidebar shell — so a logged-in user clicking "Help Center" from
inside the app now visually "leaves" the app shell and lands on a
marketing-styled page, then has no sidebar to click back with (only the
marketing footer's links). This is a direct, structural consequence of
your explicit classification of Help Center as a Public Layout page — I
didn't second-guess that classification, but the resulting UX gap is a
product decision, not an architecture one: should there be an
authenticated variant of Help Center inside the shell, should the
sidebar link open marketing pages in a new tab, or is "leaving the app
shell to read help content" actually fine? Flagging rather than guessing.
