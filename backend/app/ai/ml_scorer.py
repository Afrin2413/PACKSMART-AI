"""
PackSmart AI - ML & Multi-Attribute Scoring Engine
Combines Scikit-Learn regression/classification scoring with physics-based multi-objective optimization.
"""
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, Tuple

# Initialize and train lightweight ML model on packaging science dataset
class PackagingMLModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=35, random_state=42)
        self._train_baseline()

    def _train_baseline(self):
        # Synthetic feature matrix based on physical packaging equations:
        # Features: [moisture, fat, is_respiring, target_days, temp_c, humidity, log(otr), log(wvtr), thickness, cost_sqm, recyclability]
        # Target: [suitability_index (0-100)]
        X_train = np.array([
            # Tomato-like: high moisture (94), low fat (0.2), respiring (1), 10 days, 10C, 85% RH, log(8500)=9.0, log(22)=3.1, 30um, 4.5 INR, 85% rec
            [94.0, 0.2, 1.0, 10, 10.0, 85.0, 9.04, 3.09, 30, 4.5, 85.0],
            # Tomato with tight EVOH: log(2.5)=0.9, log(2.1)=0.7
            [94.0, 0.2, 1.0, 10, 10.0, 85.0, 0.91, 0.74, 65, 12.5, 40.0],
            # Biscuit: low moisture (3), high fat (18), non-respiring (0), 180 days, 22C, 50% RH, log(18)=2.9, log(0.8)=-0.2, 60um, 8.2 INR, 60% rec
            [3.0, 18.0, 0.0, 180, 22.0, 50.0, 2.89, -0.22, 60, 8.2, 60.0],
            # Biscuit with cheap LDPE: log(2800)=7.9, log(12)=2.5
            [3.0, 18.0, 0.0, 180, 22.0, 50.0, 7.93, 2.48, 45, 3.8, 90.0],
            # Meat: high moisture (74), fat (5), non-respiring (0), 7 days, 2C, 85% RH, log(2.5)=0.9, log(2.1)=0.7, 65um, 12.5 INR, 40% rec
            [74.0, 5.0, 0.0, 7, 2.0, 85.0, 0.91, 0.74, 65, 12.5, 40.0],
            # Coffee: low moisture (2), fat (15), non-respiring (0), 365 days, 20C, 50% RH, log(0.05)=-3.0, log(0.05)=-3.0, 70um, 16.0 INR, 15% rec
            [2.0, 15.0, 0.0, 365, 20.0, 50.0, -2.99, -2.99, 70, 16.0, 15.0],
            # Leafy Greens: high moisture (92), respiring (1), 5 days, 4C, 95% RH, log(8500)=9.0, log(22)=3.1, 30um, 4.5 INR, 85% rec
            [92.0, 0.4, 1.0, 5, 4.0, 95.0, 9.04, 3.09, 30, 4.5, 85.0],
            # Leafy Greens with barrier foil
            [92.0, 0.4, 1.0, 5, 4.0, 95.0, -2.99, -2.99, 70, 16.0, 15.0],
            # General Produce with PLA bio-film
            [90.0, 0.3, 1.0, 7, 6.0, 85.0, 6.1, 2.89, 35, 9.8, 95.0],
            # Dry Rice: low moisture (12), non-respiring (0), 365 days, 22C, 60% RH, log(75)=4.3, log(3.2)=1.16, 52um, 7.5 INR, 55% rec
            [12.0, 0.8, 0.0, 365, 22.0, 60.0, 4.31, 1.16, 52, 7.5, 55.0]
        ])
        y_train = np.array([92.0, 45.0, 94.0, 38.0, 95.0, 98.0, 95.0, 30.0, 88.0, 86.0])
        self.model.fit(X_train, y_train)

    def predict_suitability(self, feature_vector: list) -> float:
        try:
            val = float(self.model.predict([feature_vector])[0])
            return max(10.0, min(100.0, val))
        except Exception:
            return 75.0

ml_engine = PackagingMLModel()

def calculate_material_scores(
    material: Dict[str, Any],
    commodity: Dict[str, Any],
    compatibility_score: float,
    storage_temp_c: float,
    storage_humidity_pct: float,
    target_shelf_life_days: int,
    transport_duration_days: int,
    priority_protection: float,
    priority_shelf_life: float,
    priority_cost: float,
    priority_sustainability: float
) -> Tuple[Dict[str, float], float]:
    """
    Computes all component subscores and the overall multi-objective optimized score.
    """
    moisture = commodity.get("moisture_pct", 50.0)
    fat = commodity.get("fat_pct", 5.0)
    respiration = commodity.get("respiration_rate", "None")
    is_respiring = 1.0 if respiration in ["Medium", "High", "Very High"] else 0.0

    otr = max(0.01, float(material.get("otr_cc_m2_day_atm", 100.0)))
    wvtr = max(0.01, float(material.get("wvtr_g_m2_day", 10.0)))
    thickness = float(material.get("thickness_microns", 50))
    cost_sqm = float(material.get("cost_per_sqm_inr", 8.0))
    recyclability = float(material.get("recyclability_pct", 50.0))
    carbon_footprint = float(material.get("carbon_footprint_kg_co2_per_kg", 2.5))
    base_protection = float(material.get("protection_score_base", 75.0))
    base_sustainability = float(material.get("sustainability_score_base", 70.0))

    # 1. Protection Score (0 - 100)
    prot = base_protection
    # Respiration handling
    if is_respiring:
        if otr > 3000:
            prot += 15.0
        elif otr < 500:
            prot -= 35.0
    else:
        # Non-respiring: lower OTR is better for fat/oxygen
        if fat > 10.0:
            if otr < 20.0:
                prot += 12.0
            elif otr > 1000.0:
                prot -= 25.0
        if moisture < 15.0:
            if wvtr < 1.5:
                prot += 10.0
            elif wvtr > 8.0:
                prot -= 20.0
    
    if material.get("sealability") == "Excellent":
        prot += 6.0
    if material.get("puncture_resistance") == "Excellent":
        prot += 5.0
    protection_score = max(20.0, min(99.0, prot))

    # 2. Shelf Life Score (0 - 100)
    # Evaluates how well the material guarantees the target shelf life
    if is_respiring:
        if otr > 3000:
            shelf_score = 90.0 + min(8.0, target_shelf_life_days * 0.5)
        else:
            shelf_score = 35.0 # asphyxiation risk
    else:
        if target_shelf_life_days > 90:
            if otr < 5.0 and wvtr < 1.0:
                shelf_score = 95.0
            elif otr < 50.0 and wvtr < 3.0:
                shelf_score = 85.0
            else:
                shelf_score = 45.0
        elif target_shelf_life_days > 30:
            if otr < 100.0 and wvtr < 5.0:
                shelf_score = 90.0
            else:
                shelf_score = 65.0
        else:
            shelf_score = 85.0
    shelf_life_score = max(25.0, min(99.0, shelf_score))

    # 3. Cost Score (0 - 100) - Lower cost = Higher score
    # Normalize across INR 3/sqm (score 98) to INR 20/sqm (score 40)
    cost_score = max(35.0, min(98.0, 108.0 - (cost_sqm * 3.4)))

    # 4. Sustainability Score (0 - 100)
    sust = base_sustainability * 0.4 + recyclability * 0.4 + max(0.0, (5.0 - carbon_footprint) * 6.0)
    sustainability_score = max(30.0, min(98.0, sust))

    # 5. ML Model Feature Vector evaluation
    features = [
        moisture, fat, is_respiring, target_shelf_life_days,
        storage_temp_c, storage_humidity_pct,
        float(np.log(otr)), float(np.log(wvtr)),
        thickness, cost_sqm, recyclability
    ]
    ml_suitability = ml_engine.predict_suitability(features)

    # Blend ML prediction with physics compatibility
    blended_compatibility = 0.6 * compatibility_score + 0.4 * ml_suitability

    # 6. Multi-Objective Weighted Overall Score
    # Normalize priority weights to sum to 0.90 (leaving 0.10 for direct compatibility)
    total_p = priority_protection + priority_shelf_life + priority_cost + priority_sustainability
    if total_p <= 0:
        total_p = 1.0
    wp = (priority_protection / total_p) * 0.90
    wsl = (priority_shelf_life / total_p) * 0.90
    wc = (priority_cost / total_p) * 0.90
    ws = (priority_sustainability / total_p) * 0.90
    wcomp = 0.10

    overall = (
        wp * protection_score +
        wsl * shelf_life_score +
        wc * cost_score +
        ws * sustainability_score +
        wcomp * blended_compatibility
    )

    subscores = {
        "protection": round(protection_score, 1),
        "shelf_life": round(shelf_life_score, 1),
        "cost": round(cost_score, 1),
        "sustainability": round(sustainability_score, 1),
        "compatibility": round(blended_compatibility, 1)
    }

    return subscores, round(overall, 1)
