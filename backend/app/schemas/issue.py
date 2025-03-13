from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    assigned_company_id: Optional[int] = None  # Company ID selected during creation

class IssueCreate(IssueBase):
    # Optional geolocation for company selection
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    assigned_company_id: Optional[int] = None

class IssueResponse(IssueBase):
    id: int
    photo_path: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    reporter_id: int
    
    class Config:
        orm_mode = True
        from_attributes = True

class IssueDetailResponse(IssueResponse):
    # Include company details in the response
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    
    # Include response counts in the detail view
    response_count: Optional[int] = 0
    
    class Config:
        orm_mode = True
        from_attributes = True 