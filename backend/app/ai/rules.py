"""
PackSmart AI - Rule Engine for Food Packaging Science
Implements domain-specific packaging and food compatibility rules.
"""
from typing import Dict, Any, List, Tuple

def evaluate_packaging_rules(
    commodity: Dict[str, Any],
    material: Dict[str, Any],
    storage_temp_c: float,
    storage_humidity_pct: float,
    target_shelf_life_days: int,
    transport_duration_days: int,
    transport_type: str,
    transport_condition: str
) -> Tuple[float, List[str], List[Dict[str, Any]]]:
    """
    Evaluates rule compliance for a given food commodity and packaging material candidate.
    Returns:
      - compatibility_score (0 - 100)
      - rule_triggers (list of strings explaining applied rules)
      - identified_risks (list of risk dicts: {risk, level, probability_pct, reason, mitigation})
    """
    score = 85.0
    triggers = []
    risks = []

    moisture = commodity.get("moisture_pct", 50.0)
    fat = commodity.get("fat_pct", 5.0)
    ph = commodity.get("ph", 6.0)
    respiration = commodity.get("respiration_rate", "None")
    
    otr = material.get("otr_cc_m2_day_atm", 100.0)
    wvtr = material.get("wvtr_g_m2_day", 10.0)
    category = material.get("category", "")
    mat_name = material.get("name", "")
    sealability = material.get("sealability", "Good")
    puncture = material.get("puncture_resistance", "Good")
    is_map = material.get("map_suitability", False)
    min_temp = material.get("min_temp_c", -10)
    max_temp = material.get("max_temp_c", 70)

    # RULE 1: High Moisture Food (>70%)
    if moisture > 70.0:
        if respiration in ["High", "Very High"]:
            # Needs moisture retention without condensation
            if "Micro-perforated" in mat_name or "Breathable" in mat_name:
                score += 15.0
                triggers.append("High moisture + high respiration: Micro-perforation prevents anaerobic condensation.")
            elif wvtr < 1.0: # Too tight for respiring produce causes rot
                score -= 25.0
                risks.append({
                    "risk": "Produce Condensation & Anaerobic Decay",
                    "level": "High",
                    "probability_pct": 85,
                    "reason": f"Ultra-low WVTR ({wvtr} g/m²/day) traps respired water vapour, causing sweat condensation and rapid bacterial rot.",
                    "mitigation": "Switch to micro-perforated breathable film with anti-fog treatment."
                })
        else:
            # Wet non-respiring food (meat, dairy, wet processed)
            if wvtr <= 3.0:
                score += 12.0
                triggers.append("High moisture food protected by high water vapour barrier (WVTR < 3 g/m²/day).")
            else:
                score -= 15.0
                risks.append({
                    "risk": "Moisture Loss & Weight Loss",
                    "level": "Moderate",
                    "probability_pct": 60,
                    "reason": f"Higher WVTR ({wvtr} g/m²/day) will allow moisture migration, leading to product dehydration.",
                    "mitigation": "Increase barrier thickness or use multilayer coextruded barrier."
                })

    # RULE 2: Dry / Low Moisture Crisp Food (<10%)
    elif moisture < 10.0:
        if wvtr > 5.0:
            score -= 30.0
            risks.append({
                "risk": "Moisture Uptake & Soggy Texture",
                "level": "High",
                "probability_pct": 90,
                "reason": f"Dry crisp food absorbs ambient moisture rapidly through high WVTR film ({wvtr} g/m²/day).",
                "mitigation": "Use metallized BOPP or aluminium foil tri-laminate with WVTR < 1.0 g/m²/day."
            })
        else:
            score += 10.0
            triggers.append("Crispness preserved via low moisture transmission rate.")

    # RULE 3: High Fat Food (>15%)
    if fat > 15.0:
        if otr > 50.0:
            score -= 28.0
            risks.append({
                "risk": "Lipid Oxidation & Rancidity",
                "level": "High",
                "probability_pct": 80,
                "reason": f"High lipid content ({fat}%) oxidizes rapidly when exposed to oxygen permeating through film (OTR {otr} cc/m²/day).",
                "mitigation": "Adopt EVOH, metallized barrier, or foil laminate with O2 flushing."
            })
        else:
            score += 14.0
            triggers.append("High fat content shielded against rancidity by low OTR oxygen barrier.")

    # RULE 4: High Respiration Produce
    if respiration in ["High", "Very High"]:
        if otr < 500.0 and not ("Micro-perforated" in mat_name or "Breathable" in mat_name):
            score -= 35.0
            risks.append({
                "risk": "Fermentation & Off-Flavour Spoilage",
                "level": "High",
                "probability_pct": 95,
                "reason": f"Produce respiration depletes oxygen below 1% inside barrier film, triggering anaerobic fermentation and foul ethyl acetate off-odours.",
                "mitigation": "Use laser micro-perforated film engineered for target respiration rate."
            })
        elif "Micro-perforated" in mat_name or "Breathable" in mat_name:
            score += 20.0
            triggers.append("Respiration equilibrium maintained through active gas transmission.")

    # RULE 5: Target Shelf Life Longevity
    if target_shelf_life_days > 90:
        if "Monolayer" in mat_name or otr > 500.0 or wvtr > 10.0:
            score -= 25.0
            risks.append({
                "risk": "Premature Shelf-Life Degradation",
                "level": "Moderate",
                "probability_pct": 75,
                "reason": f"Target shelf life ({target_shelf_life_days} days) exceeds the barrier capability of monolayer/permeable films.",
                "mitigation": "Upgrade to multi-layer barrier or foil laminate structure."
            })
        elif "Foil" in mat_name or "EVOH" in mat_name or "Metallized" in mat_name:
            score += 15.0
            triggers.append(f"Long shelf-life requirement ({target_shelf_life_days} days) matched with high-grade barrier.")

    # RULE 6: High Storage Humidity (>80%)
    if storage_humidity_pct > 80.0:
        if "Paper" in mat_name and not "EVOH" in material.get("structure", ""):
            score -= 20.0
            risks.append({
                "risk": "Paper Substrate Softening & Tear",
                "level": "Moderate",
                "probability_pct": 65,
                "reason": f"Ambient relative humidity of {storage_humidity_pct}% can weaken standard paper fibers without external polymer coating.",
                "mitigation": "Ensure polymer extrusion coating or bio-PE sealant protection on outer paper face."
            })
        elif wvtr <= 2.5:
            score += 8.0
            triggers.append(f"High external humidity ({storage_humidity_pct}% RH) resisted by exterior moisture barrier.")

    # RULE 7: Temperature Extremes & Cold Chain
    if storage_temp_c < min_temp:
        score -= 25.0
        risks.append({
            "risk": "Cold Brittleness & Seal Fracturing",
            "level": "High",
            "probability_pct": 70,
            "reason": f"Storage temperature ({storage_temp_c}°C) is below the material flex-crack threshold ({min_temp}°C).",
            "mitigation": "Select frost-resistant nylon/LLDPE copolymer designed for deep sub-zero freezing."
        })
    elif storage_temp_c > max_temp:
        score -= 20.0
        risks.append({
            "risk": "Thermal Distortion & Barrier Degradation",
            "level": "Moderate",
            "probability_pct": 60,
            "reason": f"High storage temp ({storage_temp_c}°C) accelerates gas diffusion and weakens polymer seal seams.",
            "mitigation": "Use high heat-deflection polymers like PP or PET."
        })

    # RULE 8: Long Distance & Rough Transport
    if transport_type in ["Long Distance", "Road"] or transport_duration_days >= 5:
        if puncture in ["Fair", "Poor"]:
            score -= 15.0
            risks.append({
                "risk": "Vibration & Puncture Leaks in Transit",
                "level": "Moderate",
                "probability_pct": 55,
                "reason": f"Extended transit duration ({transport_duration_days} days) exposes flexible film to abrasion and pinholing.",
                "mitigation": "Increase film thickness by 15-20% or reinforce with biaxially oriented polyamide (BOPA)."
            })
        elif puncture == "Excellent":
            score += 10.0
            triggers.append("Superior puncture and flex-crack resistance protects goods during prolonged transit.")

    # Clamp compatibility score between 20 and 100
    final_score = max(20.0, min(100.0, score))
    return final_score, triggers, risks
