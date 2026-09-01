from typing import Dict, Any

def generate_ai_scheme_explanation(scheme_name: str, user_profile: Dict[str, Any]) -> str:
    loan = user_profile.get("loanAmountNeeded", "₹3,00,000")
    b_type = user_profile.get("businessType", "Micro Enterprise")
    
    return (
        f"Based on your profile as a {b_type} requiring {loan}, "
        f"{scheme_name} offers zero-collateral backing under government credit guarantee mandates. "
        f"We recommend submitting your Udyam registration certificate first to accelerate bank sanction."
    )
