"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import WelcomeModal from "./WelcomeModal";
import OnboardingChecklist from "./OnboardingChecklist";

const PUBLIC_PATHS = ["/", "/login", "/pricing", "/rep-portal", "/reps",
  "/partners", "/affiliate/apply", "/affiliate/dashboard",
  "/real-estate", "/insurance", "/mortgage", "/auto", "/solar",
  "/financial", "/legal", "/recruiting", "/healthcare", "/construction",
  "/consulting", "/ecommerce", "/property-management", "/trucking",
  "/dental", "/fitness", "/nonprofit", "/education"];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard", "/contacts": "Contacts", "/pipeline": "Pipeline",
  "/tasks": "Tasks", "/settings": "Settings", "/admin/reps": "Rep Applications",
  "/help": "Help Center", "/partners": "Partners",
  "/affiliate/apply": "Affiliate Application", "/affiliate/dashboard": "Affiliate Dashboard",
};

// ─── ADMIN SIDEBAR ────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { section: "HOME", items: [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
  ]},
  { section: "CRM", items: [
    { href: "/contacts", icon: "👥", label: "Contacts" },
    { href: "/pipeline", icon: "🔀", label: "Pipeline" },
    { href: "/tasks", icon: "✅", label: "Tasks" },
  ]},
  { section: "GROWTH CENTER", items: [
    { href: "/admin/reps", icon: "🤝", label: "Sales Reps" },
    { href: "/affiliate/apply", icon: "📣", label: "Affiliates" },
    { href: "/partners", icon: "🏢", label: "Partners" },
  ]},
  { section: "REPORTING", items: [
    { href: "/reports", icon: "📈", label: "Analytics" },
  ]},
  { section: "SUPPORT", items: [
    { href: "/help", icon: "❓", label: "Help Center" },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ]},
];

// ─── CUSTOMER SIDEBAR ─────────────────────────────────────────────────────────
const CUSTOMER_NAV = [
  { section: "GENERAL", items: [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/contacts", icon: "👥", label: "Contacts" },
    { href: "/pipeline", icon: "🔀", label: "Pipeline" },
    { href: "/tasks", icon: "✅", label: "Tasks" },
  ]},
  { section: "SUPPORT", items: [
    { href: "/help", icon: "❓", label: "Help Center" },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ]},
];

// ─── SDR SIDEBAR ──────────────────────────────────────────────────────────────
const REP_NAV = [
  { section: "SALES", items: [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/pipeline", icon: "🔀", label: "My Pipeline" },
    { href: "/contacts", icon: "👥", label: "My Leads" },
    { href: "/tasks", icon: "✅", label: "Tasks" },
  ]},
  { section: "REP CENTER", items: [
    { href: "/rep-portal", icon: "🔗", label: "Referral Link" },
    { href: "/help", icon: "🎓", label: "Training" },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ]},
];

// ─── AFFILIATE SIDEBAR ────────────────────────────────────────────────────────
const AFFILIATE_NAV = [
  { section: "AFFILIATE", items: [
    { href: "/affiliate/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/affiliate/dashboard", icon: "🔗", label: "Referral Links" },
  ]},
  { section: "MARKETING", items: [
    { href: "/affiliate/dashboard", icon: "✨", label: "AI Content Generator" },
    { href: "/affiliate/dashboard", icon: "🎨", label: "Marketing Assets" },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ]},
];

const INDUSTRIES = [
  { href: "/real-estate", code: "RE", label: "Real Estate", color: "bg-blue-600" },
  { href: "/insurance", code: "IN", label: "Insurance", color: "bg-emerald-600" },
  { href: "/mortgage", code: "ML", label: "Mortgage & Lending", color: "bg-violet-600" },
  { href: "/auto", code: "AU", label: "Automotive", color: "bg-red-600" },
  { href: "/solar", code: "SO", label: "Solar Energy", color: "bg-yellow-500" },
  { href: "/financial", code: "FI", label: "Financial Services", color: "bg-blue-700" },
  { href: "/legal", code: "LG", label: "Legal", color: "bg-slate-700" },
  { href: "/recruiting", code: "RC", label: "Recruiting", color: "bg-indigo-600" },
  { href: "/healthcare", code: "HC", label: "Healthcare", color: "bg-cyan-600" },
  { href: "/construction", code: "CO", label: "Construction", color: "bg-orange-600" },
  { href: "/consulting", code: "CN", label: "Consulting", color: "bg-purple-600" },
  { href: "/ecommerce", code: "EC", label: "E-Commerce", color: "bg-pink-600" },
  { href: "/property-management", code: "PM", label: "Property Mgmt", color: "bg-teal-600" },
  { href: "/trucking", code: "TR", label: "Trucking & Logistics", color: "bg-blue-800" },
  { href: "/dental", code: "DT", label: "Dental", color: "bg-sky-500" },
  { href: "/fitness", code: "FW", label: "Fitness & Wellness", color: "bg-green-600" },
  { href: "/nonprofit", code: "NP", label: "Nonprofit", color: "bg-rose-600" },
  { href: "/education", code: "ED", label: "Education", color: "bg-indigo-500" },
];

function getNavByRole(role: string) {
  switch (role) {
    case "admin": return ADMIN_NAV;
    case "rep": return REP_NAV;
    case "affiliate": return AFFILIATE_NAV;
    default: return CUSTOMER_NAV;
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case "admin": return "Admin";
    case "rep": return "Sales Rep";
    case "affiliate": return "Affiliate";
    default: return "Free Trial";
  }
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "admin": return "text-amber-400";
    case "rep": return "text-blue-400";
    case "affiliate": return "text-emerald-400";
    default: return "text-slate-500";
  }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/affiliate");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("?");
  const [userIndustry, setUserIndustry] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const isIndustryPage = INDUSTRIES.some(i => i.href === pathname);
  useEffect(() => { if (isIndustryPage) setIndustriesOpen(true); }, [pathname]);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setUserInitials(user.email.slice(0, 2).toUpperCase());
        const { data: profile } = await supabase.from("profiles").select("industry, role").eq("id", user.id).single();
        if (profile?.industry) setUserIndustry(profile.industry);
        if (profile?.role) setUserRole(profile.role);
      }
    }
    loadUser();
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (isPublic) return <>{children}</>;

  const pageTitle = PAGE_TITLES[pathname] || "Workspace";
  const navSections = getNavByRole(userRole);
  const roleLabel = getRoleLabel(userRole);
  const roleBadgeColor = getRoleBadgeColor(userRole);
  const showIndustries = userRole === "admin" || userRole === "user";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">PD</div>
            <div>
              <div className="text-base font-bold tracking-tight leading-none text-white">PipeDesk</div>
              <div className={"text-[10px] mt-0.5 font-semibold " + roleBadgeColor}>{roleLabel}</div>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">✕</button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navSections.map((section) => (
          <div key={section.section}>
            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-3 mb-1.5">{section.section}</div>
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href + item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className={"flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition " + (active ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Industries — only for admin and customer */}
        {showIndustries && (
          <>
            <button onClick={() => setIndustriesOpen(!industriesOpen)}
              className="w-full flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-4 mb-1.5 hover:text-slate-400 transition">
              <span>Industries</span>
              <span>{industriesOpen ? "▲" : "▼"}</span>
            </button>
            {industriesOpen && INDUSTRIES.filter(ind => !userIndustry || ind.href === "/" + userIndustry).map((ind) => {
              const active = pathname === ind.href;
              return (
                <Link key={ind.href} href={ind.href} onClick={() => setMobileOpen(false)}
                  className={"flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition " + (active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
                  <span className={"w-5 h-5 rounded " + ind.color + " flex items-center justify-center text-[9px] font-bold flex-shrink-0 text-white"}>{ind.code}</span>
                  <span className="truncate text-xs">{ind.label}</span>
                </Link>
              );
            })}
          </>
        )}

        {/* Logout */}
        <div className="pt-2">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition text-red-400 hover:bg-red-900/20 hover:text-red-300">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </nav>

      {/* User info */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{userInitials}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-300 truncate">{userEmail || "Loading..."}</div>
            <div className={"text-[10px] font-semibold " + roleBadgeColor}>{roleLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="hidden lg:flex w-64 bg-slate-950 text-white flex-col border-r border-slate-800 fixed h-full z-20">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-slate-950 text-white flex flex-col h-full z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition">
              <div className="w-5 h-0.5 bg-slate-600 mb-1" />
              <div className="w-5 h-0.5 bg-slate-600 mb-1" />
              <div className="w-5 h-0.5 bg-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:block">PipeDesk</span>
              <span className="text-slate-300 hidden sm:block">/</span>
              <span className="text-sm font-semibold text-slate-800">{pageTitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={"text-xs font-bold px-2 py-1 rounded-full " + (userRole === "admin" ? "bg-amber-100 text-amber-700" : userRole === "rep" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600")}>{roleLabel}</div>
            <div className="text-xs text-slate-400 hidden md:block">{userEmail}</div>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">{userInitials}</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
      <WelcomeModal />
      <OnboardingChecklist />
    </div>
  );
}
