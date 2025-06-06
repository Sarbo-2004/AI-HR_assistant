import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

def build_resume_sections(candidate, jd_text, matched_skills, jd_keywords):
    base_prompt = f"""
Candidate Details:
Name: {candidate.name}
Education: {candidate.education}
Experience: {candidate.experience}
Skills: {', '.join(candidate.skills)}
Certifications: {candidate.certifications or 'None'}
Projects: {candidate.projects or 'None'}

Job Description:
{jd_text}

JD Keywords: {', '.join(jd_keywords)}
Matched Skills: {', '.join(matched_skills)}
"""

    summary_prompt = base_prompt + """
Write a section titled 'PROFESSIONAL SUMMARY' using 5-7 bullet points.
Each point should begin with '● ' and describe a strength, experience, or achievement related to the JD. Make it short, auick and impactful.
"""

    skills_prompt = base_prompt + """
Write a SKILLS section. Divide into:
- Languages
- Libraries/Frameworks
- Core Competencies
- Tools
- Soft Skills

Each should be a single line, comma-separated, and labeled. No bullets.
"""

    experience_prompt = base_prompt + """
Write an EXPERIENCE section in 3-5 bullet points, starting each with '● '.
Only include experience that aligns with the JD. If it is not present, then tell no experience present
"""

    projects_prompt = base_prompt + """
Write a PROJECTS section for all the titled projects given by the user.
For each, write 3-4 bullet points that start with '● '.
Include the impact or outcome of the project.
"""

    certifications_prompt = base_prompt + """
Write a CERTIFICATIONS section. Use bullet points starting with '● '.
If none, say '● No certifications listed.'
"""

    return {
        "professional_summary": generate_section(summary_prompt),
        "skills": generate_section(skills_prompt),
        "experience": generate_section(experience_prompt),
        "projects": generate_section(projects_prompt),
        "certifications": generate_section(certifications_prompt),
        "education": candidate.education  # No GenAI needed here
    }

def generate_section(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating content: {e}"
