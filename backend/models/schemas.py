from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
from datetime import datetime

class ExperimentBase(BaseModel):
    dataset_name: str
    task_type: str
    model_name: str
    parameters: Optional[Dict[str, Any]] = None

class ExperimentCreate(ExperimentBase):
    metrics: Dict[str, Any]

class ExperimentResponse(ExperimentBase):
    id: int
    metrics: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class TrainRequest(BaseModel):
    dataset_name: str
    task_type: str  # "Classification", "Regression", "Clustering"
    model_name: str
    target_column: Optional[str] = None  # None for clustering
    test_size: float = 0.2
    random_state: int = 42
    use_scaling: bool = True
    use_cross_validation: bool = False

class PredictionResponse(BaseModel):
    metrics: Dict[str, Any]
    confusion_matrix: Optional[str] = None
    roc_curve: Optional[str] = None
    feature_importance: Optional[str] = None
    cluster_plot: Optional[str] = None
    residual_plot: Optional[str] = None
    explanation: str
