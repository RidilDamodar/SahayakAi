"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Sliders, CheckCircle2, ArrowRight, Building2, DollarSign, UserCheck, ShieldCheck, MapPin, Award } from "lucide-react";
import { INDIAN_STATES_AND_UTS, BUSINESS_SECTORS, MOCK_SCHEMES, getTopMatchedSchemes } from "@/lib/api";
import Link from "next/link";
import { fetchPincodeDetails } from "@/lib/pincode";

export default function FindSchemePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState(user?.name ? `${user.name}'s Enterprise` : "My Micro Enterprise");
  const [category, setCategory] = useState(user?.category || "Manufacturing & Small-Scale Industry");
  const [businessType, setBusinessType] = useState(user?.businessType || "Micro Enterprise");
  const [businessStage, setBusinessStage] = useState(user?.businessStage || "Idea / New Business (Greenfield)");
  const [loanPurpose, setLoanPurpose] = useState(user?.loanPurpose || "Working Capital / Daily Expenses");
  
  const [state, setState] = useState(user?.state || "Maharashtra");
  const [district, setDistrict] = useState(user?.district || "Mumbai Suburban");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [pincode, setPincode] = useState(user?.pincode || "400051");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [postOfficeOptions, setPostOfficeOptions] = useState<string[]>([]);

  const handlePincodeChange = async (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      setPincodeLoading(true);
      const res = await fetchPincodeDetails(cleaned);
      if (res.state) setState(res.state);
      if (res.district) setDistrict(res.district);
      if (res.city) setCity(res.city);
      if (res.postOffices && res.postOffices.length > 0) {
        setPostOfficeOptions(res.postOffices);
      }
      setPincodeLoading(false);
    }
  };

  const [loanAmount, setLoanAmount] = useState(user?.loanAmountNeeded || "₹3,00,000");
  
  const parseNumericLoan = (valStr?: string) => {
    if (!valStr) return 300000;
    const nums = valStr.replace(/,/g, "").match(/\d+/g);
    if (nums && nums.length > 0) {
      let n = parseInt(nums[0], 10);
      if (valStr.toLowerCase().includes("lakh") && n < 100) n = n * 100000;
      if (valStr.toLowerCase().includes("crore") && n < 100) n = n * 10000000;
      return n;
    }
    return 300000;
  };

  const [numericLoanAmount, setNumericLoanAmount] = useState<number>(parseNumericLoan(user?.loanAmountNeeded));

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${Math.round(val / 10000000)} Cr`;
    if (val >= 100000) return `₹${Math.round(val / 100000)} Lk`;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };
  const [annualTurnover, setAnnualTurnover] = useState(user?.annualTurnover || "₹5,00,000");
  const [collateralAvailable, setCollateralAvailable] = useState("No Collateral");

  const calculateAge = (dobString?: string) => {
    if (!dobString) return "32"; // default
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return "32";
    const today = new Date();
    const calculatedAge = today.getFullYear() - dob.getFullYear();
    return Math.max(0, calculatedAge).toString();
  };

  const [gender, setGender] = useState(user?.gender || "Female");
  const [socialCategory, setSocialCategory] = useState(user?.socialCategory || "OBC / Minorities");
  const [age, setAge] = useState(calculateAge(user?.dob));
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState(user?.annualFamilyIncome || "250000");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profileData = {
      businessType,
      category,
      gender,
      state,
      district,
      city,
      pincode,
      annualTurnover,
      loanAmountNeeded: loanAmount,
      socialCategory,
      businessStage,
      loanPurpose,
      annualFamilyIncome,
    };

    if (user) {
      // Save profile updates to Auth Context
      updateProfile(profileData);
    } else {
      localStorage.setItem("sahayak_guest_profile", JSON.stringify(profileData));
    }

    // Simulate AI calculation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1000);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-tertiary font-sans text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-tertiary" />
          <span>Sahayak AI Scheme Discovery Engine</span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
          Build Your Business Profile
        </h1>
        <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
          Answer a few quick questions to receive institutional AI matching against 10+ government subsidy & loan schemes.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex justify-center items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s)}
              className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                step === s
                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(159,60,0,0.3)] scale-110"
                  : step > s
                  ? "bg-tertiary text-on-tertiary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </button>
            <span className={`text-xs font-semibold ${step === s ? "text-primary font-bold" : "text-text-secondary"}`}>
              {s === 1 ? "Enterprise Details" : s === 2 ? "Financial Request" : "Demographics"}
            </span>
            {s < 3 && <div className="w-8 sm:w-12 h-0.5 bg-border-subtle" />}
          </div>
        ))}
      </div>

      {/* Multi-step Form Card */}
      <div className="bg-surface-card border border-outline-variant rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden card-glow">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Enterprise Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" /> Step 1: Enterprise &amp; Location
                </h2>
                <p className="text-xs text-text-secondary">Tell us about your current or proposed business entity.</p>
              </div>

              <div className="space-y-6">
                {/* Top Row: Entity Name & Business Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Business / Entity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Business Sector
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {BUSINESS_SECTORS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second Row: Business Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Business Stage
                    </label>
                    <select
                      value={businessStage}
                      onChange={(e) => setBusinessStage(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="Idea / New Business (Greenfield)">Idea / New Business (Greenfield)</option>
                      <option value="0 - 3 Years (Early Stage)">0 - 3 Years (Early Stage)</option>
                      <option value="3+ Years (Established)">3+ Years (Established)</option>
                    </select>
                  </div>
                </div>

                {/* Location PIN Code & Auto-filled fields */}
                <div className="space-y-4 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 card-glow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
                        PIN Code Location Details
                      </span>
                    </div>
                    {pincode.length === 6 && (
                      <span className="text-[11px] font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Detected Location
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* PIN Code Input Field (4 cols) */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        6-Digit PIN Code *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="e.g. 673027 or 400051"
                          className="w-full bg-surface-card border border-outline-variant/80 rounded-xl py-3 px-4 text-base font-bold text-primary tracking-wider focus:outline-none focus:border-primary"
                        />
                        {pincodeLoading && (
                          <span className="absolute right-3 top-3.5 text-xs text-tertiary font-bold animate-pulse">
                            Detecting...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Auto-filled Location Details (8 cols) */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">
                          State / UT (Auto-Filled)
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State / UT"
                          className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">
                          District (Auto-Filled)
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="District"
                          className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">
                          City / Sub-District
                        </label>
                        {postOfficeOptions.length > 1 ? (
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                          >
                            {postOfficeOptions.map((po) => (
                              <option key={po} value={po}>
                                {po}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City / Area"
                            className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-primary text-on-primary font-bold text-xs px-6 py-3 rounded-xl hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>Next: Financial Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Request */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-tertiary" /> Step 2: Loan &amp; Financial Scope
                </h2>
                <p className="text-xs text-text-secondary">Specify the funding size and collateral availability.</p>
              </div>

              <div className="space-y-6">
                {/* Funding Needed Slidebar */}
                <div className="space-y-3 bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 card-glow">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Funding Needed (Loan / Grant)
                    </label>
                    <span className="font-headline font-extrabold text-primary text-lg">
                      {formatINR(numericLoanAmount)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10000}
                    max={10000000}
                    step={numericLoanAmount < 1000000 ? 10000 : 50000}
                    value={numericLoanAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNumericLoanAmount(val);
                      setLoanAmount(formatINR(val));
                    }}
                    className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                    <span>₹10,000 (Shishu)</span>
                    <span>₹10 Lakhs (Tarun)</span>
                    <span>₹50 Lakhs (PMEGP)</span>
                    <span>₹1 Crore (Stand-Up)</span>
                  </div>

                  {/* Preset Badges */}
                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    {[
                      { label: "₹50k (Shishu)", val: 50000 },
                      { label: "₹3L (Kishore)", val: 300000 },
                      { label: "₹10L (Tarun)", val: 1000000 },
                      { label: "₹25L (PMEGP)", val: 2500000 },
                      { label: "₹1 Cr (Stand-Up)", val: 10000000 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => {
                          setNumericLoanAmount(preset.val);
                          setLoanAmount(formatINR(preset.val));
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                          numericLoanAmount === preset.val
                            ? "bg-primary text-on-primary shadow-sm"
                            : "bg-surface-card text-on-surface-variant hover:bg-surface-container border border-outline-variant/60"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Primary Purpose of Loan
                    </label>
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="Working Capital / Daily Expenses">Working Capital / Daily Expenses</option>
                      <option value="Buying Machinery / Equipment">Buying Machinery / Equipment</option>
                      <option value="Infrastructure / Building Expansion">Infrastructure / Building Expansion</option>
                      <option value="Tech Upgrade / Exports">Tech Upgrade / Exports</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Collateral / Land Security
                    </label>
                    <select
                      value={collateralAvailable}
                      onChange={(e) => setCollateralAvailable(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="No Collateral">No Collateral (Need CGTMSE / MUDRA Guarantee)</option>
                      <option value="Third Party Guarantee Only">Third-Party Guarantee Available</option>
                      <option value="Property Collateral Available">Land / Property Collateral Available</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-outline px-6 py-3 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-primary text-on-primary font-bold text-xs px-6 py-3 rounded-xl hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-md"
                >
                  <span>Next: Demographics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Entrepreneur Demographics */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-secondary" /> Step 3: Demographics &amp; Special Category
                </h2>
                <p className="text-xs text-text-secondary">
                  Many Indian schemes (e.g. Stand-Up India, PMEGP, PM Vishwakarma) offer higher subsidies (up to 35%) for specific categories.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="Female">Female (High Subsidy Priority)</option>
                      <option value="Male">Male</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Social Category
                    </label>
                    <select
                      value={socialCategory}
                      onChange={(e) => setSocialCategory(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="OBC / Minorities">OBC / Minorities</option>
                      <option value="SC / ST Category">SC / ST Category</option>
                      <option value="Ex-Servicemen / Differently Abled">Ex-Servicemen / Differently Abled</option>
                      <option value="General Category">General Category</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Entrepreneur Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      disabled
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface opacity-70 cursor-not-allowed focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Annual Family Income (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      value={annualFamilyIncome.replace(/\\D/g, "")}
                      onChange={(e) => setAnnualFamilyIncome(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="border border-outline px-6 py-3 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(159,60,0,0.3)] flex items-center gap-2 hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <span>Running AI Recommendation Match...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>MATCH MY SCHEMES NOW</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Top 3 Best Matched Schemes Result View */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-primary/10 via-tertiary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6 text-center space-y-2 card-glow">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/20 text-primary font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Profile Matching Complete
                </div>
                <h2 className="font-headline font-bold text-2xl text-on-surface">
                  Your Top 3 Recommended Schemes
                </h2>
                <p className="text-xs text-on-surface-variant max-w-xl mx-auto">
                  Based on your profile ({category}, {businessType}, {state}), Sahayak AI matched these 3 schemes with the highest approval probability for your business.
                </p>
              </div>

              {/* Top 3 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getTopMatchedSchemes(MOCK_SCHEMES, user || { category, gender, businessType, state, loanAmountNeeded: loanAmount, businessStage, loanPurpose }).map((scheme, idx) => (
                  <div
                    key={scheme.id}
                    className="bg-surface-card border-2 border-primary/40 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all card-glow relative overflow-hidden group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md">
                          #{idx + 1} Best Fit
                        </span>
                        <div className="bg-tertiary text-on-tertiary font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {scheme.matchScore}% Match
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-text-secondary block">{scheme.ministry}</span>
                        <h3 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                          {scheme.name}
                        </h3>
                      </div>

                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                        {scheme.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border-subtle space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text-secondary">Subsidy Benefit:</span>
                        <span className="text-tertiary font-bold">{scheme.maxSubsidy}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/schemes/${scheme.id}`}
                          className="flex-1 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
                        >
                          <span>Checklist</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/calculator?scheme=${scheme.id}`}
                          className="flex-1 bg-surface-container-low hover:bg-surface-container text-primary border border-outline-variant font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1"
                        >
                          <span>Calculate EMI</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-text-secondary hover:text-on-surface underline flex items-center gap-1"
                >
                  ← Refine My Profile Answers
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    href="/dashboard"
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/schemes"
                    className="bg-primary text-on-primary hover:bg-primary-container text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1 shadow-md"
                  >
                    <span>Browse All Schemes Catalogue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
