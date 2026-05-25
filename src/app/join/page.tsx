"use client";
import Link from "next/link";
import { useState } from "react";

export default function JoinPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", industry: "", experience: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { alert("Please read and agree to the Sales Rep Agreement before applying."); return; }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">PipeDesk</span>
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition">← Back to home</Link>
      </nav>

      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-green-500/30">💰 Commission-Only Sales Rep Opportunity</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Earn recurring income<br />selling PipeDesk</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">30% recurring monthly commission on every customer you bring in. The product sells itself — industry-specific CRM at $29/month with a free 14-day trial.</p>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { val: "30%", label: "Recurring Commission" },
              { val: "$29+", label: "Starting Plan Price" },
              { val: "18", label: "Industries to Sell" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{s.val}</div>
                <div className="text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">How much can you earn?</h2>
          <p className="text-slate-500 text-center mb-10">Commission stacks — every new client adds to your monthly recurring income.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { customers: "10", monthly: "$87", annual: "$1,044" },
              { customers: "25", monthly: "$217.50", annual: "$2,610" },
              { customers: "100", monthly: "$870", annual: "$10,440" },
              { customers: "500", monthly: "$4,350", annual: "$52,200" },
            ].map((r) => (
              <div key={r.customers} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{r.customers}</div>
                <div className="text-xs text-slate-400 mb-3">active clients</div>
                <div className="text-2xl font-bold text-green-600">{r.monthly}</div>
                <div className="text-xs text-slate-400">/month recurring</div>
                <div className="text-sm font-semibold text-slate-600 mt-2">{r.annual}/year</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">Based on Solo plan ($29/mo) at 30% commission. Team ($79/mo) and Business ($149/mo) earn even more.</p>
        </div>
      </section>

      {/* Why This Opportunity */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why this opportunity is different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🔄", title: "Recurring Commission", desc: "You earn every single month as long as your customer stays. One sale keeps paying you forever." },
              { icon: "🎯", title: "Easy to Sell", desc: "18 industry-specific pipelines means everyone you talk to has a demo built for their exact business." },
              { icon: "💰", title: "Multiple Price Points", desc: "Solo $29/mo, Team $79/mo, Business $149/mo. Bigger clients = bigger commissions." },
              { icon: "🚀", title: "Ground Floor Opportunity", desc: "Get in early. Be one of the first reps as PipeDesk grows across 18 industries nationwide." },
              { icon: "🏠", title: "Work From Anywhere", desc: "100% remote. Sell via phone, email, LinkedIn, or in-person. Your schedule, your terms." },
              { icon: "📱", title: "Free Trial Closes Deals", desc: "14-day free trial means no credit card needed to start. The easiest close in sales." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-3xl">{f.icon}</div>
                <div>
                  <div className="font-bold text-slate-900 mb-1">{f.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Commission Structure</h2>
          <p className="text-slate-500 text-center mb-10">Simple, transparent, recurring.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { plan: "Solo", price: "$29/mo", commission: "$8.70/mo", color: "border-blue-200 bg-blue-50" },
              { plan: "Team", price: "$79/mo", commission: "$23.70/mo", color: "border-purple-200 bg-purple-50" },
              { plan: "Business", price: "$149/mo", commission: "$44.70/mo", color: "border-green-200 bg-green-50" },
            ].map((p) => (
              <div key={p.plan} className={`rounded-xl border-2 p-6 text-center ${p.color}`}>
                <div className="text-xl font-bold text-slate-900 mb-1">{p.plan}</div>
                <div className="text-slate-500 text-sm mb-4">{p.price} per customer</div>
                <div className="text-3xl font-bold text-green-600">{p.commission}</div>
                <div className="text-xs text-slate-500 mt-1">per customer per month</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Key Terms:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✅ 30% recurring monthly commission on all plans</li>
              <li>✅ Commission paid monthly</li>
              <li>✅ Minimum 10 new paying clients per month to stay active</li>
              <li>✅ Warning issued after 2 consecutive months below minimum</li>
              <li>✅ After termination, commissions continue 90 days then revert to PipeDesk</li>
              <li>✅ All clients are permanent property of PipeDesk</li>
              <li>❌ No salary or guarantee — commission only</li>
              <li>❌ Representatives may not solicit PipeDesk clients for competing products</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Agreement */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Sales Rep Agreement</h2>
          <p className="text-slate-500 text-center mb-6">Read and agree to the terms before applying.</p>
          <div className="text-center mb-8">
            <a href="/sales-rep-agreement.pdf" target="_blank" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">
              📄 Download Sales Rep Agreement (PDF)
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <button onClick={() => setShowAgreement(!showAgreement)} className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-slate-900 hover:bg-slate-100 transition">
              <span>📄 PipeDesk Sales Representative Agreement</span>
              <span className="text-slate-400">{showAgreement ? "▲ Hide" : "▼ Read Agreement"}</span>
            </button>

            {showAgreement && (
              <div className="px-6 pb-6 prose prose-sm max-w-none text-slate-700 space-y-4">
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-bold text-slate-900 text-lg">1. Agreement Overview</h3>
                  <p>This agreement outlines the terms, expectations, and compensation structure for PipeDesk Sales Representatives. By accepting this role, the representative agrees to the terms below.</p>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">2. Compensation Structure</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Commission rate: 30% recurring on every active subscription closed by the representative.</li>
                    <li>Commission is paid monthly on all active accounts attributed to the representative.</li>
                    <li>No salary, no base pay, no cap on earnings.</li>
                    <li>Commission stacks — every new client closed adds to monthly recurring income.</li>
                  </ul>
                  <div className="bg-white rounded-lg border border-slate-200 p-4 mt-3">
                    <p className="font-semibold text-slate-800 mb-2">Example earnings:</p>
                    <ul className="space-y-1 text-sm">
                      <li>10 active clients = $87/month recurring</li>
                      <li>100 active clients = $870/month recurring</li>
                      <li>500 active clients = $4,350/month recurring</li>
                    </ul>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">3. Performance Expectations</h3>
                  <p><strong>Minimum Monthly Requirement:</strong> Each active representative is expected to close a minimum of 10 new paying clients per month. Representatives are responsible for their own outreach, prospecting, and pipeline management. PipeDesk will provide demo access, sales materials, and onboarding support.</p>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">4. Inactivity & Termination Policy</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>If a representative closes fewer than 10 new clients for 2 consecutive months, a written warning will be issued.</li>
                    <li>If fewer than 10 new clients for 3 consecutive months, the agreement will be terminated.</li>
                    <li>Upon termination, recurring commissions on existing active accounts continue for 90 days.</li>
                    <li>After 90 days, all commissions revert fully to PipeDesk.</li>
                    <li>All clients remain the permanent property of PipeDesk regardless of representative status.</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">5. Client Ownership</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>All clients closed by the representative are and remain the sole property of PipeDesk.</li>
                    <li>Representatives may not solicit PipeDesk clients for competing products or services.</li>
                    <li>Representatives may not redirect clients away from PipeDesk for any reason.</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">6. What PipeDesk Provides</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Full demo access to walk prospects through the product</li>
                    <li>Sales materials and pitch guidance</li>
                    <li>Simple client onboarding process</li>
                    <li>Monthly commission payments</li>
                  </ul>

                  <h3 className="font-bold text-slate-900 text-lg mt-4">7. Representative Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Conduct all outreach and prospecting independently</li>
                    <li>Represent PipeDesk professionally and accurately</li>
                    <li>Never misrepresent pricing, features, or capabilities</li>
                    <li>Report new client closings promptly for account setup</li>
                  </ul>

                  <p className="mt-4 text-xs text-slate-400">PipeDesk — pipedesk.app</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer flex-shrink-0" />
            <label htmlFor="agree" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
              I have read and agree to the <button onClick={() => setShowAgreement(true)} className="text-blue-600 underline font-semibold">PipeDesk Sales Representative Agreement</button>. I understand this is a commission-only role with a minimum of 10 new clients per month, and that all clients belong permanently to PipeDesk.
            </label>
          </div>

          {/* Application Form */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Apply to become a rep</h2>
          <p className="text-slate-500 mb-8">We're looking for motivated people with networks in any of our 18 industries.</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Application received!</h3>
              <p className="text-green-600 mb-2">We'll be in touch within 24 hours at {form.email}</p>
              <p className="text-sm text-green-500">Check your spam folder if you don't hear from us.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input required name="name" value={form.name} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                <input required name="phone" value={form.phone} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Strongest industry network *</label>
                <select required name="industry" value={form.industry} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select your industry</option>
                  {["Real Estate","Insurance","Mortgage","Solar","Automotive","Recruiting","Legal","Healthcare","Construction","Consulting","Trucking","Dental","Fitness","Nonprofit","Education","E-Commerce","Financial Services","Property Management"].map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sales background *</label>
                <textarea required name="experience" value={form.experience} onChange={handleChange} rows={3} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Tell us about your sales experience and network..." />
              </div>
              <button type="submit" className={`w-full font-bold py-4 rounded-xl transition text-lg ${agreed ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`} disabled={!agreed}>
                Submit Application →
              </button>
              {!agreed && <p className="text-xs text-red-500 text-center">Please read and agree to the Sales Rep Agreement above before applying.</p>}
              <p className="text-xs text-slate-400 text-center">We review all applications within 24 hours · hello@pipedesk.app</p>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">PD</div>
            <span className="font-bold text-white">PipeDesk</span>
          </div>
          <span className="text-sm text-slate-500">Questions? Email hello@pipedesk.app</span>
        </div>
      </footer>
    </div>
  );
}
