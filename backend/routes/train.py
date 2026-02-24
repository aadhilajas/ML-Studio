from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.schemas import TrainRequest, ExperimentResponse
from services.training_engine import train_model
from database import get_db
from models.db_models import Experiment
import json

router = APIRouter()

@router.post("/train", response_model=ExperimentResponse)
async def train(request: TrainRequest, db: Session = Depends(get_db)):
    try:
        # Run training pipeline
        results = train_model(request)
        
        # Save to DB
        # Store full result in metrics column for simple retrieval (metrics, explanation, viz)
        experiment = Experiment(
            dataset_name=request.dataset_name,
            task_type=request.task_type,
            model_name=request.model_name,
            metrics=results, 
            parameters=request.model_dump(exclude={"dataset_name", "task_type", "model_name"})
        )
        
        db.add(experiment)
        db.commit()
        db.refresh(experiment)
        
        return experiment
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
