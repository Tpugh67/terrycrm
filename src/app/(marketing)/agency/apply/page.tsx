"use client";
import Link from "next/link";
import { useState } from "react";

export default function AgencyApplyPage() {
  const [form, setForm] = useState({ name: "", email: "", agencyName: "", website: "", clientCount: "", why: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { supabase } = await import("../../../../lib/supabase");
    const { error: dbError } = await supabase.from("agency_applications").insert({
      name: form.name,
      email: form.email,
      agency_name: form.agencyName,
      website: form.website,
      client_count: form.clientCount,
      why: form.why,
      status: "pending",
    });

    if (dbError) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "agency_application",
        data: { name: form.name, email: form.email, agencyName: form.agencyName, clientCount: form.clientCount },
      }),
    }).catch(() => {});

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/partners" className="inline-block text-sm text-slate-400 hover:text-white transition mb-6">← Back to Partners</Link>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-amber-500/30">
            🏢 Agency Partner Program
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Resell PipeDesk to Your Clients</h1>
          <p className="text-slate-400 text-lg">White-label PipeDesk under your agency brand. Earn 25% revenue share on every client you manage.</p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg mx-auto">
            {[{ val: "25%", label: "Revenue Share" }, { val: "White-label", label: "Available" }, { val: "Dedicated", label: "Account Manager" }].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-xl font-bold text-amber-400">{s.val}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">What agency partners get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "💰", title: "25% Revenue Share", desc: "Earn 25% of every client subscription, for as long as they stay." },
              { icon: "🏷️", title: "White-Label Options", desc: "Present PipeDesk under your own agency branding to clients." },
              { icon: "🤝", title: "Dedicated Account Manager", desc: "A direct point of contact for onboarding, support, and questions." },
              { icon: "⚡", title: "Priority Support", desc: "Faster response times for you and every client you manage." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-bold text-slate-900 text-sm mb-1">{f.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-amber-800 mb-2">Application received!</h3>
              <p className="text-amber-700 mb-2">We will review your application and get back to you within 48 hours at {form.email}.</p>
              <p className="text-sm text-amber-600">Check your spam folder if you do not hear from us.</p>
              <Link href="/partners" className="inline-block mt-6 bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition">← Back to Partners</Link>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Apply as an agency partner</h2>
              <p className="text-slate-500 mb-8">Tell us about your agency and the clients you'd like to bring onto PipeDesk.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Agency Name *</label>
                  <input required name="agencyName" value={form.agencyName} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder="Your agency's name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name *</label>
                  <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder="you@agency.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Agency Website</label>
                  <input name="website" value={form.website} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder="https://youragency.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Number of Clients *</label>
                  <select required name="clientCount" value={form.clientCount} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Select a range</option>
                    {["1-5 clients", "6-15 clients", "16-50 clients", "50+ clients"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">How do you plan to work with PipeDesk? *</label>
                  <textarea required name="why" value={form.why} onChange={handleChange} rows={4} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white" placeholder="Tell us about your clients and how you'd roll out PipeDesk..." />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg">
                  {loading ? "Submitting..." : "Submit Application →"}
                </button>
                <p className="text-xs text-slate-400 text-center">We review all applications within 48 hours · hello@pipedesk.app</p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
