from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import PackagingMaterial
from app.schemas.schemas import CompareRequest, CompareResultOut, MaterialComparisonCard, PackagingMaterialOut

router = APIRouter(prefix="/compare", tags=["Material Comparison"])

@router.post("", response_model=CompareResultOut)
def compare_materials(payload: CompareRequest, db: Session = Depends(get_db)):
    if not payload.material_ids:
        # Default top 3 materials for comparison
        mats = db.query(PackagingMaterial).limit(3).all()
    else:
        mats = db.query(PackagingMaterial).filter(PackagingMaterial.id.in_(payload.material_ids)).all()

    if not mats:
        raise HTTPException(status_code=404, detail="No materials found for comparison.")

    cards = []
    radar_metrics = [
        {"metric": "Oxygen Barrier (1/OTR)", "fullMark": 100},
        {"metric": "Moisture Barrier (1/WVTR)", "fullMark": 100},
        {"metric": "Seal Strength", "fullMark": 100},
        {"metric": "Puncture Resistance", "fullMark": 100},
        {"metric": "Sustainability", "fullMark": 100},
        {"metric": "Cost Affordability", "fullMark": 100},
    ]

    bar_chart_data = []

    for m in mats:
        surface_sqm = 0.06
        unit_cost = round(m.cost_per_sqm_inr * surface_sqm * 1.18, 2)
        
        # Calculate normalized radar coordinates
        otr_score = max(20, min(100, int(105 - min(100, m.otr_cc_m2_day_atm * 0.015)))) if m.otr_cc_m2_day_atm > 50 else (98 if m.otr_cc_m2_day_atm < 5 else 90)
        wvtr_score = max(20, min(100, int(105 - min(100, m.wvtr_g_m2_day * 4.0))))
        seal_score = 95 if m.sealability == "Excellent" else (80 if m.sealability == "Good" else 60)
        punc_score = 95 if m.puncture_resistance == "Excellent" else (80 if m.puncture_resistance == "Good" else 60)
        sust_score = int(m.sustainability_score_base)
        affordability = max(25, min(100, int(105 - (m.cost_per_sqm_inr * 3.5))))

        cards.append(MaterialComparisonCard(
            material=PackagingMaterialOut.model_validate(m),
            estimated_unit_cost=unit_cost,
            protection_score=m.protection_score_base,
            shelf_life_index=round(m.protection_score_base * 0.95, 1),
            sustainability_rating="Grade A" if sust_score >= 80 else ("Grade B+" if sust_score >= 65 else "Grade B"),
            suitability_summary=m.key_features or m.ideal_for or "Versatile protective flexible laminate."
        ))

        # Add to radar metric dicts
        for rm in radar_metrics:
            key = m.name[:18]
            if rm["metric"] == "Oxygen Barrier (1/OTR)":
                rm[key] = otr_score
            elif rm["metric"] == "Moisture Barrier (1/WVTR)":
                rm[key] = wvtr_score
            elif rm["metric"] == "Seal Strength":
                rm[key] = seal_score
            elif rm["metric"] == "Puncture Resistance":
                rm[key] = punc_score
            elif rm["metric"] == "Sustainability":
                rm[key] = sust_score
            elif rm["metric"] == "Cost Affordability":
                rm[key] = affordability

        bar_chart_data.append({
            "name": m.name[:15],
            "cost_sqm": m.cost_per_sqm_inr,
            "unit_cost": unit_cost,
            "thickness": m.thickness_microns,
            "recyclability": m.recyclability_pct,
            "carbon_kg": m.carbon_footprint_kg_co2_per_kg,
            "otr": m.otr_cc_m2_day_atm,
            "wvtr": m.wvtr_g_m2_day
        })

    return CompareResultOut(
        materials=cards,
        radar_metrics=radar_metrics,
        bar_chart_data=bar_chart_data
    )
