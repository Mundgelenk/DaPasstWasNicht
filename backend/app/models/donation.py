from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Donation(Base):
    __tablename__ = "donations"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    # Payment details
    payment_id = Column(String(255), nullable=False, unique=True)
    payment_status = Column(String(50), default="pending")  # pending, completed, failed, refunded
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    issue_id = Column(Integer, ForeignKey("issues.id"))
    company_id = Column(Integer, ForeignKey("companies.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    issue = relationship("Issue", back_populates="donations")
    company = relationship("Company", back_populates="sent_donations")
    recipient = relationship("User", back_populates="received_donations") 