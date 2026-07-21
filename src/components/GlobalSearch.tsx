"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, User, Briefcase } from "lucide-react";
import { supabase } from "../lib/supabase";

type ContactResult = { type: "contact"; id: number; title: string; subtitle: string };
type DealResult = { type: "deal"; id: number; title: string; subtitle: string };
type Result = ContactResult | DealResult;

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/** Escape Postgres ILIKE wildcards in user input so a search for a literal
 * "%" or "_" doesn't get interpreted as a pattern — a real edge case, not
 * a hypothetical one, since deal amounts/percentages are common search terms. */
function escapeLike(input: string) {
  return input.replace(/[%_]/g, (m) => `\\${m}`);
}

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      // No setState here — the dropdown is already gated on this same
      // length check at render time, so stale loading/results/error state
      // simply never gets rendered. Nothing needs resetting.
      return;
    }

    debounceRef.current = setTimeout(async () => {
      // Guards against a slow earlier request resolving after a faster
      // later one and overwriting fresher results with stale ones.
      const requestId = ++requestIdRef.current;
      setLoading(true);
      setError(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (requestId === requestIdRef.current) setLoading(false);
        return;
      }

      const pattern = `%${escapeLike(trimmed)}%`;

      const [contactsRes, dealsRes] = await Promise.all([
        supabase
          .from("contacts")
          .select("id, name, email, company")
          .eq("user_id", user.id)
          .or(`name.ilike.${pattern},email.ilike.${pattern},company.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("deals")
          .select("id, title, seller, stage")
          .eq("user_id", user.id)
          .or(`title.ilike.${pattern},seller.ilike.${pattern},address.ilike.${pattern}`)
          .limit(5),
      ]);

      // A newer request has already started — discard this stale result.
      if (requestId !== requestIdRef.current) return;

      if (contactsRes.error || dealsRes.error) {
        setError(true);
        setResults([]);
        setLoading(false);
        return;
      }

      const contactResults: ContactResult[] = (contactsRes.data || []).map((c) => ({
        type: "contact",
        id: c.id,
        title: c.name,
        subtitle: c.company || c.email || "",
      }));
      const dealResults: DealResult[] = (dealsRes.data || []).map((d) => ({
        type: "deal",
        id: d.id,
        title: d.title,
        subtitle: `${d.seller ?? ""}${d.seller && d.stage ? " · " : ""}${d.stage ?? ""}`,
      }));

      setResults([...dealResults, ...contactResults]);
      setLoading(false);
      setActiveIndex(-1);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function navigateTo(result: Result) {
    setOpen(false);
    setQuery("");
    if (result.type === "deal") {
      router.push(`/pipeline?deal=${result.id}`);
    } else {
      router.push(`/contacts?q=${encodeURIComponent(result.title)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigateTo(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const trimmedQuery = query.trim();
  const showDropdown = open && trimmedQuery.length >= MIN_QUERY_LENGTH;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="pd-global-search-results"
          aria-autocomplete="list"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search contacts and deals..."
          className="w-full text-sm border border-slate-200 rounded-lg pl-9 pr-8 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="pd-global-search-results"
          role="listbox"
          className="absolute mt-1.5 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-sm text-red-500">Search failed. Please try again.</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-400">No results for &ldquo;{trimmedQuery}&rdquo;</div>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.type}-${r.id}`}
                role="option"
                aria-selected={activeIndex === i}
                onClick={() => navigateTo(r)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  activeIndex === i ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                {r.type === "deal" ? (
                  <Briefcase size={14} className="text-blue-500 flex-shrink-0" />
                ) : (
                  <User size={14} className="text-emerald-500 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{r.title}</div>
                  {r.subtitle && <div className="text-xs text-slate-400 truncate">{r.subtitle}</div>}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
