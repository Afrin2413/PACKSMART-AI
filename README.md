# PACKSMART AI

> **"Choose the Right Packaging. Reduce Waste. Extend Shelf Life."**  
> **Theme:** AI-Based Intelligent Food Packaging Material Recommendation System

---

## 🌟 Executive Overview

**PackSmart AI** is a decision-support platform designed to solve the critical packaging-food mismatch crisis in the global food value chain. By uniting **Scikit-Learn ML models**, **packaging chemistry rule engines**, **post-harvest respiration physiology**, and **multi-objective optimization**, PackSmart AI delivers explainable packaging recommendations tailored to specific food matrices, logistics routes, and sustainability goals.

---

## 🏛️ System Architecture

```
                      React 18 + TypeScript + Vite + Tailwind CSS
                                          │
                                    REST API (JSON)
                                          ▼
                                FastAPI Python Backend
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
          ML Suitability Engine     Rule Engine       Respiration Intelligence
          (Scikit-Learn Random    (Packaging Physics,    (Equilibrium MAP &
                Forest)           WVTR/OTR Thresholds)   Micro-perforations)
                    └─────────────────────┬─────────────────────┘
                                          ▼
                        Multi-Objective Optimization Engine
                         (Protection, Shelf-Life, Cost, Eco)
                                          ▼
                          Explainable AI (XAI) Synthesis
                                          ▼
                    PostgreSQL / SQLite Database + ReportLab PDF
```

---

## ✨ Key Features & Modules

1. **Intelligent Packaging Wizard (`/new-analysis`)**
   - 5-step intuitive configuration: Commodity, Matrix Properties (Moisture %, Fat %, pH, Respiration), Shelf Life, Logistics, and Optimization Priorities.
   - **Demo Mode:** 1-Click test matrix loader for *Tomato*, *Biscuits*, and *Leafy Greens*.
   - Animated multi-stage AI inference inspection.

2. **Top 3 Distinct Recommendations (`/analysis/:id`)**
   - **#1 Best Balanced Solution** (Maximum multi-objective utility)
   - **#2 Lower Cost Alternative** (Economical unit price with verified protection)
   - **#3 More Sustainable Alternative** (High circularity / recyclability)
   - Complete physical datasheets: OTR ($cc/m^2\cdot day$), WVTR ($g/m^2\cdot day$), film thickness ($\mu m$), sealability, and MAP qualification.

3. **Explainable AI (XAI)**
   - *"Why This Material?"* scientific compliance justification points.
   - *"What Would Change This Recommendation?"* sensitivity triggers.

4. **Respiration-Aware Mode (for Fresh Produce)**
   - Equilibrium Modified Atmosphere Packaging ($O_2 / CO_2 / N_2$) targets.
   - Laser micro-perforation density and diameter specs ($100-200\mu m$).
   - Anti-fog condensation advisory.

5. **Packaging Risk Analysis**
   - Dynamic failure mode matrix evaluating moisture migration, lipid oxidation, asphyxiation, and seal fracture risks with engineering mitigations.

6. **Interactive Shelf-Life Simulator (`/simulator`)**
   - Dynamic kinetic quality decay index curve ($Q(t) = 100 \cdot e^{-kt}$) vs Spoilage Threshold (60%).
   - Live temperature and humidity sliders.

7. **Packaging Cost Calculator (`/cost-calculator`)**
   - Pouch surface area, unit cost, batch expenditure, and annualized savings.

8. **Sustainability & Circularity Engine (`/sustainability`)**
   - Mono-material recyclability, carbon footprint lifecycle, and plastic mass reduction comparison.

9. **Professional PDF Report Generator (`/api/report/:id`)**
   - Real ReportLab technical report with tables, XAI, risk matrix, and disclaimer.

10. **Role-Aware Experiences (`/profile`)**
    - **Beginner Mode:** Simplified visual explanations for Farmers & Startups.
    - **Expert Mode:** Raw permeability metrics, OTR/WVTR, and MAP gas ratios for Packaging Researchers.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI Server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```
Web application will be live at `http://localhost:5173`.

### 3. Docker Compose (Full-Stack Automated)
```bash
docker compose up --build
```

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Researcher (Admin)** | `anusri@packsmart.ai` | `packsmart2026` |
| **Farmer / FPO** | `farmer.rajesh@agrifarm.in` | `farmer123` |
| **Food Startup** | `maya.sen@ecopack.co` | `startup123` |
| **Food Processor** | `vikram@harvestfoods.com` | `business123` |

---

## 📊 API Reference

- `POST /api/auth/login` - Authenticate and obtain JWT
- `POST /api/auth/register` - Create user account
- `GET /api/commodities` - List food commodities
- `GET /api/materials` - List packaging materials
- `POST /api/analyses` - Run AI packaging recommendation
- `GET /api/analyses` - List past analyses history
- `GET /api/analyses/{id}` - Retrieve analysis details
- `POST /api/compare` - Compare selected materials
- `POST /api/cost-estimate` - Calculate unit and batch cost
- `POST /api/shelf-life-simulation` - Run kinetic shelf-life decay simulation
- `GET /api/dashboard` - Get aggregated KPI metrics
- `GET /api/report/{id}` - Download generated ReportLab PDF

---

## 🏆 Project Compliance Note
This platform uses empirical packaging physics calculations and trained Scikit-Learn models with seeded datasets to provide transparent, explainable decision-support recommendations.
