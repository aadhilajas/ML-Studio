from sqlalchemy import Column, Integer, String, JSON, DateTime, Float
from sqlalchemy.sql import func
from database import Base

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String, index=True)
    task_type = Column(String) # Classification, Regression, Clustering
    model_name = Column(String)
    metrics = Column(JSON) # Store metrics dictionary
    parameters = Column(JSON) # Store hyperparameters used
    created_at = Column(DateTime, server_default=func.now())
