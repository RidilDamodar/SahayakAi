"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Calculator, Sliders } from "lucide-react";

export default function ReadinessPage() {
  const { user } = useAuth();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tertiary uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Sahayak AI Readiness Diagnostics
            </div>
            <h1 className="font-headline font-bold text-3xl text-on-surface">
              Application Readiness Report
            </h1>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Comprehensive audit evaluating your enterprise profile, EMI repayment feasibility, and financial feasibility.
            </p>
          </div>

          {/* Overall Score Dial Card */}
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl text-center space-y-1 shrink-0 shadow-inner">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Overall Readiness Score</span>
            <span className="font-headline font-extrabold text-4xl text-primary">78%</span>
            <span className="block text-[11px] font-bold text-tertiary">High Sanction Probability</span>
          </div>
        </div>
      </div>

      {/* Breakdown Matrix */}
      <div className="space-y-6">
        <h2 className="font-headline font-bold text-xl text-on-surface">Readiness Audit Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-3 card-glow">
            <div className="flex justify-between items-center">
              <span className="font-headline font-bold text-base text-on-surface">1. Enterprise Profile Data</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">100% Completed</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-full" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Business category, loan size, turnover, and demographics recorded in Sahayak AI context.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-3 card-glow">
            <div className="flex justify-between items-center">
              <span className="font-headline font-bold text-base text-on-surface">2. Repayment Feasibility Analysis</span>
              <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-full">Optimal EMI Ratio</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2">
              <div className="bg-tertiary h-2 rounded-full w-[85%]" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Monthly EMI estimated at under 25% of projected monthly net cash flow.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-3 card-glow">
            <div className="flex justify-between items-center">
              <span className="font-headline font-bold text-base text-on-surface">3. Financial Project Report (DPR)</span>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">60% Prepared</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full w-[60%]" />
            </div>
            <p className="text-xs text-on-surface-variant">
              Cash flow projections generated. Equipment quotation copy needed for bank sanction.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-3 card-glow">
            <div className="flex justify-between items-center">
              <span className="font-headline font-bold text-base text-on-surface">4. Guarantee Coverage (CGTMSE)</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">85% Eligibility</span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-[85%]" />
            </div>
            <p className="text-xs text-on-surface-variant">
              No personal property required. Covered under CGTMSE collateral-free credit guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/calculator"
          className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" /> Calculate Monthly EMI &amp; Schedule
        </Link>
        <Link
          href="/schemes"
          className="border border-outline bg-surface-card text-on-surface hover:text-primary font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Explore Matched Schemes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
