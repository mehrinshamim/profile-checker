import streamlit as st
from streamlit_folium import folium_static
from services.reverse_image import (
    load_credentials, prepare_image, detect_landmarks, detect_logos,
    detect_objects, detect_web_entities, create_folium_map
)

st.set_page_config(page_title="Reverse image search", page_icon="🧪", layout="wide")
st.title("🎯 Reverse image search")

# Upload credentials
st.sidebar.header("🔐 Config")
config_file = st.sidebar.file_uploader("Upload Google Vision API credentials", type=["json"])
uploaded_image = st.sidebar.file_uploader("📤 Upload Image", type=["jpg", "jpeg", "png"])

if config_file:
    try:
        client = load_credentials(config_file)
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
image_bytes, vision_image, pil_image = prepare_image(uploaded_image)

# Create tabbed interface
tab1, tab2, tab3, tab4 = st.tabs(["📍 Landmarks", "🏷️ Logos", "📦 Objects", "🌐 Web Entities"])

# --- LANDMARK DETECTION ---
with tab1:
    st.header("📍 Landmark Detection")
    landmarks = detect_landmarks(client, vision_image)
    col1, col2 = st.columns([1, 1])
    with col1:
        st.image(pil_image, use_container_width=True)
    if landmarks:
        with col2:
            m = create_folium_map(landmarks)
            folium_static(m)
        st.success(f"Detected: {landmarks[0].description}")
    else:
        st.warning("No landmarks detected.")

# --- LOGO DETECTION ---
with tab2:
    st.header("🏷️ Logo Detection")
    logos = detect_logos(client, vision_image)
    if logos:
        for logo in logos:
            st.markdown(f"- **{logo.description}**")
    else:
        st.info("No logos detected.")

# --- OBJECT DETECTION ---
with tab3:
    st.header("📦 Object Detection")
    objects, np_image = detect_objects(client, vision_image, image_bytes)
    if objects:
        st.image(np_image, channels="RGB")
    else:
        st.info("No objects detected.")

# --- WEB DETECTION ---
with tab4:
    st.header("🌐 Web Detection")
    web_data = detect_web_entities(client, vision_image)

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