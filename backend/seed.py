from database import SessionLocal, Base, engine
from models import SchemeDB, PartnerCenterDB

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()

    schemes_data = [
        {
            "id": "mudra-yojana",
            "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
            "category": "Micro-Enterprise Loan",
            "ministry": "Ministry of Finance",
            "description": "Financial support up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises with zero collateral requirement.",
            "max_subsidy": "Up to 15% Interest Subvention",
            "max_loan": "₹10,00,000",
            "match_score": 94,
            "readiness_score": 78,
            "target_audience": "Small vendors, artisans, micro-manufacturers",
            "collateral_required": False,
            "key_benefits": [
                "No collateral or third-party guarantee required",
                "Categorized into Shishu (up to ₹50k), Kishore (₹50k-5L), Tarun (₹5L-10L)",
                "Processing fee waived for Shishu & Kishore categories",
                "Issued with MUDRA Debit Card for working capital access"
            ],
            "eligibility": [
                "Any Indian citizen with a viable business plan for non-farm income sector",
                "Age: 18 years to 65 years",
                "No default record in any bank/financial institution"
            ],
            "required_documents": [
                "Aadhaar Card & PAN Card",
                "Proof of Business Identity / License",
                "6-month Bank Statement",
                "Quotation of Machinery / Equipment"
            ]
        },
        {
            "id": "pmegp",
            "name": "Prime Minister's Employment Generation Programme (PMEGP)",
            "category": "Capital Subsidy / Credit-Linked",
            "ministry": "Ministry of MSME",
            "description": "Credit-linked subsidy scheme offering up to 35% margin money subsidy for establishing new micro-enterprises in manufacturing and services.",
            "max_subsidy": "15% to 35% Margin Subsidy",
            "max_loan": "₹50,00,000",
            "match_score": 88,
            "readiness_score": 82,
            "target_audience": "First-generation entrepreneurs, SHGs, Rural youth",
            "collateral_required": False,
            "key_benefits": [
                "Substantial capital subsidy: 15-25% for General, 25-35% for Special Categories",
                "Max project cost: ₹50 Lakhs for Manufacturing, ₹20 Lakhs for Services",
                "Collateral-free loans under CGTMSE guarantee scheme",
                "Free EDP Training provided"
            ],
            "eligibility": [
                "Individual above 18 years of age",
                "At least VIII standard pass for projects costing above ₹10L in manufacturing",
                "Only new projects eligible"
            ],
            "required_documents": [
                "Aadhaar & PAN Card",
                "Detailed Project Report (DPR)",
                "VIII Pass Certificate",
                "Caste / Category Certificate"
            ]
        },
        {
            "id": "standup-india",
            "name": "Stand-Up India Scheme",
            "category": "Greenfield Enterprise Loan",
            "ministry": "Ministry of Finance",
            "description": "Bank loans between ₹10 Lakhs and ₹1 Crore to SC/ST and Women entrepreneurs for setting up greenfield enterprises.",
            "max_subsidy": "Concessional Interest Rates & Margin Support",
            "max_loan": "₹1,00,00,000",
            "match_score": 85,
            "readiness_score": 70,
            "target_audience": "Women Entrepreneurs & SC/ST Business Owners",
            "collateral_required": False,
            "key_benefits": [
                "High loan size between ₹10 Lakhs and ₹100 Lakhs",
                "Composite loan inclusive of working capital & term loan",
                "Repayable in 7 years with max moratorium period of 18 months",
                "Credit Guarantee Scheme support via NCGTC"
            ],
            "eligibility": [
                "SC/ST and/or Women entrepreneurs above 18 years of age",
                "Greenfield projects only (first time venture in manufacturing, services, or trading)",
                "Non-individual enterprises must have 51% shareholding held by SC/ST or Woman"
            ],
            "required_documents": [
                "Identity & Address Proof",
                "Caste Certificate (if applying under SC/ST)",
                "Company Incorporation Document / Partnership Deed",
                "Project Report with cash flow projections"
            ]
        },
        {
            "id": "pm-vishwakarma",
            "name": "PM Vishwakarma Scheme",
            "category": "Artisan & Traditional Crafts",
            "ministry": "Ministry of MSME",
            "description": "End-to-end support for traditional artisans including collateral-free credit at 5% interest rate, training stipend, and toolkit grants.",
            "max_subsidy": "₹15,000 Toolkit Grant + 5% Interest Subvention",
            "max_loan": "₹3,00,000",
            "match_score": 91,
            "readiness_score": 89,
            "target_audience": "Weavers, Tailors, Blacksmiths, Carpenters, Potters, Artisans",
            "collateral_required": False,
            "key_benefits": [
                "PM Vishwakarma ID & Official Recognition Certificate",
                "Skill training with ₹500/day stipend during training",
                "₹15,000 e-voucher grant for modern toolkits",
                "Collateral-free loan up to ₹1L (Tranche 1) & ₹2L (Tranche 2) at 5% interest"
            ],
            "eligibility": [
                "Artisan working with hands and tools in one of 18 traditional trades",
                "Minimum age of 18 years",
                "Restricted to one member per family"
            ],
            "required_documents": [
                "Aadhaar Card linked with Mobile Number",
                "Bank Account Details / Passbook Copy",
                "Ration Card or Family Declaration Document"
            ]
        },
        {
            "id": "cgtmse",
            "name": "Credit Guarantee Scheme (CGTMSE)",
            "category": "Collateral Guarantee",
            "ministry": "Ministry of MSME & SIDBI",
            "description": "Credit guarantee cover to financial institutions enabling collateral-free credit flow to Micro and Small Enterprises up to ₹5 Crore.",
            "max_subsidy": "Up to 85% Loan Guarantee Coverage",
            "max_loan": "₹5,00,00,000",
            "match_score": 82,
            "readiness_score": 75,
            "target_audience": "Established MSMEs seeking expansion loans",
            "collateral_required": False,
            "key_benefits": [
                "Obtain bank loans without offering property/collateral security",
                "Guarantee coverage up to 85% for loans up to ₹5L (Women/Micro)",
                "Guarantee coverage up to 75% for general loans up to ₹5 Crore",
                "Supported across all major public & private banks"
            ],
            "eligibility": [
                "New and existing Micro and Small Enterprises",
                "Manufacturing and Service sector enterprises including Retail trade",
                "Valid Udyam Registration required"
            ],
            "required_documents": [
                "Udyam Registration Certificate",
                "Audited Financial Statements (Last 2 Years)",
                "ITR Returns of Proprietor / Firm",
                "Bank Loan Sanction Request Proposal"
            ]
        },
        {
            "id": "pm-svanidhi",
            "name": "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
            "category": "Micro-Enterprise Loan",
            "ministry": "Ministry of Housing and Urban Affairs",
            "description": "Special micro-credit facility for street vendors providing affordable working capital loans with interest subvention and cashback rewards.",
            "max_subsidy": "7% Interest Subvention + ₹1,200 Annual Cashback",
            "max_loan": "₹50,000",
            "match_score": 93,
            "readiness_score": 85,
            "target_audience": "Street vendors, hawkers, small roadside service providers",
            "collateral_required": False,
            "key_benefits": [
                "First tranche ₹10,000 loan, 2nd tranche ₹20,000, 3rd tranche ₹50,000",
                "Interest subvention @ 7% per annum on timely repayment",
                "Cashback incentives up to ₹100/month for digital transactions",
                "No collateral or penalty on early repayment"
            ],
            "eligibility": [
                "Street vendors vending in urban areas on or before March 24, 2020",
                "Possessing Certificate of Vending or Identity Card issued by Urban Local Bodies (ULB)"
            ],
            "required_documents": [
                "Aadhaar Card",
                "Certificate of Vending (CoV) / Letter of Recommendation (LoR)",
                "Bank Account Details"
            ]
        },
        {
            "id": "startup-india-seed-fund",
            "name": "Startup India Seed Fund Scheme (SISFS)",
            "category": "Capital Subsidy / Credit-Linked",
            "ministry": "Department for Promotion of Industry and Internal Trade (DPIIT)",
            "description": "Financial assistance to early-stage startups for proof of concept, prototype development, product trials, and market entry.",
            "max_subsidy": "₹20 Lakh Grant + ₹50 Lakh Debt/Convertible Debenture",
            "max_loan": "₹70,00,000",
            "match_score": 95,
            "readiness_score": 72,
            "target_audience": "Tech startups, innovative product developers, DPIIT recognized startups",
            "collateral_required": False,
            "key_benefits": [
                "Up to ₹20 Lakhs grant for proof of concept & prototype validation",
                "Up to ₹50 Lakhs convertible debentures / debt for commercialization",
                "No equity dilution at initial grant stage",
                "Mentorship & incubation support via approved incubators"
            ],
            "eligibility": [
                "DPIIT-recognized startup incorporated not more than 2 years ago",
                "Must have business idea with market fit, scope of scaling & technology use",
                "Indian promoters holding at least 51% equity"
            ],
            "required_documents": [
                "DPIIT Recognition Certificate",
                "Pitch Deck & Executive Summary",
                "Certificate of Incorporation",
                "Bank Account statement of entity"
            ]
        },
        {
            "id": "msme-zed",
            "name": "MSME Sustainable (ZED) Certification Scheme",
            "category": "Capital Subsidy / Credit-Linked",
            "ministry": "Ministry of MSME",
            "description": "Financial support for MSMEs to adopt Zero Defect Zero Effect manufacturing practices, with subventions on certification costs and bank loan interest rates.",
            "max_subsidy": "Up to 80% Subsidy on Certification + 0.5% Bank Interest Rebate",
            "max_loan": "₹5,00,000",
            "match_score": 80,
            "readiness_score": 88,
            "target_audience": "Manufacturing MSMEs seeking quality upgrade and exports",
            "collateral_required": False,
            "key_benefits": [
                "80% subsidy for Micro, 60% for Small, 50% for Medium Enterprises on ZED certification",
                "Rs. 10,000 grant upon Bronze certification completion",
                "Concession on processing fees & 0.5% interest rate rebate from leading banks",
                "Financial assistance up to ₹5 Lakhs for handholding and tech upgrades"
            ],
            "eligibility": [
                "All manufacturing MSMEs registered with Udyam Registration",
                "Valid bank account and operational manufacturing unit"
            ],
            "required_documents": [
                "Udyam Registration Certificate",
                "GSTIN Document",
                "Plant Layout & Self-Assessment Form"
            ]
        },
        {
            "id": "nabard-agri-loan",
            "name": "NABARD Agri-Clinic & Agri-Business Centres Scheme (ACABC)",
            "category": "Greenfield Enterprise Loan",
            "ministry": "NABARD & Ministry of Agriculture",
            "description": "Subsidized credit facility for agri-preneurs to set up agriculture clinics, cold chains, custom hiring centers, and food processing units.",
            "max_subsidy": "36% to 44% Composite Capital Subsidy",
            "max_loan": "₹1,00,00,000",
            "match_score": 84,
            "readiness_score": 76,
            "target_audience": "Agri-graduates, rural entrepreneurs, food processors",
            "collateral_required": False,
            "key_benefits": [
                "44% capital subsidy for SC/ST/Women/NE Region, 36% for General Category",
                "Individual loan limit up to ₹20 Lakhs; Group project up to ₹1 Crore",
                "45-day free residential training provided by MANAGE",
                "Refinance assistance through NABARD"
            ],
            "eligibility": [
                "Graduates/Diploma holders in Agriculture & allied subjects",
                "Biological science graduates with post-graduation in agriculture",
                "Minimum age 18 years"
            ],
            "required_documents": [
                "Degree / Diploma Certificate in Agriculture",
                "MANAGE ACABC Training Completion Certificate",
                "Project Report for Agri-Clinic/Business",
                "Aadhaar & PAN Card"
            ]
        },
        {
            "id": "pli-msme",
            "name": "Production Linked Incentive (PLI) Scheme for MSMEs",
            "category": "Capital Subsidy / Credit-Linked",
            "ministry": "Ministry of Commerce & Industry",
            "description": "Incentive scheme offering 4% to 6% cashback on incremental sales to boost domestic manufacturing and export competitiveness.",
            "max_subsidy": "4% to 6% Incentive on Incremental Sales",
            "max_loan": "₹10,00,00,000",
            "match_score": 86,
            "readiness_score": 80,
            "target_audience": "Component manufacturers, electronics, textiles, pharma MSMEs",
            "collateral_required": False,
            "key_benefits": [
                "Direct financial incentive based on net incremental sales",
                "Covers key sectors: electronics, textiles, auto components, food processing",
                "Boosts export competitiveness and global supply chain integration",
                "Multi-year payout support (5 years)"
            ],
            "eligibility": [
                "Registered manufacturing MSME entity in India",
                "Meeting baseline threshold investment and incremental production targets"
            ],
            "required_documents": [
                "Audited Balance Sheet & CA Certificate of Incremental Sales",
                "Udyam & GST Registration",
                "Factory License & Environmental Clearance"
            ]
        }
    ]

    for s in schemes_data:
        existing = db.query(SchemeDB).filter_by(id=s["id"]).first()
        if not existing:
            new_scheme = SchemeDB(
                id=s["id"],
                name=s["name"],
                category=s["category"],
                ministry=s["ministry"],
                description=s["description"],
                max_subsidy=s["max_subsidy"],
                max_loan=s["max_loan"],
                match_score=s["match_score"],
                readiness_score=s["readiness_score"],
                target_audience=s["target_audience"],
                collateral_required=s["collateral_required"],
                key_benefits=s["key_benefits"],
                eligibility=s["eligibility"],
                required_documents=s["required_documents"]
            )
            db.add(new_scheme)
        else:
            # Update existing fields to ensure freshness
            existing.name = s["name"]
            existing.category = s["category"]
            existing.ministry = s["ministry"]
            existing.description = s["description"]
            existing.max_subsidy = s["max_subsidy"]
            existing.max_loan = s["max_loan"]
            existing.match_score = s["match_score"]
            existing.readiness_score = s["readiness_score"]
            existing.target_audience = s["target_audience"]
            existing.collateral_required = s["collateral_required"]
            existing.key_benefits = s["key_benefits"]
            existing.eligibility = s["eligibility"]
            existing.required_documents = s["required_documents"]

    if db.query(PartnerCenterDB).count() == 0:
        partners = [
            PartnerCenterDB(
                id="center-1",
                name="District Industries Centre (DIC) Facilitation Hub",
                type="Facilitation Center",
                address="Administrative Complex, BKC",
                city="Mumbai",
                state="Maharashtra",
                lat=19.0657,
                lng=72.8686,
                phone="+91 22 2659 0123",
                distance_km=2.4
            ),
            PartnerCenterDB(
                id="center-2",
                name="State Bank of India MSME Branch",
                type="Bank Branch",
                address="Nariman Point Main Branch",
                city="Mumbai",
                state="Maharashtra",
                lat=18.9256,
                lng=72.8242,
                phone="+91 22 2202 4567",
                distance_km=4.8
            )
        ]
        db.add_all(partners)

    db.commit()
    db.close()
    print("Database seeded successfully with 10 schemes!")

if __name__ == "__main__":
    seed_database()

