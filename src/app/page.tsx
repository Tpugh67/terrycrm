"use client";
import Link from "next/link";
import { useState } from "react";

const ALL_INDUSTRIES = [
  { code: "RE", label: "Real Estate", color: "bg-blue-600", href: "/real-estate", emoji: "🏠", tagline: "For wholesalers & investors" },
  { code: "IN", label: "Insurance", color: "bg-emerald-600", href: "/insurance", emoji: "🛡️", tagline: "For agents & brokers" },
  { code: "ML", label: "Mortgage & Lending", color: "bg-violet-600", href: "/mortgage", emoji: "🏦", tagline: "For loan officers" },
  { code: "AU", label: "Automotive", color: "bg-red-600", href: "/auto", emoji: "🚗", tagline: "For dealers & sales" },
  { code: "SO", label: "Solar Energy", color: "bg-yellow-500", href: "/solar", emoji: "☀️", tagline: "For solar reps" },
  { code: "FI", label: "Financial Services", color: "bg-blue-700", href: "/financial", emoji: "📈", tagline: "For advisors & planners" },
  { code: "LG", label: "Legal", color: "bg-slate-700", href: "/legal", emoji: "⚖️", tagline: "For attorneys & firms" },
  { code: "RC", label: "Recruiting", color: "bg-indigo-600", href: "/recruiting", emoji: "🎯", tagline: "For recruiters & agencies" },
  { code: "HC", label: "Healthcare", color: "bg-cyan-600", href: "/healthcare", emoji: "🏥", tagline: "For practices & clinics" },
  { code: "CO", label: "Construction", color: "bg-orange-600", href: "/construction", emoji: "🏗️", tagline: "For contractors & builders" },
  { code: "CN", label: "Consulting", color: "bg-purple-600", href: "/consulting", emoji: "💡", tagline: "For consultants & coaches" },
  { code: "EC", label: "E-Commerce", color: "bg-pink-600", href: "/ecommerce", emoji: "🛒", tagline: "For stores & brands" },
  { code: "PM", label: "Property Mgmt", color: "bg-teal-600", href: "/property-management", emoji: "🏢", tagline: "For property managers" },
  { code: "TR", label: "Trucking & Logistics", color: "bg-blue-800", href: "/trucking", emoji: "🚛", tagline: "For carriers & dispatchers" },
  { code: "DT", label: "Dental", color: "bg-sky-500", href: "/dental", emoji: "🦷", tagline: "For dental practices" },
  { code: "FW", label: "Fitness & Wellness", color: "bg-green-600", href: "/fitness", emoji: "💪", tagline: "For gyms & coaches" },
  { code: "NP", label: "Nonprofit", color: "bg-rose-600", href: "/nonprofit", emoji: "❤️", tagline: "For nonprofits & charities" },
  { code: "ED", label: "Education", color: "bg-indigo-500", href: "/education", emoji: "🎓", tagline: "For schools & tutors" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#industries" className="hover:text-slate-900 transition">Industries</a>
          <a href="#features" className="hover:text-slate-900 transition">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition font-medium">Log in</Link>
          <Link href="/login?mode=signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Start free trial</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-200">
          🚀 Built for Real Professionals · 18 Industries · 1 Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
          The CRM built for<br /><span className="text-blue-600">your industry</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop configuring generic tools. PipeDesk gives you a pipeline built exactly for how your industry works — stages, terminology, and workflows included.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a href="#industries" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition w-full sm:w-auto text-center">👇 Choose your industry</a>
          <Link href="/login?mode=signup" className="text-slate-600 hover:text-slate-900 font-medium text-base px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 transition w-full sm:w-auto text-center">Start free trial →</Link>
        </div>
        <p className="text-xs text-slate-400">No credit card required · 14-day free trial · Cancel anytime</p>
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-16 border-t border-slate-100">
          {[{value:"18",label:"Industries supported"},{value:"$29",label:"Per month to start"},{value:"14",label:"Day free trial"}].map((s)=>(
            <div key={s.label}><div className="text-3xl font-bold text-slate-900">{s.value}</div><div className="text-xs text-slate-400 mt-1">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section id="industries" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What industry are you in?</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Click your industry to see a live demo of your pipeline — built exactly for how you work.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_INDUSTRIES.map((ind) => (
              <Link key={ind.code} href={ind.href} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg transition flex flex-col items-center text-center gap-2">
                <div className={`w-12 h-12 rounded-xl ${ind.color} flex items-center justify-center text-xl group-hover:scale-110 transition`}>{ind.emoji}</div>
                <div className="font-semibold text-slate-800 text-sm leading-tight">{ind.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{ind.tagline}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to close more deals</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Powerful features that work out of the box — no setup, no configuration, no consultants needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{icon:"📋",title:"Visual Kanban Pipeline",desc:"See your entire pipeline at a glance with a clean board view."},{icon:"📅",title:"Follow-up Reminders",desc:"Overdue deals are flagged in red so nothing falls through the cracks."},{icon:"📝",title:"Activity Timeline",desc:"Every call, text, note, and stage change is logged automatically."},{icon:"⚡",title:"Quick Actions",desc:"Log a call, text, or offer with one click. No forms, no friction."},{icon:"🔥",title:"Hot Deal Alerts",desc:"High-value opportunities are automatically highlighted."},{icon:"📊",title:"Pipeline Dashboard",desc:"See total pipeline value, fees earned, and overdue follow-ups instantly."},{icon:"👥",title:"Contact Management",desc:"Link contacts to deals and see their full history in one place."},{icon:"🔍",title:"Smart Filters",desc:"Filter by hot deals, overdue follow-ups, or stale deals instantly."},{icon:"🔒",title:"Secure & Private",desc:"Your data is yours. Every record is tied to your account only."}].map((f)=>(
              <div key={f.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to close more deals?</h2>
          <p className="text-xl text-slate-500 mb-10">Join professionals across 18 industries using PipeDesk to manage their pipeline and never miss a follow-up.</p>
          <Link href="/login?mode=signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-5 rounded-xl transition">Start your free 14-day trial →</Link>
          <p className="text-sm text-slate-400 mt-4">No credit card required · Set up in under 2 minutes</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-slate-900">PipeDesk</span>
            <span className="text-slate-400 text-sm">· Multi-Industry CRM Platform</span>
          </div>
          <div className="text-sm text-slate-400">© 2026 PipeDesk · 18 Industries · 1 Platform</div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#industries" className="hover:text-slate-900 transition">Industries</a>
            <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
            <Link href="/login" className="hover:text-slate-900 transition">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, honest pricing</h2>
          <p className="text-slate-500 text-lg mb-8">Start free for 14 days. No credit card required.</p>
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 gap-1">
            <button onClick={()=>setAnnual(false)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${!annual?"bg-slate-900 text-white":"text-slate-500 hover:text-slate-900"}`}>Monthly</button>
            <button onClick={()=>setAnnual(true)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${annual?"bg-slate-900 text-white":"text-slate-500 hover:text-slate-900"}`}>Annual<span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Save 20%</span></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Solo</div>
            <div className="flex items-baseline gap-1 mb-1"><div className="text-4xl font-bold text-slate-900">${annual?"23":"29"}</div><div className="text-lg font-normal text-slate-400">/mo</div></div>
            {annual && <div className="text-sm text-emerald-600 font-medium mb-1">$276/yr · save $72</div>}
            <div className="text-sm text-slate-400 mb-8">Perfect for independent professionals</div>
            <div className="space-y-3 mb-8">{["1 user","All 18 industry pipelines","Unlimited deals & contacts","Activity timeline","Follow-up reminders","Email support"].map((f)=>(<div key={f} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-emerald-500 font-bold">✓</span> {f}</div>))}</div>
            <Link href="/login?mode=signup" className="block text-center border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm py-3 rounded-xl transition">Start free trial</Link>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Team</div>
            <div className="flex items-baseline gap-1 mb-1"><div className="text-4xl font-bold text-white">${annual?"47":"59"}</div><div className="text-lg font-normal text-slate-400">/mo</div></div>
            {annual && <div className="text-sm text-emerald-400 font-medium mb-1">$564/yr · save $144</div>}
            <div className="text-sm text-slate-400 mb-8">For growing teams and agencies</div>
            <div className="space-y-3 mb-8">{["Up to 5 users","All 18 industry pipelines","Unlimited deals & contacts","Activity timeline","Follow-up reminders","Priority support","Team activity feed","Admin controls"].map((f)=>(<div key={f} className="flex items-center gap-2 text-sm text-slate-300"><span className="text-blue-400 font-bold">✓</span> {f}</div>))}</div>
            <Link href="/login?mode=signup" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition">Start free trial</Link>
          </div>
        </div>
        <p className="text-center text-sm text-slate-400 mt-8">Both plans include a 14-day free trial · No credit card required · Cancel anytime</p>
      </div>
    </section>
  );
}
