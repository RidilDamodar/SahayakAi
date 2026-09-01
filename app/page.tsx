"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sliders,
  Calculator,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 md:px-12 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="space-y-8 z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-tertiary font-sans text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-tertiary animate-pulse" />
            <span>{t("home.hero.tag")}</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-[1.15] tracking-tight max-w-3xl mx-auto">
            {t("home.hero.title1")}<span className="text-primary text-glow decoration-tertiary/75">{t("home.hero.title2")}</span>{t("home.hero.title3")}<span className="text-primary text-glow decoration-tertiary/75">{t("home.hero.title4")}</span>
          </h1>

          <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {t("home.hero.desc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
            <Link
              href={isAuthenticated ? "/find-scheme" : "/login"}
              className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(159,60,0,0.25)] flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>{t("home.hero.btnFind")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/schemes"
              className="border border-outline hover:border-primary bg-surface-card text-on-surface hover:text-primary px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:shadow-md"
            >
              <span>{t("home.hero.btnExplore")}</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {t("home.hero.tag1")}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-tertiary" />
              {t("home.hero.tag2")}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-secondary" />
              {t("home.hero.tag3")}
            </span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-6 md:px-12 bg-surface-container-low/60 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
              Engineered for Complete Scheme Success
            </h2>
            <p className="text-on-surface-variant text-base">
              Sahayak AI bridges the gap between complex government policy jargon and actionable funding for your enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 card-glow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Interactive What-If Simulator</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Test different turnover, loan amount, and collateral scenarios in real-time to see how your scheme match scores and subsidy eligibility change instantly.
              </p>
              <Link href="/simulator" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Try Simulator <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 card-glow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Loan Repayment EMI Calculator</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Calculate monthly EMIs, total interest, and year-by-year repayment schedules. Factor in government margin subsidies for accurate planning.
              </p>
              <Link href="/calculator" className="inline-flex items-center gap-1 text-xs font-bold text-tertiary hover:underline">
                Calculate EMI &amp; Repayment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 card-glow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Geolocated Partner Center Locator</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Find nearest District Industries Centres (DIC), SIDBI facilitation offices, and authorized bank branches on an interactive map.
              </p>
              <Link href="/partners" className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline">
                Find Nearby Hubs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Top 3 High-Probability Schemes Banner */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> Top Approval Chances
            </div>
            <h2 className="font-headline font-bold text-3xl text-on-surface">Top 3 High Approval Chance Schemes</h2>
          </div>
          <Link href="/schemes" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All 10 Government Schemes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scheme 1 */}
          <div className="bg-surface-card border-2 border-primary/40 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary flex flex-col justify-between card-glow">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  #1 Highest Fit
                </span>
                <span className="bg-tertiary text-on-tertiary text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 94% Match
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">PMMY - MUDRA Yojana</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Collateral-free micro loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun options for non-farm business units.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-border-subtle text-xs">
              <span className="text-tertiary font-bold">Max ₹10L • 0 Collateral</span>
              <Link href="/schemes/mudra-yojana" className="font-bold text-primary hover:underline flex items-center gap-1">
                Apply <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Scheme 2 */}
          <div className="bg-surface-card border-2 border-tertiary/40 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-tertiary flex flex-col justify-between card-glow">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-tertiary/10 text-tertiary text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  #2 High Fit
                </span>
                <span className="bg-tertiary text-on-tertiary text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 91% Match
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">PM Vishwakarma Scheme</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Institutional credit support up to ₹3 Lakhs at subsidized 5% interest rate for traditional artisans and craftspeople.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-border-subtle text-xs">
              <span className="text-tertiary font-bold">₹3L Credit • 5% Rate</span>
              <Link href="/schemes/pm-vishwakarma" className="font-bold text-tertiary hover:underline flex items-center gap-1">
                Apply <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Scheme 3 */}
          <div className="bg-surface-card border-2 border-secondary/40 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all border-l-4 border-l-secondary flex flex-col justify-between card-glow">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-secondary/10 text-secondary text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase">
                  #3 High Fit
                </span>
                <span className="bg-tertiary text-on-tertiary text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 88% Match
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">PMEGP Employment Subsidy</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Credit-linked margin subsidy scheme giving up to 35% government grant for new manufacturing & service units.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-border-subtle text-xs">
              <span className="text-tertiary font-bold">35% Govt Grant</span>
              <Link href="/schemes/pmegp" className="font-bold text-secondary hover:underline flex items-center gap-1">
                Apply <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-r from-surface-card via-surface-container-low to-surface-card border-t border-outline-variant/40">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
            {t("home.cta.title")}
          </h2>
          <p className="text-on-surface-variant text-base max-w-xl mx-auto">
            {t("home.cta.desc")}
          </p>
          <div className="flex justify-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="bg-primary hover:bg-primary-container text-on-primary px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-[0_0_25px_rgba(159,60,0,0.3)] hover:scale-105"
            >
              {isAuthenticated ? t("home.cta.btnLoggedIn") : t("home.cta.btnLoggedOut")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
