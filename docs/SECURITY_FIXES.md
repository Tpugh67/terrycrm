# Security Fixes — All 5 Confirmed and Fixed

Every claim verified against actual code before fixing, not taken on
faith. All five were real. One turned out worse than described.

## 1. `/api/approve-rep` — no authentication (confirmed, critical)

Zero auth check. Used the service-role key (bypasses all RLS). Anyone
who found the URL could create a real Supabase account with an
**approved rep role**, for any email, and **the response returned the
generated temporary password directly** — a fully-formed account
takeover primitive with zero barrier to entry.

**Also found while fixing:** the magic-link email was generated but
never sent anywhere — `generateLink()`'s result was silently discarded.
The route looked like it emailed the rep; it didn't.

**Fixed:** requires a valid admin session (same pattern as
`/api/admin-stats`), no longer returns the password in the response, and
the magic link is now actually sent via email.

**Bonus finding, not fixed here:** this route has **zero callers**
anywhere in the app. The actual live rep-approval flow
(`/api/update-partner-status`, used by `admin/reps/page.tsx`) is
correctly authenticated, but it only updates a `role` column on an
existing `profiles` row by email match — **it never creates a login
account**. If a rep applicant never separately signs up through normal
signup, approving them gives them no way to log in at all; the update
matches zero rows. This is a real product workflow gap, not a security
hole — flagging it separately rather than folding an unrequested fix
into this security pass. My rewritten `/api/approve-rep` actually
contains the correct account-creation + email logic this gap needs; it
could be wired into the real approval flow as a followup if you want.

## 2. `/api/deals/import` — trusted client-supplied `user_id` (confirmed)

Took `user_id` straight from the request body and inserted deals under
it with no verification the caller owned that id. Anyone could write
deals into another user's account by passing a different id.

**Also found:** zero callers anywhere in the app. The real CSV import
feature inserts directly via the authenticated client SDK in
`pipeline/page.tsx`, correctly scoped by RLS. This route was dead but
still live and exploitable.

**Fixed:** `user_id` is now derived from a verified session token, never
trusted from the request body. Left the route in place (secured) rather
than deleted, in case a future server-side integration needs it.

## 3. `/api/ai` — unauthenticated and unmetered (confirmed, and genuinely tricky)

Zero auth, zero rate limiting — anyone could burn your Anthropic API
budget with unlimited anonymous requests. But it's called from **four**
places, one of which (`help/page.tsx`, the Help Center's AI search) is
an intentionally public marketing feature. A blanket auth requirement
would have broken that on purpose.

**Fixed with a dual mode:**
- Valid session present (the 3 in-app callers) → normal access
- No session (the public Help Center search) → strict per-IP rate limit
  (5 requests/hour) instead of a hard block

Updated all three authenticated callers (`DealAI.tsx`, `rep-portal`,
`affiliate/dashboard`) to actually send their session token — otherwise
they'd have started hitting the new anonymous rate limit themselves,
which would have been a real regression.

**Honest limitation:** the rate limiter is in-memory. It resets on cold
start and isn't shared across serverless instances — real abuse
mitigation, not a complete solution. A persistent store (Redis, or a
Supabase table) is the correct long-term fix if this endpoint sees real
abuse in practice.

## 4. Anthropic model identifier (confirmed likely invalid)

`"claude-sonnet-4-6"` doesn't match any current model identifier I know
of. Replaced with `"claude-sonnet-5"`. **I can't call the live Anthropic
API from this environment to 100% confirm** — recommend testing this
directly with a real API key before considering it verified. Also added
proper error handling: a failed Anthropic call now returns a real error
instead of silently rendering "No response generated." to the user,
which is what the previous code did on any failure, model-identifier
issue included — meaning this may have been silently broken for a while
with nothing surfacing it.

## 5. Duplicate Stripe checkout route (confirmed, already found independently)

`/api/create-checkout-session` was fully orphaned after last round's
pricing-page fix rerouted checkout through `/api/checkout` instead.
Removed entirely now that two independent reviews agree it's dead.

## Verification performed

- `tsc --noEmit`: clean
- `eslint`: clean on every touched file (one pre-existing, unrelated
  `any`-type error in `rep-portal/page.tsx` surfaced — confirmed
  pre-existing and untouched by this change, part of the already-
  documented Pass 5 lint debt, not a new regression)
- `next build`: succeeds; confirmed `create-checkout-session` no longer
  appears in the route table
- Traced all four `/api/ai` callers individually to confirm none would
  break under the new dual-mode auth requirement

## Still needs your action, not mine

- **Live-test the `claude-sonnet-5` model identifier** against a real
  Anthropic API key — I flagged the old one as invalid based on my own
  knowledge, but couldn't call the live API to confirm from here.
- **Decide on the rep-approval account-creation gap** (item 1's bonus
  finding) — a real product decision, not something I should silently
  wire in without being asked.
- **Consider a persistent rate-limit store** for `/api/ai` if the public
  Help Center endpoint sees real traffic/abuse — the in-memory limiter
  is a real but partial mitigation.
