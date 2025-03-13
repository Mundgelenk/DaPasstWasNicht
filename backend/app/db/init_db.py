import logging
from sqlalchemy.orm import Session

from app.db.session import Base, engine
from app.models.user import User
from app.models.company import Company
from app.models.issue import Issue
from app.models.response import Response
from app.models.donation import Donation

# Sample data
SAMPLE_COMPANIES = [
    {
        "name": "City Maintenance Services",
        "email": "maintenance@city.example.com",
        "description": "Official city maintenance services for public facilities and infrastructure.",
        "website": "https://city.example.com/maintenance",
        "phone": "+1-555-123-4567",
        "address": "123 Main St, Cityville, ST 12345",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "service_radius_km": 15.0,
        "service_categories": "Plumbing, Electrical, Road Maintenance, Public Facilities"
    },
    {
        "name": "QuickFix Plumbing & Heating",
        "email": "info@quickfix.example.com",
        "description": "24/7 plumbing and heating repair services for residential and commercial properties.",
        "website": "https://quickfix.example.com",
        "phone": "+1-555-987-6543",
        "address": "456 Repair Ave, Fixville, ST 54321",
        "latitude": 40.7145,
        "longitude": -74.0085,
        "service_radius_km": 25.0,
        "service_categories": "Plumbing, Heating, Water Damage, Emergency Repairs"
    },
    {
        "name": "GreenSpace Landscaping",
        "email": "contact@greenspace.example.com",
        "description": "Park and public space maintenance services.",
        "website": "https://greenspace.example.com",
        "phone": "+1-555-789-0123",
        "address": "789 Park Rd, Greenville, ST 67890",
        "latitude": 40.7210,
        "longitude": -74.0148,
        "service_radius_km": 30.0,
        "service_categories": "Parks, Landscaping, Tree Services, Public Spaces"
    }
]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Check if we already have companies
    existing_company = db.query(Company).first()
    if existing_company:
        logger.info("Database already initialized, skipping")
        return
    
    logger.info("Creating sample companies")
    
    # Create sample companies
    for company_data in SAMPLE_COMPANIES:
        company = Company(
            name=company_data["name"],
            email=company_data["email"],
            description=company_data["description"],
            website=company_data["website"],
            phone=company_data["phone"],
            address=company_data["address"],
            latitude=company_data["latitude"],
            longitude=company_data["longitude"],
            service_radius_km=company_data["service_radius_km"],
            service_categories=company_data["service_categories"],
            # In a real application, you would hash the password
            hashed_password="password123",
            is_active=True,
            is_verified=True
        )
        db.add(company)
    
    db.commit()
    logger.info("Sample data initialized")

if __name__ == "__main__":
    from app.db.session import SessionLocal
    
    db = SessionLocal()
    init_db(db)
    db.close() 