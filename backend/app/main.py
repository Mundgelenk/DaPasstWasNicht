from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="Issue Reporter API",
    description="API for reporting facility issues with photos",
    version="0.1.0",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Welcome to Issue Reporter API", "status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 