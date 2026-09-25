from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import PackagingMaterial
from app.schemas.schemas import CostCalculatorRequest

router = APIRouter(prefix="/cost-estimate", tags=["Cost Calculator"])

@router.post("")
def calculate_packaging_cost(payload: CostCalculatorRequest, db: Session = Depends(get_db)):
    # Calculate surface area per pouch in square meters (including 15% seam/trim scrap allowance)
    # Area for 3-side seal pouch or pillow pouch = 2 * (W * L) / 10000 m2 * 1.15
    width_m = payload.package_width_cm / 100.0
    length_m = payload.package_length_cm / 100.0
    height_m = payload.package_height_cm / 100.0
    
    # Surface area in square meters
    sqm_per_unit = (2.0 * width_m * length_m + 2.0 * width_m * height_m) * 1.15
    
    # 1. Fetch materials or use defaults
    current_mat = None
    if payload.current_material_id:
        current_mat = db.query(PackagingMaterial).filter(PackagingMaterial.id == payload.current_material_id).first()
    
    rec_mat = None
    if payload.recommended_material_id:
        rec_mat = db.query(PackagingMaterial).filter(PackagingMaterial.id == payload.recommended_material_id).first()
    
    # Baseline fallback rates
    current_cost_sqm = payload.custom_current_cost_sqm or (current_mat.cost_per_sqm_inr if current_mat else 12.0)
    rec_cost_sqm = payload.custom_rec_cost_sqm or (rec_mat.cost_per_sqm_inr if rec_mat else 8.5)
    
    # Eco alternative (PLA or Paper laminate)
    eco_mat = db.query(PackagingMaterial).filter(PackagingMaterial.category.ilike("%paper%") | PackagingMaterial.category.ilike("%bio%")).first()
    eco_cost_sqm = eco_mat.cost_per_sqm_inr if eco_mat else 11.5

    # Converting & fabrication overhead (₹0.35 - ₹0.60 per pouch)
    converting_overhead = 0.45

    unit_cost_current = round((current_cost_sqm * sqm_per_unit) + converting_overhead, 2)
    unit_cost_rec = round((rec_cost_sqm * sqm_per_unit) + converting_overhead, 2)
    unit_cost_eco = round((eco_cost_sqm * sqm_per_unit) + converting_overhead, 2)

    total_current = round(unit_cost_current * payload.quantity, 2)
    total_rec = round(unit_cost_rec * payload.quantity, 2)
    total_eco = round(unit_cost_eco * payload.quantity, 2)

    cost_diff = round(total_current - total_rec, 2)
    savings_pct = round(((total_current - total_rec) / total_current) * 100.0, 1) if total_current > 0 else 0.0

    return {
        "quantity": payload.quantity,
        "package_dimensions": {
            "width_cm": payload.package_width_cm,
            "length_cm": payload.package_length_cm,
            "height_cm": payload.package_height_cm,
            "surface_area_sqm_unit": round(sqm_per_unit, 4)
        },
        "current_packaging": {
            "name": current_mat.name if current_mat else "Traditional Multilayer Coex",
            "cost_per_sqm_inr": current_cost_sqm,
            "unit_cost_inr": unit_cost_current,
            "total_cost_inr": total_current
        },
        "recommended_packaging": {
            "name": rec_mat.name if rec_mat else "Optimized High-Barrier Monomaterial",
            "cost_per_sqm_inr": rec_cost_sqm,
            "unit_cost_inr": unit_cost_rec,
            "total_cost_inr": total_rec
        },
        "eco_alternative": {
            "name": eco_mat.name if eco_mat else "Paper-based Recyclable Barrier",
            "cost_per_sqm_inr": eco_cost_sqm,
            "unit_cost_inr": unit_cost_eco,
            "total_cost_inr": total_eco
        },
        "savings_analysis": {
            "unit_savings_inr": round(unit_cost_current - unit_cost_rec, 2),
            "batch_savings_inr": max(0.0, cost_diff),
            "savings_percentage": max(0.0, savings_pct),
            "annualized_projected_savings_inr": max(0.0, round(cost_diff * 12, 2)),
            "cost_reduction_notes": f"Switching to optimized barrier film saves approximately ₹{max(0.0, cost_diff):,.2f} per {payload.quantity:,} unit production batch by eliminating over-engineered secondary foil layers while retaining essential moisture/oxygen protection."
        }
    }
