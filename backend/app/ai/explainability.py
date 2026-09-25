"""
PackSmart AI - Explainable AI (XAI) Generation Module
Provides clear transparent justification for material selection and counterfactual triggers.
"""
from typing import Dict, Any, List

def generate_explanations(
    material: Dict[str, Any],
    commodity: Dict[str, Any],
    subscores: Dict[str, float],
    storage_temp_c: float,
    storage_humidity_pct: float,
    target_shelf_life_days: int,
    transport_duration_days: int,
    rank_type: str
) -> Dict[str, List[str]]:
    """
    Generates structured XAI rationale points and 'What would change this recommendation' conditional triggers.
    """
    why_points = []
    what_would_change = []

    mat_name = material.get("name", "")
    structure = material.get("structure", "")
    otr = material.get("otr_cc_m2_day_atm", 100.0)
    wvtr = material.get("wvtr_g_m2_day", 10.0)
    cost = material.get("cost_per_sqm_inr", 5.0)
    recyclability = material.get("recyclability_pct", 50.0)
    sealability = material.get("sealability", "Good")
    
    moisture = commodity.get("moisture_pct", 50.0)
    fat = commodity.get("fat_pct", 5.0)
    respiration = commodity.get("respiration_rate", "None")

    # WHY THIS MATERIAL points
    if rank_type == "Best Balanced Solution":
        why_points.append(f"Optimal multi-objective equilibrium balancing protection ({subscores['protection']:.0f}/100) and shelf life ({subscores['shelf_life']:.0f}/100).")
    elif rank_type == "Lower Cost Alternative":
        why_points.append(f"Highly cost-effective selection (₹{cost:.2f}/m²), reducing unit packaging expenditure by over 20-35%.")
    elif rank_type == "More Sustainable Alternative":
        why_points.append(f"Eco-optimized formulation with {recyclability:.0f}% recyclability / bio-origin score ({subscores['sustainability']:.0f}/100).")

    # Barrier specific rationale
    if respiration in ["High", "Very High"] and ("Micro-perforated" in mat_name or "Breathable" in mat_name):
        why_points.append(f"Engineered gas transmission rate (OTR: {otr:,.0f} cc/m²/day) maintains active O₂/CO₂ equilibrium, preventing anaerobic off-flavours.")
    elif fat > 15.0 and otr < 50.0:
        why_points.append(f"Low oxygen permeability (OTR: {otr} cc/m²/day) halts free-radical lipid oxidation and rancidity in fatty matrix ({fat}% fat).")
    elif moisture < 10.0 and wvtr < 2.0:
        why_points.append(f"Ultra-low moisture permeability (WVTR: {wvtr} g/m²/day) preserves crispy brittle texture against ambient humidity.")
    elif moisture > 70.0 and wvtr < 3.0 and respiration in ["None", "Low"]:
        why_points.append(f"High moisture retention prevents dehydration and weight loss in wet food matrix.")

    if sealability in ["Good", "Excellent"]:
        why_points.append(f"{sealability} thermal seal integrity ensures gas hermeticity and prevents seam micro-channel leaks.")

    if material.get("map_suitability", False):
        why_points.append("Compatible with Modified Atmosphere Packaging (MAP) flushing technology.")

    why_points.append(f"Material structure ({structure}) reliably fulfills the target {target_shelf_life_days}-day shelf-life benchmark.")

    # WHAT WOULD CHANGE THIS RECOMMENDATION?
    if storage_humidity_pct < 85.0:
        what_would_change.append(f"If storage relative humidity increases above 85% RH, a stronger moisture barrier laminate (WVTR < 1.0 g/m²/day) would become essential.")
    else:
        what_would_change.append("If storage humidity drops to air-conditioned low humidity (<50% RH), a lighter gauge economical polymer could be safely used.")

    if storage_temp_c <= 15.0:
        what_would_change.append(f"If ambient storage temperature exceeds 28°C during warm retail transit, barrier degradation kinetics would necessitate an EVOH coex upgrade.")
    else:
        what_would_change.append("If maintained in a continuous cold chain (<4°C), respiration and oxidation rates decrease, allowing lighter lower-cost film options.")

    if target_shelf_life_days < 90:
        what_would_change.append(f"If target shelf life is extended beyond {target_shelf_life_days * 2} days, metallized or aluminium foil lamination will be prioritized for total light and oxygen blocking.")
    
    if transport_duration_days <= 3:
        what_would_change.append(f"If transport distance is extended to inter-state/export routes (>7 days road transit), higher puncture-resistant polyamide (BOPA) layers would be required.")

    return {
        "why_points": why_points[:6],
        "what_would_change": what_would_change[:4]
    }
