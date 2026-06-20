import os
import gc
import tempfile
import shutil
import logging
import threading
from contextlib import asynccontextmanager

import torch
import numpy as np
import librosa
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("stress_detector_api")

# Determine model directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.getenv("MODEL_PATH", os.path.abspath(os.path.join(BASE_DIR, "..", "final_model")))

if not os.path.exists(MODEL_DIR):
    MODEL_DIR = "/app/final_model"

logger.info(f"Model path directory: {MODEL_DIR}")

# Global thread-safe loading flags
model = None
processor = None
model_loaded = False
load_error_message = None

def load_model_worker():
    """Worker function to load the model in a background thread."""
    global model, processor, model_loaded, load_error_message
    
    try:
        logger.info("Background thread: Beginning to load Wav2Vec2 model and processor...")
        
        # Check files
        if not os.path.exists(MODEL_DIR):
            raise FileNotFoundError(f"Model directory '{MODEL_DIR}' does not exist.")
            
        # 1. Load processor
        processor = Wav2Vec2Processor.from_pretrained(MODEL_DIR)
        
        # 2. Load classification model with memory optimization
        # low_cpu_mem_usage=True uses accelerate to load weights directly without doubling RAM allocations
        model = Wav2Vec2ForSequenceClassification.from_pretrained(
            MODEL_DIR, 
            low_cpu_mem_usage=True
        )
        
        # 3. Configure CPU optimization
        model.eval()
        torch.set_grad_enabled(False)
        torch.set_num_threads(1)  # Bind PyTorch CPU threads to 1 to prevent core saturation
        
        model_loaded = True
        logger.info("Background thread: Model and processor successfully loaded into memory.")
        
    except Exception as e:
        load_error_message = str(e)
        logger.error(f"Background thread: Error occurred during model loading: {load_error_message}", exc_info=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Spin up background thread to load model immediately on app start
    # This lets uvicorn bind and answer port requests immediately (passing Render's health checks)
    loader_thread = threading.Thread(target=load_model_worker, name="ModelLoaderThread", daemon=True)
    loader_thread.start()
    
    yield
    
    # Clean up on shutdown
    logger.info("Lifespan shutdown: Cleaning up models...")
    global model, processor, model_loaded
    model = None
    processor = None
    model_loaded = False
    gc.collect()
    logger.info("Cleanup complete.")

# Initialize FastAPI
app = FastAPI(
    title="AI Speech Stress Detector API",
    description="Optimized backend for deploying neural models in memory-constrained cloud environments.",
    version="1.1.0",
    lifespan=lifespan
)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint. Return HTTP 200 immediately to pass Render's deployment check."""
    if model_loaded:
        return {
            "status": "online",
            "message": "AI Speech Stress Detector API is ready.",
            "model_architecture": "Wav2Vec2ForSequenceClassification"
        }
    elif load_error_message:
        return {
            "status": "error",
            "message": f"Model failed to load: {load_error_message}"
        }
    else:
        return {
            "status": "loading",
            "message": "Model weights are loading in the background. Please wait."
        }

@app.post("/predict")
async def predict_stress(file: UploadFile = File(...)):
    """Predict stress levels from speech audio."""
    global model, processor, model_loaded
    
    if not model_loaded:
        if load_error_message:
            raise HTTPException(status_code=500, detail=f"Model failed to initialize: {load_error_message}")
        raise HTTPException(
            status_code=503, 
            detail="Model is still initializing in the background. Please try again in 5-10 seconds."
        )

    # Validate extension
    filename = file.filename or "audio"
    ext = filename.split(".")[-1].lower()
    allowed_exts = ["wav", "mp3", "m4a", "ogg", "mp4", "webm", "aac", "3gp", "flac"]
    
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format: {ext}. Allowed formats: {', '.join(allowed_exts)}"
        )

    # Write temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_path = temp_audio.name

    try:
        # Load and resample
        audio, sr = librosa.load(temp_path, sr=16000, mono=True)
        
        duration = len(audio) / 16000
        if duration < 0.1:
            raise HTTPException(status_code=400, detail="Audio file too short.")
            
        # Preprocess
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
        
        # Inference
        logits = model(inputs.input_values).logits
        probs = torch.nn.functional.softmax(logits, dim=-1)
        pred_idx = torch.argmax(logits, dim=1).item()
        
        labels = ["UNSTRESSED", "STRESSED"]
        prediction = labels[pred_idx]
        
        unstressed_prob = float(probs[0][0].item())
        stressed_prob = float(probs[0][1].item())
        confidence = unstressed_prob if pred_idx == 0 else stressed_prob

        # Explicitly delete audio tensor buffers to reclaim RAM immediately
        del inputs
        del logits
        del probs
        gc.collect()

        return {
            "success": True,
            "filename": filename,
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "probabilities": {
                "STRESSED": round(stressed_prob, 4),
                "UNSTRESSED": round(unstressed_prob, 4)
            },
            "audio_metadata": {
                "duration_seconds": round(duration, 2),
                "sampling_rate": sr,
                "samples_count": len(audio)
            }
        }
        
    except Exception as e:
        logger.error(f"Inference crash: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
        
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

if __name__ == "__main__":
    import uvicorn
    # Bind locally to test
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
