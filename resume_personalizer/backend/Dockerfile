FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies with extended timeout and index URL
RUN pip install --no-cache-dir --timeout=100 --index-url https://pypi.org/simple -r requirements.txt
RUN python -m spacy download en_core_web_sm
# Copy rest of the application code
COPY . .

# Start the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
