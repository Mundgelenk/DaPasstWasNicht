import os
from typing import Optional, Dict, Any
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import httpx

from app.core.config import settings

async def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Google OAuth token and return user info"""
    try:
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        # Check issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return None
        
        # Return user info
        return {
            "email": idinfo["email"],
            "name": idinfo.get("name", ""),
            "picture": idinfo.get("picture", ""),
            "sub": idinfo["sub"],
            "provider": "google"
        }
    except Exception as e:
        print(f"Error verifying Google token: {e}")
        return None

async def verify_apple_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Apple OAuth token and return user info"""
    try:
        # Get Apple's public keys
        async with httpx.AsyncClient() as client:
            response = await client.get('https://appleid.apple.com/auth/keys')
            apple_keys = response.json()
        
        # Decode the token
        decoded = jwt.decode(
            token,
            apple_keys,
            audience=settings.APPLE_CLIENT_ID,
            algorithms=['RS256'],
            options={"verify_exp": True}
        )
        
        # Check issuer
        if decoded['iss'] != 'https://appleid.apple.com':
            return None
        
        # Return user info
        return {
            "email": decoded.get("email", ""),
            "name": decoded.get("name", {}).get("firstName", "") + " " + decoded.get("name", {}).get("lastName", ""),
            "sub": decoded["sub"],
            "provider": "apple"
        }
    except Exception as e:
        print(f"Error verifying Apple token: {e}")
        return None 