import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import os

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def load_dataset(filename: str) -> pd.DataFrame:
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset {filename} not found")
    return pd.read_csv(file_path)

def get_columns(filename: str):
    df = load_dataset(filename)
    return {"columns": df.columns.tolist(), "dtypes": df.dtypes.astype(str).to_dict()}

def preprocess_data(df: pd.DataFrame, target_column: str = None, task_type: str = "Classification", use_scaling: bool = True):
    # Separate features and target
    X = df.copy()
    y = None
    
    if target_column:
        if target_column not in df.columns:
            raise ValueError(f"Target column {target_column} not found in dataset")
        X = df.drop(columns=[target_column])
        y = df[target_column]

    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object', 'category']).columns.tolist()

    # Define transformers
    numeric_steps = [('imputer', SimpleImputer(strategy='mean'))]
    if use_scaling:
        numeric_steps.append(('scaler', StandardScaler()))
    
    numeric_transformer = Pipeline(steps=numeric_steps)

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='drop' # Drop columns not specified (e.g. datetime if not handled) - simplest for now
    )
    
    # For now, just fit_transform X
    # Note: returning dataframe logic is complex with ColumnTransformer, returning numpy array
    X_processed = preprocessor.fit_transform(X)
    
    # Get feature names after transformation
    feature_names = numeric_features
    if categorical_features:
        cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
        # If the encoder was fitted, we can get feature names
        # Check if it supports get_feature_names_out (sklearn > 1.0)
        try:
             # This works if the transformer has been fitted, which it has in fit_transform
             cat_feature_names = cat_encoder.get_feature_names_out(categorical_features)
             feature_names.extend(cat_feature_names)
        except Exception:
             # Fallback or older sklearn versions
             feature_names.extend([f"{c}_encoded" for c in categorical_features])

    # Handle Target
    if task_type == "Classification" and y is not None:
        le = LabelEncoder()
        y = le.fit_transform(y)
    elif task_type == "Regression" and y is not None:
        y = y.values # Keep as is, maybe reshape if needed
        # Impute missing values in target if any? usually we drop rows with missing target
        # For simplicity, let's assume target is clean or we fill it.
        # Actually dropping rows with missing target is better.
        pass

    return X_processed, y, feature_names
