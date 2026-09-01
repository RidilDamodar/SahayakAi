export interface Scheme {
  id: string;
  name: string;
  category: string;
  ministry: string;
  description: string;
  maxSubsidy: string;
  maxLoan: string;
  matchScore: number;
  readinessScore: number;
  targetAudience: string;
  keyBenefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  applicationUrl?: string;
  collateralRequired: boolean;
  defaultInterestRate?: number;
  defaultTenureYears?: number;
  subsidyPercent?: number;
}

export interface PartnerCenter {
  id: string;
  name: string;
  type: string; // 'Facilitation Center' | 'Bank Branch' | 'CSC Center'
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  phone: string;
  distanceKm?: number;
}

export const INDIAN_STATES_AND_UTS: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const BUSINESS_SECTORS: string[] = [
  "Manufacturing & Small-Scale Industry",
  "Agriculture & Allied Activities",
  "Retail & Trading",
  "Food, Restaurant & Hospitality",
  "IT, Digital & Professional Services",
  "Transport & Logistics",
  "Personal, Beauty & Local Services",
  "Construction & Infrastructure Services",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Complete Database of 10 Government Schemes
export const MOCK_SCHEMES: Scheme[] = [
  {
    id: "mudra-yojana",
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    category: "Micro-Enterprise Loan",
    ministry: "Ministry of Finance",
    description: "Financial support up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises with zero collateral requirement.",
    maxSubsidy: "Up to 15% Interest Subvention",
    maxLoan: "₹10,00,000",
    matchScore: 94,
    readinessScore: 78,
    targetAudience: "Small vendors, artisans, micro-manufacturers",
    collateralRequired: false,
    defaultInterestRate: 8.5,
    defaultTenureYears: 5,
    subsidyPercent: 0,
    keyBenefits: [
      "No collateral or third-party guarantee required",
      "Categorized into Shishu (up to ₹50k), Kishore (₹50k-5L), Tarun (₹5L-10L)",
      "Processing fee waived for Shishu & Kishore categories",
      "Issued with MUDRA Debit Card for working capital access"
    ],
    eligibility: [
      "Any Indian citizen with a viable business plan for non-farm income sector",
      "Age: 18 years to 65 years",
      "No default record in any bank/financial institution",
      "Udyam Registration preferred"
    ],
    requiredDocuments: [
      "Aadhaar Card & PAN Card",
      "Proof of Business Identity / License",
      "6-month Bank Statement",
      "Quotation of Machinery / Equipment to be purchased"
    ]
  },
  {
    id: "pmegp",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: "Capital Subsidy / Credit-Linked",
    ministry: "Ministry of MSME",
    description: "Credit-linked subsidy scheme offering up to 35% margin money subsidy for establishing new micro-enterprises in manufacturing and services.",
    maxSubsidy: "15% to 35% Margin Subsidy",
    maxLoan: "₹50,00,000",
    matchScore: 88,
    readinessScore: 82,
    targetAudience: "First-generation entrepreneurs, SHGs, Rural youth",
    collateralRequired: false,
    defaultInterestRate: 9.0,
    defaultTenureYears: 7,
    subsidyPercent: 35,
    keyBenefits: [
      "Substantial capital subsidy: 15-25% for General, 25-35% for SC/ST/OBC/Women",
      "Max project cost: ₹50 Lakhs for Manufacturing, ₹20 Lakhs for Services",
      "Collateral-free loans under CGTMSE guarantee scheme",
      "EDP Training provided free of cost"
    ],
    eligibility: [
      "Individual above 18 years of age",
      "At least VIII standard pass for projects costing above ₹10L in manufacturing",
      "Only new projects are eligible for assistance under PMEGP",
      "Self Help Groups (SHGs) and Charitable Trusts registered under Societies Act"
    ],
    requiredDocuments: [
      "Aadhaar & PAN Card",
      "Detailed Project Report (DPR)",
      "Educational Qualification Certificate (VIII Pass Certificate)",
      "Caste / Category Certificate (for special subsidy rate)"
    ]
  },
  {
    id: "standup-india",
    name: "Stand-Up India Scheme",
    category: "Greenfield Enterprise Loan",
    ministry: "Ministry of Finance",
    description: "Bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC/ST borrower and one Woman borrower per bank branch.",
    maxSubsidy: "Low Interest Rates & Margin Support",
    maxLoan: "₹1,00,00,000",
    matchScore: 85,
    readinessScore: 70,
    targetAudience: "Women Entrepreneurs & SC/ST Business Owners",
    collateralRequired: false,
    defaultInterestRate: 7.5,
    defaultTenureYears: 7,
    subsidyPercent: 15,
    keyBenefits: [
      "High loan size between ₹10 Lakhs and ₹100 Lakhs",
      "Composite loan inclusive of working capital & term loan",
      "Repayable in 7 years with a maximum moratorium period of 18 months",
      "Credit Guarantee Scheme support via NCGTC"
    ],
    eligibility: [
      "SC/ST and/or Women entrepreneurs above 18 years of age",
      "Loans under the scheme are available for GREENFIELD projects only",
      "In non-individual enterprises, 51% shareholding must be held by SC/ST or Woman",
      "Borrower should not be in default to any bank/financial institution"
    ],
    requiredDocuments: [
      "Identity & Address Proof (Aadhaar/Voter ID/Passport)",
      "Caste Certificate (if applying under SC/ST category)",
      "Partnership Deed / Company Incorporation Document",
      "Project Report with projected cash flows for 3 years"
    ]
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Scheme",
    category: "Artisan & Traditional Crafts",
    ministry: "Ministry of MSME",
    description: "Comprehensive end-to-end support for traditional artisans and craftspeople including collateral-free credit at 5% interest rate.",
    maxSubsidy: "₹15,000 Toolkit Grant + 5% Interest Subvention",
    maxLoan: "₹3,00,000",
    matchScore: 91,
    readinessScore: 89,
    targetAudience: "Weavers, Tailors, Blacksmiths, Carpenters, Potters",
    collateralRequired: false,
    defaultInterestRate: 5.0,
    defaultTenureYears: 3,
    subsidyPercent: 8,
    keyBenefits: [
      "PM Vishwakarma Certificate & ID Card providing official recognition",
      "Basic training of 5-7 days with ₹500 stipend per day",
      "Toolkit incentive of ₹15,000 as direct e-voucher grant",
      "Collateral-free loan up to ₹1 Lakh (Tranche 1) and ₹2 Lakhs (Tranche 2) at 5% interest"
    ],
    eligibility: [
      "Artisan or craftsperson working with hands and tools in one of the 18 family-based traditional trades",
      "Minimum age of 18 years on the date of registration",
      "Engaged in the relevant trade on the date of registration",
      "Restricted to one member per family"
    ],
    requiredDocuments: [
      "Aadhaar Card linked with Mobile Number",
      "Bank Account details (Passbook copy / IFSC)",
      "Ration Card or Family Declaration Document"
    ]
  },
  {
    id: "cgtmse",
    name: "Credit Guarantee Scheme (CGTMSE)",
    category: "Collateral Guarantee",
    ministry: "Ministry of MSME & SIDBI",
    description: "Credit guarantee cover to financial institutions enabling collateral-free credit flow to Micro and Small Enterprises up to ₹5 Crore.",
    maxSubsidy: "85% Loan Guarantee Coverage",
    maxLoan: "₹5,00,00,000",
    matchScore: 82,
    readinessScore: 75,
    targetAudience: "Established MSMEs seeking expansion loans",
    collateralRequired: false,
    defaultInterestRate: 8.5,
    defaultTenureYears: 5,
    subsidyPercent: 0,
    keyBenefits: [
      "Enables obtaining bank loans without offering property/collateral",
      "Guarantee coverage up to 85% for loans up to ₹5 Lakhs (Women/Micro)",
      "Guarantee coverage up to 75% for general loans up to ₹5 Crore",
      "Supported by major public & private sector banks across India"
    ],
    eligibility: [
      "New and existing Micro and Small Enterprises",
      "Manufacturing as well as Service sector enterprises (including Retail trade)",
      "Borrower unit must have valid Udyam Registration"
    ],
    requiredDocuments: [
      "Udyam Registration Certificate",
      "Audited Financial Statements (Last 2 Years)",
      "ITR Returns of Proprietor / Firm",
      "Bank Loan Sanction Request Proposal"
    ]
  },
  {
    id: "pm-svanidhi",
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    category: "Micro-Enterprise Loan",
    ministry: "Ministry of Housing and Urban Affairs",
    description: "Special micro-credit facility for street vendors providing affordable working capital loans with interest subvention and cashback rewards.",
    maxSubsidy: "7% Interest Subvention + ₹1,200 Cashback",
    maxLoan: "₹50,000",
    matchScore: 93,
    readinessScore: 85,
    targetAudience: "Street vendors, hawkers, small roadside service providers",
    collateralRequired: false,
    defaultInterestRate: 7.0,
    defaultTenureYears: 1,
    subsidyPercent: 7,
    keyBenefits: [
      "First tranche ₹10,000 loan, 2nd tranche ₹20,000, 3rd tranche ₹50,000",
      "Interest subvention @ 7% per annum on timely repayment",
      "Cashback incentives up to ₹100/month for digital transactions",
      "No collateral or penalty on early repayment"
    ],
    eligibility: [
      "Street vendors vending in urban areas",
      "Possessing Certificate of Vending or Identity Card issued by Urban Local Bodies (ULB)"
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Certificate of Vending (CoV) / Letter of Recommendation (LoR)",
      "Bank Account Details"
    ]
  },
  {
    id: "startup-india-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    category: "Capital Subsidy / Credit-Linked",
    ministry: "DPIIT",
    description: "Financial assistance to early-stage tech startups for proof of concept, prototype development, product trials, and market entry.",
    maxSubsidy: "₹20 Lakh Grant + ₹50 Lakh Debt Support",
    maxLoan: "₹70,00,000",
    matchScore: 87,
    readinessScore: 72,
    targetAudience: "Tech startups, innovative product developers",
    collateralRequired: false,
    defaultInterestRate: 6.0,
    defaultTenureYears: 5,
    subsidyPercent: 15,
    keyBenefits: [
      "Up to ₹20 Lakhs grant for proof of concept & prototype validation",
      "Up to ₹50 Lakhs convertible debentures / debt for commercialization",
      "No equity dilution at initial grant stage",
      "Mentorship & incubation support via approved incubators"
    ],
    eligibility: [
      "DPIIT-recognized startup incorporated not more than 2 years ago",
      "Must have business idea with market fit & technology use",
      "Indian promoters holding at least 51% equity"
    ],
    requiredDocuments: [
      "DPIIT Recognition Certificate",
      "Pitch Deck & Executive Summary",
      "Certificate of Incorporation"
    ]
  },
  {
    id: "msme-zed",
    name: "MSME Sustainable (ZED) Certification Scheme",
    category: "Capital Subsidy / Credit-Linked",
    ministry: "Ministry of MSME",
    description: "Financial support for MSMEs to adopt Zero Defect Zero Effect manufacturing practices, with subventions on certification costs.",
    maxSubsidy: "Up to 80% Subsidy on Certification",
    maxLoan: "₹5,00,00,000",
    matchScore: 80,
    readinessScore: 88,
    targetAudience: "Manufacturing MSMEs seeking quality upgrade",
    collateralRequired: false,
    defaultInterestRate: 8.0,
    defaultTenureYears: 3,
    subsidyPercent: 80,
    keyBenefits: [
      "80% subsidy for Micro, 60% for Small, 50% for Medium Enterprises",
      "Concession on processing fees & 0.5% interest rebate from banks",
      "Financial assistance up to ₹5 Lakhs for handholding and tech upgrades"
    ],
    eligibility: [
      "All manufacturing MSMEs registered with Udyam Registration",
      "Operational manufacturing unit in India"
    ],
    requiredDocuments: [
      "Udyam Registration Certificate",
      "GSTIN Document"
    ]
  },
  {
    id: "nabard-agri-loan",
    name: "NABARD Agri-Clinic & Agri-Business Centres (ACABC)",
    category: "Greenfield Enterprise Loan",
    ministry: "NABARD & Ministry of Agriculture",
    description: "Subsidized credit facility for agri-preneurs to set up agriculture clinics, cold chains, custom hiring centers, and food processing units.",
    maxSubsidy: "36% to 44% Composite Capital Subsidy",
    maxLoan: "₹1,00,00,000",
    matchScore: 84,
    readinessScore: 76,
    targetAudience: "Agri-graduates, rural entrepreneurs, food processors",
    collateralRequired: false,
    defaultInterestRate: 6.5,
    defaultTenureYears: 7,
    subsidyPercent: 33,
    keyBenefits: [
      "44% capital subsidy for SC/ST/Women/NE Region, 36% for General Category",
      "Individual loan limit up to ₹20 Lakhs; Group project up to ₹1 Crore",
      "45-day free residential training provided by MANAGE"
    ],
    eligibility: [
      "Graduates/Diploma holders in Agriculture & allied subjects",
      "Minimum age 18 years"
    ],
    requiredDocuments: [
      "Degree / Diploma Certificate in Agriculture",
      "MANAGE ACABC Training Certificate",
      "Project Report"
    ]
  },
  {
    id: "pli-msme",
    name: "Production Linked Incentive (PLI) Scheme for MSMEs",
    category: "Capital Subsidy / Credit-Linked",
    ministry: "Ministry of Commerce & Industry",
    description: "Incentive scheme offering 4% to 6% cashback on incremental sales to boost domestic manufacturing and export competitiveness.",
    maxSubsidy: "4% to 6% Incentive on Incremental Sales",
    maxLoan: "₹10,00,00,000",
    matchScore: 86,
    readinessScore: 80,
    targetAudience: "Component manufacturers, electronics, textiles, pharma MSMEs",
    collateralRequired: false,
    defaultInterestRate: 8.0,
    defaultTenureYears: 5,
    subsidyPercent: 6,
    keyBenefits: [
      "Direct financial incentive based on net incremental sales",
      "Covers electronics, textiles, auto components, food processing",
      "Multi-year payout support (5 years)"
    ],
    eligibility: [
      "Registered manufacturing MSME entity in India",
      "Meeting baseline threshold investment targets"
    ],
    requiredDocuments: [
      "Audited Balance Sheet & CA Certificate",
      "Udyam & GST Registration"
    ]
  }
];

export const MOCK_PARTNERS: PartnerCenter[] = [
  {
    id: "center-1",
    name: "District Industries Centre (DIC) Facilitation Hub",
    type: "Facilitation Center",
    address: "Administrative Complex, Bandra Kurla Complex",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 19.0657,
    lng: 72.8686,
    phone: "+91 22 2659 0123",
    distanceKm: 2.4
  },
  {
    id: "center-2",
    name: "State Bank of India MSME RBO Branch",
    type: "Bank Branch",
    address: "Nariman Point Main Branch",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 18.9256,
    lng: 72.8242,
    phone: "+91 22 2202 4567",
    distanceKm: 4.8
  },
  {
    id: "center-3",
    name: "PM Vishwakarma CSC Service Point",
    type: "CSC Center",
    address: "Shop 12, Main Market Road, Dadar West",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 19.0178,
    lng: 72.8478,
    phone: "+91 98201 34567",
    distanceKm: 1.2
  },
  {
    id: "center-4",
    name: "SIDBI MSME Facilitation Cell",
    type: "Facilitation Center",
    address: "SIDBI Tower, BKC G Block",
    city: "Mumbai",
    state: "Maharashtra",
    lat: 19.0689,
    lng: 72.8712,
    phone: "+91 22 6753 1000",
    distanceKm: 3.1
  }
];

/**
 * Filter schemes based on user profile applicability rules.
 * Rule: Before login (user === null), every scheme is visible.
 * After login (user !== null), showcase only those schemes applicable to user.
 */
export function filterApplicableSchemes(schemes: Scheme[], user: any): Scheme[] {
  if (!user) {
    return schemes;
  }

  // Parse numerical loan amount needed from string
  let loanVal = 300000;
  if (user.loanAmountNeeded) {
    const rawStr = user.loanAmountNeeded.toString().replace(/,/g, "");
    const nums = rawStr.match(/\d+/g);
    if (nums && nums.length > 0) {
      loanVal = parseInt(nums[0], 10);
      if (rawStr.toLowerCase().includes("lakh") && loanVal < 100) {
        loanVal = loanVal * 100000;
      } else if (rawStr.toLowerCase().includes("crore") && loanVal < 100) {
        loanVal = loanVal * 10000000;
      }
    }
  }

  const gender = (user.gender || "").toLowerCase();
  const social = (user.socialCategory || "").toLowerCase();
  const busType = (user.businessType || "").toLowerCase();
  const cat = (user.category || "").toLowerCase();
  const stage = (user.businessStage || "").toLowerCase();
  const purpose = (user.loanPurpose || "").toLowerCase();

  return schemes.filter((scheme) => {
    const sid = scheme.id.toLowerCase();

    // 1. Stand-Up India: SC/ST/Women AND New Business only
    if (sid === "standup-india") {
      const isFemale = gender.includes("female") || gender.includes("woman") || busType.includes("women");
      const isScSt = social.includes("sc") || social.includes("st") || social.includes("caste") || social.includes("tribe");
      if (!isFemale && !isScSt) return false;
      if (stage && !stage.includes("idea") && !stage.includes("new")) return false;
    }

    // 2. PM Vishwakarma: Artisans only
    if (sid === "pm-vishwakarma") {
      const isArtisan = busType.includes("artisan") || busType.includes("craft") || cat.includes("handicraft") || cat.includes("traditional") || busType.includes("micro");
      if (!isArtisan && (busType.includes("tech") || busType.includes("corporate") || busType.includes("medium"))) {
        return false;
      }
    }

    // 3. PM SVANidhi: Small loan <= 2L or vendors
    if (sid === "pm-svanidhi") {
      if (loanVal > 200000 && !busType.includes("vendor") && !cat.includes("street")) return false;
    }

    // 4. Startup India Seed Fund: Tech startups only
    if (sid === "startup-india-seed-fund") {
      const isStartup = busType.includes("startup") || busType.includes("tech") || cat.includes("tech") || cat.includes("innovation") || cat.includes("software");
      if (!isStartup) return false;
    }

    // 5. NABARD Agri Loan: STRICTLY Agriculture / Food
    if (sid === "nabard-agri-loan") {
      const isAgri = busType.includes("agri") || busType.includes("farm") || cat.includes("agri") || cat.includes("food") || cat.includes("rural");
      if (!isAgri) return false;
    }

    // 6. PMEGP: Only New Projects (Greenfield)
    if (sid === "pmegp") {
      if (stage && !stage.includes("idea") && !stage.includes("new")) return false;
    }

    // 7. MSME ZED: Established Manufacturing businesses only
    if (sid === "msme-zed") {
      if (stage && stage.includes("idea")) return false;
      if (!cat.includes("manufacturing")) return false;
    }

    // Default: Applicable
    return true;
  });
}

/**
 * Calculates dynamic match score for a scheme based on user profile.
 */
export function getDynamicSchemeMatchScore(scheme: Scheme, user: any): number {
  let score = scheme.matchScore || 80;
  if (user) {
    const busType = (user.businessType || "").toLowerCase();
    const cat = (user.category || "").toLowerCase();
    const gender = (user.gender || "").toLowerCase();
    const stage = (user.businessStage || "").toLowerCase();
    const purpose = (user.loanPurpose || "").toLowerCase();

    if (scheme.id === "mudra-yojana") {
      if (busType.includes("micro") || cat.includes("manufacturing") || cat.includes("retail") || cat.includes("small")) {
        score = Math.max(score, 94);
      }
      if (purpose.includes("working capital")) score = Math.max(score, 96);
    }
    if (scheme.id === "pm-vishwakarma") {
      if (busType.includes("artisan") || cat.includes("personal") || cat.includes("beauty")) {
        score = Math.max(score, 96);
      }
      if (purpose.includes("equipment") || purpose.includes("machinery")) score = Math.max(score, 98);
    }
    if (scheme.id === "standup-india") {
      if (gender.includes("female") || busType.includes("women")) score = Math.max(score, 95);
      if (stage.includes("idea") || stage.includes("new")) score = Math.max(score, 97);
    }
    if (scheme.id === "pmegp") {
      if (cat.includes("manufacturing") || cat.includes("food") || cat.includes("construction")) score = Math.max(score, 92);
      if (stage.includes("idea") || stage.includes("new")) score = Math.max(score, 95);
    }
    if (scheme.id === "startup-india-seed-fund") {
      if (cat.includes("it") || cat.includes("digital") || cat.includes("tech")) score = Math.max(score, 95);
      if (stage.includes("idea") || stage.includes("early")) score = Math.max(score, 98);
    }
    if (scheme.id === "nabard-agri-loan") {
      if (cat.includes("agri") || cat.includes("farm") || cat.includes("food")) score = Math.max(score, 96);
      if (purpose.includes("infrastructure") || purpose.includes("equipment")) score = Math.max(score, 98);
    }
    if (scheme.id === "msme-zed") {
      if (cat.includes("manufacturing") && stage.includes("established")) score = Math.max(score, 95);
      if (purpose.includes("tech upgrade") || purpose.includes("export")) score = Math.max(score, 98);
    }
  }
  return score;
}

/**
 * Returns Top 3 schemes with the highest sanction / approval match percentage score.
 */
export function getTopMatchedSchemes(schemes: Scheme[], user: any): Scheme[] {
  const applicable = filterApplicableSchemes(schemes, user);

  const scored = applicable.map((scheme) => {
    return {
      ...scheme,
      matchScore: getDynamicSchemeMatchScore(scheme, user),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 3);
}

export async function fetchSchemes(): Promise<Scheme[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/schemes`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unavailable, using fallback mock data:", err);
  }
  return MOCK_SCHEMES;
}

export async function fetchSchemeById(id: string): Promise<Scheme | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/schemes/${id}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend API unavailable, using fallback mock data:", err);
  }
  return MOCK_SCHEMES.find((s) => s.id === id);
}

export async function fetchPartnerCenters(city = "Mumbai"): Promise<PartnerCenter[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/partners?city=${encodeURIComponent(city)}`, { cache: "no-store" });
    if (res.ok) {
      const data: PartnerCenter[] = await res.json();
      return data.filter((p) => (p.distanceKm ?? 0) <= 20.0);
    }
  } catch (err) {
    console.warn("Backend API unavailable, using fallback mock partners:", err);
  }
  return MOCK_PARTNERS.filter((p) => (p.distanceKm ?? 0) <= 20.0);
}
