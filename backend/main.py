import os
import logging
from flask import Flask, request, jsonify
from google.cloud import firestore, vision
import google.generativeai as genai
from typing import List, Dict, Any

# Configure logging to show messages in Cloud Run
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
app = Flask(__name__)

# --- Client Initialization ---
try:
    logging.info("Initializing Google Cloud clients...")
    GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
    db = firestore.Client()
    vision_client = vision.ImageAnnotatorClient()
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    logging.info("Clients initialized successfully.")
except KeyError as e:
    logging.critical(f"FATAL: Missing environment variable: {e}. The service cannot start.")
    
# --- Main Flask Route ---
@app.route("/", methods=["POST"])
def handle_firestore_event():
    logging.info("--- TRIGGER RECEIVED: Backend process started. ---")
    event = request.get_json()
    
    if not (event and 'value' in event and 'name' in event['value']):
        logging.error(f"Invalid EventArc payload: {event}")
        return "Bad Request: Invalid payload", 400

    doc_path = event["value"]["name"].split("/documents/")[-1]
    logging.info(f"Step 1: Extracted document path -> {doc_path}")

    doc_ref = db.document(doc_path)
    
    try:
        logging.info(f"Step 2: Fetching document from Firestore...")
        doc_snap = doc_ref.get()
        if not doc_snap.exists:
            logging.warning(f"Document {doc_path} does not exist.")
            return "Document not found", 200
        product = doc_snap.to_dict()
        logging.info("Step 2 successful: Document fetched.")
    except Exception as e:
        logging.error(f"!!! FAILED at Step 2: Could not fetch from Firestore. Error: {str(e)}")
        return "Firestore read error", 500

    image_url = product.get("imageUrl")
    if not image_url:
        logging.warning("No 'imageUrl' field found in the document.")
        return "Missing imageUrl", 200

    labels = []
    try:
        logging.info(f"Step 3: Calling Vision API for image: {image_url}")
        image = vision.Image(source=vision.ImageSource(image_uri=image_url))
        response = vision_client.label_detection(image=image, max_results=10)
        labels = [label.description for label in response.label_annotations] if response.label_annotations else []
        logging.info(f"Step 3 successful: Vision API returned labels -> {labels}")
    except Exception as e:
        logging.error(f"!!! FAILED at Step 3: Vision API call failed. Error: {str(e)}")
        return "Vision API error", 500

    prompt = f"Generate a short, creative Instagram caption for a product named '{product.get('productName', 'N/A')}'."
    
    caption = ""
    try:
        logging.info("Step 4: Calling Gemini AI to generate caption...")
        response = model.generate_content(prompt)
        caption = response.text.strip()
        logging.info("Step 4 successful: Gemini AI returned a caption.")
    except Exception as e:
        logging.error(f"!!! FAILED at Step 4: Gemini API call failed. Error: {str(e)}")
        return "Gemini API error", 500

    try:
        logging.info("Step 5: Updating Firestore document with the new caption...")
        doc_ref.update({"postDescription": caption, "aiLabels": labels})
        logging.info("--- SUCCESS: Backend process finished. ---")
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        logging.error(f"!!! FAILED at Step 5: Firestore update failed. Error: {str(e)}")
        return "Firestore update error", 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))