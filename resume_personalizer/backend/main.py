from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from schema import CandidateProfile
from genai_handler import build_resume_sections
from nlp_utils import extract_keywords_from_jd, semantic_match_skills
import json
from PyPDF2 import PdfReader

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_file(file: UploadFile) -> str:
    if file.filename.endswith(".txt"):
        return file.file.read().decode("utf-8")
    elif file.filename.endswith(".pdf"):
        
        reader = PdfReader(file.file)
        return "\n".join(page.extract_text() for page in reader.pages)
    else:
        raise ValueError("Unsupported file type")

@app.post("/generate_resume/")
async def generate_section(candidate_data: str = Form(...), jd_file: UploadFile = File(...)):
    try:
        candidate_dict = json.loads(candidate_data)
        candidate = CandidateProfile(**candidate_dict)
        jd_text = extract_text_from_file(jd_file)

        jd_keywords = extract_keywords_from_jd(jd_text)
        matched_skills = semantic_match_skills(candidate.skills, jd_text)

        sections = build_resume_sections(candidate, jd_text, matched_skills, jd_keywords)

        return {"sections": sections}
    
    except Exception as e:
        return {"error": str(e)}
