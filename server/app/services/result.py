from app.services.gvision_folium_service import (
    detect_landmarks, detect_logos,
    detect_web_entities, detect_text,
    load_credentials, prepare_image
)
from app.services.metadata_analysis import ImageMetadataPIIAnalyzer
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import io
import base64

# Initialize Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_safety_alert(prompt):
    """Generate safety alert using Gemini directly"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating alert: {str(e)}"

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
def summarize_vulnerabilities(agg_result):
    """
    Generate a user-friendly privacy alert message using Gemini.
    Prompt includes few-shot examples for more structured output.
    """
    summary_prompt = f"""
You are the privacy safety assistant for a dating app called **MISMATCHED**. Your job is to alert users if their profile photo could reveal their real-world identity. Write in a clear, emoji-enhanced, non-technical tone.

Your response should follow this format:
🚨 Privacy Alert: Profile Photo Risk Detected 🚨

🔍 What We Found:
- (List of sites the photo appears on)
- (Metadata or visible personal info: names, affiliations, etc.)
- (Mentions of photographers or visible places/logos)
- (Any text that could identify user)

📡 Risk Level: (Low / Elevated / High) — explain briefly

⚠️ What You Should Do:
- (2-3 clear safety tips)

🛡️ End with a short digital safety reminder.

---

📌 **Example 1:**

🚨 Privacy Alert: Profile Photo Risk Detected 🚨

Your current profile photo may expose personally identifiable information.

🔍 What We Found:
- Your photo was found on:
  • LinkedIn  
  • Resume-hosting site ResumeNest  
- Metadata includes name: *Nandini V. Roy*
- Associated with: Internship at GovTech India

📡 Risk Level: **High**  
This image is linked to your professional identity and can be reverse-searched.

⚠️ What You Should Do:
- 🔁 Use a photo not uploaded elsewhere  
- ✂️ Remove metadata or watermarks  
- 🔒 Tighten privacy settings on professional profiles

🛡️ Remember: A photo can be a breadcrumb to your real-world identity.

---

📌 **Example 2:**

🚨 Privacy Alert: Profile Photo Risk Detected 🚨

🔍 What We Found:
- Your profile image appears on:
  • Your college website  
  • A national-level hackathon gallery  
- Photographer: *Rishi K Mehta*
- Visible logo: *IIT-Ropar Hack 2024*

📡 Risk Level: **Elevated**  
While not directly named, this image is traceable through events and logos.

⚠️ What You Should Do:
- Switch to a neutral, privately-taken photo  
- Avoid event backgrounds or college shirts  
- Check reverse image visibility via Google Lens

🛡️ Digital clues add up — protect your privacy from unwanted exposure.

---

📌 **Now generate a personalized alert for this user:**

Vulnerabilities Found: {agg_result['vulnerabilities']}  
Image Found On: {agg_result['sources']}  
Websites: {agg_result['domains']}  
Personal Info Risks: {agg_result['pii_risk_summary']}  
"""

    return generate_safety_alert(summary_prompt)


def test_aggregate_and_summarize():
    """Interactive test function"""
    load_dotenv()
    
    credentials_base64 = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if not credentials_base64:
        print("Missing Google credentials")
        return

    image_path = input("Enter the path to the image file: ").strip()

    try:
        # Decode and load credentials
        credentials_json = json.loads(base64.b64decode(credentials_base64))
        client = load_credentials(io.BytesIO(json.dumps(credentials_json).encode()))

        # Load and prepare image
        with open(image_path, "rb") as img_file:
            image_bytes, vision_image, pil_image = prepare_image(io.BytesIO(img_file.read()))

        # Aggregate results without Gemini agent
        agg_result = aggregate_image_analysis(
            image_bytes, client, vision_image, pil_image, None
        )

        # Generate summary
        summary = summarize_vulnerabilities(agg_result)

        print("\nAggregated Result:")
        print(json.dumps(agg_result, indent=2))
        print("\nSafety Alert:")
        print(summary)

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_aggregate_and_summarize()

