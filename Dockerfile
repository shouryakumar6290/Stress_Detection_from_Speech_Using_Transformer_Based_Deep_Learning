FROM python:3.10-slim

# Set environment variables for production and memory optimization
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    MODEL_PATH="/app/final_model" \
    PORT=8000 \
    # Force single-threading in math & ML libraries to prevent CPU spike overheads
    OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    OPENBLAS_NUM_THREADS=1 \
    VECLIB_MAXIMUM_THREADS=1 \
    NUMEXPR_NUM_THREADS=1 \
    # Instruct glibc memory allocator to return memory to OS immediately after deletion (forces trim at 100KB)
    MALLOC_TRIM_THRESHOLD_=100000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    # Install PyTorch CPU and dependencies
    pip install --no-cache-dir -r requirements.txt

# Copy model assets
COPY final_model /app/final_model

# Copy application source code
COPY backend /app/backend

# Expose the port
EXPOSE 8000

# Run uvicorn server on container startup
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
