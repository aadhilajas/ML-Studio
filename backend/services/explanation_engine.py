def generate_explanation(metrics, task_type):
    explanation = ""
    
    if task_type == "Classification":
        acc = metrics.get("accuracy", 0)
        f1 = metrics.get("f1", 0)
        
        explanation += f"The model correctly predicts outcomes {acc:.1%} of the time. "
        if acc > 0.90:
            explanation += "This is excellent performance, suitable for critical applications."
        elif acc > 0.80:
            explanation += "This indicates strong performance and is reliable."
        elif acc > 0.70:
            explanation += "This is a decent performance, but there is room for optimization."
        else:
            explanation += "The model is struggling to generalize. Consider feature engineering or trying a different model."
            
        if f1 < acc - 0.15:
            explanation += " Note: The F1 score is notably lower than accuracy, suggesting the model may be biased towards the majority class (imbalanced dataset)."

    elif task_type == "Regression":
        r2 = metrics.get("r2", 0)
        explanation += f"The model explains {r2:.1%} of the variance in the target variable. "
        if r2 > 0.8:
             explanation += "It captures the underlying trends very well."
        elif r2 > 0.5:
             explanation += "It has moderate predictive power but misses some patterns."
        else:
             explanation += "The model fails to capture the significant trends. Try non-linear models or adding more features."

    elif task_type == "Clustering":
        sil = metrics.get("silhouette", 0)
        explanation += f"The Silhouette Score is {sil:.2f}. "
        if sil > 0.7:
            explanation += "The clusters are dense and well-separated."
        elif sil > 0.5:
            explanation += "The clusters are reasonably distinct."
        else:
            explanation += "The clusters are overlapping or not well-defined. The data might not have clear groupings."

    return explanation
