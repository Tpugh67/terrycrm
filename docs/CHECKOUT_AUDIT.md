# Checkout/Stripe Integration Audit

Triggered by an external review (Lovable) flagging a "13 vs 18 industries"
Stripe discrepancy. That specific claim couldn't be verified (no Stripe
dashboard access from this environment), but tracing the checkout flow to
investigate it surfaced two real, more serious bugs.

## Found and fixed

### 1. Pricing page could take payment without ever creating an account (critical)

`/pricing`'s checkout buttons called `/api/create-checkout-session`
directly with just a `priceId` — no signup step, no Supabase account
creation, nothing. A customer could:

1. Land on `/pricing` directly (not via the homepage's signup-first CTAs)
2. Click "Start free trial," pay Stripe successfully
3. Get redirected to `/dashboard?success=true`
4. Hit `AuthGate`, which requires a real session — **none exists**, since
   no account was ever created
5. Have no way to log in, with no account tied to their payment

The `checkout.session.completed` webhook handler updates a `profiles`
row by matching on email — but if that row never existed, the update
silently affects zero rows. No error, no account, paid customer stuck.

**Fixed** by routing all four pricing-page plan CTAs through
`/login?mode=signup&plan=X` instead — the same flow the homepage's
pricing section was already correctly using, which creates the account
*before* redirecting to Stripe. Confirmed by inspecting the actual
rendered HTML output, not just the change itself.

### 2. `/api/checkout`'s price map was missing the Business plan (real, pre-existing)

Even for the *correct* signup flow, `/api/checkout`'s `PRICES` object only
had `solo` and `team` — `business` fell through to
`PRICES[plan] || PRICES.solo`, silently charging the Solo price for
anyone signing up on the Business plan. Added the missing entry using
the same real Stripe price ID already present elsewhere in the codebase.

### 3. My own bug from the previous round

The version of the pricing page I built two rounds ago posted `{ priceId }`
to `/api/checkout`, which actually reads `{ plan, email }` and ignores
unrecognized payloads — silently defaulting every checkout to the Solo
price regardless of which plan was selected. Fixed last round; noting it
here for the complete audit trail.

## Also fixed while in these files

- `catch (err: any)` in both `/api/checkout` and `/api/create-checkout-session`
  replaced with proper `err instanceof Error` narrowing.
- `/api/create-checkout-session` was collecting `email` from the request
  body but never passing it to Stripe (`customer_email` was omitted
  entirely) — fixed, though this route is currently unused (see below).

## Flagged, not fixed — needs your input or access I don't have

- **`/api/create-checkout-session` is now an orphaned route** — nothing
  in the app calls it anymore after the pricing-page fix. Left in place
  rather than deleted, in case something outside this codebase (a
  separate marketing page, an external tool) depends on it. Worth
  confirming before removing it.
- **The "13 vs 18 industries" Stripe claim** — could not verify. This
  would live in Stripe product/price *descriptions*, which I have no
  read access to from this environment. Worth checking directly in the
  Stripe dashboard.
- **EUR default at checkout** — same limitation. Determined by the
  currency baked into the Stripe Price objects themselves at creation
  time, not by anything in this codebase.
- **Annual vs. monthly pricing still charges the same amount** — flagged
  two rounds ago, still open. The Solo/Team/Business "annual" price IDs
  are identical to their monthly counterparts in the actual Stripe
  price map. The billing toggle on `/pricing` is currently a display-only
  feature until real annual price IDs exist in Stripe.
- **`rep_commissions` schema verification incomplete** — was in the
  middle of checking whether that table's schema allows the "pending"
  row `/api/track-referral` creates (which omits `subscription_amount`/
  `commission_amount`) when Supabase tool access became unavailable
  mid-session. Not verified either way — worth a manual check.

## Verification performed

- `tsc --noEmit`: clean
- `eslint`: clean on all touched files
- `next build`: succeeds
- Inspected actual rendered HTML output to confirm all four pricing plan
  links now point through the account-creating signup flow, not just
  assumed from the source change
