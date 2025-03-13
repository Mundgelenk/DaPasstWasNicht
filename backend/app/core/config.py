import os
from typing import List, Optional
from pydantic import PostgresDsn, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "development_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Local development frontend
        "http://localhost:8080",  # Alternative local frontend
    ]
    
    # Database
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "postgresql://app_user:app_password@localhost:5432/issue_reporter")
    
    # Authentication
    GOOGLE_CLIENT_ID: Optional[str] = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.environ.get("GOOGLE_CLIENT_SECRET")
    
    APPLE_CLIENT_ID: Optional[str] = os.environ.get("APPLE_CLIENT_ID")
    APPLE_TEAM_ID: Optional[str] = os.environ.get("APPLE_TEAM_ID")
    APPLE_KEY_ID: Optional[str] = os.environ.get("APPLE_KEY_ID")
    
    # PayPal
    PAYPAL_CLIENT_ID: Optional[str] = os.environ.get("PAYPAL_CLIENT_ID")
    PAYPAL_CLIENT_SECRET: Optional[str] = os.environ.get("PAYPAL_CLIENT_SECRET")
    PAYPAL_MODE: str = os.environ.get("PAYPAL_MODE", "sandbox")  # or "live" for production
    
    # File storage
    UPLOAD_FOLDER: str = os.environ.get("UPLOAD_FOLDER", "/app/uploads")
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16 MB max upload size
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif"]
    
    # Debug mode
    DEBUG: bool = os.environ.get("DEBUG", "False").lower() == "true"
    
    # Application settings
    PROJECT_NAME: str = "Issue Reporter"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 