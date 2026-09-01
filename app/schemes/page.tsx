"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { fetchSchemes, Scheme, filterApplicableSchemes, getTopMatchedSchemes } from "@/lib/api";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sliders,
  ShieldCheck,
  UserCheck,
  Eye,
  Layers,
} from "lucide-react";

export default function SchemesPage() {
  const { user, isAuthenticated } = useAuth();
  const [allSchemes, setAllSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyApplicable, setShowOnlyApplicable] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchSchemes();
      setAllSchemes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const categories = [
    "All",
    "Micro-Enterprise Loan",
    "Capital Subsidy / Credit-Linked",
    "Artisan & Traditional Crafts",
    "Greenfield Enterprise Loan",
    "Collateral Guarantee",
  ];

  // Apply user logged-in applicability filter first (if logged in & toggle is active)
  const baseSchemes =
    isAuthenticated && showOnlyApplicable
      ? filterApplicableSchemes(allSchemes, user)
      : allSchemes;

  // Then apply search & category filters
  const filteredSchemes = baseSchemes.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-surface-card via-surface-container-low to-surface-card border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary" /> Scheme Intelligence Library
          </div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">
            Explore Government Schemes
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl">
            Browse available national &amp; state government subsidy and financial assistance schemes for your business.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/simulator"
            className="bg-surface-card border border-outline text-on-surface hover:text-primary font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-4 h-4 text-tertiary" /> Test in Simulator
          </Link>
        </div>
      </div>

      {/* User Login Applicability Status Bar */}
      <div className="bg-surface-card border border-outline-variant/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  Logged in as <span className="text-primary">{user?.name}</span>
                </span>
                <span className="text-[10px] font-extrabold bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full border border-tertiary/20">
                  Profile Active
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                Displaying <strong>{filteredSchemes.length}</strong> scheme{filteredSchemes.length !== 1 ? "s" : ""} applicable to your profile ({user?.businessType || "Micro Enterprise"}, {user?.gender || "General"}, {user?.state || "Maharashtra"}).
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface">
                Public Scheme Catalogue (Logged Out)
              </span>
              <p className="text-[11px] text-text-secondary">
                Showing all <strong>{allSchemes.length}</strong> national schemes. <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link> to automatically showcase only schemes applicable to your business profile.
              </p>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <button
            onClick={() => setShowOnlyApplicable(!showOnlyApplicable)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
              showOnlyApplicable
                ? "bg-primary text-on-primary border-primary shadow-sm"
                : "bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOnlyApplicable ? "Showing Applicable Schemes" : "Show All Schemes"}</span>
          </button>
        )}
      </div>



      {/* Filter and Search Controls */}
      <div className="bg-surface-card border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheme name or ministry..."
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg py-2 pl-9 pr-4 text-xs text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-text-secondary shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-on-surface-variant">Loading scheme matches...</div>
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-surface-card border border-outline-variant rounded-2xl p-12 text-center space-y-4">
          <Layers className="w-10 h-10 text-text-secondary mx-auto" />
          <h3 className="font-headline font-bold text-lg text-on-surface">No Schemes Match Your Filter</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Try adjusting your search keywords or category filters, or click &quot;Show All Schemes&quot; above to view the full catalogue.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setShowOnlyApplicable(false);
            }}
            className="bg-primary text-on-primary text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container transition-all"
          >
            Reset Filters &amp; View All Schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-surface-card border border-outline-variant rounded-2xl p-8 space-y-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden card-glow flex flex-col justify-between"
            >
              {/* Left Accent Bar */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-tertiary to-secondary"></div>

              <div className="space-y-4">
                {/* Top Row: Category */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                      {scheme.ministry}
                    </span>
                    <h2 className="font-headline font-bold text-xl text-on-surface mt-1">{scheme.name}</h2>
                  </div>
                  {isAuthenticated && (
                    <span className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applicable
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">{scheme.description}</p>

                {/* Key Benefits Bullet List */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                    Key Highlights &amp; Benefits
                  </span>
                  <ul className="space-y-1.5 text-xs text-on-surface-variant">
                    {scheme.keyBenefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Details Footer */}
              <div className="pt-4 border-t border-border-subtle space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                    <span className="text-[10px] text-text-secondary uppercase font-bold block">Maximum Loan Size</span>
                    <span className="font-bold text-on-surface text-sm">{scheme.maxLoan}</span>
                  </div>
                  <div className="bg-surface-accent/60 p-3 rounded-xl border border-outline-variant/40">
                    <span className="text-[10px] text-tertiary uppercase font-bold block">Subsidy / Subvention</span>
                    <span className="font-bold text-tertiary text-sm">{scheme.maxSubsidy}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/schemes/${scheme.id}`}
                    className="flex-1 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold py-3 rounded-xl transition-all text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Scheme Details &amp; Checklist</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/calculator?scheme=${scheme.id}`}
                    className="bg-surface-container-low hover:bg-surface-container text-primary border border-outline-variant text-xs font-bold px-4 py-3 rounded-xl transition-colors text-center shrink-0 flex items-center justify-center gap-1"
                  >
                    <span>Calculate EMI</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
