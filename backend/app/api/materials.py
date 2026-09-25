from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import PackagingMaterial
from app.schemas.schemas import PackagingMaterialOut, PackagingMaterialCreate

router = APIRouter(prefix="/materials", tags=["Packaging Materials"])

@router.get("", response_model=List[PackagingMaterialOut])
def get_materials(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PackagingMaterial)
    if category and category != "All":
        query = query.filter(PackagingMaterial.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (PackagingMaterial.name.ilike(f"%{search}%")) |
            (PackagingMaterial.structure.ilike(f"%{search}%"))
        )
    return query.order_by(PackagingMaterial.name).all()

@router.get("/{material_id}", response_model=PackagingMaterialOut)
def get_material_by_id(material_id: int, db: Session = Depends(get_db)):
    mat = db.query(PackagingMaterial).filter(PackagingMaterial.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Packaging material not found")
    return mat

@router.post("", response_model=PackagingMaterialOut, status_code=status.HTTP_201_CREATED)
def create_material(material_in: PackagingMaterialCreate, db: Session = Depends(get_db)):
    mat = PackagingMaterial(**material_in.dict())
    db.add(mat)
    db.commit()
    db.refresh(mat)
    return mat

@router.put("/{material_id}", response_model=PackagingMaterialOut)
def update_material(material_id: int, material_in: PackagingMaterialCreate, db: Session = Depends(get_db)):
    mat = db.query(PackagingMaterial).filter(PackagingMaterial.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Packaging material not found")
    for field, value in material_in.dict().items():
        setattr(mat, field, value)
    db.commit()
    db.refresh(mat)
    return mat

@router.delete("/{material_id}")
def delete_material(material_id: int, db: Session = Depends(get_db)):
    mat = db.query(PackagingMaterial).filter(PackagingMaterial.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Packaging material not found")
    db.delete(mat)
    db.commit()
    return {"message": "Packaging material successfully removed"}
