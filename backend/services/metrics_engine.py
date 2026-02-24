from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_absolute_error, mean_squared_error, r2_score, silhouette_score
import numpy as np

def calculate_metrics(y_true, y_pred, task_type, X=None):
    metrics = {}
    
    if task_type == "Classification":
        metrics["accuracy"] = float(accuracy_score(y_true, y_pred))
        metrics["precision"] = float(precision_score(y_true, y_pred, average='weighted', zero_division=0))
        metrics["recall"] = float(recall_score(y_true, y_pred, average='weighted', zero_division=0))
        metrics["f1"] = float(f1_score(y_true, y_pred, average='weighted', zero_division=0))
        
    elif task_type == "Regression":
        metrics["mae"] = float(mean_absolute_error(y_true, y_pred))
        metrics["mse"] = float(mean_squared_error(y_true, y_pred))
        metrics["rmse"] = float(np.sqrt(metrics["mse"]))
        metrics["r2"] = float(r2_score(y_true, y_pred))
        
    elif task_type == "Clustering":
        if X is not None:
             try:
                 metrics["silhouette"] = float(silhouette_score(X, y_pred))
             except ValueError:
                 metrics["silhouette"] = -1.0 # Error case usually implies < 2 labels
                 
    return metrics
