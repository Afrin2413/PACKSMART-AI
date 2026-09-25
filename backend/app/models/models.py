import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="Farmer")  # Farmer, Startup, Business, Researcher, Admin
    organization = Column(String(255), nullable=True, default="AgriTech Labs")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")


class Commodity(Base):
    __tablename__ = "commodities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    category = Column(String(80), nullable=False)  # Fruits, Vegetables, Grains, Bakery, Dairy, Meat, Snacks, Processed Food, Other
    moisture_pct = Column(Float, nullable=False)
    fat_pct = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    respiration_rate = Column(String(50), nullable=False)  # None, Low, Medium, High, Very High
    ideal_temp_c = Column(Float, nullable=False)
    ideal_humidity_pct = Column(Float, nullable=False)
    typical_shelf_life_days = Column(Integer, nullable=False)
    recommended_gas_ratio_o2 = Column(Float, default=0.0)
    recommended_gas_ratio_co2 = Column(Float, default=0.0)
    recommended_gas_ratio_n2 = Column(Float, default=100.0)
    sensitivity_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PackagingMaterial(Base):
    __tablename__ = "packaging_materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, index=True, nullable=False)
    structure = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # Breathable Polymer, High Barrier Coex, Foil Laminate, Metallized Film, Biaxially Oriented Film, Polyester Barrier, Bio-Degradable Polymer, Paper Laminate, Polyolefin Monolayer, Rigid Barrier MAP
    thickness_microns = Column(Integer, nullable=False)
    otr_cc_m2_day_atm = Column(Float, nullable=False)  # Oxygen Transmission Rate
    wvtr_g_m2_day = Column(Float, nullable=False)      # Water Vapor Transmission Rate
    gas_permeability_category = Column(String(50), nullable=False) # Ultra Low, Low, Medium, High, Very High
    sealability = Column(String(50), nullable=False)   # Poor, Fair, Good, Excellent
    puncture_resistance = Column(String(50), nullable=False) # Fair, Good, Excellent
    map_suitability = Column(Boolean, default=False)
    recyclability_pct = Column(Float, default=50.0)
    carbon_footprint_kg_co2_per_kg = Column(Float, default=2.5)
    cost_per_sqm_inr = Column(Float, nullable=False)
    sustainability_score_base = Column(Float, default=70.0)
    protection_score_base = Column(Float, default=80.0)
    min_temp_c = Column(Float, default=-10.0)
    max_temp_c = Column(Float, default=70.0)
    key_features = Column(Text, nullable=True)
    ideal_for = Column(Text, nullable=True)
    is_custom = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Input parameters
    commodity_name = Column(String(150), nullable=False)
    commodity_category = Column(String(80), nullable=False)
    moisture_pct = Column(Float, nullable=False)
    fat_pct = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    respiration_rate = Column(String(50), nullable=False)
    
    target_shelf_life_days = Column(Integer, nullable=False)
    storage_temp_c = Column(Float, nullable=False)
    storage_humidity_pct = Column(Float, nullable=False)
    
    transport_duration_days = Column(Integer, default=2)
    transport_type = Column(String(50), default="Road")       # Local, Road, Cold Chain, Long Distance
    transport_condition = Column(String(50), default="Normal") # Normal, Humid, High Temperature, Refrigerated
    
    priority_protection = Column(Float, default=0.35)
    priority_shelf_life = Column(Float, default=0.25)
    priority_cost = Column(Float, default=0.20)
    priority_sustainability = Column(Float, default=0.20)
    
    mode = Column(String(20), default="Beginner")  # Beginner, Expert
    overall_risk_level = Column(String(20), default="LOW") # LOW, MODERATE, HIGH
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="analyses")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")
    cost_estimate = relationship("CostEstimate", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    sustainability_score = relationship("SustainabilityScore", back_populates="analysis", uselist=False, cascade="all, delete-orphan")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    rank = Column(Integer, nullable=False)  # 1, 2, 3
    recommendation_type = Column(String(100), nullable=False)  # "Best Balanced Solution", "Lower Cost Alternative", "More Sustainable Alternative"
    
    material_id = Column(Integer, ForeignKey("packaging_materials.id"), nullable=True)
    material_name = Column(String(150), nullable=False)
    material_structure = Column(String(255), nullable=False)
    thickness_microns = Column(Integer, nullable=False)
    otr = Column(Float, nullable=False)
    wvtr = Column(Float, nullable=False)
    sealability = Column(String(50), nullable=False)
    gas_permeability = Column(String(50), nullable=False)
    map_suitability = Column(Boolean, default=False)
    
    estimated_cost_unit = Column(Float, nullable=False) # INR
    sustainability_score = Column(Float, nullable=False) # /100
    protection_score = Column(Float, nullable=False) # /100
    shelf_life_score = Column(Float, nullable=False) # /100
    compatibility_score = Column(Float, nullable=False) # /100
    overall_score = Column(Float, nullable=False) # /100
    
    why_points_json = Column(JSON, default=list) # List of bullet strings explaining selection
    what_would_change_json = Column(JSON, default=list) # List of conditional triggers
    risks_json = Column(JSON, default=list) # List of {risk, probability, reason, mitigation}

    analysis = relationship("Analysis", back_populates="recommendations")


class CostEstimate(Base):
    __tablename__ = "cost_estimates"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    quantity = Column(Integer, default=10000)
    package_width_cm = Column(Float, default=15.0)
    package_length_cm = Column(Float, default=20.0)
    package_height_cm = Column(Float, default=5.0)
    unit_cost_current = Column(Float, default=3.50)
    unit_cost_recommended = Column(Float, default=2.85)
    total_cost_current = Column(Float, default=35000.0)
    total_cost_recommended = Column(Float, default=28500.0)
    cost_savings_pct = Column(Float, default=18.57)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", back_populates="cost_estimate")


class SustainabilityScore(Base):
    __tablename__ = "sustainability_scores"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("packaging_materials.id"), nullable=True)
    recyclability_pct = Column(Float, default=80.0)
    carbon_saved_kg = Column(Float, default=124.5)
    plastic_reduction_pct = Column(Float, default=35.0)
    environmental_rating = Column(String(10), default="A-")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("Analysis", back_populates="sustainability_score")
