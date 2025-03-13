from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DonationBase(BaseModel):
    amount: float
    currency: str = "USD"
    issue_id: int

class DonationCreate(DonationBase):
    pass

class DonationResponse(DonationBase):
    id: int
    payment_id: str
    payment_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    company_id: int
    recipient_id: int
    
    class Config:
        orm_mode = True
        from_attributes = True 