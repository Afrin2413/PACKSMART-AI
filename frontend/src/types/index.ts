export type UserRole = 'Farmer' | 'Startup' | 'Business' | 'Researcher' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  created_at: string;
}

export interface Commodity {
  id: number;
  name: string;
  category: string;
  moisture_pct: number;
  fat_pct: number;
  ph: number;
  respiration_rate: string;
  ideal_temp_c: number;
  ideal_humidity_pct: number;
  typical_shelf_life_days: number;
  recommended_gas_ratio_o2: number;
  recommended_gas_ratio_co2: number;
  recommended_gas_ratio_n2: number;
  sensitivity_notes?: string;
  created_at: string;
}

export interface PackagingMaterial {
  id: number;
  name: string;
  structure: string;
  category: string;
  thickness_microns: number;
  otr_cc_m2_day_atm: number;
  wvtr_g_m2_day: number;
  gas_permeability_category: string;
  sealability: string;
  puncture_resistance: string;
  map_suitability: boolean;
  recyclability_pct: number;
  carbon_footprint_kg_co2_per_kg: number;
  cost_per_sqm_inr: number;
  sustainability_score_base: number;
  protection_score_base: number;
  min_temp_c: number;
  max_temp_c: number;
  key_features?: string;
  ideal_for?: string;
  is_custom?: boolean;
}

export interface RiskItem {
  risk: string;
  level: 'Low' | 'Moderate' | 'High';
  probability_pct: number;
  reason: string;
  mitigation: string;
}

export interface Recommendation {
  id?: number;
  rank: number;
  recommendation_type: string;
  material_id?: number;
  material_name: string;
  material_structure: string;
  thickness_microns: number;
  otr: number;
  wvtr: number;
  sealability: string;
  gas_permeability: string;
  map_suitability: boolean;
  estimated_cost_unit: number;
  sustainability_score: number;
  protection_score: number;
  shelf_life_score: number;
  compatibility_score: number;
  overall_score: number;
  why_points: string[];
  what_would_change: string[];
  risks: RiskItem[];
}

export interface RespirationIntelligence {
  respiration_level: string;
  o2_permeability_target: string;
  co2_flush_tolerance: string;
  micro_perforation_needed: boolean;
  micro_perforation_spec?: string;
  anti_fog_recommended: boolean;
  map_gas_mix: {
    o2_pct: number;
    co2_pct: number;
    n2_pct: number;
  };
  advisory_notes: string;
}

export interface CostEstimate {
  quantity: number;
  package_width_cm: number;
  package_length_cm: number;
  package_height_cm: number;
  unit_cost_current: number;
  unit_cost_recommended: number;
  total_cost_current: number;
  total_cost_recommended: number;
  cost_savings_pct: number;
  annual_estimated_savings_inr: number;
}

export interface SustainabilityScore {
  recyclability_pct: number;
  carbon_saved_kg: number;
  plastic_reduction_pct: number;
  environmental_rating: string;
  material_impact_notes: string;
}

export interface AnalysisDetail {
  id: number;
  user_id?: number;
  commodity_name: string;
  commodity_category: string;
  moisture_pct: number;
  fat_pct: number;
  ph: number;
  respiration_rate: string;
  target_shelf_life_days: number;
  storage_temp_c: number;
  storage_humidity_pct: number;
  transport_duration_days: number;
  transport_type: string;
  transport_condition: string;
  priority_protection: number;
  priority_shelf_life: number;
  priority_cost: number;
  priority_sustainability: number;
  mode: string;
  overall_risk_level: string;
  status: string;
  created_at: string;
  recommendations: Recommendation[];
  respiration_intelligence?: RespirationIntelligence;
  cost_estimate?: CostEstimate;
  sustainability_score?: SustainabilityScore;
}

export interface AnalysisListItem {
  id: number;
  date: string;
  commodity: string;
  category: string;
  recommended_material: string;
  shelf_life_days: number;
  cost_inr: number;
  sustainability_score: number;
  risk_level: string;
  status: string;
}

export interface SimulationDayPoint {
  day: number;
  current_quality_pct: number;
  recommended_quality_pct: number;
  spoilage_threshold: number;
  current_microbial_log: number;
  recommended_microbial_log: number;
}

export interface SimulationResult {
  days: SimulationDayPoint[];
  current_shelf_life_days: number;
  recommended_shelf_life_days: number;
  shelf_life_extension_pct: number;
  primary_failure_mode: string;
  simulation_notes: string;
}

export interface DashboardSummary {
  analyses_completed: number;
  avg_shelf_life_improvement_pct: number;
  potential_cost_saving_inr: number;
  avg_sustainability_score: number;
  recent_analyses: AnalysisListItem[];
  top_recommended_materials: { name: string; count: number }[];
  active_risk_alerts: {
    id: number;
    commodity: string;
    risk_type: string;
    severity: string;
    message: string;
    action: string;
  }[];
  category_distribution: { name: string; value: number }[];
  monthly_trend: { month: string; analyses: number; savings: number; sust_score: number }[];
}
