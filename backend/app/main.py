import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import engine, Base, SessionLocal
from app.database.seed_data import seed_database

# Routers
from app.api.auth import router as auth_router
from app.api.commodities import router as commodities_router
from app.api.materials import router as materials_router
from app.api.analyses import router as analyses_router
from app.api.compare import router as compare_router
from app.api.cost import router as cost_router
from app.api.simulation import router as simulation_router
from app.api.dashboard import router as dashboard_router
from app.api.report import router as report_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Seed default data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Based Intelligent Food Packaging Material Recommendation System",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Register API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(commodities_router, prefix=settings.API_V1_STR)
app.include_router(materials_router, prefix=settings.API_V1_STR)
app.include_router(analyses_router, prefix=settings.API_V1_STR)
app.include_router(compare_router, prefix=settings.API_V1_STR)
app.include_router(cost_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(report_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "PackSmart AI",
        "version": settings.VERSION,
        "mode": "Production Ready"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to PackSmart AI - Intelligent Food Packaging Decision Support Platform",
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
