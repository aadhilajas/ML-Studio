from services.preprocessing import load_dataset, preprocess_data
from services.model_factory import get_model
from services.metrics_engine import calculate_metrics
from services.explanation_engine import generate_explanation
from services.visualization_engine import generate_confusion_matrix, generate_feature_importance, generate_residual_plot, generate_cluster_plot
from sklearn.model_selection import train_test_split
import joblib
import os
import uuid

MODEL_DIR = "models_saved"
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def train_model(request):
    # request is TrainRequest object
    dataset_name = request.dataset_name
    task_type = request.task_type
    model_name = request.model_name
    target_column = request.target_column
    
    # 1. Load Data
    df = load_dataset(dataset_name)
    
    # 2. Preprocess
    X, y, feature_names = preprocess_data(df, target_column, task_type, request.use_scaling)
    
    # 3. Downsample if dataset is too large to prevent extremely long training times
    MAX_SAMPLES = 50000
    if model_name in ["SVM", "KNN", "DBSCAN", "Agglomerative Clustering"]:
        MAX_SAMPLES = 10000
        
    if X.shape[0] > MAX_SAMPLES:
        import numpy as np
        if y is not None and task_type == "Classification":
            from sklearn.model_selection import StratifiedShuffleSplit
            # Try stratified sampling first if we have enough samples of each class
            try:
                sss = StratifiedShuffleSplit(n_splits=1, train_size=MAX_SAMPLES, random_state=42)
                for train_index, _ in sss.split(X, y):
                    X = X[train_index]
                    y = y[train_index]
            except ValueError:
                # Fallback to random sampling if stratified fails (e.g., small classes)
                indices = np.random.choice(X.shape[0], MAX_SAMPLES, replace=False)
                X = X[indices]
                y = y[indices]
        else:
            indices = np.random.choice(X.shape[0], MAX_SAMPLES, replace=False)
            X = X[indices]
            if y is not None:
                y = y[indices]

    # 4. Get Model
    model = get_model(task_type, model_name)
    
    # 4. Train and Evaluate
    y_test = None
    y_pred = None
    
    if task_type != "Clustering":
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=request.test_size, random_state=request.random_state)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Check for overfitting (simple logic)
        train_score = model.score(X_train, y_train)
        test_score = model.score(X_test, y_test)
    else:
        y_pred = model.fit_predict(X)
        train_score = 0
        test_score = 0
        
    # 5. Metrics
    metrics = calculate_metrics(y_test if task_type != "Clustering" else y_pred, y_pred, task_type, X if task_type == "Clustering" else None)
    
    # Add overfitting info if relevant
    if task_type != "Clustering":
        metrics["train_score"] = train_score
        metrics["test_score"] = test_score
    
    # 6. Explanation
    explanation = generate_explanation(metrics, task_type)
    if task_type != "Clustering" and train_score > test_score + 0.15:
        explanation += " Warning: The model shows signs of overfitting (high train score, low test score)."
    
    # 7. Visualizations
    visualizations = {}
    if task_type == "Classification":
        visualizations["confusion_matrix"] = generate_confusion_matrix(y_test, y_pred)
        visualizations["feature_importance"] = generate_feature_importance(model, feature_names)
        
    elif task_type == "Regression":
         visualizations["residual_plot"] = generate_residual_plot(y_test, y_pred)
         visualizations["feature_importance"] = generate_feature_importance(model, feature_names)
         
    elif task_type == "Clustering":
         visualizations["cluster_plot"] = generate_cluster_plot(X, y_pred)

    # 8. Save Model
    model_id = str(uuid.uuid4())
    model_path = os.path.join(MODEL_DIR, f"{model_id}.pkl")
    joblib.dump(model, model_path)
    
    return {
        "metrics": metrics,
        "explanation": explanation,
        "visualizations": visualizations,
        "model_id": model_id
    }
