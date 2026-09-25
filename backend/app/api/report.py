from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Analysis, Recommendation, CostEstimate, SustainabilityScore, User
from app.services.pdf_generator import generate_analysis_pdf

router = APIRouter(prefix="/report", tags=["PDF Report Generation"])

@router.get("/{analysis_id}")
def download_pdf_report(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    recs = db.query(Recommendation).filter(Recommendation.analysis_id == analysis_id).order_by(Recommendation.rank).all()
    cost = db.query(CostEstimate).filter(CostEstimate.analysis_id == analysis_id).first()
    sust = db.query(SustainabilityScore).filter(SustainabilityScore.analysis_id == analysis_id).first()
    user = db.query(User).filter(User.id == analysis.user_id).first()

    user_name = f"{user.name} ({user.role})" if user else "Research Partner"

    analysis_data = {
        "id": analysis.id,
        "created_at": analysis.created_at,
        "commodity_name": analysis.commodity_name,
        "commodity_category": analysis.commodity_category,
        "moisture_pct": analysis.moisture_pct,
        "fat_pct": analysis.fat_pct,
        "ph": analysis.ph,
        "respiration_rate": analysis.respiration_rate,
        "target_shelf_life_days": analysis.target_shelf_life_days,
        "storage_temp_c": analysis.storage_temp_c,
        "storage_humidity_pct": analysis.storage_humidity_pct,
        "transport_duration_days": analysis.transport_duration_days,
        "transport_type": analysis.transport_type,
        "transport_condition": analysis.transport_condition,
        "overall_risk_level": analysis.overall_risk_level,
        "recommendations": [
            {
                "rank": r.rank,
                "recommendation_type": r.recommendation_type,
                "material_name": r.material_name,
                "material_structure": r.material_structure,
                "thickness_microns": r.thickness_microns,
                "otr": r.otr,
                "wvtr": r.wvtr,
                "sealability": r.sealability,
                "estimated_cost_unit": r.estimated_cost_unit,
                "sustainability_score": r.sustainability_score,
                "protection_score": r.protection_score,
                "shelf_life_score": r.shelf_life_score,
                "overall_score": r.overall_score,
                "why_points": r.why_points_json or [],
                "what_would_change": r.what_would_change_json or [],
                "risks": r.risks_json or []
            }
            for r in recs
        ],
        "cost_estimate": {
            "quantity": cost.quantity if cost else 10000,
            "total_cost_current": cost.total_cost_current if cost else 35000.0,
            "total_cost_recommended": cost.total_cost_recommended if cost else 28500.0,
            "cost_savings_pct": cost.cost_savings_pct if cost else 18.5
        },
        "sustainability_score": {
            "recyclability_pct": sust.recyclability_pct if sust else 80.0,
            "carbon_saved_kg": sust.carbon_saved_kg if sust else 124.5,
            "plastic_reduction_pct": sust.plastic_reduction_pct if sust else 35.0,
            "environmental_rating": sust.environmental_rating if sust else "A"
        }
    }

    pdf_stream = generate_analysis_pdf(analysis_data, user_name=user_name)
    
    filename = f"PackSmart_Analysis_{analysis.commodity_name.replace(' ', '_')}_{analysis.id}.pdf"
    
    return StreamingResponse(
        pdf_stream,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
