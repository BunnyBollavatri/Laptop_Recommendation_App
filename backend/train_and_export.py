"""
Train and export the Random Forest Laptop Recommendation model, pipeline, and clean dataset.
"""

import os
import re
import json
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_PATH = BASE_DIR / "ml" / "laptops.csv"
ARTIFACTS_DIR = BASE_DIR / "backend" / "artifacts"
DATA_DIR = BASE_DIR / "backend" / "data"

ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)


def extract_gpu_vram(text):
    match = re.search(r"(\d+)\s*GB\s*(?:Graph|Graphics)", str(text), re.IGNORECASE)
    return int(match.group(1)) if match else 0


def extract_intel_generation(text):
    match = re.search(r"(\d+)(?:th|st|nd|rd)\s+Gen", str(text), re.IGNORECASE)
    return int(match.group(1)) if match else 0


def parse_warranty(val):
    if pd.isnull(val):
        return 1
    val_str = str(val).strip()
    match = re.search(r"\d+", val_str)
    return int(match.group(0)) if match else 1


def compute_tags(row):
    tags = []
    has_dedicated_gpu = row["has_dedicated_gpu"] == 1
    ram = row["ram_memory"]
    price = row["Price"]
    perf = row["Performance_Score"]

    if has_dedicated_gpu and ram >= 8:
        tags.append("Gaming")
    if ram >= 16 or (row["num_cores"] >= 6 and ram >= 8):
        tags.append("Coding & Dev")
    if (has_dedicated_gpu and ram >= 16) or (row["resolution_pixels"] >= 1920 * 1200 and ram >= 16):
        tags.append("Content Creation")
    if price <= 55000 or ram <= 8:
        tags.append("Student & Office")
    if not tags:
        tags.append("Everyday Use")
    return tags


def train_and_export():
    print(f"Loading raw dataset from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)

    # 1. Cleaning
    if "index" in df.columns:
        df = df.drop(columns=["index"])
    df = df[df["num_threads"] != 0].copy()
    df = df.reset_index(drop=True)

    # 2. Feature Engineering
    df["total_storage"] = df["primary_storage_capacity"] + df["secondary_storage_capacity"]
    df["resolution_pixels"] = df["resolution_width"] * df["resolution_height"]
    df["has_dedicated_gpu"] = (df["gpu_type"].str.lower() == "dedicated").astype(int)
    df["gpu_vram"] = df["Model"].apply(extract_gpu_vram)
    df["cpu_generation"] = df["Model"].apply(extract_intel_generation)

    # 3. CPU score
    cpu_tier_score_map = {
        "celeron": 25,
        "pentium": 30,
        "core i3": 45,
        "core i5": 60,
        "core i7": 75,
        "core i9": 90,
        "core ultra 7": 80,
        "ryzen 3": 45,
        "ryzen 5": 60,
        "ryzen 7": 75,
        "ryzen 9": 90,
        "m1": 65,
        "m2": 75,
        "m3": 85,
        "other": 40,
    }
    df["cpu_tier_score"] = df["processor_tier"].str.lower().map(cpu_tier_score_map).fillna(40)
    df["cpu_core_score"] = (df["num_cores"] / df["num_cores"].max()) * 100
    df["cpu_thread_score"] = (df["num_threads"] / df["num_threads"].max()) * 100
    df["cpu_score"] = (
        0.60 * df["cpu_tier_score"]
        + 0.20 * df["cpu_core_score"]
        + 0.20 * df["cpu_thread_score"]
    )

    # 4. GPU score
    gpu_brand_score_map = {
        "nvidia": 90,
        "amd": 80,
        "intel": 55,
        "apple": 70,
        "arm": 40,
    }
    df["gpu_brand_score"] = df["gpu_brand"].str.lower().map(gpu_brand_score_map).fillna(40)
    df["gpu_type_score"] = np.where(
        df["gpu_type"].str.lower() == "dedicated",
        90,
        np.where(df["gpu_type"].str.lower() == "integrated", 50, 65)
    )
    df["gpu_vram_score"] = (df["gpu_vram"].clip(0, 16) / 16) * 100
    df["gpu_score"] = (
        0.45 * df["gpu_brand_score"]
        + 0.40 * df["gpu_type_score"]
        + 0.15 * df["gpu_vram_score"]
    )

    # 5. RAM, Storage, Display scores
    df["ram_score"] = (df["ram_memory"].clip(0, 32) / 32) * 100
    df["storage_score"] = (df["total_storage"].clip(0, 2048) / 2048) * 100
    df["resolution_score"] = (df["resolution_pixels"] / df["resolution_pixels"].max()) * 100
    df["display_size_score"] = (df["display_size"] / df["display_size"].max()) * 100
    df["display_score"] = 0.70 * df["resolution_score"] + 0.30 * df["display_size_score"]

    # 6. Performance Score & Value Score
    df["Performance_Score"] = (
        0.40 * df["cpu_score"]
        + 0.40 * df["gpu_score"]
        + 0.10 * df["ram_score"]
        + 0.05 * df["storage_score"]
        + 0.05 * df["display_score"]
    ).round(2)
    df["Value_Score"] = ((df["Performance_Score"] / df["Price"]) * 100000).round(2)

    # 7. Model Features & Target
    features = [
        "Price",
        "processor_brand",
        "processor_tier",
        "num_cores",
        "num_threads",
        "ram_memory",
        "primary_storage_type",
        "primary_storage_capacity",
        "gpu_brand",
        "gpu_type",
        "gpu_vram",
        "has_dedicated_gpu",
        "display_size",
        "resolution_width",
        "resolution_height",
        "OS",
    ]
    categorical_features = [
        "processor_brand",
        "processor_tier",
        "primary_storage_type",
        "gpu_brand",
        "gpu_type",
        "OS",
    ]

    target = "Performance_Score"
    X = df[features]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_features)
        ],
        remainder="passthrough",
    )

    rf_model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", rf_model),
        ]
    )

    print("Training Random Forest Pipeline...")
    pipeline.fit(X_train, y_train)

    # Predictions & Metrics
    preds = pipeline.predict(X_test)
    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))

    print(f"Evaluation Metrics: MAE={mae:.2f}, RMSE={rmse:.2f}, R2={r2:.4f}")

    # Feature Importances
    trained_model = pipeline.named_steps["model"]
    trained_preprocessor = pipeline.named_steps["preprocessor"]
    feature_names = trained_preprocessor.get_feature_names_out()
    importances = trained_model.feature_importances_

    sorted_indices = np.argsort(importances)[::-1][:20]
    top_features = [
        {"feature": str(feature_names[i]), "importance": round(float(importances[i]), 4)}
        for i in sorted_indices
    ]

    # Save Pipeline artifact
    pipeline_path = ARTIFACTS_DIR / "rf_pipeline.joblib"
    joblib.dump(pipeline, pipeline_path)
    print(f"Saved trained pipeline to: {pipeline_path}")

    # Save Metrics artifact
    metrics = {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2_score": round(r2, 4),
        "total_records": len(df),
        "features_count": len(features),
        "top_features": top_features,
        "hardware_weights": {
            "cpu_weight": 0.40,
            "gpu_weight": 0.40,
            "ram_weight": 0.10,
            "storage_weight": 0.05,
            "display_weight": 0.05,
        },
    }
    metrics_path = ARTIFACTS_DIR / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved model metrics to: {metrics_path}")

    # Save Cleaned Laptops JSON for fast runtime lookup
    laptops_records = []
    for idx, row in df.iterrows():
        tags = compute_tags(row)
        laptops_records.append({
            "id": int(idx + 1),
            "brand": str(row["brand"]),
            "model": str(row["Model"]),
            "price": float(row["Price"]),
            "rating": float(row["Rating"]) if pd.notnull(row["Rating"]) else 60.0,
            "processor_brand": str(row["processor_brand"]),
            "processor_tier": str(row["processor_tier"]),
            "num_cores": int(row["num_cores"]),
            "num_threads": int(row["num_threads"]),
            "ram_memory": int(row["ram_memory"]),
            "primary_storage_type": str(row["primary_storage_type"]),
            "primary_storage_capacity": int(row["primary_storage_capacity"]),
            "secondary_storage_type": str(row["secondary_storage_type"]),
            "secondary_storage_capacity": int(row["secondary_storage_capacity"]),
            "total_storage": int(row["total_storage"]),
            "gpu_brand": str(row["gpu_brand"]),
            "gpu_type": str(row["gpu_type"]),
            "gpu_vram": int(row["gpu_vram"]),
            "has_dedicated_gpu": bool(row["has_dedicated_gpu"]),
            "is_touch_screen": bool(row["is_touch_screen"]),
            "display_size": float(row["display_size"]),
            "resolution_width": int(row["resolution_width"]),
            "resolution_height": int(row["resolution_height"]),
            "os": str(row["OS"]),
            "warranty": parse_warranty(row["year_of_warranty"]),
            "performance_score": float(row["Performance_Score"]),
            "value_score": float(row["Value_Score"]),
            "tags": tags,
        })

    laptops_json_path = DATA_DIR / "laptops_clean.json"
    with open(laptops_json_path, "w", encoding="utf-8") as f:
        json.dump(laptops_records, f, indent=2)
    print(f"Saved {len(laptops_records)} clean laptops to: {laptops_json_path}")


if __name__ == "__main__":
    train_and_export()
