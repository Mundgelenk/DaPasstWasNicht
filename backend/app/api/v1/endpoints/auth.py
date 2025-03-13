from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.auth.oauth import verify_google_token, verify_apple_token
from app.auth.jwt import create_access_token
from app.models.user import User
from app.schemas.token import Token, OAuthLogin

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """Login with username and password"""
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # TODO: Implement password verification here
    
    return {
        "access_token": create_access_token(data={"sub": str(user.id)}),
        "token_type": "bearer",
    }

@router.post("/oauth/google", response_model=Token)
async def login_google(
    data: OAuthLogin,
    db: Session = Depends(get_db)
) -> Any:
    """Login with Google OAuth"""
    user_data = await verify_google_token(data.token)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )
    
    # Find or create user
    user = db.query(User).filter(
        User.auth_provider == "google",
        User.auth_provider_user_id == user_data["sub"]
    ).first()
    
    if not user:
        # Create new user
        user = User(
            email=user_data["email"],
            name=user_data["name"],
            profile_picture=user_data.get("picture"),
            auth_provider="google",
            auth_provider_user_id=user_data["sub"],
            is_verified=True,  # Google already verified email
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {
        "access_token": create_access_token(data={"sub": str(user.id)}),
        "token_type": "bearer",
    }

@router.post("/oauth/apple", response_model=Token)
async def login_apple(
    data: OAuthLogin,
    db: Session = Depends(get_db)
) -> Any:
    """Login with Apple OAuth"""
    user_data = await verify_apple_token(data.token)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Apple token",
        )
    
    # Find or create user
    user = db.query(User).filter(
        User.auth_provider == "apple",
        User.auth_provider_user_id == user_data["sub"]
    ).first()
    
    if not user:
        # Create new user
        user = User(
            email=user_data["email"],
            name=user_data["name"],
            auth_provider="apple",
            auth_provider_user_id=user_data["sub"],
            is_verified=True,  # Apple already verified email
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {
        "access_token": create_access_token(data={"sub": str(user.id)}),
        "token_type": "bearer",
    } 