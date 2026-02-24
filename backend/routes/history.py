from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from models.schemas import ExperimentResponse
from database import get_db
from models.db_models import Experiment

router = APIRouter()

@router.get("/history", response_model=List[ExperimentResponse])
async def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    experiments = db.query(Experiment).order_by(Experiment.created_at.desc()).offset(skip).limit(limit).all()
    return experiments
