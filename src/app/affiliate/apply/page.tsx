"use client";
import Link from "next/link";
import { useState } from "react";

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({ name: "", email: "", website: "", audience: "", platform: "", why: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { supabase } = await import("../../../lib/supabase");
    await supabase.from("affiliate_applications").insert({
      name: form.name,
      email: form.email,
      website: form.website,
      audience: form.audience,
      platform: form.platform,
      why: form.why,
      status: "pending",
    });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <Link href="/partners" className="text-sm text-slate-500 hover:text-slate-900 transition">← Back to Partners</Link>
      </nav>

      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-emerald-600/30">
            📣 Affiliate Program
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join the PipeDesk Affiliate Program</h1>
          <p className="text-slate-400 text-lg">Earn 20% recurring commission on every customer you refer. Share your link, earn every month.</p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg mx-auto">
            {[{ val: "20%", label: "Recurring Commission" }, { val: "Monthly", label: "Payout Schedule" }, { val: "Free", label: "To Join" }].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-emerald-400">{s.val}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">Application received!</h3>
              <p className="text-emerald-600 mb-2">We will review your application and get back to you within 24 hours at {form.email}.</p>
              <p className="text-sm text-emerald-500">Check your spam folder if you do not hear from us.</p>
              <Link href="/partners" className="inline-block mt-6 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition">← Back to Partners</Link>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Apply to become an affiliate</h2>
              <p className="text-slate-500 mb-8">Tell us about yourself and how you plan to promote PipeDesk.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Website or Social Profile</label>
                  <input name="website" value={form.website} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="https://yourwebsite.com or @yourhandle" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Platform *</label>
                  <select required name="platform" value={form.platform} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                    <option value="">Select your main platform</option>
                    {["Blog / Website", "YouTube", "Instagram", "TikTok", "LinkedIn", "Facebook", "Twitter / X", "Email Newsletter", "Podcast", "Other"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Audience Size / Description *</label>
                  <input required name="audience" value={form.audience} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="e.g. 5,000 email subscribers, small business owners" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">How will you promote PipeDesk? *</label>
                  <textarea required name="why" value={form.why} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" placeholder="Tell us your promotion strategy..." />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition text-lg">
                  Submit Application →
                </button>
                <p className="text-xs text-slate-400 text-center">We review all applications within 24 hours · hello@pipedesk.app</p>
              </form>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-bold text-white">PipeDesk</span>
          <span className="text-sm text-slate-500">Questions? Email hello@pipedesk.app</span>
        </div>
      </footer>
    </div>
  );
}
