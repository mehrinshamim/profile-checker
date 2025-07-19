from app.services.gvision_folium_service import (
    detect_landmarks, detect_logos,# detect_objects,
    detect_web_entities, detect_text
)
from app.services.metadata_analysis import ImageMetadataPIIAnalyzer
from app.services.gemini_agent import GeminiAgent

def aggregate_image_analysis(
    image_bytes,
    vision_client,
    vision_image,
    pil_image,
    gemini_agent=None
):
    # 1. Google Vision analyses
    landmarks = detect_landmarks(vision_client, vision_image)
    logos = detect_logos(vision_client, vision_image)
    # objects, _ = detect_objects(vision_client, vision_image, image_bytes)
    web_data = detect_web_entities(vision_client, vision_image)
    text_annots = detect_text(vision_client, vision_image)
    extracted_text = text_annots[0].description if text_annots else ""

    # 2. Gemini Agent analysis
    gemini_result = None
    if gemini_agent and extracted_text:
        gemini_result = gemini_agent.quick_analyze(extracted_text)

    # 3. Metadata/PII analysis
    analyzer = ImageMetadataPIIAnalyzer()
    pii_result = analyzer.analyze_comprehensive_pii(image_bytes)

    # 4. Aggregate vulnerabilities and sources/domains
    vulnerabilities = []
    sources = set()

    # Landmarks, logos, objects
    if landmarks:
        vulnerabilities.append("Landmarks detected: " + ", ".join([l.description for l in landmarks]))
    if logos:
        vulnerabilities.append("Logos detected: " + ", ".join([l.description for l in logos]))
    # if objects:
    #     vulnerabilities.append("Objects detected: " + ", ".join([o.name for o in objects]))

    # Web entities and visually similar images
    if hasattr(web_data, "web_entities") and web_data.web_entities:
        vulnerabilities.append("Web entities: " + ", ".join([e.description for e in web_data.web_entities if e.description]))
    if hasattr(web_data, "pages_with_matching_images") and web_data.pages_with_matching_images:
        sources.update([p.url for p in web_data.pages_with_matching_images])
    if hasattr(web_data, "visually_similar_images") and web_data.visually_similar_images:
        sources.update([img.url for img in web_data.visually_similar_images])

    # Extracted text
    if extracted_text:
        vulnerabilities.append(f"Text found in image: {extracted_text[:100]}...")

    # Gemini Agent summary
    if gemini_result:
        vulnerabilities.append(f"AI summary: {gemini_result}")

    # PII findings
    if pii_result and "findings" in pii_result:
        for finding in pii_result["findings"]:
            vulnerabilities.append(f"PII risk ({finding['risk']}): {finding['type']} - {finding['data']}")

    # Domains
    domains = [url.split("/")[2] for url in sources if "://" in url]

    return {
        "vulnerabilities": vulnerabilities,
        "sources": list(sources),
        "domains": list(set(domains)),
        "pii_risk_summary": pii_result.get("risk_assessment", {}) if pii_result else {},
    }

def summarize_vulnerabilities_with_gemini(agg_result, gemini_agent: GeminiAgent):
    """
    Use GeminiAgent to summarize vulnerabilities and sources/domains.
    """
    summary_prompt = (
        "Summarize the following image analysis vulnerabilities and sources/domains. "
        "List the main risks, and mention the domains/links where information can be found. "
        "Here is the data:\n"
        f"Vulnerabilities: {agg_result['vulnerabilities']}\n"
        f"Sources: {agg_result['sources']}\n"
        f"Domains: {agg_result['domains']}\n"
        f"PII Risk Summary: {agg_result['pii_risk_summary']}\n"
    )
    summary = gemini_agent.quick_analyze(summary_prompt)
    return summary

def test_aggregate_and_summarize():
    """
    Interactive test function to aggregate and summarize vulnerabilities for a given image path.
    Prompts user for image path and credentials path, and loads Gemini/Serp API keys from environment.
    """
    import os
    import json
    import io

    # Get API keys from environment variables
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    serp_api_key = os.getenv("SERP_API_KEY")

    if not gemini_api_key or not serp_api_key:
        print("Please set GEMINI_API_KEY and SERP_API_KEY in your environment (.env file).")
        return

    # Prompt user for image and credentials path
    image_path = input("Enter the path to the image file: ").strip()
    credentials_path = input("Enter the path to the Google Vision API credentials JSON file: ").strip()

    # Load credentials
    from app.services.gvision_folium_service import load_credentials, prepare_image
    from app.services.gemini_agent import GeminiAgent

    try:
        with open(credentials_path, "r") as f:
            credentials_json = json.load(f)
        client = load_credentials(io.BytesIO(json.dumps(credentials_json).encode()))
    except Exception as e:
        print(f"Error loading credentials: {e}")
        return

    # Load image
    try:
        with open(image_path, "rb") as img_file:
            image_bytes, vision_image, pil_image = prepare_image(io.BytesIO(img_file.read()))
    except Exception as e:
        print(f"Error loading image: {e}")
        return

    # Create Gemini agent
    gemini_agent = GeminiAgent(gemini_api_key, serp_api_key)

    # Aggregate results
    agg_result = aggregate_image_analysis(
        image_bytes, client, vision_image, pil_image, gemini_agent
    )

    # Summarize vulnerabilities
    summary = summarize_vulnerabilities_with_gemini(agg_result, gemini_agent)

    print("Aggregated Result:")
    print(agg_result)
    print("\nGemini Summary:")
    print(summary)

if __name__ == "__main__":
    test_aggregate_and_summarize()

