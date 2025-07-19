import io
import json
import cv2
# import numpy as np
from PIL import Image
import folium
from google.cloud import vision
from google.cloud.vision_v1 import types
from google.oauth2 import service_account
import re
from datetime import datetime
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Dict, List
from .metadata_analysis import ImageMetadataPIIAnalyzer

def load_credentials(config_file):
    credentials = service_account.Credentials.from_service_account_info(json.load(config_file))
    client = vision.ImageAnnotatorClient(credentials=credentials)
    return client

def prepare_image(uploaded_image):
    image_bytes = uploaded_image.read()
    vision_image = types.Image(content=image_bytes)
    pil_image = Image.open(io.BytesIO(image_bytes))
    return image_bytes, vision_image, pil_image

def detect_landmarks(client, vision_image):
    response = client.landmark_detection(image=vision_image)
    return response.landmark_annotations

def detect_logos(client, vision_image):
    response = client.logo_detection(image=vision_image)
    return response.logo_annotations

# def detect_objects(client, vision_image, image_bytes):
#     response = client.object_localization(image=vision_image)
#     objects = response.localized_object_annotations
#     np_image = None
#     if objects:
#         np_image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
#         for obj in objects:
#             vertices = [(int(v.x * np_image.shape[1]), int(v.y * np_image.shape[0])) for v in obj.bounding_poly.normalized_vertices]
#             for i in range(4):
#                 cv2.line(np_image, vertices[i], vertices[(i + 1) % 4], (0, 255, 0), 2)
#             cv2.putText(np_image, f"{obj.name} ({int(obj.score * 100)}%)", vertices[0], cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
#         np_image = cv2.cvtColor(np_image, cv2.COLOR_BGR2RGB)
#     return objects, np_image

def detect_web_entities(client, vision_image):
    response = client.web_detection(image=vision_image)
    return response.web_detection

def create_folium_map(landmarks):
    lat = landmarks[0].locations[0].lat_lng.latitude
    lon = landmarks[0].locations[0].lat_lng.longitude
    m = folium.Map(location=[lat, lon], zoom_start=15)
    for landmark in landmarks:
        coords = landmark.locations[0].lat_lng
        folium.Marker([coords.latitude, coords.longitude], tooltip=landmark.description).add_to(m)
    return m

def detect_text(client, vision_image):
    response = client.text_detection(image=vision_image)
    return response.text_annotations