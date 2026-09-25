import math
from fastapi import APIRouter
from app.schemas.schemas import SimulationRequest, SimulationResultOut, SimulationDayPoint

router = APIRouter(prefix="/shelf-life-simulation", tags=["Shelf Life Simulation"])

@router.post("", response_model=SimulationResultOut)
def run_shelf_life_simulation(payload: SimulationRequest):
    # Kinetic spoilage parameters
    # Deterioration rate constant k influenced by temperature, moisture, fat, and packaging barrier
    temp_factor = math.exp(0.065 * (payload.temperature_c - 4.0)) # Arrhenius temp acceleration
    humidity_delta = abs(payload.humidity_pct - 50.0) / 50.0
    
    # Calculate baseline deterioration constants
    if payload.respiration_rate in ["High", "Very High"]:
        # Respiring produce
        # In permeable/perforated (recommended), k is lower
        k_current = 0.14 * temp_factor * (1.0 + humidity_delta * 0.4)
        k_recommended = 0.062 * temp_factor * (1.0 + humidity_delta * 0.2)
        primary_failure = "Respiration accumulation, condensation mould (Botrytis), or moisture loss"
    elif payload.fat_pct > 15.0:
        # High lipid item (biscuits, chips, nuts)
        k_current = 0.022 * temp_factor * (1.0 + payload.fat_pct * 0.02)
        k_recommended = 0.0075 * temp_factor
        primary_failure = "Hydroperoxide rancidity from lipid auto-oxidation and moisture crispness loss"
    elif payload.moisture_pct < 10.0:
        # Dry snack
        k_current = 0.028 * temp_factor * (1.0 + humidity_delta * 0.6)
        k_recommended = 0.0085 * temp_factor
        primary_failure = "Water vapor ingress causing sogginess and loss of acoustic crispness"
    else:
        # General perishable food
        k_current = 0.095 * temp_factor
        k_recommended = 0.042 * temp_factor
        primary_failure = "Microbial growth and biochemical enzymatic degradation"

    # Number of days to simulate (target + buffer)
    total_days = max(14, int(payload.target_days * 1.35))
    day_points = []
    
    current_life = total_days
    rec_life = total_days
    current_life_found = False
    rec_life_found = False

    for day in range(0, total_days + 1):
        # Quality index formula Q(t) = 100 * exp(-k * t)
        q_cur = max(0.0, min(100.0, 100.0 * math.exp(-k_current * day)))
        q_rec = max(0.0, min(100.0, 100.0 * math.exp(-k_recommended * day)))

        # Microbial log CFU/g estimate (start at 2.5, spoilage threshold 6.0)
        micro_cur = round(min(9.0, 2.2 + (100.0 - q_cur) * 0.065), 2)
        micro_rec = round(min(9.0, 2.2 + (100.0 - q_rec) * 0.055), 2)

        if not current_life_found and q_cur < 60.0:
            current_life = day
            current_life_found = True

        if not rec_life_found and q_rec < 60.0:
            rec_life = day
            rec_life_found = True

        day_points.append(SimulationDayPoint(
            day=day,
            current_quality_pct=round(q_cur, 1),
            recommended_quality_pct=round(q_rec, 1),
            spoilage_threshold=60.0,
            current_microbial_log=micro_cur,
            recommended_microbial_log=micro_rec
        ))

    if not current_life_found:
        current_life = total_days
    if not rec_life_found:
        rec_life = total_days

    extension_pct = round(((rec_life - current_life) / max(1, current_life)) * 100.0, 1)

    notes = (
        f"Simulated shelf-life projection indicates {extension_pct}% longevity extension at {payload.temperature_c}°C "
        f"and {payload.humidity_pct}% RH. The recommended packaging delays sensory decay beyond the critical 60% quality index."
    )

    return SimulationResultOut(
        days=day_points,
        current_shelf_life_days=current_life,
        recommended_shelf_life_days=rec_life,
        shelf_life_extension_pct=max(0.0, extension_pct),
        primary_failure_mode=primary_failure,
        simulation_notes=notes
    )
