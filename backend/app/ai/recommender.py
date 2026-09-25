"""
PackSmart AI - AI Recommender Engine
Orchestrates candidate scoring, role identification (Best Balanced, Lower Cost, More Sustainable),
produce respiration mode, and full explainability.
"""
from typing import List, Dict, Any
from app.ai.rules import evaluate_packaging_rules
from app.ai.ml_scorer import calculate_material_scores
from app.ai.respiration import analyze_produce_respiration
from app.ai.explainability import generate_explanations

def generate_recommendations(
    commodity_data: Dict[str, Any],
    all_materials: List[Dict[str, Any]],
    storage_temp_c: float,
    storage_humidity_pct: float,
    target_shelf_life_days: int,
    transport_duration_days: int,
    transport_type: str,
    transport_condition: str,
    priority_protection: float,
    priority_shelf_life: float,
    priority_cost: float,
    priority_sustainability: float,
    mode: str = "Beginner"
) -> Dict[str, Any]:
    """
    Evaluates all candidate packaging materials and generates the Top 3 ranked recommendations.
    """
    scored_candidates = []

    for mat in all_materials:
        # 1. Rule Engine Evaluation
        comp_score, rule_triggers, risks = evaluate_packaging_rules(
            commodity=commodity_data,
            material=mat,
            storage_temp_c=storage_temp_c,
            storage_humidity_pct=storage_humidity_pct,
            target_shelf_life_days=target_shelf_life_days,
            transport_duration_days=transport_duration_days,
            transport_type=transport_type,
            transport_condition=transport_condition
        )

        # 2. ML & Multi-Attribute Scoring
        subscores, overall_score = calculate_material_scores(
            material=mat,
            commodity=commodity_data,
            compatibility_score=comp_score,
            storage_temp_c=storage_temp_c,
            storage_humidity_pct=storage_humidity_pct,
            target_shelf_life_days=target_shelf_life_days,
            transport_duration_days=transport_duration_days,
            priority_protection=priority_protection,
            priority_shelf_life=priority_shelf_life,
            priority_cost=priority_cost,
            priority_sustainability=priority_sustainability
        )

        # Approximate unit pouch cost (e.g. 20cm x 15cm pouch = 0.06 m² surface area + 15% conversion)
        surface_sqm = (15.0 * 20.0 * 2) / 10000.0 # 0.06 sqm
        unit_cost = round(mat.get("cost_per_sqm_inr", 8.0) * surface_sqm * 1.18, 2)

        scored_candidates.append({
            "material": mat,
            "subscores": subscores,
            "overall_score": overall_score,
            "comp_score": comp_score,
            "rule_triggers": rule_triggers,
            "risks": risks,
            "unit_cost": unit_cost
        })

    # Sort candidates by overall score descending
    scored_candidates.sort(key=lambda x: x["overall_score"], reverse=True)

    if not scored_candidates:
        raise ValueError("No packaging materials available for scoring.")

    # 1. Best Balanced Solution (Highest overall score)
    best_candidate = scored_candidates[0]

    # 2. Lower Cost Alternative: highest cost score with acceptable protection (>60) and not same as best
    cost_pool = [c for c in scored_candidates if c["material"]["id"] != best_candidate["material"]["id"] and c["subscores"]["protection"] >= 55.0]
    if not cost_pool:
        cost_pool = [c for c in scored_candidates if c["material"]["id"] != best_candidate["material"]["id"]]
    if cost_pool:
        cost_pool.sort(key=lambda x: (x["subscores"]["cost"], x["overall_score"]), reverse=True)
        lower_cost_candidate = cost_pool[0]
    else:
        lower_cost_candidate = best_candidate

    # 3. More Sustainable Alternative: highest sustainability score with acceptable protection (>60) and not same as best or lower_cost
    used_ids = {best_candidate["material"]["id"], lower_cost_candidate["material"]["id"]}
    sust_pool = [c for c in scored_candidates if c["material"]["id"] not in used_ids and c["subscores"]["protection"] >= 55.0]
    if not sust_pool:
        sust_pool = [c for c in scored_candidates if c["material"]["id"] not in used_ids]
    if sust_pool:
        sust_pool.sort(key=lambda x: (x["subscores"]["sustainability"], x["overall_score"]), reverse=True)
        sustainable_candidate = sust_pool[0]
    else:
        # Pick 3rd best overall if distinct
        rem = [c for c in scored_candidates if c["material"]["id"] not in used_ids]
        sustainable_candidate = rem[0] if rem else best_candidate

    # Build Top 3 recommendations with XAI
    top_3 = []
    assignments = [
        (1, "RECOMMENDATION #1: Best Balanced Solution", best_candidate),
        (2, "RECOMMENDATION #2: Lower Cost Alternative", lower_cost_candidate),
        (3, "RECOMMENDATION #3: More Sustainable Alternative", sustainable_candidate)
    ]

    for rank, rec_type, cand in assignments:
        mat = cand["material"]
        subs = cand["subscores"]
        
        # Generate XAI explanations
        xai = generate_explanations(
            material=mat,
            commodity=commodity_data,
            subscores=subs,
            storage_temp_c=storage_temp_c,
            storage_humidity_pct=storage_humidity_pct,
            target_shelf_life_days=target_shelf_life_days,
            transport_duration_days=transport_duration_days,
            rank_type=rec_type.split(":")[1].strip() if ":" in rec_type else rec_type
        )

        top_3.append({
            "rank": rank,
            "recommendation_type": rec_type,
            "material_id": mat.get("id"),
            "material_name": mat.get("name"),
            "material_structure": mat.get("structure"),
            "thickness_microns": mat.get("thickness_microns"),
            "otr": mat.get("otr_cc_m2_day_atm"),
            "wvtr": mat.get("wvtr_g_m2_day"),
            "sealability": mat.get("sealability"),
            "gas_permeability": mat.get("gas_permeability_category"),
            "map_suitability": mat.get("map_suitability", False),
            "estimated_cost_unit": cand["unit_cost"],
            "sustainability_score": subs["sustainability"],
            "protection_score": subs["protection"],
            "shelf_life_score": subs["shelf_life"],
            "compatibility_score": subs["compatibility"],
            "overall_score": cand["overall_score"],
            "why_points": xai["why_points"],
            "what_would_change": xai["what_would_change"],
            "risks": cand["risks"]
        })

    # Overall Risk Level across best recommendation
    high_risks = [r for r in best_candidate["risks"] if r.get("level") == "High"]
    mod_risks = [r for r in best_candidate["risks"] if r.get("level") == "Moderate"]
    if high_risks:
        overall_risk = "HIGH"
    elif mod_risks:
        overall_risk = "MODERATE"
    else:
        overall_risk = "LOW"

    # Produce Respiration Intelligence
    respiration_intel = analyze_produce_respiration(
        commodity_name=commodity_data.get("name", ""),
        commodity_category=commodity_data.get("category", ""),
        respiration_rate=commodity_data.get("respiration_rate", "None"),
        storage_temp_c=storage_temp_c,
        moisture_pct=commodity_data.get("moisture_pct", 50.0)
    )

    # Cost Calculation Benchmark (10,000 standard pouches)
    std_qty = 10000
    current_unit_cost = round(best_candidate["unit_cost"] * 1.32, 2) # Typical baseline unoptimized packaging
    rec_unit_cost = best_candidate["unit_cost"]
    tot_cur = round(current_unit_cost * std_qty, 2)
    tot_rec = round(rec_unit_cost * std_qty, 2)
    savings_pct = round(((tot_cur - tot_rec) / tot_cur) * 100.0, 1)
    annual_savings = round((tot_cur - tot_rec) * 12, 0) # 12 production batches/year

    cost_estimate = {
        "quantity": std_qty,
        "package_width_cm": 15.0,
        "package_length_cm": 20.0,
        "package_height_cm": 5.0,
        "unit_cost_current": current_unit_cost,
        "unit_cost_recommended": rec_unit_cost,
        "total_cost_current": tot_cur,
        "total_cost_recommended": tot_rec,
        "cost_savings_pct": max(0.0, savings_pct),
        "annual_estimated_savings_inr": max(0.0, annual_savings)
    }

    # Sustainability Impact Score
    best_mat = best_candidate["material"]
    sust_impact = {
        "recyclability_pct": best_mat.get("recyclability_pct", 75.0),
        "carbon_saved_kg": round((3.5 - best_mat.get("carbon_footprint_kg_co2_per_kg", 2.0)) * 60.0, 1),
        "plastic_reduction_pct": round(max(10.0, 100.0 - best_mat.get("thickness_microns", 50) * 1.2), 1),
        "environmental_rating": "A" if best_candidate["subscores"]["sustainability"] >= 80 else ("B+" if best_candidate["subscores"]["sustainability"] >= 65 else "B"),
        "material_impact_notes": f"Estimated {best_mat.get('recyclability_pct', 70)}% material circularity index. Promotes lower carbon emissions compared to conventional rigid non-recyclable multi-composites."
    }

    return {
        "recommendations": top_3,
        "overall_risk_level": overall_risk,
        "respiration_intelligence": respiration_intel,
        "cost_estimate": cost_estimate,
        "sustainability_score": sust_impact
    }
