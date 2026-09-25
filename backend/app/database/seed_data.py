"""
PackSmart AI - Database Seeding Module
Populates PostgreSQL / SQLite database with realistic initial users, commodities, materials, and analyses.
"""
import os
import csv
import datetime
from sqlalchemy.orm import Session
from app.models.models import (
    User, Commodity, PackagingMaterial, Analysis, Recommendation, CostEstimate, SustainabilityScore
)
from app.services.auth_service import get_password_hash
from app.ai.recommender import generate_recommendations

def seed_database(db: Session):
    # 1. Seed Users
    if db.query(User).count() == 0:
        demo_users = [
            User(
                name="Anusri P",
                email="anusri@packsmart.ai",
                hashed_password=get_password_hash("packsmart2026"),
                role="Researcher",
                organization="National Institute of Food Technology"
            ),
            User(
                name="Rajesh Kumar",
                email="farmer.rajesh@agrifarm.in",
                hashed_password=get_password_hash("farmer123"),
                role="Farmer",
                organization="Krishi Sahyog FPO"
            ),
            User(
                name="Dr. Maya Sen",
                email="maya.sen@ecopack.co",
                hashed_password=get_password_hash("startup123"),
                role="Startup",
                organization="GreenFresh Bio-Packaging"
            ),
            User(
                name="Vikram Patel",
                email="vikram@harvestfoods.com",
                hashed_password=get_password_hash("business123"),
                role="Business",
                organization="Harvest Foods Processing Ltd"
            )
        ]
        db.add_all(demo_users)
        db.commit()
        print("[SEED] Seeded demo users successfully.")

    # 2. Seed Commodities
    if db.query(Commodity).count() == 0:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "commodities.csv")
        if os.path.exists(csv_path):
            with open(csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    commodity = Commodity(
                        id=int(row["id"]),
                        name=row["name"],
                        category=row["category"],
                        moisture_pct=float(row["moisture_pct"]),
                        fat_pct=float(row["fat_pct"]),
                        ph=float(row["ph"]),
                        respiration_rate=row["respiration_rate"],
                        ideal_temp_c=float(row["ideal_temp_c"]),
                        ideal_humidity_pct=float(row["ideal_humidity_pct"]),
                        typical_shelf_life_days=int(row["typical_shelf_life_days"]),
                        recommended_gas_ratio_o2=float(row.get("recommended_gas_ratio_o2", 0.0)),
                        recommended_gas_ratio_co2=float(row.get("recommended_gas_ratio_co2", 0.0)),
                        recommended_gas_ratio_n2=float(row.get("recommended_gas_ratio_n2", 100.0)),
                        sensitivity_notes=row.get("sensitivity_notes", "")
                    )
                    db.add(commodity)
            db.commit()
            print("[SEED] Seeded commodities from CSV.")

    # 3. Seed Packaging Materials
    if db.query(PackagingMaterial).count() == 0:
        csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "packaging_materials.csv")
        if os.path.exists(csv_path):
            with open(csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    mat = PackagingMaterial(
                        id=int(row["id"]),
                        name=row["name"],
                        structure=row["structure"],
                        category=row["category"],
                        thickness_microns=int(row["thickness_microns"]),
                        otr_cc_m2_day_atm=float(row["otr_cc_m2_day_atm"]),
                        wvtr_g_m2_day=float(row["wvtr_g_m2_day"]),
                        gas_permeability_category=row["gas_permeability_category"],
                        sealability=row["sealability"],
                        puncture_resistance=row["puncture_resistance"],
                        map_suitability=row["map_suitability"].lower() == "true",
                        recyclability_pct=float(row["recyclability_pct"]),
                        carbon_footprint_kg_co2_per_kg=float(row["carbon_footprint_kg_co2_per_kg"]),
                        cost_per_sqm_inr=float(row["cost_per_sqm_inr"]),
                        sustainability_score_base=float(row["sustainability_score_base"]),
                        protection_score_base=float(row["protection_score_base"]),
                        min_temp_c=float(row["min_temp_c"]),
                        max_temp_c=float(row["max_temp_c"]),
                        key_features=row.get("key_features", ""),
                        ideal_for=row.get("ideal_for", ""),
                        is_custom=False
                    )
                    db.add(mat)
            db.commit()
            print("[SEED] Seeded packaging materials from CSV.")

    # 4. Seed Realistic Initial Analyses (for Dashboard KPIs and History)
    if db.query(Analysis).count() == 0:
        user = db.query(User).first()
        user_id = user.id if user else None
        
        all_materials_db = db.query(PackagingMaterial).all()
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
            for m in all_materials_db
        ]

        seed_scenarios = [
            {
                "commodity_name": "Tomato",
                "commodity_category": "Fruits",
                "moisture_pct": 94.0,
                "fat_pct": 0.2,
                "ph": 4.3,
                "respiration_rate": "High",
                "target_shelf_life_days": 10,
                "storage_temp_c": 10.0,
                "storage_humidity_pct": 85.0,
                "transport_duration_days": 2,
                "transport_type": "Road",
                "transport_condition": "Refrigerated",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=4)
            },
            {
                "commodity_name": "Biscuits & Cookies",
                "commodity_category": "Bakery",
                "moisture_pct": 3.0,
                "fat_pct": 18.0,
                "ph": 6.5,
                "respiration_rate": "None",
                "target_shelf_life_days": 180,
                "storage_temp_c": 22.0,
                "storage_humidity_pct": 50.0,
                "transport_duration_days": 5,
                "transport_type": "Long Distance",
                "transport_condition": "Normal",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=3)
            },
            {
                "commodity_name": "Fresh Leafy Greens (Spinach)",
                "commodity_category": "Vegetables",
                "moisture_pct": 92.0,
                "fat_pct": 0.4,
                "ph": 6.2,
                "respiration_rate": "Very High",
                "target_shelf_life_days": 6,
                "storage_temp_c": 4.0,
                "storage_humidity_pct": 95.0,
                "transport_duration_days": 1,
                "transport_type": "Cold Chain",
                "transport_condition": "Refrigerated",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=2)
            },
            {
                "commodity_name": "Roasted Coffee Beans",
                "commodity_category": "Snacks",
                "moisture_pct": 2.0,
                "fat_pct": 15.0,
                "ph": 5.0,
                "respiration_rate": "None",
                "target_shelf_life_days": 365,
                "storage_temp_c": 20.0,
                "storage_humidity_pct": 50.0,
                "transport_duration_days": 7,
                "transport_type": "Long Distance",
                "transport_condition": "Normal",
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(days=1)
            }
        ]

        for sc in seed_scenarios:
            result = generate_recommendations(
                commodity_data={
                    "name": sc["commodity_name"],
                    "category": sc["commodity_category"],
                    "moisture_pct": sc["moisture_pct"],
                    "fat_pct": sc["fat_pct"],
                    "ph": sc["ph"],
                    "respiration_rate": sc["respiration_rate"]
                },
                all_materials=mat_dicts,
                storage_temp_c=sc["storage_temp_c"],
                storage_humidity_pct=sc["storage_humidity_pct"],
                target_shelf_life_days=sc["target_shelf_life_days"],
                transport_duration_days=sc["transport_duration_days"],
                transport_type=sc["transport_type"],
                transport_condition=sc["transport_condition"],
                priority_protection=0.35,
                priority_shelf_life=0.25,
                priority_cost=0.20,
                priority_sustainability=0.20
            )

            analysis = Analysis(
                user_id=user_id,
                commodity_name=sc["commodity_name"],
                commodity_category=sc["commodity_category"],
                moisture_pct=sc["moisture_pct"],
                fat_pct=sc["fat_pct"],
                ph=sc["ph"],
                respiration_rate=sc["respiration_rate"],
                target_shelf_life_days=sc["target_shelf_life_days"],
                storage_temp_c=sc["storage_temp_c"],
                storage_humidity_pct=sc["storage_humidity_pct"],
                transport_duration_days=sc["transport_duration_days"],
                transport_type=sc["transport_type"],
                transport_condition=sc["transport_condition"],
                priority_protection=0.35,
                priority_shelf_life=0.25,
                priority_cost=0.20,
                priority_sustainability=0.20,
                mode="Beginner",
                overall_risk_level=result["overall_risk_level"],
                status="Completed",
                created_at=sc["created_at"]
            )
            db.add(analysis)
            db.flush()

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

            cost = result["cost_estimate"]
            db.add(CostEstimate(
                analysis_id=analysis.id,
                quantity=cost["quantity"],
                package_width_cm=cost["package_width_cm"],
                package_length_cm=cost["package_length_cm"],
                package_height_cm=cost["package_height_cm"],
                unit_cost_current=cost["unit_cost_current"],
                unit_cost_recommended=cost["unit_cost_recommended"],
                total_cost_current=cost["total_cost_current"],
                total_cost_recommended=cost["total_cost_recommended"],
                cost_savings_pct=cost["cost_savings_pct"]
            ))

            sust = result["sustainability_score"]
            db.add(SustainabilityScore(
                analysis_id=analysis.id,
                material_id=result["recommendations"][0]["material_id"],
                recyclability_pct=sust["recyclability_pct"],
                carbon_saved_kg=sust["carbon_saved_kg"],
                plastic_reduction_pct=sust["plastic_reduction_pct"],
                environmental_rating=sust["environmental_rating"]
            ))

        db.commit()
        print("[SEED] Seeded baseline analyses successfully.")
