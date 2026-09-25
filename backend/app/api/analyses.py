from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import (
    Analysis, Recommendation, CostEstimate, SustainabilityScore, PackagingMaterial, User
)
from app.schemas.schemas import (
    AnalysisCreate, AnalysisDetailOut, AnalysisListItem, RecommendationOut,
    CostEstimateOut, SustainabilityScoreOut, RespirationIntelligence
)
from app.services.auth_service import get_current_user
from app.ai.recommender import generate_recommendations
from app.ai.respiration import analyze_produce_respiration

router = APIRouter(prefix="/analyses", tags=["Analyses & Recommendation"])

@router.post("", response_model=AnalysisDetailOut, status_code=status.HTTP_201_CREATED)
def run_packaging_intelligence(
    payload: AnalysisCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Load candidate packaging materials from DB
    materials_db = db.query(PackagingMaterial).all()
    if not materials_db:
        raise HTTPException(status_code=500, detail="Packaging material database is empty.")

    mat_dicts = [
        {
            "id": m.id,
            "name": m.name,
            "structure": m.structure,
            "category": m.category,
            "thickness_microns": m.thickness_microns,
            "otr_cc_m2_day_atm": m.otr_cc_m2_day_atm,
            "wvtr_g_m2_day": m.wvtr_g_m2_day,
            "gas_permeability_category": m.gas_permeability_category,
            "sealability": m.sealability,
            "puncture_resistance": m.puncture_resistance,
            "map_suitability": m.map_suitability,
            "recyclability_pct": m.recyclability_pct,
            "carbon_footprint_kg_co2_per_kg": m.carbon_footprint_kg_co2_per_kg,
            "cost_per_sqm_inr": m.cost_per_sqm_inr,
            "sustainability_score_base": m.sustainability_score_base,
            "protection_score_base": m.protection_score_base,
            "min_temp_c": m.min_temp_c,
            "max_temp_c": m.max_temp_c,
        }
        for m in materials_db
    ]

    commodity_dict = {
        "name": payload.commodity_name,
        "category": payload.commodity_category,
        "moisture_pct": payload.moisture_pct,
        "fat_pct": payload.fat_pct,
        "ph": payload.ph,
        "respiration_rate": payload.respiration_rate
    }

    # 2. Run recommendation intelligence engine
    result = generate_recommendations(
        commodity_data=commodity_dict,
        all_materials=mat_dicts,
        storage_temp_c=payload.storage_temp_c,
        storage_humidity_pct=payload.storage_humidity_pct,
        target_shelf_life_days=payload.target_shelf_life_days,
        transport_duration_days=payload.transport_duration_days,
        transport_type=payload.transport_type,
        transport_condition=payload.transport_condition,
        priority_protection=payload.priority_protection,
        priority_shelf_life=payload.priority_shelf_life,
        priority_cost=payload.priority_cost,
        priority_sustainability=payload.priority_sustainability,
        mode=payload.mode
    )

    # 3. Persist Analysis in DB
    user_id = current_user.id if current_user else 1
    analysis = Analysis(
        user_id=user_id,
        commodity_name=payload.commodity_name,
        commodity_category=payload.commodity_category,
        moisture_pct=payload.moisture_pct,
        fat_pct=payload.fat_pct,
        ph=payload.ph,
        respiration_rate=payload.respiration_rate,
        target_shelf_life_days=payload.target_shelf_life_days,
        storage_temp_c=payload.storage_temp_c,
        storage_humidity_pct=payload.storage_humidity_pct,
        transport_duration_days=payload.transport_duration_days,
        transport_type=payload.transport_type,
        transport_condition=payload.transport_condition,
        priority_protection=payload.priority_protection,
        priority_shelf_life=payload.priority_shelf_life,
        priority_cost=payload.priority_cost,
        priority_sustainability=payload.priority_sustainability,
        mode=payload.mode,
        overall_risk_level=result["overall_risk_level"],
        status="Completed"
    )
    db.add(analysis)
    db.flush()

    # 4. Save Recommendations
    saved_recs = []
    for r in result["recommendations"]:
        rec = Recommendation(
            analysis_id=analysis.id,
            rank=r["rank"],
            recommendation_type=r["recommendation_type"],
            material_id=r["material_id"],
            material_name=r["material_name"],
            material_structure=r["material_structure"],
            thickness_microns=r["thickness_microns"],
            otr=r["otr"],
            wvtr=r["wvtr"],
            sealability=r["sealability"],
            gas_permeability=r["gas_permeability"],
            map_suitability=r["map_suitability"],
            estimated_cost_unit=r["estimated_cost_unit"],
            sustainability_score=r["sustainability_score"],
            protection_score=r["protection_score"],
            shelf_life_score=r["shelf_life_score"],
            compatibility_score=r["compatibility_score"],
            overall_score=r["overall_score"],
            why_points_json=r["why_points"],
            what_would_change_json=r["what_would_change"],
            risks_json=r["risks"]
        )
        db.add(rec)
        saved_recs.append(rec)

    # 5. Save Cost and Sustainability
    cost_data = result["cost_estimate"]
    db.add(CostEstimate(
        analysis_id=analysis.id,
        quantity=cost_data["quantity"],
        package_width_cm=cost_data["package_width_cm"],
        package_length_cm=cost_data["package_length_cm"],
        package_height_cm=cost_data["package_height_cm"],
        unit_cost_current=cost_data["unit_cost_current"],
        unit_cost_recommended=cost_data["unit_cost_recommended"],
        total_cost_current=cost_data["total_cost_current"],
        total_cost_recommended=cost_data["total_cost_recommended"],
        cost_savings_pct=cost_data["cost_savings_pct"]
    ))

    sust_data = result["sustainability_score"]
    db.add(SustainabilityScore(
        analysis_id=analysis.id,
        material_id=result["recommendations"][0]["material_id"],
        recyclability_pct=sust_data["recyclability_pct"],
        carbon_saved_kg=sust_data["carbon_saved_kg"],
        plastic_reduction_pct=sust_data["plastic_reduction_pct"],
        environmental_rating=sust_data["environmental_rating"]
    ))

    db.commit()
    db.refresh(analysis)

    # 6. Format Response
    formatted_recs = [
        RecommendationOut(
            id=r.id,
            rank=r.rank,
            recommendation_type=r.recommendation_type,
            material_id=r.material_id,
            material_name=r.material_name,
            material_structure=r.material_structure,
            thickness_microns=r.thickness_microns,
            otr=r.otr,
            wvtr=r.wvtr,
            sealability=r.sealability,
            gas_permeability=r.gas_permeability,
            map_suitability=r.map_suitability,
            estimated_cost_unit=r.estimated_cost_unit,
            sustainability_score=r.sustainability_score,
            protection_score=r.protection_score,
            shelf_life_score=r.shelf_life_score,
            compatibility_score=r.compatibility_score,
            overall_score=r.overall_score,
            why_points=r.why_points_json or [],
            what_would_change=r.what_would_change_json or [],
            risks=r.risks_json or []
        )
        for r in saved_recs
    ]

    return AnalysisDetailOut(
        id=analysis.id,
        user_id=analysis.user_id,
        commodity_name=analysis.commodity_name,
        commodity_category=analysis.commodity_category,
        moisture_pct=analysis.moisture_pct,
        fat_pct=analysis.fat_pct,
        ph=analysis.ph,
        respiration_rate=analysis.respiration_rate,
        target_shelf_life_days=analysis.target_shelf_life_days,
        storage_temp_c=analysis.storage_temp_c,
        storage_humidity_pct=analysis.storage_humidity_pct,
        transport_duration_days=analysis.transport_duration_days,
        transport_type=analysis.transport_type,
        transport_condition=analysis.transport_condition,
        priority_protection=analysis.priority_protection,
        priority_shelf_life=analysis.priority_shelf_life,
        priority_cost=analysis.priority_cost,
        priority_sustainability=analysis.priority_sustainability,
        mode=analysis.mode,
        overall_risk_level=analysis.overall_risk_level,
        status=analysis.status,
        created_at=analysis.created_at,
        recommendations=formatted_recs,
        respiration_intelligence=result.get("respiration_intelligence"),
        cost_estimate=CostEstimateOut(
            quantity=cost_data["quantity"],
            package_width_cm=cost_data["package_width_cm"],
            package_length_cm=cost_data["package_length_cm"],
            package_height_cm=cost_data["package_height_cm"],
            unit_cost_current=cost_data["unit_cost_current"],
            unit_cost_recommended=cost_data["unit_cost_recommended"],
            total_cost_current=cost_data["total_cost_current"],
            total_cost_recommended=cost_data["total_cost_recommended"],
            cost_savings_pct=cost_data["cost_savings_pct"],
            annual_estimated_savings_inr=cost_data["annual_estimated_savings_inr"]
        ),
        sustainability_score=SustainabilityScoreOut(
            recyclability_pct=sust_data["recyclability_pct"],
            carbon_saved_kg=sust_data["carbon_saved_kg"],
            plastic_reduction_pct=sust_data["plastic_reduction_pct"],
            environmental_rating=sust_data["environmental_rating"],
            material_impact_notes=sust_data["material_impact_notes"]
        )
    )

@router.get("", response_model=List[AnalysisListItem])
def list_analyses(
    commodity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Analysis)
    if commodity:
        query = query.filter(Analysis.commodity_name.ilike(f"%{commodity}%"))
    
    analyses = query.order_by(Analysis.created_at.desc()).all()
    results = []
    
    for a in analyses:
        top_rec = db.query(Recommendation).filter(Recommendation.analysis_id == a.id, Recommendation.rank == 1).first()
        mat_name = top_rec.material_name if top_rec else "Standard Packaging"
        cost_inr = top_rec.estimated_cost_unit if top_rec else 3.50
        sust_score = top_rec.sustainability_score if top_rec else 75.0
        
        results.append(AnalysisListItem(
            id=a.id,
            date=a.created_at,
            commodity=a.commodity_name,
            category=a.commodity_category,
            recommended_material=mat_name,
            shelf_life_days=a.target_shelf_life_days,
            cost_inr=cost_inr,
            sustainability_score=sust_score,
            risk_level=a.overall_risk_level,
            status=a.status
        ))
    return results

@router.get("/{analysis_id}", response_model=AnalysisDetailOut)
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    recs_db = db.query(Recommendation).filter(Recommendation.analysis_id == analysis_id).order_by(Recommendation.rank).all()
    formatted_recs = [
        RecommendationOut(
            id=r.id,
            rank=r.rank,
            recommendation_type=r.recommendation_type,
            material_id=r.material_id,
            material_name=r.material_name,
            material_structure=r.material_structure,
            thickness_microns=r.thickness_microns,
            otr=r.otr,
            wvtr=r.wvtr,
            sealability=r.sealability,
            gas_permeability=r.gas_permeability,
            map_suitability=r.map_suitability,
            estimated_cost_unit=r.estimated_cost_unit,
            sustainability_score=r.sustainability_score,
            protection_score=r.protection_score,
            shelf_life_score=r.shelf_life_score,
            compatibility_score=r.compatibility_score,
            overall_score=r.overall_score,
            why_points=r.why_points_json or [],
            what_would_change=r.what_would_change_json or [],
            risks=r.risks_json or []
        )
        for r in recs_db
    ]

    cost = db.query(CostEstimate).filter(CostEstimate.analysis_id == analysis_id).first()
    sust = db.query(SustainabilityScore).filter(SustainabilityScore.analysis_id == analysis_id).first()

    cost_out = None
    if cost:
        cost_out = CostEstimateOut(
            quantity=cost.quantity,
            package_width_cm=cost.package_width_cm,
            package_length_cm=cost.package_length_cm,
            package_height_cm=cost.package_height_cm,
            unit_cost_current=cost.unit_cost_current,
            unit_cost_recommended=cost.unit_cost_recommended,
            total_cost_current=cost.total_cost_current,
            total_cost_recommended=cost.total_cost_recommended,
            cost_savings_pct=cost.cost_savings_pct,
            annual_estimated_savings_inr=round((cost.total_cost_current - cost.total_cost_recommended) * 12, 0)
        )

    sust_out = None
    if sust:
        sust_out = SustainabilityScoreOut(
            recyclability_pct=sust.recyclability_pct,
            carbon_saved_kg=sust.carbon_saved_kg,
            plastic_reduction_pct=sust.plastic_reduction_pct,
            environmental_rating=sust.environmental_rating,
            material_impact_notes=f"Recyclability score of {sust.recyclability_pct}%. Saves an estimated {sust.carbon_saved_kg} kg CO₂ equivalent per production run."
        )

    resp_intel = analyze_produce_respiration(
        commodity_name=analysis.commodity_name,
        commodity_category=analysis.commodity_category,
        respiration_rate=analysis.respiration_rate,
        storage_temp_c=analysis.storage_temp_c,
        moisture_pct=analysis.moisture_pct
    )

    return AnalysisDetailOut(
        id=analysis.id,
        user_id=analysis.user_id,
        commodity_name=analysis.commodity_name,
        commodity_category=analysis.commodity_category,
        moisture_pct=analysis.moisture_pct,
        fat_pct=analysis.fat_pct,
        ph=analysis.ph,
        respiration_rate=analysis.respiration_rate,
        target_shelf_life_days=analysis.target_shelf_life_days,
        storage_temp_c=analysis.storage_temp_c,
        storage_humidity_pct=analysis.storage_humidity_pct,
        transport_duration_days=analysis.transport_duration_days,
        transport_type=analysis.transport_type,
        transport_condition=analysis.transport_condition,
        priority_protection=analysis.priority_protection,
        priority_shelf_life=analysis.priority_shelf_life,
        priority_cost=analysis.priority_cost,
        priority_sustainability=analysis.priority_sustainability,
        mode=analysis.mode,
        overall_risk_level=analysis.overall_risk_level,
        status=analysis.status,
        created_at=analysis.created_at,
        recommendations=formatted_recs,
        respiration_intelligence=resp_intel,
        cost_estimate=cost_out,
        sustainability_score=sust_out
    )

@router.delete("/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(analysis)
    db.commit()
    return {"message": "Analysis deleted successfully"}
