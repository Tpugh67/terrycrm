"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleSignup() {
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setError("Signup successful. You can now log in.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
        <p className="text-slate-500 mb-6">Sign in to PipeDesk</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
          />

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            className="w-full bg-slate-950 text-white rounded-xl py-3 hover:bg-slate-800 transition"
          >
            Log In
          </button>
        </form>

        <button
          onClick={handleSignup}
          className="w-full mt-3 border border-slate-300 rounded-xl py-3 hover:bg-slate-50 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
