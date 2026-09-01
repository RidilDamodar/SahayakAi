"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] py-16 px-6 flex items-center justify-center bg-sunset-radial">
      <div className="w-full max-w-md bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden card-glow">
        {/* Glow Accent Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>

        <div className="text-center space-y-2 pt-2">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/logo.png"
              alt="Sahayak AI Official Logo"
              className="h-24 sm:h-32 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Log In to Sahayak AI</h1>
          <p className="text-xs text-text-secondary">
            Access your government scheme matches, document OCR, and application readiness.
          </p>
        </div>

        {error && (
          <div className="bg-error-container/40 border border-error/40 text-on-error-container text-xs p-3 rounded-lg flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@business.com"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[11px] font-semibold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(159,60,0,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>LOG IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs border-t border-border-subtle space-y-2">
          <p className="text-text-secondary">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Sign Up for Free
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-tertiary">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Supabase / Firebase Auth Ready</span>
          </div>
        </div>
      </div>
    </main>
  );
}
