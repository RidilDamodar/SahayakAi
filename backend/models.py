from sqlalchemy import Column, String, Integer, Float, Boolean, Text, JSON
from database import Base

class SchemeDB(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    ministry = Column(String)
    description = Column(Text)
    max_subsidy = Column(String)
    max_loan = Column(String)
    match_score = Column(Integer, default=85)
    readiness_score = Column(Integer, default=80)
    target_audience = Column(String)
    collateral_required = Column(Boolean, default=False)
    key_benefits = Column(JSON)
    eligibility = Column(JSON)
    required_documents = Column(JSON)

class PartnerCenterDB(Base):
    __tablename__ = "partner_centers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    phone = Column(String)
    distance_km = Column(Float, default=2.0)
