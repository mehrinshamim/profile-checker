from fastapi import APIRouter, Depends, HTTPException, Request
from app.util.auth import get_current_user, UserData
from ..services.supabase_service import supabase

from pydantic import BaseModel
import requests
import io


router = APIRouter()

class UserIdRequest(BaseModel):
    userid: str

@router.post("/get-photo-url")
async def get_photo_url(
    request: Request,
    body: UserIdRequest,
    current_user: UserData = Depends(get_current_user)
):
    # Authenticate user (already done by Depends)
    user_id = body.userid

    # Fetch photo_url from Supabase profileurl table
    response = supabase.table("profileurl").select("photo_url").eq("user_id", user_id).single().execute()
    if response.data and "photo_url" in response.data:
        return {"photo_url": response.data["photo_url"]}
    else:
        raise HTTPException(status_code=404, detail="Photo URL not found for user")

def fetch_photo_bytes(user_id: str) -> bytes:
    # Get photo URL using your DRY function
    response = supabase.table("profileurl").select("photo_url").eq("user_id", user_id).single().execute()
    if response.data and "photo_url" in response.data:
        photo_url = response.data["photo_url"]
    else:
        raise HTTPException(status_code=404, detail="Photo URL not found for user")
    # Fetch photo bytes
    photo_response = requests.get(photo_url)
    if photo_response.status_code == 200:
        return photo_response.content
    else:
        raise HTTPException(status_code=400, detail="Could not fetch photo from URL")
