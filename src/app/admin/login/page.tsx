"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin";
  const urlError = searchParams.get("error");

  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(urlError ?? "");
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/admin");
      else setCheckingAuth(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); }
      else router.replace(redirect);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError(error.message); setLoading(false); }
      else {
        setMessage("Check your email to confirm your account, then log in.");
        setMode("login");
        setLoading(false);
      }
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A10]">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & name */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-900/40 bg-white/5 border border-white/10">
            <Image src="/jc.png" alt="JC" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Jasmeet Chandhok</h1>
          <p className="text-gray-500 text-sm mt-1">Career Counsellor · Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-7">
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  mode === m ? "bg-[#7C3AED] text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}>
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jasmeet@jasmeetchandhok.com"
                className="w-full bg-white/5 border border-white/10 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-white/5 border border-white/10 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3.5 text-sm outline-none transition-colors"
              />
              {mode === "signup" && (
                <p className="text-xs text-gray-600 mt-1.5">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-red-400 text-sm">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-green-400 text-sm">✓</span>
                <p className="text-green-400 text-sm">{message}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-xl transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-purple-900/30">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</span>
                : mode === "login" ? "Sign In to Dashboard" : "Create Admin Account"
              }
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center text-xs text-gray-600 mt-5">
              First time?{" "}
              <button onClick={() => setMode("signup")} className="text-[#8B5CF6] font-semibold hover:underline">
                Create your admin account
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          ← <a href="/" className="hover:text-gray-400 transition-colors">Back to website</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A10]">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
