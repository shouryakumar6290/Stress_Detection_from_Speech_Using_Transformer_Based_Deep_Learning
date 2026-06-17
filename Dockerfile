FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MODEL_PATH="/app/final_model" \
    PORT=8000

# Install system dependencies
# ffmpeg is required for reading different audio formats
# libsndfile1 is required by the soundfile library used in audio loading
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy requirements and install dependencies
# We use --no-cache-dir to minimize Docker layer sizes
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy model assets
COPY final_model /app/final_model

# Copy application source code
COPY backend /app/backend

# Expose the port
EXPOSE 8000

# Run uvicorn server on container startup
# Using host 0.0.0.0 is critical for accessibility outside the container
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
