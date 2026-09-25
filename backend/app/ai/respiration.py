"""
PackSmart AI - Respiration Intelligence Engine
Specialized post-harvest physiology and Modified Atmosphere Packaging (MAP) rules for fresh produce.
"""
from typing import Dict, Any, Optional

def analyze_produce_respiration(
    commodity_name: str,
    commodity_category: str,
    respiration_rate: str,
    storage_temp_c: float,
    moisture_pct: float
) -> Optional[Dict[str, Any]]:
    """
    Computes respiration parameters, target gas equilibrium, perforation needs, and anti-fog recommendations.
    """
    is_produce = (
        commodity_category.lower() in ["fruits", "vegetables", "fresh produce"] or
        respiration_rate.lower() in ["medium", "high", "very high"]
    )
    
    if not is_produce and respiration_rate.lower() in ["none", "low"]:
        return None

    # Respiration rates at typical temperatures (mg CO2 / kg-hr)
    respiration_values = {
        "Very High": "40 - 80 mg CO₂/kg·h (Extremely Active Metabolism)",
        "High": "20 - 40 mg CO₂/kg·h (High Metabolic Activity)",
        "Medium": "10 - 20 mg CO₂/kg·h (Moderate Respiration)",
        "Low": "5 - 10 mg CO₂/kg·h (Slow Respiration)",
        "None": "Non-respiring food matrix"
    }
    
    resp_desc = respiration_values.get(respiration_rate, "Active Metabolism")

    # Gas mixes for MAP
    if commodity_name.lower() in ["tomato", "tomatoes"]:
        o2_target = 3.0
        co2_target = 5.0
        n2_target = 92.0
        micro_perf = True
        perf_spec = "45 - 60 micro-holes per m² (120μm diameter)"
        anti_fog = True
        target_otr = "3,000 - 8,500 cc/m²·day·atm"
        notes = "Tomatoes are sensitive to CO₂ injury (>6% CO₂) and chilling injury (<7°C). Regulated OTR keeps atmosphere above 2% O2 to avoid fermentation."
    elif "spinach" in commodity_name.lower() or "leafy" in commodity_name.lower() or "lettuce" in commodity_name.lower():
        o2_target = 3.0
        co2_target = 8.0
        n2_target = 89.0
        micro_perf = True
        perf_spec = "80 - 120 micro-holes per m² (150μm diameter)"
        anti_fog = True
        target_otr = "6,000 - 12,000 cc/m²·day·atm"
        notes = "Extremely high surface area and transpiration rate. High micro-perforation density is required to prevent anaerobic yellowing and sour odour accumulation."
    elif "mushroom" in commodity_name.lower():
        o2_target = 3.0
        co2_target = 10.0
        n2_target = 87.0
        micro_perf = True
        perf_spec = "90 - 140 micro-holes per m² (180μm diameter)"
        anti_fog = True
        target_otr = "8,000 - 15,000 cc/m²·day·atm"
        notes = "Mushrooms have one of the highest respiration rates. Impermeable films cause rapid blackening of gills and slime production within 48 hours."
    elif "strawberr" in commodity_name.lower() or "berr" in commodity_name.lower():
        o2_target = 3.0
        co2_target = 12.0
        n2_target = 85.0
        micro_perf = True
        perf_spec = "50 - 75 micro-holes per m² (130μm diameter)"
        anti_fog = True
        target_otr = "4,000 - 9,000 cc/m²·day·atm"
        notes = "Elevated CO2 (10-15%) strongly suppresses Botrytis cinerea (grey mould) mycelial development."
    elif "apple" in commodity_name.lower():
        o2_target = 2.0
        co2_target = 6.0
        n2_target = 92.0
        micro_perf = False
        perf_spec = "Selective micro-perforations only for sliced cuts (20 holes/m²)"
        anti_fog = True
        target_otr = "1,500 - 3,500 cc/m²·day·atm"
        notes = "Moderate respiration. Low O2 inhibits polyphenol oxidase (enzymatic browning) in fresh-cut slices."
    else:
        # Default fresh produce profile
        o2_target = 3.0 if respiration_rate in ["High", "Very High"] else 5.0
        co2_target = 5.0 if respiration_rate in ["High", "Very High"] else 3.0
        n2_target = 100.0 - (o2_target + co2_target)
        micro_perf = respiration_rate in ["High", "Very High"]
        perf_spec = "40 - 80 micro-holes per m² (120-150μm)" if micro_perf else "Standard permeable polymer"
        anti_fog = moisture_pct > 80.0
        target_otr = "4,000 - 10,000 cc/m²·day·atm" if micro_perf else "1,000 - 3,000 cc/m²·day·atm"
        notes = f"Controlled respiration equilibrium balanced for {respiration_rate} respiration rate at {storage_temp_c}°C."

    return {
        "respiration_level": f"{respiration_rate} ({resp_desc})",
        "o2_permeability_target": target_otr,
        "co2_flush_tolerance": f"Up to {co2_target}% CO₂ balance",
        "micro_perforation_needed": micro_perf,
        "micro_perforation_spec": perf_spec if micro_perf else "Not required for low/medium respiration produce",
        "anti_fog_recommended": anti_fog,
        "map_gas_mix": {
            "o2_pct": o2_target,
            "co2_pct": co2_target,
            "n2_pct": n2_target
        },
        "advisory_notes": notes
    }
