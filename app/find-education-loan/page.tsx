"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, CheckCircle2, ArrowRight, DollarSign, UserCheck, GraduationCap, MapPin } from "lucide-react";
import { MOCK_SCHEMES, getTopMatchedSchemes } from "@/lib/api";
import Link from "next/link";
import { fetchPincodeDetails } from "@/lib/pincode";

export default function FindEducationLoanPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [institutionName, setInstitutionName] = useState(user?.institutionName || "");
  const [educationalLevel, setEducationalLevel] = useState(user?.educationalLevel || "Bachelors Degree");
  const [courseName, setCourseName] = useState("B.Tech / B.E.");
  
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

  const [loanAmount, setLoanAmount] = useState(user?.loanAmountNeeded || "₹4,00,000");
  
  const parseNumericLoan = (valStr?: string) => {
    if (!valStr) return 400000;
    const nums = valStr.replace(/,/g, "").match(/\d+/g);
    if (nums && nums.length > 0) {
      let n = parseInt(nums[0], 10);
      if (valStr.toLowerCase().includes("lakh") && n < 100) n = n * 100000;
      if (valStr.toLowerCase().includes("crore") && n < 100) n = n * 10000000;
      return n;
    }
    return 400000;
  };

  const [numericLoanAmount, setNumericLoanAmount] = useState<number>(parseNumericLoan(user?.loanAmountNeeded));

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${Math.round(val / 10000000)} Cr`;
    if (val >= 100000) return `₹${Math.round(val / 100000)} Lk`;
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return "20"; // default for student
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return "20";
    const today = new Date();
    const calculatedAge = today.getFullYear() - dob.getFullYear();
    return Math.max(0, calculatedAge).toString();
  };

  const [gender, setGender] = useState(user?.gender || "Female");
  const [socialCategory, setSocialCategory] = useState(user?.socialCategory || "OBC / Minorities");
  const [age, setAge] = useState(calculateAge(user?.dob));
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState(user?.annualFamilyIncome || "250000");
  const [disabilityStatus, setDisabilityStatus] = useState(user?.disabilityStatus || "None");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profileData = {
      isStudent: true,
      institutionName,
      educationalLevel,
      gender,
      state,
      district,
      city,
      pincode,
      loanAmountNeeded: loanAmount,
      socialCategory,
      annualFamilyIncome,
      disabilityStatus,
    };

    if (user) {
      updateProfile(profileData);
    } else {
      localStorage.setItem("sahayak_student_profile", JSON.stringify(profileData));
    }

    // Simulate AI calculation delay
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1000);
  };

  const simulatedUser = { ...user, isStudent: true, educationalLevel, socialCategory, annualFamilyIncome, loanAmountNeeded: loanAmount };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-tertiary font-sans text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-tertiary" />
          <span>Sahayak AI Student Loan Matcher</span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">
          Find the Right Educational Loan
        </h1>
        <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
          Answer a few quick questions to match with government interest subsidy schemes for your studies in India or abroad.
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
              {s === 1 ? "Academic Profile" : s === 2 ? "Loan Request" : "Demographics"}
            </span>
            {s < 3 && <div className="w-8 sm:w-12 h-0.5 bg-border-subtle" />}
          </div>
        ))}
      </div>

      {/* Multi-step Form Card */}
      <div className="glass-panel rounded-3xl p-8 space-y-6 relative card-glow">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary rounded-t-3xl"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Step 1: Academic &amp; Course Details
                </h2>
                <p className="text-xs text-text-secondary">Tell us about the course you are pursuing or planning to pursue.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Educational Level
                    </label>
                    <select
                      value={educationalLevel}
                      onChange={(e) => setEducationalLevel(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="Undergraduate (Bachelors)">Undergraduate (Bachelors)</option>
                      <option value="Postgraduate (Masters)">Postgraduate (Masters)</option>
                      <option value="M.Phil / Ph.D">M.Phil / Ph.D</option>
                      <option value="Diploma / Certification">Diploma / Certification</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Institution/University Name
                    </label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. IIT Bombay, Oxford University"
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Location PIN Code */}
                <div className="space-y-4 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 card-glow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider">
                        Home Address PIN Code
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
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
                          placeholder="e.g. 400051"
                          className="w-full bg-surface-card border border-outline-variant/80 rounded-xl py-3 px-4 text-base font-bold text-primary tracking-wider focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">
                          State / UT
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">
                          District
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-surface-card border border-outline-variant/40 rounded-xl py-3 px-3 font-bold text-on-surface focus:outline-none focus:border-primary"
                        />
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
                  <span>Next: Loan Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Loan Request */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-tertiary" /> Step 2: Loan Requirement
                </h2>
                <p className="text-xs text-text-secondary">Specify the amount you need to cover your course fees and expenses.</p>
              </div>

              <div className="space-y-6">
                {/* Funding Needed Slidebar */}
                <div className="space-y-3 bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 card-glow">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Loan Amount Needed
                    </label>
                    <span className="font-headline font-extrabold text-primary text-lg">
                      {formatINR(numericLoanAmount)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={50000}
                    max={2000000}
                    step={50000}
                    value={numericLoanAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNumericLoanAmount(val);
                      setLoanAmount(formatINR(val));
                    }}
                    className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  <div className="flex justify-between text-[10px] font-bold text-text-secondary">
                    <span>₹50,000</span>
                    <span>₹7.5 Lakhs (CSIS Limit)</span>
                    <span>₹20 Lakhs</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pt-1">
                    {[
                      { label: "₹2L (Short Course)", val: 200000 },
                      { label: "₹7.5L (Max No Collateral)", val: 750000 },
                      { label: "₹10L (Professional Course)", val: 1000000 },
                      { label: "₹20L (Study Abroad)", val: 2000000 },
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

          {/* STEP 3: Student Demographics */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-border-subtle pb-3">
                <h2 className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-secondary" /> Step 3: Demographics &amp; Family Income
                </h2>
                <p className="text-xs text-text-secondary">
                  Education loan subsidies (like CSIS and Padho Pardesh) are highly dependent on family income and category.
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
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Social Category / Caste
                    </label>
                    <select
                      value={socialCategory}
                      onChange={(e) => setSocialCategory(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="General Category">General Category / Economically Weaker Section (EWS)</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC / ST Category">SC / ST Category</option>
                      <option value="Minorities">Minorities (Muslim, Christian, Sikh, Buddhist, Parsi, Jain)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Disability Status
                    </label>
                    <select
                      value={disabilityStatus}
                      onChange={(e) => setDisabilityStatus(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl py-3 px-4 text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="None">None</option>
                      <option value="Locomotor Disability">Locomotor Disability</option>
                      <option value="Visual Impairment">Visual Impairment</option>
                      <option value="Hearing Impairment">Hearing Impairment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Annual Family Income (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 400000"
                      value={annualFamilyIncome.replace(/\D/g, "")}
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
                  className="bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-8 py-3.5 rounded-xl transition-all animate-pulse-glow flex items-center gap-2 hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <span>Running AI Recommendation Match...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>MATCH MY EDUCATION SCHEMES</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Top Results */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-primary/10 via-tertiary/10 to-secondary/10 border border-primary/30 rounded-2xl p-6 text-center space-y-2 card-glow">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/20 text-primary font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Match Complete
                </div>
                <h2 className="font-headline font-bold text-2xl text-on-surface">
                  Your Recommended Education Loan Schemes
                </h2>
                <p className="text-xs text-on-surface-variant max-w-xl mx-auto">
                  Based on your academic profile, family income (₹{annualFamilyIncome}), and {socialCategory} status, we found these matches for you.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getTopMatchedSchemes(MOCK_SCHEMES, simulatedUser).map((scheme, idx) => (
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
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {getTopMatchedSchemes(MOCK_SCHEMES, simulatedUser).length === 0 && (
                   <div className="col-span-3 text-center py-8 text-on-surface-variant text-sm border border-dashed border-outline-variant rounded-xl">
                      No educational loan schemes found matching your specific criteria. Please try adjusting your family income or exploring non-subsidized options.
                   </div>
                )}
              </div>

              {/* Action Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-text-secondary hover:text-on-surface underline flex items-center gap-1"
                >
                  ← Refine My Student Profile
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Link
                    href="/dashboard"
                    className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    Go to Dashboard
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
