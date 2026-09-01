"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  Sliders,
  FileCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Award,
  AlertCircle,
  FileText,
  UserCheck,
  Calculator,
} from "lucide-react";
import { MOCK_SCHEMES, filterApplicableSchemes, getTopMatchedSchemes } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-on-surface-variant">Loading your Sahayak AI Dashboard...</p>
      </div>
    );
  }

  const topMatch = MOCK_SCHEMES[0]; // MUDRA Yojana 94%

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-surface-card via-surface-container-low to-surface-card border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tertiary uppercase tracking-wider">
            <UserCheck className="w-4 h-4" /> Authenticated Profile Hub
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl">
            Business: <strong>{user.businessType}</strong> | Location: <strong>{user.state}</strong> | Required Funding: <strong>{user.loanAmountNeeded || "₹3,00,000"}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/find-scheme"
            className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Sliders className="w-4 h-4" /> Edit Profile Data
          </Link>
          <Link
            href="/readiness"
            className="border border-outline bg-surface-card text-on-surface hover:text-primary font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-tertiary" /> View Readiness Report
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-text-secondary uppercase">Top Scheme Match</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-headline text-primary">94%</span>
            <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <p className="text-xs font-bold text-on-surface truncate">{topMatch.name}</p>
        </div>

        <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-text-secondary uppercase">Eligible Subsidy</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-headline text-tertiary">35%</span>
            <span className="bg-tertiary/10 text-tertiary text-[11px] font-bold px-2 py-0.5 rounded-full">PMEGP Grant</span>
          </div>
          <p className="text-xs font-bold text-on-surface">Up to ₹17.5 Lakh Margin Money</p>
        </div>

        <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-text-secondary uppercase">Estimated EMI</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-headline text-secondary">₹5,700</span>
            <span className="bg-secondary/10 text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full">Monthly</span>
          </div>
          <p className="text-xs font-bold text-on-surface">Calculated for ₹3L @ 8.5%</p>
        </div>

        <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-text-secondary uppercase">Nearby Facilitation</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-headline text-on-surface">4 Hubs</span>
            <span className="bg-surface-container-high text-on-surface text-[11px] font-bold px-2 py-0.5 rounded-full">Leaflet Map</span>
          </div>
          <p className="text-xs font-bold text-on-surface">DIC &amp; SIDBI BKC Branch</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Top 3 Best Matched Schemes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-tertiary uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" /> High Sanction Probability
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                Top 3 Schemes with Highest Approval Chance
              </h2>
            </div>
            <Link href="/schemes" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {getTopMatchedSchemes(MOCK_SCHEMES, user).map((scheme, idx) => (
              <div
                key={scheme.id}
                className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all card-glow relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                      #{idx + 1} Best Approval Fit • {scheme.ministry}
                    </span>
                    <h3 className="font-headline font-bold text-lg text-on-surface mt-0.5">{scheme.name}</h3>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 shrink-0 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {scheme.matchScore}% Match
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">{scheme.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-xs">
                  <div>
                    <span className="text-text-secondary block text-[10px] uppercase font-bold">Max Loan</span>
                    <span className="font-bold text-on-surface">{scheme.maxLoan}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block text-[10px] uppercase font-bold">Subsidy / Benefit</span>
                    <span className="font-bold text-tertiary">{scheme.maxSubsidy}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end items-center gap-2">
                    <Link
                      href={`/calculator?scheme=${scheme.id}`}
                      className="bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs px-3 py-2 rounded-lg transition-colors border border-outline-variant/60"
                    >
                      <span>EMI Calculator</span>
                    </Link>
                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="bg-primary text-on-primary hover:bg-primary-container font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Quick Action Tools Hub */}
        <div className="space-y-6">
          <h2 className="font-headline font-bold text-xl text-on-surface">Interactive AI Tools</h2>

          <div className="space-y-4">
            {/* Tool 1 */}
            <Link
              href="/simulator"
              className="block bg-surface-card border border-outline-variant hover:border-primary rounded-2xl p-6 space-y-2 shadow-sm transition-all group card-glow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface">What-If Simulator</h3>
              <p className="text-xs text-on-surface-variant">
                Adjust funding requirement and turnover sliders to simulate match score updates.
              </p>
            </Link>

            {/* Tool 2 */}
            <Link
              href="/calculator"
              className="block bg-surface-card border border-outline-variant hover:border-tertiary rounded-2xl p-6 space-y-2 shadow-sm transition-all group card-glow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-tertiary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface">EMI Repayment Calculator</h3>
              <p className="text-xs text-on-surface-variant">
                Calculate monthly EMIs, total interest, and government subsidy adjustments.
              </p>
            </Link>

            {/* Tool 3 */}
            <Link
              href="/partners"
              className="block bg-surface-card border border-outline-variant hover:border-secondary rounded-2xl p-6 space-y-2 shadow-sm transition-all group card-glow"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface">Partner Locator Map</h3>
              <p className="text-xs text-on-surface-variant">
                Locate nearby DIC, SIDBI, and bank branches on Leaflet OpenStreetMap.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
