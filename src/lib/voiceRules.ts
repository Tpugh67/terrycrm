import { toE164 } from "./phone";

// Area codes that share the +1 country code but are NOT in the United
// States (Canada and the Caribbean). Calling them is billed at much higher
// international rates, and scams often use them, so they are blocked.
// US territories (Puerto Rico 787/939, USVI 340, Guam 671, N. Mariana 670,
// American Samoa 684) are US and stay allowed.
const NON_US_AREA_CODES = new Set([
  // Canada
  "204","226","236","249","250","257","263","289","306","343","354","365","367","368","382","403","416","418","428",
  "431","437","438","450","468","474","506","514","519","548","579","581","584","587","604","613","639","647","672",
  "683","705","709","742","753","778","780","782","807","819","825","867","873","879","902","905",
  // Caribbean and other +1 countries
  "242","246","264","268","284","345","441","473","649","658","664","721","758","767","784","809","829","849","868","869","876",
]);

// Premium-rate and toll-free ranges: never needed for calling prospects.
const BLOCKED_AREA_CODES = new Set(["900","800","833","844","855","866","877","888","700","710"]);

export type Destination = { ok: true; e164: string } | { ok: false; reason: string };

export function validateDestination(raw?: string | null): Destination {
  const e164 = toE164(raw);
  if (!e164) return { ok: false, reason: "Enter a 10-digit US phone number." };
  const area = e164.slice(2, 5);
  const exchange = e164.slice(5, 8);
  if (!/^[2-9]/.test(area) || !/^[2-9]/.test(exchange)) return { ok: false, reason: "That is not a valid US phone number." };
  if (area[1] === "1" && area[2] === "1") return { ok: false, reason: "Service numbers (like 911 or 411) cannot be called." };
  if (NON_US_AREA_CODES.has(area)) return { ok: false, reason: "Only US numbers are allowed. Canadian and Caribbean numbers are blocked." };
  if (BLOCKED_AREA_CODES.has(area) || exchange === "976") return { ok: false, reason: "Toll-free and premium-rate numbers are blocked." };
  return { ok: true, e164 };
}

// Spending safeguards, per user, rolling 24 hours. Override in Vercel with
// VOICE_DAILY_CALL_LIMIT and VOICE_DAILY_MINUTE_LIMIT.
export const DEFAULT_DAILY_CALL_LIMIT = 150;
export const DEFAULT_DAILY_MINUTE_LIMIT = 240;

// Twilio rates (US): browser leg $0.004/min + outbound phone leg $0.014/min,
// billed per started minute. Used only for estimates in reports.
export const COST_PER_MINUTE = 0.018;
export function estimateCost(durationSecs: number) {
  return durationSecs > 0 ? Math.ceil(durationSecs / 60) * COST_PER_MINUTE : 0;
}
