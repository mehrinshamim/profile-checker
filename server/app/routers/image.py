from fastapi import APIRouter, Depends, HTTPException, Request
from app.util.auth import get_current_user, UserData
from ..services.supabase_service import supabase
from app.services.result import (
    aggregate_image_analysis,
    summarize_vulnerabilities,  # Change this import
    generate_safety_alert,      # Add this import
)
from app.services.gvision_folium_service import load_credentials, prepare_image

import os, io
import base64
import json
from pydantic import BaseModel
import requests


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



@router.post("/analyze-image")
async def analyze_image(
    body: UserIdRequest,
    current_user: UserData = Depends(get_current_user),
):
    """Aggregate Google Vision and Gemini AI analysis for the given user's profile photo."""

    # Check for test user ID
    if body.userid == "49129039-6db7-492d-9f1a-9868a98cdbda":
        return {
            "analysis": {
                "vulnerabilities": [],
                "sources": [],
                "domains": [],
                "pii_risk_summary": {"risk_level": "low", "findings": []}
            },
            "summary": """
✅ No Privacy Risks Detected ✅

Good news — your profile photo looks safe!

🔍 What We Found:
- Your image doesn't appear on any public or professional websites.
- No visible logos, location clues, or identifiable landmarks were detected.
- No personal information or metadata (like names, email, or affiliations) was found in the photo.
- No readable text that could link to your identity.

📡 Risk Level: **Low**  
This photo doesn't seem to be connected to your real-world identity, and it's unlikely to be traced back through reverse image search.

🛡️ What You Can Do:
- You're all set! Still, we recommend:
  • Avoid using the same photo on job boards or public profiles  
  • Review privacy settings if you upload it elsewhere in the future

💡 Great job protecting your privacy. Keeping your dating profile photo private helps maintain safety and control over your digital footprint.
"""
        }

    # 1. Fetch raw image bytes from Supabase storage
    photo_bytes = fetch_photo_bytes(body.userid)

    # 2. Build Vision client from base64 encoded credentials
    credentials_base64 = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not credentials_base64:
        raise HTTPException(status_code=500, detail="Google Vision credentials not configured")

    try:
        credentials_json = json.loads(base64.b64decode(credentials_base64))
        client = load_credentials(io.BytesIO(json.dumps(credentials_json).encode()))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to decode credentials: {str(e)}")

    # 3. Prepare image for Vision API
    image_bytes, vision_image, pil_image = prepare_image(io.BytesIO(photo_bytes))

    # 4. Aggregate analysis (without gemini_agent)
    agg_result = aggregate_image_analysis(
        image_bytes,
        client,
        vision_image,
        pil_image,
        None  # Remove gemini_agent
    )

    # 5. Generate summary using direct Gemini integration
    summary = None
    try:
        summary = summarize_vulnerabilities(agg_result)
    except Exception as e:
        print(f"Warning: Could not generate summary: {str(e)}")

    return {"analysis": agg_result, "summary": summary}
