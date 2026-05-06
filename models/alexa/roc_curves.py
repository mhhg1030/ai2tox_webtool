import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # non-interactive backend, no popup windows
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, roc_curve

# ── Load and preprocess data (same as training script) ──────────────────────
PC = pd.read_csv('prediction_model_data_human_only.csv')
PC.dropna(inplace=True)

encoding_mappings = {
    'Size_Group': {"<50": 0, "50~100": 1, "100~150": 2, ">150": 3},
    'In_Time':    {"<30": 0, "30~60": 1, ">60": 2},
    'ZP_Group':   {"<-50": 0, "-50~-10": 1, "-10~+10": 2, "+10~+50": 3, ">+50": 4},
    'APOE': {"Present": 0, "Absent": 1},
    'APOB': {"Present": 0, "Absent": 1},
    'CO3':  {"Present": 0, "Absent": 1},
    'CLUS': {"Present": 0, "Absent": 1},
}

for col, mapping in encoding_mappings.items():
    PC[col] = PC[col].map(mapping)

PC_encoded = pd.get_dummies(
    PC, columns=['Type', 'Subtype', 'ZP_Charge', 'Mod_Charge', 'Shaking'],
    drop_first=True
)

feature_columns = joblib.load('saved_models/feature_columns.joblib')
X = PC_encoded[feature_columns]

targets     = ['APOE', 'APOB', 'CO3', 'CLUS']
model_names = ['KNN', 'LGBM', 'RF', 'SVM', 'XGBoost']

# Colors for each model line
COLORS = {
    'KNN':     '#5B8FD4',
    'LGBM':    '#D4699E',
    'RF':      '#2E7D5C',
    'SVM':     '#E8A838',
    'XGBoost': '#8B5CF6',
}

PROTEIN_LABELS = {
    'APOE': 'Apolipoprotein E (APOE)',
    'APOB': 'Apolipoprotein B-100 (APOB)',
    'CO3':  'Complement C3 (CO3)',
    'CLUS': 'Clusterin (CLUS)',
}

os.makedirs('saved_models', exist_ok=True)

# ── Generate one ROC curve figure per protein ────────────────────────────────
for target in targets:
    print(f"Generating ROC curve for {target}...")

    # Recreate same test split as training (same random_state=32)
    y = PC_encoded[target]
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.3, random_state=32, stratify=y
    )

    fig, ax = plt.subplots(figsize=(8, 6))

    for model_name in model_names:
        model_path = f'saved_models/{model_name}_{target}.joblib'
        if not os.path.exists(model_path):
            print(f"  Skipping {model_name} — file not found")
            continue

        model = joblib.load(model_path)
        y_prob = model.predict_proba(X_test)[:, 1]
        auc    = roc_auc_score(y_test, y_prob)
        fpr, tpr, _ = roc_curve(y_test, y_prob)

        ax.plot(fpr, tpr,
                label=f'{model_name} (AUC = {auc:.2f})',
                color=COLORS[model_name],
                linewidth=2)

    # Random classifier baseline
    ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Random Classifier')

    ax.set_title(PROTEIN_LABELS[target], fontsize=15, fontweight='bold', pad=12)
    ax.set_xlabel('False Positive Rate', fontsize=12)
    ax.set_ylabel('True Positive Rate', fontsize=12)
    ax.legend(loc='lower right', fontsize=10, framealpha=0.9)
    ax.grid(True, alpha=0.3)
    ax.set_xlim([0, 1])
    ax.set_ylim([0, 1.02])

    fig.tight_layout()

    out_path = f'saved_models/roc_{target.lower()}.png'
    fig.savefig(out_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  Saved → {out_path}")

print("\nDone! All ROC curves saved in saved_models/")