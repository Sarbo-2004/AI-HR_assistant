# Stage 1: Build stage
FROM python:3.10-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Create and use virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --timeout=100 -r requirements.txt
RUN python -m spacy download en_core_web_sm

# Stage 2: Runtime stage
FROM python:3.10-slim

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /opt/venv /opt/venv
COPY . .

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH=/app

# Clean up unnecessary files
RUN find /usr/local/lib/python3.10 -name '__pycache__' -exec rm -rf {} + && \
    find /usr/local/lib/python3.10 -name '*.so' -exec strip {} +

# Use non-root user for security
RUN useradd -m myuser && chown -R myuser:myuser /app
USER myuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]