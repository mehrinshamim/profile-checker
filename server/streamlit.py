import streamlit as st
from streamlit_folium import folium_static
from app.services.gvision_folium_service import (
    load_credentials, prepare_image, detect_landmarks, detect_logos,
    detect_objects, detect_web_entities, create_folium_map, detect_text
)
from services.metadataanalysis import ImageMetadataPIIAnalyzer,create_metadata_map
from services.gemini_agent import GeminiAgent  # <-- Add this import
import xyzservices.providers as xyz
import folium
import io
from PIL import Image
import numpy as np
import cv2
import json

st.set_page_config(page_title="Reverse image search", page_icon="🧪", layout="wide")
st.title("🎯 Reverse image search")

# Add sidebar fields for Gemini and SerpAPI keys
gemini_api_key = st.sidebar.text_input("Gemini API Key", type="password")
serp_api_key = st.sidebar.text_input("SerpAPI Key", type="password")

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

# Create tabbed interface (add a 6th tab for PII)
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📍 Landmarks", "🏷️ Logos", "📦 Objects", "🌐 Web Entities", "🤖 Text & AI Analysis", "🕵️ PII Analysis"
])

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

# --- TEXT & AI ANALYSIS ---
with tab5:
    st.header("🤖 Text Detection & Gemini AI Analysis")
    with st.spinner("Extracting text from image..."):
        text_annots = detect_text(client, vision_image)
        extracted_text = text_annots[0].description if text_annots else ""
    if extracted_text:
        st.subheader("📝 Extracted Text")
        st.text_area("Extracted Text", extracted_text, height=200, disabled=True)
        if gemini_api_key and serp_api_key:
            st.subheader("🔎 Gemini AI Analysis")
            if st.button("Analyze with Gemini AI"):
                gemini_agent = GeminiAgent(gemini_api_key, serp_api_key)
                with st.spinner("Gemini AI is analyzing..."):
                    result = gemini_agent.quick_analyze(extracted_text)
                st.markdown(result)
        else:
            st.info("Please provide both Gemini and SerpAPI keys in the sidebar to enable AI analysis.")
    else:
        st.warning("No text detected in the image.")

# --- PII ANALYSIS ---
with tab6:
    st.header("🕵️ Comprehensive Privacy Analysis")
    analyzer = ImageMetadataPIIAnalyzer()
    analysis_result = analyzer.analyze_comprehensive_pii(image_bytes)

    if 'error' not in analysis_result:
        risk_assessment = analysis_result['risk_assessment']
        risk_colors = {
            'CRITICAL': '🔴', 'HIGH': '🟠', 'MEDIUM': '🟡',
            'LOW': '🟢', 'MINIMAL': '✅'
        }
        st.subheader(f"{risk_colors.get(risk_assessment['level'], '⚪')} Overall Privacy Risk: {risk_assessment['level']}")
        st.write(f"**Risk Score**: {risk_assessment.get('score', 0)}/10")
        st.write(f"**Summary**: {risk_assessment['summary']}")
        
        findings = analysis_result['findings']
        if findings:
            st.subheader('⚠️ Detailed Privacy Findings')
            categories = {}
            for finding in findings:
                category = finding.get('category', 'Other')
                if category not in categories:
                    categories[category] = []
                categories[category].append(finding)
            
            for category, category_findings in categories.items():
                with st.expander(f"📂 {category} Privacy Risks ({len(category_findings)} found)", expanded=True):
                    for finding in category_findings:
                        risk_icon = risk_colors.get(finding['risk'], '⚪')
                        st.write(f"{risk_icon} **{finding['type']}** ({finding['risk']} Risk)")
                        st.write(f"**Data Found**: {finding['data']}")
                        st.write(f"**Privacy Concern**: {finding['concern']}")
                        if 'recommendation' in finding:
                            st.write(f"**Recommendation**: {finding['recommendation']}")
                        st.write("")
            
            exif_data = analysis_result.get('exif_data', {})
            if exif_data:
                with st.expander("📋 Raw EXIF Data", expanded=False):
                    for key, value in exif_data.items():
                        if key != 'GPSInfo':
                            st.write(f"**{key}**: {value}")
                        else:
                            st.write(f"**GPS Information**:")
                            for gps_key, gps_value in value.items():
                                st.write(f"  - {gps_key}: {gps_value}")
            
            metadata_map = create_metadata_map(exif_data)
            if metadata_map:
                st.subheader('📍 GPS Location from Metadata')
                st.warning("⚠️ This map shows the exact location where your photo was taken!")
                folium_static(metadata_map)
        else:
            st.success("✅ No significant privacy risks found in metadata")

        metadata_summary = analysis_result['metadata_summary']
        st.subheader('📊 Metadata Summary')
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Image Format", metadata_summary.get('format', 'Unknown'))
        with col2:
            size = metadata_summary.get('size', [0,0])
            st.metric("Image Size", f"{size[0]}x{size[1]}")
        with col3:
            st.metric("Metadata Fields", metadata_summary.get('total_metadata_fields', 0))
    else:
        st.error(f"❌ Error analyzing metadata: {analysis_result['error']}")


