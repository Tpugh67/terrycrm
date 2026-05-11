"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login"|"signup">("login");

  useEffect(() => {
    if (searchParams.get("mode") === "signup") setMode("signup");
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    if (!email || !password) { setError("Please enter your email and password."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    const industry = searchParams.get("industry") || "";
    const plan = searchParams.get("plan") || "solo";
    if (signUpData.user) {
      await supabase.from("profiles").upsert({
        id: signUpData.user.id,
        email,
        industry,
        plan: "trial",
      });
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      } else {
        setError("Checkout error: " + (data.error || "unknown"));
      }
    } catch (err) {
      setError("Failed to connect to checkout. Please try again.");
    }
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">PD</div>
          <h1 className="text-3xl font-bold text-white">PipeDesk</h1>
          <p className="text-slate-400 mt-1">Multi-Industry CRM</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button onClick={()=>{setMode("login");setError("");}} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode==="login"?"bg-white shadow text-slate-900":"text-slate-500"}`}>Log In</button>
            <button onClick={()=>{setMode("signup");setError("");}} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode==="signup"?"bg-white shadow text-slate-900":"text-slate-500"}`}>Create Account</button>
          </div>
          {mode==="signup"&&(
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-center">
              <div className="text-sm font-bold text-blue-800">🎉 Start your free 14-day trial</div>
              <div className="text-xs text-blue-600 mt-0.5">No credit card required · Cancel anytime</div>
            </div>
          )}
          <form onSubmit={mode==="login"?handleLogin:handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
              <input type="password" placeholder={mode==="signup"?"At least 6 characters":"Your password"} value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            {error&&<div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl py-3 transition text-sm">
              {loading?(mode==="signup"?"Setting up your account...":"Logging in..."):(mode==="login"?"Log In →":"Create Account & Start Free Trial →")}
            </button>
          </form>
          {mode==="login"&&<p className="text-center text-sm text-slate-400 mt-4">No account? <button onClick={()=>setMode("signup")} className="text-blue-600 font-semibold hover:underline">Sign up free</button></p>}
          {mode==="signup"&&<p className="text-center text-sm text-slate-400 mt-4">Already have an account? <button onClick={()=>setMode("login")} className="text-blue-600 font-semibold hover:underline">Log in</button></p>}
        </div>
        <p className="text-center text-xs text-slate-600 mt-6">
          <a href="/" className="hover:text-slate-400 transition">← Back to pipedesk.app</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950"/>}>
      <LoginForm />
    </Suspense>
  );
}
