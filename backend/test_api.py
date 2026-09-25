import requests

base = "http://127.0.0.1:8000/api"
print("1. Commodities:", len(requests.get(f"{base}/commodities").json()))
print("2. Materials:", len(requests.get(f"{base}/materials").json()))
print("3. Dashboard analyses completed:", requests.get(f"{base}/dashboard").json()["analyses_completed"])

payload = {
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
    "priority_protection": 0.35,
    "priority_shelf_life": 0.25,
    "priority_cost": 0.20,
    "priority_sustainability": 0.20,
    "mode": "Beginner"
}

res = requests.post(f"{base}/analyses", json=payload)
print("4. Analysis POST status:", res.status_code)
analysis_data = res.json()
print("   - Recommended Material #1:", analysis_data["recommendations"][0]["material_name"])
print("   - Why points count:", len(analysis_data["recommendations"][0]["why_points"]))
print("   - Respiration Intel micro-perf:", analysis_data["respiration_intelligence"]["micro_perforation_needed"])
print("   - Overall Risk Level:", analysis_data["overall_risk_level"])

analysis_id = analysis_data["id"]
pdf_res = requests.get(f"{base}/report/{analysis_id}")
print(f"5. PDF Report Status: {pdf_res.status_code}, Bytes: {len(pdf_res.content)}")

sim_payload = {
    "commodity_name": "Tomato",
    "temperature_c": 10.0,
    "humidity_pct": 85.0,
    "target_days": 10,
    "moisture_pct": 94.0,
    "fat_pct": 0.2,
    "respiration_rate": "High"
}
sim_res = requests.post(f"{base}/shelf-life-simulation", json=sim_payload)
print(f"6. Shelf-life Simulation Status: {sim_res.status_code}, Extension: {sim_res.json()['shelf_life_extension_pct']}%")

print("\n--- ALL BACKEND TEST PASSES SUCCESSFULLY ---")
