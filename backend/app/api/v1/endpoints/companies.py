from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from app.db.session import get_db
from app.models.company import Company
from app.schemas.company import CompanyResponse, CompanySearchParams, NearbyCompany
from app.auth.jwt import get_current_active_user
from app.utils.geo import haversine_distance, get_bounding_box

router = APIRouter()

@router.get("/", response_model=List[CompanyResponse])
def read_companies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve companies (with pagination)
    """
    companies = db.query(Company).filter(Company.is_active == True).offset(skip).limit(limit).all()
    return companies

@router.get("/{company_id}", response_model=CompanyResponse)
def read_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
) -> Any:
    """
    Get specific company by ID
    """
    company = db.query(Company).filter(Company.id == company_id, Company.is_active == True).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    return company

@router.get("/search/", response_model=List[CompanyResponse])
def search_companies(
    query: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
) -> Any:
    """
    Search companies by name or category
    """
    search_query = db.query(Company).filter(Company.is_active == True)
    
    # Apply text search if query is provided
    if query:
        search_query = search_query.filter(
            or_(
                Company.name.ilike(f"%{query}%"),
                Company.description.ilike(f"%{query}%")
            )
        )
    
    # Filter by service category if provided
    if category:
        search_query = search_query.filter(Company.service_categories.ilike(f"%{category}%"))
    
    # Get results
    companies = search_query.limit(50).all()
    return companies

@router.post("/nearby/", response_model=List[NearbyCompany])
def find_nearby_companies(
    search_params: CompanySearchParams,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_active_user)
) -> Any:
    """
    Find companies near a specific location
    """
    # Validate location data
    if not search_params.latitude or not search_params.longitude:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Latitude and longitude are required for location-based search"
        )
    
    # Calculate bounding box for optimized query
    min_lat, min_lon, max_lat, max_lon = get_bounding_box(
        search_params.latitude, 
        search_params.longitude, 
        search_params.max_distance_km
    )
    
    # Query companies within the bounding box
    companies_query = db.query(Company).filter(
        and_(
            Company.is_active == True,
            Company.latitude.between(min_lat, max_lat),
            Company.longitude.between(min_lon, max_lon)
        )
    )
    
    # Apply text search if query is provided
    if search_params.query:
        companies_query = companies_query.filter(
            or_(
                Company.name.ilike(f"%{search_params.query}%"),
                Company.description.ilike(f"%{search_params.query}%")
            )
        )
    
    # Filter by service category if provided
    if search_params.service_category:
        companies_query = companies_query.filter(
            Company.service_categories.ilike(f"%{search_params.service_category}%")
        )
    
    # Get results and calculate exact distances
    companies = companies_query.all()
    
    # Calculate exact distances and filter by max distance
    nearby_companies = []
    for company in companies:
        if company.latitude and company.longitude:
            distance = haversine_distance(
                search_params.latitude,
                search_params.longitude,
                company.latitude,
                company.longitude
            )
            
            # Only include companies within the specified distance
            if distance <= search_params.max_distance_km:
                nearby_companies.append({
                    "id": company.id,
                    "name": company.name,
                    "distance_km": round(distance, 2),
                    "address": company.address,
                    "service_categories": company.service_categories
                })
    
    # Sort by distance
    nearby_companies.sort(key=lambda x: x["distance_km"])
    
    return nearby_companies 