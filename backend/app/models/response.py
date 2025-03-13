from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Response(Base):
    __tablename__ = "responses"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    
    # Response details
    status_update = Column(String(50), nullable=True)  # e.g., "accepted", "in_progress", "resolved"
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    # Relationships
    issue = relationship("Issue", back_populates="responses")
    company = relationship("Company", back_populates="responses") 