from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class CompanyBase(BaseModel):
    name: str
    email: EmailStr
    description: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    service_radius_km: Optional[float] = 10.0
    service_categories: Optional[str] = None

class CompanyCreate(CompanyBase):
    password: str

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    description: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    service_radius_km: Optional[float] = None
    service_categories: Optional[str] = None
    password: Optional[str] = None

class CompanyInDB(CompanyBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

class CompanyResponse(CompanyBase):
    id: int
    is_verified: bool
    
    class Config:
        orm_mode = True
        from_attributes = True

class CompanySearchParams(BaseModel):
    query: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    max_distance_km: Optional[float] = 50.0
    service_category: Optional[str] = None
    
class NearbyCompany(BaseModel):
    id: int
    name: str
    distance_km: float
    address: Optional[str] = None
    service_categories: Optional[str] = None
    
    class Config:
        orm_mode = True
        from_attributes = True 