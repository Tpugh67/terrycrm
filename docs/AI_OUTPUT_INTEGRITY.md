# AI Output Integrity Policy

## The rule

For AI features, never fabricate probabilities, revenue forecasts, activity
events, or customer insights. Every AI recommendation must clearly derive
from real PipeDesk data, deterministic calculations, or an explicitly
labeled AI inference.

If a number or claim isn't grounded in real data or real computation, the
AI must say so — "not enough information" — rather than produce a
plausible-sounding guess.

## Audit findings (this round)

- Predict close probability (DealAI.tsx) — Violation found, fixed.
  Prompt instructed the AI to give a percentage with no statistical model
  behind it. Renamed to "Assess deal health" — qualitative signal only
  (Strong / Moderate / Weak), grounded in real deal facts, says "not enough
  information" rather than guessing.
- Homepage AI copy and Help Center FAQ — updated to match the new, honest
  behavior.
- Dashboard AI insight, AI Workspace prompts, rep-portal and affiliate
  assistants — audited, found compliant.

## Going-forward check for any new AI feature

1. Every number/claim is either a real data value, a deterministic
   calculation, or explicitly labeled as general-purpose.
2. Never ask the AI to invent a statistic or probability.
3. If there isn't enough real data, say so instead of guessing.
4. Update all copy (marketing, in-app, Help Center) to match actual behavior.
5. Log the feature here.
