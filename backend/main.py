import uvicorn
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, get_db
from models import SchemeDB, PartnerCenterDB
from seed import seed_database
from recommendation import calculate_recommendation_score
from ocr_engine import process_document_ocr
from ai_engine import generate_ai_scheme_explanation

# Initialize FastAPI App
app = FastAPI(
    title="Sahayak AI Financial Intelligence API",
    description="FastAPI backend providing Scheme Matching, PaddleOCR Scanning, AI Explanations, and Partner Center Locator.",
    version="1.0.0"
)

# Enable CORS for Next.js App Router frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print("Seed notice:", e)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Sahayak AI FastAPI Engine",
        "version": "1.0.0"
    }

@app.get("/api/schemes")
def get_all_schemes(db: Session = Depends(get_db)):
    schemes = db.query(SchemeDB).all()
    result = []
    for s in schemes:
        result.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "ministry": s.ministry,
            "description": s.description,
            "maxSubsidy": s.max_subsidy,
            "maxLoan": s.max_loan,
            "matchScore": s.match_score,
            "readinessScore": s.readiness_score,
            "targetAudience": s.target_audience,
            "collateralRequired": s.collateral_required,
            "keyBenefits": s.key_benefits or [],
            "eligibility": s.eligibility or [],
            "requiredDocuments": s.required_documents or []
        })
    return result

@app.get("/api/schemes/{scheme_id}")
def get_scheme_by_id(scheme_id: str, db: Session = Depends(get_db)):
    s = db.query(SchemeDB).filter(SchemeDB.id == scheme_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scheme not found")

    return {
        "id": s.id,
        "name": s.name,
        "category": s.category,
        "ministry": s.ministry,
        "description": s.description,
        "maxSubsidy": s.max_subsidy,
        "maxLoan": s.max_loan,
        "matchScore": s.match_score,
        "readinessScore": s.readiness_score,
        "targetAudience": s.target_audience,
        "collateralRequired": s.collateral_required,
        "keyBenefits": s.key_benefits or [],
        "eligibility": s.eligibility or [],
        "requiredDocuments": s.required_documents or []
    }

@app.post("/api/recommendations")
def get_recommendations(profile: Dict[str, Any], db: Session = Depends(get_db)):
    schemes = db.query(SchemeDB).all()
    results = []

    for s in schemes:
        s_dict = {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "ministry": s.ministry,
            "description": s.description,
            "maxSubsidy": s.max_subsidy,
            "maxLoan": s.max_loan,
            "readinessScore": s.readiness_score,
            "collateralRequired": s.collateral_required,
            "keyBenefits": s.key_benefits or [],
            "eligibility": s.eligibility or [],
            "requiredDocuments": s.required_documents or []
        }

        match_score = calculate_recommendation_score(s_dict, profile)
        s_dict["matchScore"] = match_score
        results.append(s_dict)

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:3]

@app.post("/api/ocr/scan")
async def scan_document(file: UploadFile = File(...)):
    contents = await file.read()
    res = process_document_ocr(contents, file.filename)
    return res

CITY_COORDINATES = {
    "mumbai": (19.0760, 72.8777),
    "pune": (18.5204, 73.8567),
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "ahmedabad": (23.0225, 72.5714),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "jaipur": (26.9124, 75.7873),
    "lucknow": (26.8467, 80.9462),
    "chandigarh": (30.7333, 76.7794),
    "nagpur": (21.1458, 79.0882),
    "surat": (21.1702, 72.8311),
    "indore": (22.7196, 75.8577),
    "nashik": (19.9975, 73.7898),
    "thane": (19.2183, 72.9781),
}

@app.get("/api/partners")
def get_partner_centers(city: Optional[str] = "Mumbai", db: Session = Depends(get_db)):
    centers = db.query(PartnerCenterDB).all()
    results = []
    
    clean_city = (city or "Mumbai").strip().lower()
    
    # Match DB centers for requested city
    matching_db_centers = [c for c in centers if clean_city in c.city.lower() or c.city.lower() in clean_city]
    
    if matching_db_centers:
        for c in matching_db_centers:
            if c.distance_km <= 20.0:
                results.append({
                    "id": c.id,
                    "name": c.name,
                    "type": c.type,
                    "address": c.address,
                    "city": c.city,
                    "state": c.state,
                    "lat": c.lat,
                    "lng": c.lng,
                    "phone": c.phone,
                    "distanceKm": round(c.distance_km, 1)
                })
    else:
        # Generate local partner centers within max 20km radius for searched city
        base_lat, base_lng = CITY_COORDINATES.get(clean_city, (19.0760, 72.8777))
        city_display = city.strip().title() if city else "Local District"
        
        gen_centers = [
            {
                "id": f"gen-dic-{clean_city}",
                "name": f"District Industries Centre (DIC) {city_display} Hub",
                "type": "Facilitation Center",
                "address": f"Administrative Complex, Main Road, {city_display}",
                "city": city_display,
                "state": "India",
                "lat": round(base_lat + 0.015, 4),
                "lng": round(base_lng + 0.012, 4),
                "phone": "+91 1800 180 2020",
                "distanceKm": 2.4
            },
            {
                "id": f"gen-sbi-{clean_city}",
                "name": f"State Bank of India MSME RBO Branch",
                "type": "Bank Branch",
                "address": f"Station Road, Near Collectorate, {city_display}",
                "city": city_display,
                "state": "India",
                "lat": round(base_lat - 0.022, 4),
                "lng": round(base_lng - 0.018, 4),
                "phone": "+91 22 2202 4567",
                "distanceKm": 4.8
            },
            {
                "id": f"gen-csc-{clean_city}",
                "name": f"PM Vishwakarma CSC Service Point",
                "type": "CSC Center",
                "address": f"Shop 14, Central Market, {city_display}",
                "city": city_display,
                "state": "India",
                "lat": round(base_lat + 0.008, 4),
                "lng": round(base_lng - 0.009, 4),
                "phone": "+91 98201 34567",
                "distanceKm": 1.2
            },
            {
                "id": f"gen-sidbi-{clean_city}",
                "name": f"SIDBI MSME Facilitation Cell",
                "type": "Facilitation Center",
                "address": f"Financial Tower, Block B, {city_display}",
                "city": city_display,
                "state": "India",
                "lat": round(base_lat - 0.035, 4),
                "lng": round(base_lng + 0.028, 4),
                "phone": "+91 22 6753 1000",
                "distanceKm": 8.5
            }
        ]
        
        for c in gen_centers:
            if c["distanceKm"] <= 20.0:
                results.append(c)
    
    # Strict filter: Max 20km radius
    filtered_results = [r for r in results if r["distanceKm"] <= 20.0]
    filtered_results.sort(key=lambda x: x["distanceKm"])
    return filtered_results

@app.post("/api/ai/explain")
def get_ai_explanation(payload: Dict[str, Any]):
    scheme_name = payload.get("scheme_name", "Selected Scheme")
    profile = payload.get("profile", {})
    explanation = generate_ai_scheme_explanation(scheme_name, profile)
    return {"explanation": explanation}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
