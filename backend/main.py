import os
import gc
import tempfile
import shutil
import logging
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
    # Fallback for Docker container setup
    MODEL_DIR = "/app/final_model"

logger.info(f"Using model directory: {MODEL_DIR}")

# Global references for lifespan management
model = None
processor = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, processor
    
    # Check model directory files
    if not os.path.exists(MODEL_DIR):
        logger.error(f"Model directory not found at {MODEL_DIR}")
        raise RuntimeError(f"Model path '{MODEL_DIR}' does not exist.")
    
    required_files = ["config.json", "model.safetensors", "processor_config.json"]
    for f in required_files:
        full_path = os.path.join(MODEL_DIR, f)
        if not os.path.exists(full_path):
            logger.error(f"Missing required model file: {full_path}")
            raise RuntimeError(f"Required model file '{f}' is missing from {MODEL_DIR}")
            
    logger.info("Loading speech stress detection model and processor...")
    try:
        # Load CPU-only configuration
        processor = Wav2Vec2Processor.from_pretrained(MODEL_DIR)
        model = Wav2Vec2ForSequenceClassification.from_pretrained(MODEL_DIR)
        
        # Set to evaluation mode
        model.eval()
        
        # Disable gradient calculations globally for inference
        torch.set_grad_enabled(False)
        
        # Optimize memory usage for PyTorch CPU operations
        torch.set_num_threads(1)
        
        logger.info("Model and processor loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        raise e
        
    yield
    
    # Cleanup on shutdown
    logger.info("Shutting down API. Releasing model memory...")
    del model
    del processor
    gc.collect()
    logger.info("Cleanup completed.")

# Initialize FastAPI
app = FastAPI(
    title="AI Speech Stress Detector API",
    description="Backend API for detecting stress in human speech from audio uploads using Wav2Vec2.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend deployment (e.g. Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint indicating model status."""
    if model is None or processor is None:
        return {"status": "loading", "message": "Model is initializing."}
    return {
        "status": "online",
        "message": "AI Speech Stress Detector API is ready.",
        "model_architecture": "Wav2Vec2ForSequenceClassification"
    }

@app.post("/predict")
async def predict_stress(file: UploadFile = File(...)):
    """
    Predict stress level from an uploaded audio file.
    Accepts various audio formats (wav, mp3, mp4, m4a, webm, ogg, etc.)
    """
    if model is None or processor is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet. Please try again in a moment.")

    # Validate file extension
    filename = file.filename or "audio"
    ext = filename.split(".")[-1].lower()
    allowed_exts = ["wav", "mp3", "m4a", "ogg", "mp4", "webm", "aac", "3gp", "flac"]
    
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {ext}. Allowed formats: {', '.join(allowed_exts)}"
        )

    # Save uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_path = temp_audio.name

    try:
        logger.info(f"Processing audio file: {filename}")
        
        # Load audio using librosa.
        # Librosa automatically handles formats (using soundfile/audioread), 
        # resamples to 16000Hz, and collapses multi-channel audio to mono.
        audio, sr = librosa.load(temp_path, sr=16000, mono=True)
        
        # Check if the audio is empty or extremely short
        duration = len(audio) / 16000
        if duration < 0.1:
            raise HTTPException(status_code=400, detail="Audio file is too short (minimum 0.1 seconds required).")
            
        logger.info(f"Audio loaded successfully. Duration: {duration:.2f}s, Sampling Rate: {sr}Hz")
        
        # Preprocess features
        inputs = processor(audio, sampling_rate=16000, return_tensors="pt", padding=True)
        
        # Inference (No Gradients)
        logits = model(inputs.input_values).logits
        
        # Compute probabilities using softmax
        probs = torch.nn.functional.softmax(logits, dim=-1)
        
        # Extract results
        pred_idx = torch.argmax(logits, dim=1).item()
        
        # Mapping: Class 0 = STRESSED, Class 1 = UNSTRESSED (based on LabelEncoder fit order)
        labels = ["STRESSED", "UNSTRESSED"]
        prediction = labels[pred_idx]
        
        stressed_prob = float(probs[0][0].item())
        unstressed_prob = float(probs[0][1].item())
        confidence = stressed_prob if pred_idx == 0 else unstressed_prob

        logger.info(f"Prediction result: {prediction} (Confidence: {confidence:.2%})")

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
        logger.error(f"Error during audio processing/inference: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process audio or perform inference: {str(e)}")
        
    finally:
        # Delete temporary file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as clean_err:
                logger.warning(f"Could not delete temp file {temp_path}: {str(clean_err)}")

if __name__ == "__main__":
    import uvicorn
    # Default local dev port is 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
