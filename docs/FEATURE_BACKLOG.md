# PipeDesk Feature Backlog

Grounded in actual code/schema inspection this pass — several assumed
problems turned out to be already fixed, and a couple assumed-fine areas
turned out to be real gaps. Re-verified rather than carried forward from
memory.

## 🔴 Critical

| Feature | Why critical | Status |
|---|---|---|
| **Global search** | Listed explicitly in Epic 1; confirmed zero search functionality exists anywhere in the app — not a contacts filter, not a deal filter, nothing global. For a CRM with growing data volume, this is a daily-use gap, not a nice-to-have. | Not started — **building this now, see below** |
| **Calendar** | Confirmed zero calendar feature exists. Follow-up dates exist per-deal but there's no calendar view anywhere. | Not started |
| **Remove `page.backup.tsx`** | Dead file in `pipeline/`, flagged since Pass 1, never removed. Trivial but real — a stray backup file sitting in production source. | Not started |

## 🟡 Important

| Feature | Notes |
|---|---|
| **Pre-existing lint debt (40 errors)** | Found in Pass 5 across `pipeline/page.tsx`, `contacts/page.tsx`, `CsvTools.tsx`, most API routes — `any` types, setState-in-effect, unescaped JSX. Not a "feature," but "if a workflow exists it should be complete" cuts against leaving known bugs sitting unaddressed. |
| **Activity feed** | `rep_activity` exists for reps specifically; there's no general activity/timeline feature for regular CRM users (e.g., "Jane added a note on Oak Street Duplex, 2h ago"). Partial infrastructure exists (deal notes), full feature doesn't. |
| **Onboarding wizard** | `WelcomeModal`/`OnboardingChecklist` exist but are minimal — your own suggested 7-step "Getting Started" path isn't implemented anywhere. |
| **Email sync** | Zero email integration exists — the AI can *draft* an email but can't send or track one. |

## 🟢 Nice to have

| Feature | Notes |
|---|---|
| **Companies** | Listed as "if applicable" — genuinely uncertain given PipeDesk spans 18 industries, several of which (real estate wholesaling, solar) deal with individuals, not companies. **This needs your call, not mine** — building it speculatively risks a feature nobody uses. |
| **Webhooks/public API** | No customer-facing API exists today; real scope, no signal yet that customers are asking for it. |
| **Marketing automation** | Genuinely large scope (Epic 6) — sequencing/drip campaigns don't exist in any form today. Recommend deferring until Epic 1 is solid. |

## Corrected from earlier assumptions

- **Dashboard "placeholder stats"** (flagged in the Pass 1 audit) — re-checked the actual current code: it genuinely queries real Supabase data (`supabase.from("deals").select("*").eq("user_id", user.id)`) and computes real totals. **This is fixed**, not still broken — the Pass 1 finding was accurate at the time but stale now.
- **`rep_referrals`/`rep_commissions` missing RLS** (flagged in Pass 1 as blocking referral tracking) — re-checked the real policies. `rep_referrals` has zero policies but is also **never referenced anywhere in the app code** — it's dead schema, not a live bug. `rep_commissions` writes go through the service-role client (bypasses RLS by design) and reads are covered by an existing "Reps can read own commissions" policy. **Not actually broken**, contrary to the original finding.

---

Starting with **global search** — the clearest, most unambiguous 🔴 item, real daily-use value, no dependency on a product decision I can't make myself (unlike Companies).
