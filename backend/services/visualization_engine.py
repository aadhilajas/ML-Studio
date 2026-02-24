import matplotlib
matplotlib.use('Agg') # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from sklearn.metrics import confusion_matrix
import numpy as np

# Set style
sns.set_theme(style="whitegrid")

def plot_to_base64(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_str

def generate_confusion_matrix(y_true, y_pred, labels=None):
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
    ax.set_title('Confusion Matrix')
    ax.set_ylabel('Actual')
    ax.set_xlabel('Predicted')
    return plot_to_base64(fig)

def generate_feature_importance(model, feature_names):
    importances = None
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    elif hasattr(model, 'coef_'):
         # For logic regression or linear models, coef_ might be (n_classes, n_features) or (n_features,)
         if model.coef_.ndim > 1:
             importances = np.mean(np.abs(model.coef_), axis=0) # Average abs importance across classes
         else:
             importances = np.abs(model.coef_)
             
    if importances is None:
        return None
        
    # Sort top 10
    if len(feature_names) != len(importances):
         # Mismatch fallback
         return None
         
    indices = np.argsort(importances)[-10:]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(range(len(indices)), importances[indices], color='#4f46e5', align='center')
    ax.set_yticks(range(len(indices)))
    ax.set_yticklabels([feature_names[i] for i in indices])
    ax.set_xlabel('Relative Importance')
    ax.set_title('Top 10 Feature Importances')
    return plot_to_base64(fig)

def generate_residual_plot(y_true, y_pred):
    residuals = y_true - y_pred
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.scatterplot(x=y_pred, y=residuals, ax=ax, alpha=0.6)
    ax.axhline(0, color='r', linestyle='--')
    ax.set_xlabel('Predicted Values')
    ax.set_ylabel('Residuals')
    ax.set_title('Residual Plot')
    return plot_to_base64(fig)

def generate_cluster_plot(X, labels):
    # Visualize first two dimensions if > 2, or use PCA (simplified here - just first 2 cols)
    if X.shape[1] < 2:
        return None
        
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.scatterplot(x=X[:, 0], y=X[:, 1], hue=labels, palette='viridis', ax=ax, s=50)
    ax.set_title('Cluster Visualization (First 2 Components)')
    return plot_to_base64(fig)
