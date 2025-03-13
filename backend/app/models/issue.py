from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    photo_path = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    
    # Status of the issue
    status = Column(String(50), default="pending")  # pending, in_progress, resolved, rejected
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    reporter_id = Column(Integer, ForeignKey("users.id"))
    assigned_company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    
    # Relationships
    reporter = relationship("User", back_populates="reported_issues")
    assigned_company = relationship("Company", back_populates="assigned_issues")
    responses = relationship("Response", back_populates="issue", cascade="all, delete-orphan")
    donations = relationship("Donation", back_populates="issue", cascade="all, delete-orphan") 