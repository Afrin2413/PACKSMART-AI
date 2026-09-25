from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, UserOut, Token
from app.services.auth_service import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        organization=user_in.organization or "AgriTech Enterprise"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return Token(access_token=token, token_type="bearer", user=user)

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    token = create_access_token({"sub": user.email})
    return Token(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    if not current_user:
        # Return demo profile if not logged in
        return UserOut(
            id=1,
            name="Research Partner",
            email="demo@packsmart.ai",
            role="Researcher",
            organization="Food Packaging Innovation Center",
            created_at="2026-01-01T00:00:00"
        )
    return current_user
