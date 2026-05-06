from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load shared feature columns
feature_columns = joblib.load("saved_models/feature_columns.joblib")

encoding_mappings = {
    'Size_Group': {"<50": 0, "50~100": 1, "100~150": 2, ">150": 3},
    'In_Time':    {"<30": 0, "30~60": 1, ">60": 2},
    'ZP_Group':   {"<-50": 0, "-50~-10": 1, "-10~+10": 2, "+10~+50": 3, ">+50": 4},
}

TARGETS = ['APOE', 'APOB', 'CO3', 'CLUS']
MODELS  = ['KNN', 'LGBM', 'RF', 'SVM', 'XGBoost']

def load_model(model_name, target):
    filename = f"saved_models/{model_name}_{target}.joblib"
    if not os.path.exists(filename):
        raise FileNotFoundError(f"Model not found: {filename}")
    return joblib.load(filename)

def preprocess(raw: dict) -> pd.DataFrame:
    df = pd.DataFrame([raw])
    for col, mapping in encoding_mappings.items():
        if col in df.columns:
            df[col] = df[col].map(mapping)
    df = pd.get_dummies(df)
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    return df[feature_columns]

class PredictionInput(BaseModel):
    Size_Group: str
    ZP_Group:   str
    In_Time:    str
    Type_Inorganic:    int = 0
    Type_Organic:      int = 0
    Type_Carbon_Based: int = 0
    Subtype_Silica:      int = 0
    Subtype_Metal:       int = 0
    Subtype_Metal_Oxide: int = 0
    Subtype_Lipid:       int = 0
    Subtype_Polystyrene: int = 0
    Subtype_Carbon:      int = 0
    Subtype_DNA:         int = 0
    Subtype_Latex:       int = 0
    Subtype_Niosome:     int = 0
    ZP_Charge_Negative: int = 0
    ZP_Charge_Neutral:  int = 0
    ZP_Charge_Positive: int = 0
    Mod_Charge_No_Modification: int = 0
    Mod_Charge_Positive:        int = 0
    Mod_Charge_Neutral:         int = 0
    Mod_Charge_Negative:        int = 0
    model_name: str = 'XGBoost'

@app.post("/predict")
def predict(data: PredictionInput):
    if data.model_name not in MODELS:
        raise HTTPException(status_code=400, detail=f"model_name must be one of {MODELS}")

    raw = {
        'Size_Group': data.Size_Group,
        'ZP_Group':   data.ZP_Group,
        'In_Time':    data.In_Time,
        'Type_Inorganic':    data.Type_Inorganic,
        'Type_Organic':      data.Type_Organic,
        'Type_Carbon-Based': data.Type_Carbon_Based,
        'Subtype_Silica':      data.Subtype_Silica,
        'Subtype_Metal':       data.Subtype_Metal,
        'Subtype_Metal Oxide': data.Subtype_Metal_Oxide,
        'Subtype_Lipid':       data.Subtype_Lipid,
        'Subtype_Polystyrene': data.Subtype_Polystyrene,
        'Subtype_Carbon':      data.Subtype_Carbon,
        'Subtype_DNA':         data.Subtype_DNA,
        'Subtype_Latex':       data.Subtype_Latex,
        'Subtype_Niosome':     data.Subtype_Niosome,
        'ZP_Charge_Negative': data.ZP_Charge_Negative,
        'ZP_Charge_Neutral':  data.ZP_Charge_Neutral,
        'ZP_Charge_Positive': data.ZP_Charge_Positive,
        'Mod_Charge_No Modification': data.Mod_Charge_No_Modification,
        'Mod_Charge_Positive':        data.Mod_Charge_Positive,
        'Mod_Charge_Neutral':         data.Mod_Charge_Neutral,
        'Mod_Charge_Negative':        data.Mod_Charge_Negative,
    }

    df_processed = preprocess(raw)

    results = {}
    for target in TARGETS:
        model = load_model(data.model_name, target)
        preds = model.predict(df_processed)
        probs = model.predict_proba(df_processed)
        pred = preds[0]
        confidence = probs[0][pred]
        results[target] = {
            'prediction': 'Present' if pred == 0 else 'Absent',
            'confidence': round(float(confidence) * 100, 1)
        }

    return results

# ── ROC curve image endpoint ─────────────────────────────────────────────────
@app.get("/roc/{protein}")
def get_roc(protein: str):
    protein = protein.upper()
    if protein not in TARGETS:
        raise HTTPException(status_code=404, detail=f"Protein must be one of {TARGETS}")
    path = f"saved_models/roc_{protein.lower()}.png"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"ROC curve not found for {protein}. Run generate_roc_curves.py first.")
    return FileResponse(path, media_type="image/png")

@app.get("/")
def root():
    return {"status": "NP-PC Prediction API running"}