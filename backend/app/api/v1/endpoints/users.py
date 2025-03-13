from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.auth.jwt import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=dict)
def read_current_user(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "profile_picture": current_user.profile_picture,
        "is_verified": current_user.is_verified
    }

@router.get("/", response_model=List[dict])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve users
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "profile_picture": user.profile_picture,
            "is_verified": user.is_verified
        }
        for user in users
    ] 