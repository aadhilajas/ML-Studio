from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering

def get_model(task_type, model_name, params=None):
    if params is None:
        params = {}
        
    if task_type == "Classification":
        if model_name == "Logistic Regression":
            return LogisticRegression(max_iter=1000, **params)
        elif model_name == "Random Forest":
            return RandomForestClassifier(**params)
        elif model_name == "SVM":
            return SVC(probability=True, **params)
        elif model_name == "KNN":
            return KNeighborsClassifier(**params)
            
    elif task_type == "Regression":
        if model_name == "Linear Regression":
            return LinearRegression(**params)
        elif model_name == "Random Forest Regressor":
            return RandomForestRegressor(**params)
        elif model_name == "Gradient Boosting":
            return GradientBoostingRegressor(**params)
            
    elif task_type == "Clustering":
        if model_name == "KMeans":
            return KMeans(**params)
        elif model_name == "DBSCAN":
            return DBSCAN(**params)
        elif model_name == "Agglomerative Clustering":
            return AgglomerativeClustering(**params)
            
    raise ValueError(f"Model {model_name} not supported for task {task_type}")
