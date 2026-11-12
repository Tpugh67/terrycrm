// Turns a phone number as people type it into E.164 (+15551234567).
// US/Canada only for now: 10 digits, or 11 digits starting with 1, or an
// explicit +1. Anything else returns null so we never dial a guess.
export function toE164(raw?: string | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return null;
}
