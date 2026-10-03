import os
import json
import asyncio
import certifi
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from dotenv import load_dotenv
import motor.motor_asyncio
from google import genai
from bson import ObjectId

# Load environment variables (Gemini API key pulls from .env)
load_dotenv()

# Hardcoded MongoDB URI with your updated password
MONGO_URI = "mongodb+srv://allenchongtham2124_db_user:Aquara2124@cluster0.pndbjan.mongodb.net/?appName=Cluster0"

# Connect to MongoDB using certifi to resolve Linux SSL connection blocking
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URI, 
    serverSelectionTimeoutMS=5000, 
    tlsCAFile=certifi.where()
)

db = client.aquara_db
reports_collection = db.reports
incidents_collection = db.incidents

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

class IncidentStatusUpdate(BaseModel):
    status: str  # NEW, UNDER_REVIEW, FIELD_INSPECTION, RESPONSE, RESOLVED
    comment: Optional[str] = None

@app.get("/")
def health_check():
    return {"status": "Aquara API is live"}

# Retrieve all stored water reports for the frontend map
@app.get("/api/reports")
async def get_reports():
    try:
        reports = []
        async for doc in reports_collection.find():
            doc["_id"] = str(doc["_id"])
            reports.append(doc)
        return {"status": "success", "count": len(reports), "data": reports}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Create a new report and analyze via Gemini 3.5 Flash
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
    
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")
            
        gemini_client = genai.Client(api_key=api_key)
        
        loop = asyncio.get_event_loop()
        ai_response = await loop.run_in_executor(
            None, 
            lambda: gemini_client.models.generate_content(
                model='gemini-3.5-flash',
                contents=prompt
            )
        )
        
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

    try:
        result = await reports_collection.insert_one(report_doc)
        inserted_id = str(result.inserted_id)
    except Exception as e:
        inserted_id = f"temp_mock_id_mongo_offline: {str(e)}"

    return {
        "message": "Report processed successfully",
        "id": inserted_id,
        "ai_analysis": ai_data
    }

# Retrieve all aggregated incidents for the Authority Dashboard
@app.get("/api/incidents")
async def get_incidents():
    try:
        incidents = []
        async for doc in incidents_collection.find():
            doc["_id"] = str(doc["_id"])
            incidents.append(doc)
        return {"status": "success", "count": len(incidents), "data": incidents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Correlate nearby reports into an official Incident
@app.post("/api/incidents/correlate")
async def correlate_reports():
    try:
        reports = []
        async for doc in reports_collection.find():
            doc["_id"] = str(doc["_id"])
            reports.append(doc)

        if not reports:
            return {"status": "success", "message": "No reports to correlate"}

        groups = {}
        for r in reports:
            ai_data = r.get("ai_analysis", {})
            issue_type = ai_data.get("issue_type", "UNKNOWN")
            
            lat_approx = round(r["latitude"], 2)
            lon_approx = round(r["longitude"], 2)
            key = f"{issue_type}_{lat_approx}_{lon_approx}"
            
            if key not in groups:
                groups[key] = []
            groups[key].append(r)

        created_incidents = 0
        for key, group_reports in groups.items():
            issue_type, lat, lon = key.split("_", 2)
            
            incident_doc = {
                "issue_type": issue_type,
                "latitude": float(lat),
                "longitude": float(lon),
                "affected_households": len(group_reports) * 3,
                "independent_reports": len(group_reports),
                "evidence_level": "Community Supported" if len(group_reports) > 2 else "Emerging",
                "status": "NEW",
                "summary": f"Multiple independent observations indicate an issue ({issue_type}) in this sector.",
                "report_ids": [r["_id"] for r in group_reports],
                "created_at": datetime.utcnow().isoformat()
            }
            
            await incidents_collection.update_one(
                {"issue_type": issue_type, "latitude": float(lat), "longitude": float(lon)},
                {"$set": incident_doc},
                upsert=True
            )
            created_incidents += 1

        return {
            "status": "success", 
            "message": "Successfully processed correlation. Active incidents updated.",
            "incidents_count": created_incidents
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update Incident Status (For Authorities)
@app.patch("/api/incidents/{incident_id}/status")
async def update_incident_status(incident_id: str, update: IncidentStatusUpdate):
    try:
        result = await incidents_collection.update_one(
            {"_id": ObjectId(incident_id)},
            {"$set": {"status": update.status, "last_comment": update.comment, "updated_at": datetime.utcnow().isoformat()}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Incident not found")
            
        return {"status": "success", "message": f"Incident status updated to {update.status}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))