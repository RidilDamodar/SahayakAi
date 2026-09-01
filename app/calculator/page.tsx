
"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calculator,
  Percent,
  Calendar,
  IndianRupee,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  PieChart,
  Table,
  Sliders,
  Building2,
  RefreshCw,
} from "lucide-react";
import { MOCK_SCHEMES, Scheme } from "@/lib/api";

function EmiCalculatorContent() {
  const searchParams = useSearchParams();
  const schemeParam = searchParams.get("scheme");

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemeParam || "");
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [subsidyPct, setSubsidyPct] = useState<number>(0);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");

  // Get active linked scheme object
  const activeScheme = useMemo(() => {
    return MOCK_SCHEMES.find((s) => s.id === selectedSchemeId);
  }, [selectedSchemeId]);

  // Handler to auto-fill rates & payback period when scheme is selected
  const handleSchemeSelect = (id: string) => {
    setSelectedSchemeId(id);
    if (!id) return;
    const target = MOCK_SCHEMES.find((s) => s.id === id);
    if (target) {
      if (target.defaultInterestRate !== undefined) setInterestRate(target.defaultInterestRate);
      if (target.defaultTenureYears !== undefined) setTenureYears(target.defaultTenureYears);
      if (target.subsidyPercent !== undefined) setSubsidyPct(target.subsidyPercent);

      // Parse numerical max loan
      const nums = target.maxLoan.replace(/,/g, "").match(/\d+/g);
      if (nums && nums.length > 0) {
        let amt = parseInt(nums[0], 10);
        if (target.maxLoan.toLowerCase().includes("lakh") && amt < 100) amt = amt * 100000;
        if (target.maxLoan.toLowerCase().includes("crore") && amt < 100) amt = amt * 10000000;
        setLoanAmount(amt);
      }
    }
  };

  // Sync with URL query parameter on mount or URL change
  useEffect(() => {
    if (schemeParam) {
      handleSchemeSelect(schemeParam);
    }
  }, [schemeParam]);

  // Format currency in Indian format
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // Total tenure in months
  const totalMonths = useMemo(() => {
    return tenureType === "years" ? tenureYears * 12 : tenureYears;
  }, [tenureYears, tenureType]);

  // EMI Calculation Formula
  const { emi, totalPayment, totalInterest, netPrincipal, netEmi } = useMemo(() => {
    const P = Math.max(0, loanAmount);
    const r = interestRate / (12 * 100);
    const n = Math.max(1, totalMonths);

    let monthlyEmi = 0;
    if (r > 0) {
      monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthlyEmi = P / n;
    }

    const totalPay = monthlyEmi * n;
    const totalInt = totalPay - P;

    // Calculation with Govt Margin Subsidy applied to principal
    const netP = P * (1 - subsidyPct / 100);
    let netMonthlyEmi = 0;
    if (r > 0) {
      netMonthlyEmi = (netP * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      netMonthlyEmi = netP / n;
    }

    return {
      emi: monthlyEmi,
      totalPayment: totalPay,
      totalInterest: totalInt,
      netPrincipal: netP,
      netEmi: netMonthlyEmi,
    };
  }, [loanAmount, interestRate, totalMonths, subsidyPct]);

  // Percentage breakdown
  const principalPercent = useMemo(() => {
    if (totalPayment <= 0) return 100;
    return Math.min(100, Math.max(0, (loanAmount / totalPayment) * 100));
  }, [loanAmount, totalPayment]);

  const interestPercent = useMemo(() => {
    return 100 - principalPercent;
  }, [principalPercent]);

  // Year-wise Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    const schedule: {
      year: number;
      openingBalance: number;
      principalPaid: number;
      interestPaid: number;
      totalYearPaid: number;
      closingBalance: number;
    }[] = [];

    const P = loanAmount;
    const r = interestRate / (12 * 100);
    const totalM = totalMonths;
    const monthlyEmiVal = emi;

    if (P <= 0 || totalM <= 0) return schedule;

    let balance = P;
    const numYears = Math.ceil(totalM / 12);

    for (let yr = 1; yr <= numYears; yr++) {
      const opening = balance;
      let yrPrincipal = 0;
      let yrInterest = 0;

      const monthsInYr = yr === numYears && totalM % 12 !== 0 ? totalM % 12 : 12;

      for (let m = 0; m < monthsInYr; m++) {
        if (balance <= 0) break;
        const interestForMonth = balance * r;
        const principalForMonth = monthlyEmiVal - interestForMonth;
        yrInterest += interestForMonth;
        yrPrincipal += principalForMonth;
        balance -= principalForMonth;
      }

      if (balance < 0) balance = 0;

      schedule.push({
        year: yr,
        openingBalance: opening,
        principalPaid: yrPrincipal,
        interestPaid: yrInterest,
        totalYearPaid: yrPrincipal + yrInterest,
        closingBalance: balance,
      });
    }

    return schedule;
  }, [loanAmount, interestRate, totalMonths, emi]);

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-surface-card via-surface-container-low to-surface-card border border-outline-variant rounded-2xl p-8 shadow-sm space-y-3 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-outline-variant bg-surface-container-low text-primary text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4 text-primary" />
          <span>Government Scheme Loan Calculator</span>
        </div>

        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
          Scheme-Linked Loan EMI &amp; Repayment Calculator
        </h1>

        <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
          Auto-linked with official government interest rates, payback periods, and margin subsidies for MUDRA, PM Vishwakarma, PMEGP, Stand-Up India, and state enterprise loans.
        </p>
      </div>

      {/* Linked Scheme Selector Dropdown */}
      <div className="bg-surface-card border-2 border-primary/40 rounded-2xl p-6 shadow-md card-glow space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
              Select Government Scheme to Auto-Fill Rates &amp; Payback Period
            </span>
          </div>
          {activeScheme && (
            <span className="text-xs font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Linked to {activeScheme.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8">
            <select
              value={selectedSchemeId}
              onChange={(e) => handleSchemeSelect(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/80 rounded-xl py-3 px-4 text-sm font-bold text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="">-- Custom Calculation (Manual Sliders) --</option>
              {MOCK_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name} — Int: {scheme.defaultInterestRate}% | Tenure: {scheme.defaultTenureYears} Yrs | Subsidy: {scheme.subsidyPercent}%
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4 flex gap-2">
            {selectedSchemeId && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSchemeId("");
                  setInterestRate(8.5);
                  setTenureYears(5);
                  setSubsidyPct(0);
                  setLoanAmount(500000);
                }}
                className="w-full border border-outline hover:border-error hover:text-error text-text-secondary text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Parameters
              </button>
            )}
          </div>
        </div>

        {/* Linked Scheme Active Summary Banner */}
        {activeScheme && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-primary text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Linked Parameters for {activeScheme.name}
              </span>
              <span className="text-[11px] font-bold text-text-secondary">Ministry: {activeScheme.ministry}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-on-surface">
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Interest Rate</span>
                <span className="font-extrabold text-primary text-sm">{activeScheme.defaultInterestRate}% per annum</span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Payback Period</span>
                <span className="font-extrabold text-on-surface text-sm">{activeScheme.defaultTenureYears} Years ({activeScheme.defaultTenureYears! * 12} Months)</span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Government Subsidy</span>
                <span className="font-extrabold text-tertiary text-sm">{activeScheme.subsidyPercent}% Grant Benefit</span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Maximum Loan Limit</span>
                <span className="font-extrabold text-on-surface text-sm">{activeScheme.maxLoan}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sliders & Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-card border border-outline-variant rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm card-glow">
          <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
            <Sliders className="w-5 h-5 text-primary" /> Loan Parameters
          </h2>

          {/* Loan Amount Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Loan Amount Required
              </label>
              <div className="flex items-center border border-outline-variant rounded-xl bg-surface-container-low px-3 py-1.5 focus-within:border-primary">
                <span className="text-xs font-bold text-primary mr-1">₹</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  step={10000}
                  min={10000}
                  max={10000000}
                  className="w-28 bg-transparent text-sm font-bold text-on-surface focus:outline-none text-right"
                />
              </div>
            </div>

            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[11px] text-text-secondary font-medium">
              <span>₹10,000 (PM SVANidhi)</span>
              <span>₹10 Lakhs (MUDRA Tarun)</span>
              <span>₹1 Crore (Stand-Up India)</span>
            </div>
          </div>

          {/* Interest Rate Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                Interest Rate (% per annum)
                {activeScheme && (
                  <span className="text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full font-bold">
                    Scheme Rate
                  </span>
                )}
              </label>
              <div className="flex items-center border border-outline-variant rounded-xl bg-surface-container-low px-3 py-1.5 focus-within:border-primary">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step={0.25}
                  min={1}
                  max={20}
                  className="w-16 bg-transparent text-sm font-bold text-on-surface focus:outline-none text-right"
                />
                <span className="text-xs font-bold text-text-secondary ml-1">%</span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={20}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[11px] text-text-secondary font-medium">
              <span>5.0% (PM Vishwakarma)</span>
              <span>8.5% (MUDRA Standard)</span>
              <span>15.0% (Commercial Bank)</span>
            </div>
          </div>

          {/* Loan Tenure Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                Payback Period / Tenure
                {activeScheme && (
                  <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                    Scheme Tenure
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setTenureType("years")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      tenureType === "years" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary"
                    }`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenureType("months")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      tenureType === "months" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary"
                    }`}
                  >
                    Months
                  </button>
                </div>

                <div className="flex items-center border border-outline-variant rounded-xl bg-surface-container-low px-3 py-1.5 focus-within:border-primary">
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    min={1}
                    max={tenureType === "years" ? 15 : 180}
                    className="w-14 bg-transparent text-sm font-bold text-on-surface focus:outline-none text-right"
                  />
                  <span className="text-xs font-bold text-text-secondary ml-1">
                    {tenureType === "years" ? "Yrs" : "Mo"}
                  </span>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={tenureType === "years" ? 15 : 180}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between text-[11px] text-text-secondary font-medium">
              <span>1 Year (PM SVANidhi)</span>
              <span>5 Years (Standard MSME)</span>
              <span>7 Years (PMEGP / Stand-Up India)</span>
            </div>
          </div>

          {/* Government Subsidy Deduction Slider */}
          <div className="space-y-3 bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 card-glow">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-tertiary" /> Government Margin Subsidy Benefit (%)
              </label>
              <div className="flex items-center border border-tertiary/30 rounded-xl bg-surface-card px-3 py-1.5">
                <input
                  type="number"
                  value={subsidyPct}
                  onChange={(e) => setSubsidyPct(Number(e.target.value))}
                  min={0}
                  max={80}
                  className="w-14 bg-transparent text-sm font-bold text-tertiary focus:outline-none text-right"
                />
                <span className="text-xs font-bold text-tertiary ml-1">%</span>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={subsidyPct}
              onChange={(e) => setSubsidyPct(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-tertiary"
            />

            <p className="text-[11px] text-text-secondary leading-relaxed">
              PMEGP offers up to 35% margin money grant. MSME ZED offers up to 80% certification subvention. Applied directly to reduce principal loan liability.
            </p>
          </div>
        </div>

        {/* Right Column: Calculated Results & Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main EMI Card */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-secondary text-on-primary rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl card-glow relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-on-primary/80 block">
                Calculated Monthly EMI
              </span>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-on-primary">
                {formatINR(emi)}
                <span className="text-sm font-sans font-normal text-on-primary/80"> / month</span>
              </div>
            </div>

            {subsidyPct > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-xs space-y-1">
                <div className="flex justify-between font-bold text-on-primary">
                  <span>Net EMI with {subsidyPct}% Subsidy:</span>
                  <span className="text-amber-300 font-extrabold">{formatINR(netEmi)} / mo</span>
                </div>
                <div className="text-[11px] text-on-primary/90">
                  Government Subsidy reduces principal to {formatINR(netPrincipal)}.
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-on-primary/20 pt-4 text-xs">
              <div>
                <span className="text-on-primary/70 uppercase text-[10px] font-bold block">Total Payable Amount</span>
                <span className="font-bold text-base text-on-primary">{formatINR(totalPayment)}</span>
              </div>
              <div>
                <span className="text-on-primary/70 uppercase text-[10px] font-bold block">Total Interest Burden</span>
                <span className="font-bold text-base text-amber-300">{formatINR(totalInterest)}</span>
              </div>
            </div>
          </div>

          {/* Visual Breakdown Card */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-4 shadow-sm card-glow">
            <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-primary" /> Payment Breakdown
            </h3>

            <div className="space-y-2">
              <div className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                <div className="h-full bg-primary" style={{ width: `${principalPercent}%` }}></div>
                <div className="h-full bg-tertiary" style={{ width: `${interestPercent}%` }}></div>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-text-secondary">Principal Amount:</span>
                  <strong className="text-on-surface">{formatINR(loanAmount)} ({principalPercent.toFixed(1)}%)</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <span className="text-text-secondary">Interest:</span>
                  <strong className="text-tertiary">{formatINR(totalInterest)} ({interestPercent.toFixed(1)}%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Action Box */}
          <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-tertiary" /> Ready for Bank Application?
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Now that you know your repayment schedule, check document readiness for government bank sanctioning or locate nearest facilitation centers.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/schemes"
                className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Apply for Government Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/partners"
                className="border border-outline hover:border-primary text-on-surface text-xs font-bold py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Find Nearest Bank Facilitation Branch</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Amortization Schedule Table */}
      <div className="bg-surface-card border border-outline-variant rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm card-glow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-subtle pb-4">
          <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
            <Table className="w-5 h-5 text-primary" /> Year-Wise Repayment Amortization Schedule
          </h2>
          <span className="text-xs font-bold text-text-secondary">
            Total Tenure: {totalMonths} Months ({tenureYears} Years)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/60 bg-surface-container-low text-on-surface-variant">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Year</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Opening Balance</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right text-primary">Principal Paid</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right text-tertiary">Interest Paid</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Total Year Payment</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {amortizationSchedule.map((row) => (
                <tr key={row.year} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-on-surface">Year {row.year}</td>
                  <td className="py-3 px-4 text-right font-medium text-text-secondary">{formatINR(row.openingBalance)}</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">{formatINR(row.principalPaid)}</td>
                  <td className="py-3 px-4 text-right font-bold text-tertiary">{formatINR(row.interestPaid)}</td>
                  <td className="py-3 px-4 text-right font-bold text-on-surface">{formatINR(row.totalYearPaid)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-on-surface-variant">{formatINR(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default function EmiCalculatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-xs text-text-secondary">Loading Scheme Calculator...</div>}>
      <EmiCalculatorContent />
    </Suspense>
  );
}
