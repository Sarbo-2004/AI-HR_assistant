from pydantic import BaseModel
from typing import List, Optional

class CandidateProfile(BaseModel):
    name: str
    email: str
    phone: str
    education: str
    experience: str
    skills: List[str]
    certifications: Optional[str] = None
    projects: Optional[str] = None

class ResumeRequest(BaseModel):
    candidate: CandidateProfile
    job_description: str
