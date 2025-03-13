from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255))
    hashed_password = Column(String(255), nullable=True)  # Can be null for OAuth users
    
    # OAuth information
    auth_provider = Column(String(50), nullable=True)  # google, apple, email
    auth_provider_user_id = Column(String(255), nullable=True)
    
    # User status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Profile information
    profile_picture = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    
    # Relationships
    reported_issues = relationship("Issue", back_populates="reporter")
    received_donations = relationship("Donation", back_populates="recipient") 