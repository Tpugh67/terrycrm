import { supabase } from "./supabase";

/**
 * Returns an Authorization header for the current session, or an empty
 * object if there's no session — used by every client-side call to a
 * route that accepts (but doesn't always require) authentication, e.g.
 * /api/ai. Small, but genuinely shared across 3+ call sites rather than
 * duplicated per-component.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
}
