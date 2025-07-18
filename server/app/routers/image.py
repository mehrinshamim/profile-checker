from fastapi import APIRouter, Depends, HTTPException, Request
from app.util.auth import get_current_user, UserData
from ..services.supabase_service import supabase
from ..services.gvision_folium_service import (
    load_credentials, prepare_image, detect_landmarks, detect_logos,
    detect_objects, detect_web_entities, detect_text
)
from ..services.metadata_analysis import ImageMetadataPIIAnalyzer, create_metadata_map
from ..services.gemini_agent import GeminiAgent
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

class AnalyzeRequest(BaseModel):
    userid: str
    gemini_api_key: str = None
    serp_api_key: str = None

@router.post("/analyze-photo")
async def analyze_photo(
    body: AnalyzeRequest,
    current_user: UserData = Depends(get_current_user)
):
    # Get photo bytes
    image_bytes = fetch_photo_bytes(body.userid)
    # Prepare image for analysis
    _, vision_image, pil_image = prepare_image(io.BytesIO(image_bytes))
    # Load credentials (adjust as needed for your setup)
    # client = load_credentials(...)  # You may need to fetch credentials per user/session

    # Run analyses (assuming you have a client object)
    # landmarks = detect_landmarks(client, vision_image)
    # logos = detect_logos(client, vision_image)
    # objects, np_image = detect_objects(client, vision_image, image_bytes)
    # web_data = detect_web_entities(client, vision_image)
    # text_annots = detect_text(client, vision_image)
    # extracted_text = text_annots[0].description if text_annots else ""

    # analyzer = ImageMetadataPIIAnalyzer()
    # analysis_result = analyzer.analyze_comprehensive_pii(image_bytes)

    # Return results (fill in with actual analysis results)
    return {
        "message": "Analysis results here",
        # "landmarks": ...,
        # "logos": ...,
        # "objects": ...,
        # "web_entities": ...,
        # "extracted_text": ...,
        # "pii_analysis": ...,
    }



