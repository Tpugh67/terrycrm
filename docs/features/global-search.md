# Global Search — Feature Documentation

First item off the 🔴 Critical backlog. Built end-to-end: no new database
schema needed (existing RLS already covers the access pattern safely),
new `GlobalSearch` component, wired into the app shell header (desktop +
mobile), plus deep-link support added to Contacts and Pipeline so a
search result actually lands somewhere useful.

## Design

- **Scope:** searches `contacts` (name, email, company) and `deals`
  (title, seller, address), the two entity types users search for daily.
  Tasks/notes search intentionally deferred — see Not Included below.
- **Data access:** queries Supabase directly from the client, same
  pattern every other page in the app already uses (Contacts, Pipeline).
  No new API route — verified the existing RLS policies
  (`contacts_select_own`, `deals_select_own`, both `auth.uid() = user_id`)
  already scope results correctly, so a new backend layer would be pure
  overhead, not a safety requirement.
- **UI:** input in the header (desktop: always visible; mobile: icon
  toggle, since there's no room for a persistent search bar next to the
  hamburger menu and page title). Dropdown grouped implicitly by icon
  (briefcase for deals, person for contacts), not by section headers —
  keeps it compact for a max-5-results-per-type list.

## Edge cases handled

- **ILIKE wildcard injection.** A literal search for `50%` (a realistic
  deal-related search term) would otherwise be interpreted as a SQL
  wildcard pattern, silently matching far more than intended. User input
  is escaped (`%`/`_` → `\%`/`\_`) before being embedded in the filter.
  Verified the resulting query syntax directly against the real database.
- **Race conditions.** Fast typing can fire multiple debounced searches;
  a slow early request finishing after a fast later one would otherwise
  overwrite fresh results with stale ones. Guarded with a request-id
  counter — only the most recently *started* request is allowed to
  commit its results.
- **Minimum query length.** No search fires below 2 characters — avoids
  a wasteful full-table-ish scan on every single keystroke.
- **Unauthenticated edge case.** If `supabase.auth.getUser()` somehow
  returns no user mid-session (e.g. a token expiring while a search is
  in flight), the search silently returns no results rather than
  throwing.
- **Search failure.** A real error state (not just an empty result) is
  shown if the Supabase queries themselves fail, distinct from "no
  results found."
- **Outside click / Escape / route change** all close the dropdown.

## Accessibility

- `role="combobox"` on the input, `role="listbox"`/`role="option"` on
  the results, `aria-expanded`/`aria-selected` wired to real state — not
  just visual styling.
- Full keyboard operation: Arrow Up/Down to move selection, Enter to
  navigate, Escape to close. No mouse required.
- Clear button has a real `aria-label`, not just an icon.

## Testing performed

- `tsc --noEmit`: clean.
- `eslint`: clean on all new/touched files. Caught and fixed one real
  bug in my own new code during this process — an early version called
  `setState` synchronously in the search effect's body (the same
  anti-pattern class fixed in `Reveal.tsx` back in Pass 3 and in
  `AppLayout.tsx` in Pass 5) — fixed by moving state updates into the
  debounced callback instead of the effect body directly.
- `next build`: succeeds; confirmed `useSearchParams` in Contacts/
  Pipeline did not require a Suspense boundary in this app's actual
  build configuration (verified by building, not assumed from general
  Next.js documentation, since behavior here varies by rendering mode).
- Verified real content still renders (not an error boundary) on both
  modified pages after adding deep-link support.
- Validated the actual ILIKE-with-escape query syntax directly against
  the real Supabase database (read-only) rather than only trusting that
  the JS query-builder call would produce valid SQL.
- **Not tested:** actual browser interaction (typing, keyboard nav,
  dropdown behavior) — no headless browser available in this
  environment, consistent with every other UI feature built this
  project. Recommend a manual pass in your local dev environment before
  considering this fully verified.

## Not included in this pass (real scope cuts, not oversights)

- **Tasks/notes search** — the `tasks` table wasn't inspected as part of
  this pass; adding it is a small, config-like extension to the existing
  query pattern once scoped.
- **Fuzzy matching / typo tolerance** — current implementation is
  substring match only (`ILIKE '%term%'`). Full-text search (Postgres
  `tsvector`, or a dedicated search service) would be a genuine
  architectural addition, not a config change — worth its own scoping
  pass if search volume/expectations grow.
- **Search analytics** (what people search for, zero-result queries) —
  no infrastructure exists for this yet.
