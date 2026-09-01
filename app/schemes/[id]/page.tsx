"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchSchemeById, Scheme, getDynamicSchemeMatchScore } from "@/lib/api";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Building2,
  Award,
  Sliders,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowRight,
  Lightbulb,
  Calculator,
  Download,
} from "lucide-react";
import { generateActionPlanPDF } from "@/lib/pdfGenerator";

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [scheme, setScheme] = useState<Scheme | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [guestProfile, setGuestProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "eligibility" | "documents" | "action">("overview");

  useEffect(() => {
    async function loadData() {
      if (id) {
        const data = await fetchSchemeById(id);
        setScheme(data);
      }
      const guest = localStorage.getItem("sahayak_guest_profile");
      if (guest) {
        try {
          setGuestProfile(JSON.parse(guest));
        } catch (e) {}
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const { user } = useAuth();
  const activeProfile = user || guestProfile;
  const displayMatchScore = scheme ? getDynamicSchemeMatchScore(scheme, activeProfile) : 85;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-bold text-on-surface-variant">
        Loading Scheme Details...
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold font-headline text-on-surface">Scheme Not Found</h1>
        <p className="text-xs text-on-surface-variant">The requested government scheme could not be located.</p>
        <Link href="/schemes" className="inline-block bg-primary text-on-primary text-xs font-bold px-6 py-3 rounded-xl">
          Back to Schemes List
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Top Back Navigation */}
      <Link href="/schemes" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Best Matches
      </Link>

      {/* Main Header Banner */}
      <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-md space-y-6 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" /> {scheme.ministry}
            </span>
            <h1 className="font-headline font-bold text-3xl text-on-surface">{scheme.name}</h1>
            <p className="text-xs text-secondary font-bold">{scheme.category}</p>
          </div>

          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-1.5 shadow-sm shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" /> {displayMatchScore}% Match Score
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <span className="text-[10px] text-text-secondary font-bold uppercase block">Max Loan Limit</span>
            <span className="text-base font-bold text-on-surface">{scheme.maxLoan}</span>
          </div>
          <div className="bg-surface-accent/70 p-4 rounded-xl border border-outline-variant/40">
            <span className="text-[10px] text-tertiary font-bold uppercase block">Subsidy Grant</span>
            <span className="text-base font-bold text-tertiary">{scheme.maxSubsidy}</span>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
            <span className="text-[10px] text-text-secondary font-bold uppercase block">Collateral Security</span>
            <span className="text-base font-bold text-secondary">
              {scheme.collateralRequired ? "Required" : "Zero Collateral Needed"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle space-x-4">
        {[
          { key: "overview", label: "Overview & Benefits" },
          { key: "eligibility", label: "Eligibility Criteria" },
          { key: "documents", label: "Required Documents" },
          { key: "action", label: "Application Action Plan" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-primary font-extrabold"
                : "border-transparent text-text-secondary hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-sm space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-headline font-bold text-xl text-on-surface">Program Description</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">{scheme.description}</p>

            <div className="space-y-3 pt-4 border-t border-border-subtle">
              <h3 className="font-headline font-bold text-base text-on-surface">Key Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scheme.keyBenefits.map((benefit, i) => (
                  <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-on-surface leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "eligibility" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-headline font-bold text-xl text-on-surface">Who Can Apply</h2>
            <div className="space-y-3">
              {scheme.eligibility.map((item, i) => (
                <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-xs font-semibold text-on-surface leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-headline font-bold text-xl text-on-surface">Document Checklist</h2>
              <Link
                href="/calculator"
                className="bg-tertiary hover:bg-tertiary-container text-on-tertiary text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-4 h-4" /> Calculate Loan EMI
              </Link>
            </div>

            <div className="space-y-3">
              {scheme.requiredDocuments.map((doc, i) => (
                <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-on-surface">{doc}</span>
                  </div>
                  <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                    Required
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "action" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-headline font-bold text-xl text-on-surface">Step-by-Step Application Roadmap</h2>
            <div className="space-y-4 relative pl-6 border-l-2 border-primary/30">
              <div className="space-y-1 relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-sm text-on-surface">Verify Identity &amp; Business Documents</h3>
                <p className="text-xs text-on-surface-variant">Use Sahayak AI PaddleOCR to extract Aadhaar and PAN fields.</p>
              </div>

              <div className="space-y-1 relative pt-4">
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-tertiary text-white font-bold text-[10px] flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-sm text-on-surface">Generate Detailed Project Report (DPR)</h3>
                <p className="text-xs text-on-surface-variant">Prepare financial projections for equipment purchase.</p>
              </div>

              <div className="space-y-1 relative pt-4">
                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-secondary text-white font-bold text-[10px] flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-sm text-on-surface">Submit Application &amp; Visit Facilitation Center</h3>
                <p className="text-xs text-on-surface-variant">Submit online via official portal or visit nearest DIC/Bank branch.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                type="button"
                onClick={() => generateActionPlanPDF(activeProfile, scheme)}
                className="bg-secondary text-on-secondary text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" /> Download Action Plan PDF
              </button>
              <Link
                href={`/calculator?scheme=${scheme.id}`}
                className="bg-tertiary text-on-tertiary text-xs font-bold px-6 py-3 rounded-xl hover:bg-tertiary/90 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Calculator className="w-4 h-4" /> Calculate EMI &amp; Repayment for {scheme.name}
              </Link>
              <Link
                href="/partners"
                className="bg-primary text-on-primary text-xs font-bold px-6 py-3 rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MapPin className="w-4 h-4" /> Find Nearest Facilitation Center Map
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
