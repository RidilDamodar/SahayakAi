"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, User, Building2, ArrowRight, ShieldCheck, CheckCircle2, Calendar, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Verification & Form States
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState("");
  const [businessType, setBusinessType] = useState("Micro Enterprise");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter an email address first.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setOtpSent(true);
    setOtpMessage("OTP sent! (Hint: Use 123456 for testing)");
  };

  const handleVerifyOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      setEmailVerified(true);
      setOtpMessage("");
      setError("");
    } else {
      setError("Invalid OTP. Try 123456.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      setError("Please verify your email first.");
      return;
    }
    if (!name || !email || !password || !dob) {
      setError("Please fill out all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signup({ name, email, businessType, dob });
      router.push("/find-scheme");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] py-16 px-6 flex items-center justify-center bg-sunset-radial">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-8 space-y-6 relative card-glow">
        {/* Glow Accent Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-tertiary via-primary to-secondary rounded-t-3xl"></div>

        <div className="text-center space-y-2 pt-2">
          <Link href="/" className="inline-block mb-2">
            <img
              src="/logo.png"
              alt="Sahayak AI Official Logo"
              className="h-24 sm:h-32 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-headline font-bold text-2xl text-on-surface">Create your Sahayak AI Account</h1>
          <p className="text-xs text-text-secondary">
            Unlock personalized scheme recommendations, document OCR, and subsidy calculations.
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
              Full Name / Business Owner Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar / Sunita Patil"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Email Address *
              </label>
              {emailVerified && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  disabled={emailVerified}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@mybusiness.com"
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-70"
                />
              </div>
              {!emailVerified && !otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-primary text-on-primary px-4 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-primary-container transition-all"
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>

          {!emailVerified && otpSent && (
            <div className="space-y-1.5 bg-tertiary/5 border border-tertiary/20 p-4 rounded-xl">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex justify-between">
                <span>Enter Verification Code</span>
                <span className="text-tertiary font-normal normal-case">{otpMessage}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-center tracking-[0.5em] font-bold text-on-surface focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-tertiary text-on-tertiary px-6 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-tertiary-container transition-all"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {emailVerified && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Profile Type
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Micro Enterprise">Micro Enterprise (Loan &lt; ₹10L)</option>
                      <option value="Small Business">Small Business (&lt; ₹5Cr)</option>
                      <option value="Artisan / Craftsperson">Artisan / PM Vishwakarma</option>
                      <option value="Woman Entrepreneur">Woman-Led Business</option>
                      <option value="Startup">Tech / Greenfield Startup</option>
                      <option value="Student">Student (Education Loans)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-secondary absolute left-3 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 pl-10 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-text-secondary hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-tertiary hover:bg-tertiary-container text-on-tertiary font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(140,75,0,0.25)] flex items-center justify-center gap-2 hover:scale-[1.01] animate-in fade-in slide-in-from-top-4 duration-500"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>SIGN UP &amp; BUILD PROFILE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </form>

        <div className="pt-2 text-center text-xs border-t border-border-subtle space-y-2">
          <p className="text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Log In Here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-primary">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Data Privacy Guaranteed</span>
          </div>
        </div>
      </div>
    </main>
  );
}
