from typing import Dict, Any

def calculate_recommendation_score(scheme: Dict[str, Any], profile: Dict[str, Any]) -> int:
    score = 0 # Base baseline

    loan_needed_str = profile.get("loanAmountNeeded", "300000")
    # Parse numbers from loan string
    import re
    numbers = re.findall(r'\d+', loan_needed_str.replace(',', ''))
    loan_val = int(numbers[0]) if numbers else 300000

    category = profile.get("category", "").lower()
    gender = profile.get("gender", "").lower()
    social = profile.get("socialCategory", "").lower()
    business_type = profile.get("businessType", "").lower()
    stage = profile.get("businessStage", "").lower()
    purpose = profile.get("loanPurpose", "").lower()

    sid = scheme["id"]

    # 1. Stand-Up India
    if sid == "standup-india":
        is_female = "female" in gender or "woman" in gender or "women" in business_type
        is_sc_st = "sc" in social or "st" in social or "caste" in social or "tribe" in social
        if not is_female and not is_sc_st:
            return 0 # Strict Exclusion
        if stage and "idea" not in stage and "new" not in stage:
            return 0 # Strict Exclusion for existing business
        score += 90

    # 2. PM Vishwakarma
    elif sid == "pm-vishwakarma":
        is_artisan = "artisan" in business_type or "craft" in business_type or "handicraft" in category or "traditional" in category or "micro" in business_type
        if not is_artisan and ("tech" in business_type or "corporate" in business_type or "medium" in business_type):
            return 0
        if is_artisan:
            score += 75
        if "equipment" in purpose or "machinery" in purpose:
            score += 20

    # 3. PM SVANidhi
    elif sid == "pm-svanidhi":
        if loan_val > 200000 and "vendor" not in business_type and "street" not in category:
            return 0
        if loan_val <= 50000:
            score += 70
        if "working capital" in purpose:
            score += 25

    # 4. Startup India Seed Fund
    elif sid == "startup-india-seed-fund":
        is_startup = "startup" in business_type or "tech" in business_type or "tech" in category or "innovation" in category or "software" in category
        if not is_startup:
            return 0
        if stage and ("idea" in stage or "early" in stage):
            score += 90

    # 5. NABARD Agri Loan
    elif sid == "nabard-agri-loan":
        is_agri = "agri" in business_type or "farm" in business_type or "agri" in category or "food" in category or "rural" in category
        if not is_agri:
            return 0
        score += 75
        if "infrastructure" in purpose or "equipment" in purpose:
            score += 20

    # 6. PMEGP
    elif sid == "pmegp":
        if stage and "idea" not in stage and "new" not in stage:
            return 0
        if "manufacturing" in category or "food" in category or "construction" in category:
            score += 50
        if "female" in gender or "transgender" in gender or "sc" in social or "st" in social or "obc" in social:
            score += 40

    # 7. MSME ZED
    elif sid == "msme-zed":
        if stage and "idea" in stage:
            return 0
        if "manufacturing" not in category:
            return 0
        score += 65
        if "tech upgrade" in purpose or "export" in purpose:
            score += 30

    # 8. MUDRA
    elif sid == "mudra-yojana":
        if loan_val <= 1000000:
            score += 60
        if "micro" in business_type or "manufacturing" in category:
            score += 20
        if "working capital" in purpose:
            score += 15

    # 9. CGTMSE
    elif sid == "cgtmse":
        if loan_val > 1000000:
            score += 50
        if stage and "established" in stage:
            score += 45
            
    # 10. CSIS Education Loan
    elif sid == "csis-education-loan":
        is_student = profile.get("isStudent", False)
        if not is_student:
            return 0
        family_income = int(str(profile.get("annualFamilyIncome", "0")).replace(',', '').replace('₹', ''))
        if family_income > 450000:
            return 0
        score += 85
        edu_level = profile.get("educationalLevel", "").lower()
        if "bachelors" in edu_level or "masters" in edu_level:
            score += 10
            
    # 11. Dr. Ambedkar Education Loan
    elif sid == "dr-ambedkar-education-loan":
        is_student = profile.get("isStudent", False)
        if not is_student:
            return 0
        is_obc = "obc" in social or "backward" in social
        is_ebc = "ebc" in social or "economically backward" in social or "general" in social
        if not is_obc and not is_ebc:
            return 0
        family_income = int(str(profile.get("annualFamilyIncome", "0")).replace(',', '').replace('₹', ''))
        if is_obc and family_income > 800000:
            return 0
        if is_ebc and family_income > 250000:
            return 0
        score += 85
        edu_level = profile.get("educationalLevel", "").lower()
        if "masters" in edu_level or "phd" in edu_level:
            score += 10
            
    # 12. Padho Pardesh
    elif sid == "padho-pardesh":
        is_student = profile.get("isStudent", False)
        if not is_student:
            return 0
        is_minority = "minority" in social or "minorities" in social
        if not is_minority:
            return 0
        family_income = int(str(profile.get("annualFamilyIncome", "0")).replace(',', '').replace('₹', ''))
        if family_income > 600000:
            return 0
        score += 85
        edu_level = profile.get("educationalLevel", "").lower()
        if "masters" in edu_level or "phd" in edu_level:
            score += 10

    return min(99, max(0, score))
