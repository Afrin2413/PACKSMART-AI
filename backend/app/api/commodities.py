from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Commodity
from app.schemas.schemas import CommodityOut, CommodityCreate

router = APIRouter(prefix="/commodities", tags=["Commodities"])

@router.get("", response_model=List[CommodityOut])
def get_commodities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Commodity)
    if category and category != "All":
        query = query.filter(Commodity.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(Commodity.name.ilike(f"%{search}%"))
    return query.order_by(Commodity.name).all()

@router.get("/{commodity_id}", response_model=CommodityOut)
def get_commodity_by_id(commodity_id: int, db: Session = Depends(get_db)):
    comm = db.query(Commodity).filter(Commodity.id == commodity_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commodity not found")
    return comm

@router.post("", response_model=CommodityOut, status_code=status.HTTP_201_CREATED)
def create_commodity(commodity_in: CommodityCreate, db: Session = Depends(get_db)):
    existing = db.query(Commodity).filter(Commodity.name.ilike(commodity_in.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Commodity with this name already exists.")
    commodity = Commodity(**commodity_in.dict())
    db.add(commodity)
    db.commit()
    db.refresh(commodity)
    return commodity

@router.put("/{commodity_id}", response_model=CommodityOut)
def update_commodity(commodity_id: int, commodity_in: CommodityCreate, db: Session = Depends(get_db)):
    comm = db.query(Commodity).filter(Commodity.id == commodity_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commodity not found")
    for field, value in commodity_in.dict().items():
        setattr(comm, field, value)
    db.commit()
    db.refresh(comm)
    return comm

@router.delete("/{commodity_id}")
def delete_commodity(commodity_id: int, db: Session = Depends(get_db)):
    comm = db.query(Commodity).filter(Commodity.id == commodity_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Commodity not found")
    db.delete(comm)
    db.commit()
    return {"message": "Commodity successfully removed"}
