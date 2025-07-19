import io
import json
import cv2
import numpy as np
import server.streamlit_test as st
from PIL import Image
import folium
from streamlit_folium import folium_static
from google.cloud import vision
from google.cloud.vision_v1 import types
from google.oauth2 import service_account

st.set_page_config(page_title="Reverse image search", page_icon="🧪", layout="wide")
st.title("🎯 Reverse image search")


# Upload credentials
st.sidebar.header("🔐 Config")
config_file = st.sidebar.file_uploader("Upload Google Vision API credentials", type=["json"])
uploaded_image = st.sidebar.file_uploader("📤 Upload Image", type=["jpg", "jpeg", "png"])

if config_file:
    try:
        credentials = service_account.Credentials.from_service_account_info(json.load(config_file))
        client = vision.ImageAnnotatorClient(credentials=credentials)
        st.sidebar.success("Credentials loaded.")
    except Exception as e:
        st.sidebar.error(f"Error loading credentials: {e}")
        st.stop()
else:
    st.warning("Please upload the config file.")
    st.stop()

if not uploaded_image:
    st.info("📸 Upload an image to get started.")
    st.stop()

# Prepare image
image_bytes = uploaded_image.read()
vision_image = types.Image(content=image_bytes)
pil_image = Image.open(io.BytesIO(image_bytes))

# Create tabbed interface
tab1, tab2, tab3, tab4 = st.tabs(["📍 Landmarks", "🏷️ Logos", "📦 Objects", "🌐 Web Entities"])

# --- LANDMARK DETECTION ---
with tab1:
    st.header("📍 Landmark Detection")
    response = client.landmark_detection(image=vision_image)
    landmarks = response.landmark_annotations
    col1, col2 = st.columns([1, 1])
    with col1:
        st.image(pil_image, use_container_width=True)
    if landmarks:
        with col2:
            lat = landmarks[0].locations[0].lat_lng.latitude
            lon = landmarks[0].locations[0].lat_lng.longitude
            m = folium.Map(location=[lat, lon], zoom_start=15)
            for landmark in landmarks:
                coords = landmark.locations[0].lat_lng
                folium.Marker([coords.latitude, coords.longitude], tooltip=landmark.description).add_to(m)
            folium_static(m)
        st.success(f"Detected: {landmarks[0].description}")
    else:
        st.warning("No landmarks detected.")

# --- LOGO DETECTION ---
with tab2:
    st.header("🏷️ Logo Detection")
    response = client.logo_detection(image=vision_image)
    logos = response.logo_annotations
    if logos:
        for logo in logos:
            st.markdown(f"- **{logo.description}**")
    else:
        st.info("No logos detected.")

# --- OBJECT DETECTION ---
with tab3:
    st.header("📦 Object Detection")
    response = client.object_localization(image=vision_image)
    objects = response.localized_object_annotations
    if objects:
        np_image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        for obj in objects:
            vertices = [(int(v.x * np_image.shape[1]), int(v.y * np_image.shape[0])) for v in obj.bounding_poly.normalized_vertices]
            for i in range(4):
                cv2.line(np_image, vertices[i], vertices[(i + 1) % 4], (0, 255, 0), 2)
            cv2.putText(np_image, f"{obj.name} ({int(obj.score * 100)}%)", vertices[0], cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        np_image = cv2.cvtColor(np_image, cv2.COLOR_BGR2RGB)
        st.image(np_image, channels="RGB")
    else:
        st.info("No objects detected.")

# --- WEB DETECTION ---
with tab4:
    st.header("🌐 Web Detection")
    response = client.web_detection(image=vision_image)
    web_data = response.web_detection

    if web_data.web_entities:
        st.subheader("🔍 Web Entities")
        for entity in web_data.web_entities:
            if entity.description:
                st.markdown(f"- {entity.description} ({int(entity.score * 100)}%)")

    if web_data.pages_with_matching_images:
        st.subheader("🔗 Matching Pages")
        for page in web_data.pages_with_matching_images:
            st.markdown(f"[{page.url}]({page.url})")

    if web_data.visually_similar_images:
        st.subheader("🖼️ Similar Images")
        cols = st.columns(3)
        for i, img in enumerate(web_data.visually_similar_images):
            with cols[i % 3]:
                st.image(img.url, use_container_width=True)
    if not (web_data.web_entities or web_data.pages_with_matching_images or web_data.visually_similar_images):
        st.info("No web data found.")
