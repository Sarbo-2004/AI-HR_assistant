from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator, Field
from typing import List, Optional, Dict
import json
from PyPDF2 import PdfReader
from genai_handler import build_resume_sections
from nlp_utils import extract_keywords_from_jd, semantic_match_skills

app = FastAPI(title="AI Resume Generator API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CandidateProfile(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., pattern=r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
    phone: str = Field(..., min_length=10)
    education: str = Field(..., min_length=1)
    experience: str = Field(..., min_length=1)
    skills: List[str] = Field(..., min_items=1)
    certifications: Optional[str] = None
    projects: Optional[str] = None

    @validator('skills', pre=True)
    def validate_skills(cls, v):
        if isinstance(v, str):
            return [skill.strip() for skill in v.split(',') if skill.strip()]
        return v

def extract_text_from_file(file: UploadFile) -> str:
    try:
        if file.filename.endswith(".txt"):
            return file.file.read().decode("utf-8")
        elif file.filename.endswith(".pdf"):
            reader = PdfReader(file.file)
            text = "\n".join(page.extract_text() for page in reader.pages)
            if not text.strip():
                raise ValueError("PDF appears to be empty or unreadable")
            return text
        raise ValueError("Only .txt and .pdf files are supported")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File error: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/generate_resume/")
async def generate_section(
    candidate_data: str = Form(...),
    jd_file: UploadFile = File(...)
) -> Dict[str, Dict[str, str]]:
    try:
        # Parse and validate input
        candidate_dict = json.loads(candidate_data)
        candidate = CandidateProfile(**candidate_dict)
        
        # Process file
        jd_text = extract_text_from_file(jd_file)
        
        # Generate resume sections
        jd_keywords = extract_keywords_from_jd(jd_text)
        matched_skills = semantic_match_skills(candidate.skills, jd_text)
        sections = build_resume_sections(candidate, jd_text, matched_skills, jd_keywords)

        return JSONResponse({
            "status": "success",
            "data": {
                "sections": sections,
                "matched_skills": matched_skills,
                "jd_keywords": jd_keywords,
                "analysis": {
                    "match_score": f"{len(matched_skills)/len(candidate.skills)*100:.1f}%",
                    "top_keywords": jd_keywords[:5]
                }
            }
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume generation failed: {str(e)}"
        )