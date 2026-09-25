from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "Farmer"
    organization: Optional[str] = "AgriTech Labs"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None


# Commodity Schemas
class CommodityBase(BaseModel):
    name: str
    category: str
    moisture_pct: float
    fat_pct: float
    ph: float
    respiration_rate: str
    ideal_temp_c: float
    ideal_humidity_pct: float
    typical_shelf_life_days: int
    recommended_gas_ratio_o2: float = 0.0
    recommended_gas_ratio_co2: float = 0.0
    recommended_gas_ratio_n2: float = 100.0
    sensitivity_notes: Optional[str] = None

class CommodityCreate(CommodityBase):
    pass

class CommodityOut(CommodityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Material Schemas
class PackagingMaterialBase(BaseModel):
    name: str
    structure: str
    category: str
    thickness_microns: int
    otr_cc_m2_day_atm: float
    wvtr_g_m2_day: float
    gas_permeability_category: str
    sealability: str
    puncture_resistance: str
    map_suitability: bool = False
    recyclability_pct: float = 50.0
    carbon_footprint_kg_co2_per_kg: float = 2.5
    cost_per_sqm_inr: float
    sustainability_score_base: float = 70.0
    protection_score_base: float = 80.0
    min_temp_c: float = -10.0
    max_temp_c: float = 70.0
    key_features: Optional[str] = None
    ideal_for: Optional[str] = None
    is_custom: bool = False

class PackagingMaterialCreate(PackagingMaterialBase):
    pass

class PackagingMaterialOut(PackagingMaterialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Analysis & Recommendation Schemas
class AnalysisCreate(BaseModel):
    commodity_name: str
    commodity_category: str = "Fruits"
    moisture_pct: float = Field(..., ge=0, le=100)
    fat_pct: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=1, le=14)
    respiration_rate: str = "None" # None, Low, Medium, High, Very High
    
    target_shelf_life_days: int = Field(..., ge=1, le=1000)
    storage_temp_c: float = Field(..., ge=-30, le=60)
    storage_humidity_pct: float = Field(..., ge=5, le=100)
    
    transport_duration_days: int = Field(default=2, ge=0, le=60)
    transport_type: str = "Road" # Local, Road, Cold Chain, Long Distance
    transport_condition: str = "Normal" # Normal, Humid, High Temperature, Refrigerated
    
    priority_protection: float = Field(default=0.35, ge=0.0, le=1.0)
    priority_shelf_life: float = Field(default=0.25, ge=0.0, le=1.0)
    priority_cost: float = Field(default=0.20, ge=0.0, le=1.0)
    priority_sustainability: float = Field(default=0.20, ge=0.0, le=1.0)
    
    mode: str = "Beginner" # Beginner, Expert

class RiskItem(BaseModel):
    risk: str
    level: str # Low, Moderate, High
    probability_pct: int
    reason: str
    mitigation: str

class RecommendationOut(BaseModel):
    id: Optional[int] = None
    rank: int
    recommendation_type: str # "Best Balanced Solution", "Lower Cost Alternative", "More Sustainable Alternative"
    material_id: Optional[int] = None
    material_name: str
    material_structure: str
    thickness_microns: int
    otr: float
    wvtr: float
    sealability: str
    gas_permeability: str
    map_suitability: bool
    estimated_cost_unit: float
    sustainability_score: float
    protection_score: float
    shelf_life_score: float
    compatibility_score: float
    overall_score: float
    why_points: List[str]
    what_would_change: List[str]
    risks: List[RiskItem]

    class Config:
        from_attributes = True

class RespirationIntelligence(BaseModel):
    respiration_level: str
    o2_permeability_target: str
    co2_flush_tolerance: str
    micro_perforation_needed: bool
    micro_perforation_spec: Optional[str]
    anti_fog_recommended: bool
    map_gas_mix: Dict[str, float]
    advisory_notes: str

class CostEstimateOut(BaseModel):
    quantity: int
    package_width_cm: float
    package_length_cm: float
    package_height_cm: float
    unit_cost_current: float
    unit_cost_recommended: float
    total_cost_current: float
    total_cost_recommended: float
    cost_savings_pct: float
    annual_estimated_savings_inr: float

class SustainabilityScoreOut(BaseModel):
    recyclability_pct: float
    carbon_saved_kg: float
    plastic_reduction_pct: float
    environmental_rating: str
    material_impact_notes: str

class AnalysisDetailOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    commodity_name: str
    commodity_category: str
    moisture_pct: float
    fat_pct: float
    ph: float
    respiration_rate: str
    target_shelf_life_days: int
    storage_temp_c: float
    storage_humidity_pct: float
    transport_duration_days: int
    transport_type: str
    transport_condition: str
    priority_protection: float
    priority_shelf_life: float
    priority_cost: float
    priority_sustainability: float
    mode: str
    overall_risk_level: str
    status: str
    created_at: datetime
    
    recommendations: List[RecommendationOut]
    respiration_intelligence: Optional[RespirationIntelligence] = None
    cost_estimate: Optional[CostEstimateOut] = None
    sustainability_score: Optional[SustainabilityScoreOut] = None

    class Config:
        from_attributes = True

class AnalysisListItem(BaseModel):
    id: int
    date: datetime
    commodity: str
    category: str
    recommended_material: str
    shelf_life_days: int
    cost_inr: float
    sustainability_score: float
    risk_level: str
    status: str

# Cost Calculator
class CostCalculatorRequest(BaseModel):
    quantity: int = Field(default=10000, ge=100)
    package_width_cm: float = Field(default=15.0, ge=2)
    package_length_cm: float = Field(default=20.0, ge=2)
    package_height_cm: float = Field(default=5.0, ge=0)
    current_material_id: Optional[int] = None
    recommended_material_id: Optional[int] = None
    custom_current_cost_sqm: Optional[float] = None
    custom_rec_cost_sqm: Optional[float] = None

# Shelf Life Simulation
class SimulationRequest(BaseModel):
    commodity_name: str
    current_material_name: Optional[str] = "LDPE Standard Monolayer Film"
    recommended_material_name: Optional[str] = "EVOH High-Barrier Multilayer Film"
    temperature_c: float = 8.0
    humidity_pct: float = 85.0
    target_days: int = 14
    moisture_pct: float = 90.0
    fat_pct: float = 1.0
    respiration_rate: str = "High"

class SimulationDayPoint(BaseModel):
    day: int
    current_quality_pct: float
    recommended_quality_pct: float
    spoilage_threshold: float = 60.0
    current_microbial_log: float
    recommended_microbial_log: float

class SimulationResultOut(BaseModel):
    days: List[SimulationDayPoint]
    current_shelf_life_days: int
    recommended_shelf_life_days: int
    shelf_life_extension_pct: float
    primary_failure_mode: str
    simulation_notes: str

# Compare Request & Output
class CompareRequest(BaseModel):
    material_ids: List[int]

class MaterialComparisonCard(BaseModel):
    material: PackagingMaterialOut
    estimated_unit_cost: float
    protection_score: float
    shelf_life_index: float
    sustainability_rating: str
    suitability_summary: str

class CompareResultOut(BaseModel):
    materials: List[MaterialComparisonCard]
    radar_metrics: List[Dict[str, Any]]
    bar_chart_data: List[Dict[str, Any]]

# Dashboard Summary
class DashboardSummaryOut(BaseModel):
    analyses_completed: int
    avg_shelf_life_improvement_pct: float
    potential_cost_saving_inr: float
    avg_sustainability_score: float
    recent_analyses: List[AnalysisListItem]
    top_recommended_materials: List[Dict[str, Any]]
    active_risk_alerts: List[Dict[str, Any]]
    category_distribution: List[Dict[str, Any]]
    monthly_trend: List[Dict[str, Any]]
