from fastapi import APIRouter

from app.api.v1.endpoints import auth, issues, users, companies, donations

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(issues.router, prefix="/issues", tags=["Issues"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(donations.router, prefix="/donations", tags=["Donations"]) 