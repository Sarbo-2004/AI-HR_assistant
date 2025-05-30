# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import os
from tempfile import NamedTemporaryFile, TemporaryDirectory
from gemini_matcher import score_resume
from scorer import parse_gemini_response, rank_resumes
from utils import get_text_from_file
import zipfile
import pandas as pd
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rank/")
async def rank_resumes_api(
    jd_file: UploadFile = File(...),
    uploads: list[UploadFile] = File(...)
):
    # 1. Read JD text
    jd_temp = NamedTemporaryFile(delete=False, suffix=".txt")
    jd_temp.write(await jd_file.read())
    jd_temp.close()
    jd_text = get_text_from_file(jd_temp.name)
    os.remove(jd_temp.name)

    results = []

    with TemporaryDirectory() as tmpdir:
        for upload in uploads:
            ext = os.path.splitext(upload.filename)[1].lower()

            if ext == ".zip":
                # Unzip and process all .pdf/.txt files
                zip_path = os.path.join(tmpdir, upload.filename)
                with open(zip_path, "wb") as f:
                    f.write(await upload.read())
                
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(tmpdir)
                
                for root, _, files in os.walk(tmpdir):
                    for fname in files:
                        if fname.lower().endswith((".pdf", ".txt")):
                            full_path = os.path.join(root, fname)
                            resume_text = get_text_from_file(full_path)
                            raw = score_resume(jd_text, resume_text)
                            parsed = parse_gemini_response(raw)
                            parsed["filename"] = fname
                            results.append(parsed)

            elif ext in [".pdf", ".txt"]:
                temp_path = os.path.join(tmpdir, upload.filename)
                with open(temp_path, "wb") as f:
                    f.write(await upload.read())
                resume_text = get_text_from_file(temp_path)
                raw = score_resume(jd_text, resume_text)
                parsed = parse_gemini_response(raw)
                parsed["filename"] = upload.filename
                results.append(parsed)

    # Rank resumes
    ranked = rank_resumes(results)

    # Create CSV
    df = pd.DataFrame(ranked)
    csv_stream = io.StringIO()
    df.to_csv(csv_stream, index=False)
    csv_bytes = io.BytesIO(csv_stream.getvalue().encode())

    return StreamingResponse(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ranked_resumes.csv"}
    )
