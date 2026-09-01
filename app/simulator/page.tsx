"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Sliders, CheckCircle2, ArrowRight, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { MOCK_SCHEMES, getTopMatchedSchemes, Scheme } from "@/lib/api";

function parseMaxLoan(maxLoanStr: string) {
  if (!maxLoanStr) return 1000000;
  const rawStr = maxLoanStr.toString().replace(/,/g, "");
  const nums = rawStr.match(/\d+/g);
  if (nums && nums.length > 0) {
    let n = parseInt(nums[0], 10);
    if (rawStr.toLowerCase().includes("lakh") && n < 100) n = n * 100000;
    if (rawStr.toLowerCase().includes("crore") && n < 100) n = n * 10000000;
    return n;
  }
  return 1000000;
}

export default function SimulatorPage() {
  const { user } = useAuth();
  
  const [loanAmount, setLoanAmount] = useState(300000); // 3 Lakhs
  const [turnover, setTurnover] = useState(500000); // 5 Lakhs
  const [collateralPct, setCollateralPct] = useState(0); // 0%
  const [creditScore, setCreditScore] = useState(720); // 720
  const [hasChanged, setHasChanged] = useState(false);
  
  const [topSchemes, setTopSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    // Determine initial loan amount from user profile if available
    let initialLoan = 300000;
    if (user?.loanAmountNeeded) {
      const parsed = parseMaxLoan(user.loanAmountNeeded);
      if (parsed) initialLoan = parsed;
    }
    setLoanAmount(initialLoan);

    // Fetch user's top 3 best matching schemes
    const bestSchemes = getTopMatchedSchemes(MOCK_SCHEMES, user || {});
    setTopSchemes(bestSchemes.slice(0, 3));
  }, [user]);

  // Function to simulate real-time percentage adjustments
  const getSimulatedScore = (scheme: Scheme) => {
    let base = scheme.matchScore || 80;
    if (!hasChanged) return base; // Only recalculate after user adjusts inputs

    const maxLoanNum = parseMaxLoan(scheme.maxLoan);
    
    // Impact of Loan Amount
    if (loanAmount > maxLoanNum) {
      base -= 40; // Heavy penalty if loan requested exceeds scheme max limit
    } else if (loanAmount <= maxLoanNum * 0.8) {
      base += 5;
    }

    // Impact of Collateral
    if (!scheme.collateralRequired) {
      if (collateralPct === 0) base += 5; // Good fit for zero collateral
    } else {
      if (collateralPct < 30) base -= 20; // Penalty if collateral is required but missing
      if (collateralPct >= 50) base += 10;
    }

    // Impact of Credit Score
    if (creditScore >= 750) {
      base += 12;
    } else if (creditScore < 600) {
      base -= 25;
    }

    // Impact of Turnover (Micro schemes prefer lower turnover)
    if (turnover > 20000000 && scheme.category.toLowerCase().includes("micro")) {
      base -= 15;
    } else if (turnover <= 5000000) {
      base += 5;
    }

    return Math.min(99, Math.max(5, base));
  };

  const getStatusMessage = (scheme: Scheme, score: number) => {
    if (!hasChanged) return scheme.description;
    const maxLoanNum = parseMaxLoan(scheme.maxLoan);
    if (loanAmount > maxLoanNum) {
      return `Warning: Requested loan amount exceeds the scheme's maximum limit of ${scheme.maxLoan}.`;
    }
    if (creditScore < 600) {
      return "Low credit score significantly reduces the probability of bank approval.";
    }
    if (score >= 90) {
      return "Excellent probability of sanction based on current simulated parameters.";
    }
    return "Good fit, but improving credit score or providing some collateral could boost chances.";
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-tertiary font-sans text-xs font-semibold">
          <Sliders className="w-4 h-4 text-tertiary" />
          <span>Interactive Financial Parameter Engine</span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
          What-If Scheme Simulator
        </h1>
        <p className="text-xs text-on-surface-variant">
          Adjust loan size, turnover, collateral, and credit parameters in real-time to simulate live scheme eligibility and subsidy outcomes for your top recommended schemes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Sliders Panel */}
        <div className="lg:col-span-6 bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-xl space-y-8 relative overflow-hidden card-glow">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>

          <div className="flex justify-between items-center border-b border-border-subtle pb-4">
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" /> Adjust Financial Inputs
            </h2>
            <button
              onClick={() => {
                setLoanAmount(300000);
                setTurnover(500000);
                setCollateralPct(0);
                setCreditScore(720);
                setHasChanged(false);
              }}
              className="text-xs font-bold text-text-secondary hover:text-primary flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Slider 1: Loan Amount */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Funding Required (Loan Size)
              </label>
              <span className="font-headline font-bold text-base text-primary">
                ₹{loanAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={loanAmount < 1000000 ? 10000 : 50000}
              value={loanAmount}
              onChange={(e) => { setLoanAmount(Number(e.target.value)); setHasChanged(true); }}
              className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
              <span>₹10,000 (Shishu)</span>
              <span>₹10L (MUDRA)</span>
              <span>₹1Cr+ (Stand-Up)</span>
            </div>
          </div>

          {/* Slider 2: Annual Turnover */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Annual Business Turnover
              </label>
              <span className="font-headline font-bold text-base text-tertiary">
                ₹{turnover.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000000}
              step={100000}
              value={turnover}
              onChange={(e) => { setTurnover(Number(e.target.value)); setHasChanged(true); }}
              className="w-full accent-tertiary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
              <span>₹0 (New Enterprise)</span>
              <span>₹25 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          {/* Slider 3: Collateral Available */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Collateral Property Security Available
              </label>
              <span className="font-headline font-bold text-base text-secondary">
                {collateralPct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={collateralPct}
              onChange={(e) => { setCollateralPct(Number(e.target.value)); setHasChanged(true); }}
              className="w-full accent-secondary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
              <span>0% (Need Govt Guarantee)</span>
              <span>50%</span>
              <span>100% Full Security</span>
            </div>
          </div>

          {/* Slider 4: Credit Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                CIBIL / Credit Score Indicator
              </label>
              <span className="font-headline font-bold text-base text-on-surface">
                {creditScore}
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={900}
              step={10}
              value={creditScore}
              onChange={(e) => { setCreditScore(Number(e.target.value)); setHasChanged(true); }}
              className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-secondary font-semibold">
              <span>300 (Poor)</span>
              <span>720 (Good)</span>
              <span>850+ (Excellent)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Match Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tertiary" /> Your Top 3 Schemes
            </h2>
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full">
              Real-time Recalculation
            </span>
          </div>

          {topSchemes.map((scheme, idx) => {
            const simulatedScore = getSimulatedScore(scheme);
            const colorClass = idx === 0 ? "primary" : idx === 1 ? "tertiary" : "secondary";
            const bgClass = idx === 0 ? "bg-primary" : idx === 1 ? "bg-tertiary" : "bg-secondary";
            const textClass = idx === 0 ? "text-primary" : idx === 1 ? "text-tertiary" : "text-secondary";

            return (
              <div key={scheme.id} className="bg-surface-card border border-outline-variant rounded-2xl p-6 shadow-sm space-y-3 card-glow transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase">{scheme.category}</span>
                    <h3 className="font-headline font-bold text-base text-on-surface">{scheme.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-2xl font-extrabold font-headline ${textClass}`}>{simulatedScore}%</span>
                    <span className={`block text-[10px] font-bold ${textClass}`}>Simulated Match</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2">
                  <div className={`${bgClass} h-2 rounded-full transition-all duration-300`} style={{ width: `${simulatedScore}%` }} />
                </div>
                <p className="text-xs text-on-surface-variant">
                  {getStatusMessage(scheme, simulatedScore)}
                </p>
              </div>
            );
          })}

          {topSchemes.length === 0 && (
            <div className="p-8 text-center text-sm text-text-secondary border border-outline-variant rounded-2xl">
              Loading your best schemes...
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Link
              href="/schemes"
              className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Explore Scheme Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
