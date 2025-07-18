from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict
import jwt
from jwt.exceptions import PyJWTError, ExpiredSignatureError
from pydantic import BaseModel
import os
from datetime import datetime
from dotenv import load_dotenv
from .logging_config import setup_logger

# Set up logger
logger = setup_logger(__name__, 'auth.log')

# Load environment variables from .env file
load_dotenv()

security = HTTPBearer()

class UserData(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    provider: Optional[str] = None

class AuthService:
    def __init__(self):
        # Get this from Supabase Dashboard -> Project Settings -> API -> JWT Settings
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        if not self.jwt_secret:
            logger.error("SUPABASE_JWT_SECRET environment variable is not set")
            raise ValueError("SUPABASE_JWT_SECRET environment variable is not set")
        logger.debug("AuthService initialized successfully")

    def decode_token(self, token: str) -> Dict:
        try:
            logger.debug(f"Attempting to decode token: {token[:10]}...")  # Log first 10 chars of token
            logger.debug(f"Using JWT secret: {self.jwt_secret[:10]}...")  # Log first 10 chars of secret
            
            # Get current time for logging
            current_time = datetime.utcnow().timestamp()
            logger.debug(f"Current server time: {current_time}")
            
            # First decode without verification to check claims
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            logger.debug(f"Unverified payload: {unverified_payload}")
            
            # Log timing details before verification
            if 'iat' in unverified_payload:
                iat_time = unverified_payload['iat']
                time_diff = current_time - iat_time
                logger.debug(f"Token iat: {iat_time}, Time difference: {time_diff} seconds")
            
            # Decode and verify the JWT token with increased leeway
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"], 
                audience="authenticated",
                options={
                    "verify_exp": True,
                    "verify_iat": True,
                    "verify_aud": True,
                },
                leeway=300  # Increase leeway to 5 minutes to handle larger clock skews
            )
            
            # Log successful decode
            logger.debug(f"Token decoded successfully. Payload: {payload}")
            return payload
            
        except jwt.InvalidIssuedAtError as e:
            logger.error(f"Token iat validation error: {str(e)}")
            logger.error(f"Current time: {current_time}, Token iat: {unverified_payload.get('iat')}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token validation failed: Server time is behind token issuance time"
            )
        except (PyJWTError, ExpiredSignatureError) as e:
            logger.error(f"Token validation error: {str(e)}")
            logger.error(f"Token details - Length: {len(token)}, Format: {token[:10]}...")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error during token decode: {str(e)}")
            logger.exception("Stack trace:")  # This will log the full stack trace
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication error: {str(e)}"
            )

    def extract_user_data(self, payload: Dict) -> UserData:
        """Extract user data from JWT payload"""
        user_metadata = payload.get('user_metadata', {})
        
        return UserData(
            id=payload.get('sub'),
            email=payload.get('email'),
            full_name=user_metadata.get('full_name'),
            avatar_url=user_metadata.get('avatar_url'),
            provider=payload.get('app_metadata', {}).get('provider')
        )

auth_service = AuthService()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> UserData:
    """
    Dependency to get the current authenticated user from the access token.
    Usage:
    @app.get("/protected")
    async def protected_route(user: UserData = Depends(get_current_user)):
        return {"message": f"Hello {user.full_name}"}
    """
    try:
        logger.debug("get_current_user called with credentials")
        if not credentials:
            logger.error("No credentials provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No credentials provided"
            )
            
        logger.debug(f"Authorization scheme: {credentials.scheme}")
        logger.debug(f"Token received: {credentials.credentials[:10]}...")
        
        # Verify and decode the access token
        logger.debug("Attempting to decode access token")
        payload = auth_service.decode_token(credentials.credentials)
        
        logger.debug(f"Token decoded successfully. Extracting user data from payload: {payload}")
        # Extract user data from the payload
        user = auth_service.extract_user_data(payload)
        logger.debug(f"User data extracted: id={user.id}, email={user.email}")
        
        return user
        
    except Exception as e:
        logger.error(f"Error in get_current_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

# Optional: Refresh token handling
async def refresh_access_token(refresh_token: str):
    """
    Handle token refresh if needed.
    Note: Supabase client libraries usually handle token refresh automatically,
    but this is here if you need manual refresh handling.
    """
    try:
        # You would typically call Supabase's token refresh endpoint
        # This is just a placeholder for the structure
        raise NotImplementedError(
            "Token refresh should typically be handled by Supabase client"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not refresh token"
        )

# Example protected route
from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
async def get_user_profile(user: UserData = Depends(get_current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "provider": user.provider
    }