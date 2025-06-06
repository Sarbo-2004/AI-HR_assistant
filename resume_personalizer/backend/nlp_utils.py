import spacy
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util

# Load models
nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT()
semantic_model = SentenceTransformer("all-MiniLM-L6-v2")

def extract_keywords_from_jd(jd_text: str, top_n=10):
    keywords = kw_model.extract_keywords(jd_text, top_n=top_n)
    return [kw[0] for kw in keywords]

def extract_entities(text: str):
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]

def semantic_match_skills(candidate_skills: list, jd_text: str, threshold=0.5):
    matched_skills = []
    jd_embedding = semantic_model.encode(jd_text, convert_to_tensor=True)
    for skill in candidate_skills:
        skill_embedding = semantic_model.encode(skill, convert_to_tensor=True)
        similarity = util.cos_sim(jd_embedding, skill_embedding).item()
        if similarity >= threshold:
            matched_skills.append(skill)
    return matched_skills
