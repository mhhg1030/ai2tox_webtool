# -*- coding: utf-8 -*-
"""
Created on Mon Apr 27 11:54:38 2026

@author: Alexa Canchola
"""
# %% ============================================================================
# Import Required Libraries
# ============================================================================
import pandas as pd
import numpy as np
import joblib
import os

# %% ============================================================================
# Load model + features
# ============================================================================
# -------------------------------
# Load shared artifacts
# -------------------------------
feature_columns = joblib.load("saved_models/feature_columns.joblib")

encoding_mappings = {
    'Size_Group': {"<50": 0, "50~100": 1, "100~150": 2, ">150": 3},
    'In_Time': {"<30": 0, "30~60": 1, ">60": 2},
    'ZP_Group': {"<-50": 0, "-50~-10": 1, "-10~+10": 2, "+10~+50": 3, ">+50": 4},
}

# -------------------------------
# User selection (same style as your original script)
# -------------------------------
target_choice = 'CO3'     # 'APOE', 'APOB', 'CO3', 'CLUS'
model_choice = 'XGBoost'   # 'KNN', 'LGBM', 'RF', 'SVM', 'XGBoost'

# -------------------------------
# Load selected model
# -------------------------------
def load_model(model_name, target):
    filename = f"saved_models/{model_name}_{target}.joblib"

    if not os.path.exists(filename):
        raise FileNotFoundError(f"Model not found: {filename}")

    return joblib.load(filename)

model = load_model(model_choice, target_choice)

# -------------------------------
# Preprocessing
# -------------------------------
def preprocess(df):
    df = df.copy()

    for col, mapping in encoding_mappings.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)

    df = pd.get_dummies(df)

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    return df[feature_columns]

# -------------------------------
# Prediction
# -------------------------------
def predict(df):
    df_processed = preprocess(df)

    preds = model.predict(df_processed)
    probs = model.predict_proba(df_processed)

    results = df.copy()
    results = results.reset_index(drop=True)
    results.index.name = "Sample_ID"

    # Map prediction to labels
    results["prediction"] = ["PRESENT" if p == 0 else "ABSENT" for p in preds]

    # Get probability of predicted class (row-wise)
    predicted_class_prob = probs[np.arange(len(preds)), preds]

    results["confidence"] = predicted_class_prob

    return results[["prediction", "confidence"]]
    
# -------------------------------
# Example usage (multiple inputs supported)
# -------------------------------
if __name__ == "__main__":

    data = pd.DataFrame([
        {
            'Size_Group': "50~100",
            'ZP_Group': "-50~-10",
            'In_Time': "30~60",
            'Type_Organic': 1,
            'Subtype_Metal': 1,
            'ZP_Charge_Negative': 1,
            'Mod_Charge_No Modification': 1
        },
        {
            'Size_Group': ">150",
            'ZP_Group': "+10~+50",
            'In_Time': ">60",
            'Type_Organic': 0,
            'Subtype_Silica': 1,
            'ZP_Charge_Positive': 1,
            'Mod_Charge_Positive': 1
        }
    ])

    results = predict(data)

print(results)
