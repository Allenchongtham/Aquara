import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
import motor.motor_asyncio
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-1.5-flash')

# Connect to MongoDB with a 3-second server selection timeout so it fails fast instead of hanging
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=3000)

db = client.aquara_db
reports_collection = db.reports

app = FastAPI(title="Aquara API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportInput(BaseModel):
    latitude: float
    longitude: float
    description: str

@app.get("/")
def health_check():
    return {"status": "Aquara API is live"}

@app.post("/api/reports")
async def create_report(report: ReportInput):
    
    prompt = f"""
    Analyze this water/irrigation report: "{report.description}"
    Return ONLY a valid JSON object with these exact keys:
    - "issue_type": (e.g., "DRY_CANAL", "PIPE_BURST", "NO_WATER")
    - "severity": ("HIGH", "MEDIUM", "LOW")
    - "language": (The language used)
    Do not include markdown backticks or extra text.
    """
    
    # Run Gemini call inside a thread pool so it doesn't block the async event loop
    try:
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")
            
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(None, lambda: model.generate_content(prompt))
        
        # Clean up output in case Gemini returns markdown formatting
        clean_text = ai_response.text.replace("```json", "").replace("```", "").strip()
        ai_data = json.loads(clean_text)
    except Exception as e:
        ai_data = {
            "issue_type": "NO_WATER" if "water" in report.description.lower() else "UNKNOWN",
            "severity": "HIGH",
            "language": "English",
            "fallback": True,
            "error_details": str(e)
        }

    report_doc = {
        "latitude": report.latitude,
        "longitude": report.longitude,
        "original_text": report.description,
        "ai_analysis": ai_data,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Attempt database save with fallback if local MongoDB server is offline
    try:
        result = await reports_collection.insert_one(report_doc)
        inserted_id = str(result.inserted_id)
    except Exception:
        inserted_id = "temp_mock_id_mongo_offline"

    return {
        "message": "Report processed successfully",
        "id": inserted_id,
        "ai_analysis": ai_data
    }