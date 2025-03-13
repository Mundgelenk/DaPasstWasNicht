from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Company details
    description = Column(Text, nullable=True)
    logo_path = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    
    # Geolocation data for proximity search
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    service_radius_km = Column(Float, default=10.0)  # Default service area radius in kilometers
    
    # Service categories for filtering
    service_categories = Column(String(255), nullable=True)  # Comma-separated list of service categories
    
    # Company status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    assigned_issues = relationship("Issue", back_populates="assigned_company")
    responses = relationship("Response", back_populates="company")
    sent_donations = relationship("Donation", back_populates="company") 