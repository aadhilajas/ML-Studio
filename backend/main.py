from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import upload, train, history
import os

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ML Studio API", description="Backend for ML Studio", version="1.0.0")

# CORS
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "https://ml-studio-frontend.vercel.app", 
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(train.router, prefix="/api", tags=["Train"])
app.include_router(history.router, prefix="/api", tags=["History"])

from fastapi.responses import FileResponse
from services.training_engine import MODEL_DIR

@app.get("/")
def read_root():
    return {"message": "ML Studio API is running"}

@app.get("/api/download/{model_id}")
async def download_model(model_id: str):
    file_path = os.path.join(MODEL_DIR, f"{model_id}.pkl")
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=f"model_{model_id}.pkl", media_type="application/octet-stream")
    return {"error": "Model not found"}
