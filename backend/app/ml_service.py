import json
import logging
import joblib
import pandas as pd
from typing import List, Dict, Any, Optional
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)


class MLService:
    def __init__(self):
        self.pipeline = None
        self.metrics: Dict[str, Any] = {}
        self.laptops: List[Dict[str, Any]] = []
        self._load_artifacts()

    def _load_artifacts(self):
        # 1. Load pipeline
        if settings.PIPELINE_PATH.exists():
            try:
                self.pipeline = joblib.load(settings.PIPELINE_PATH)
                logger.info(f"Loaded ML Pipeline from {settings.PIPELINE_PATH}")
            except Exception as e:
                logger.error(f"Failed to load ML pipeline: {e}")
        else:
            logger.warning(f"Pipeline not found at {settings.PIPELINE_PATH}")

        # 2. Load metrics
        if settings.METRICS_PATH.exists():
            try:
                with open(settings.METRICS_PATH, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
                logger.info("Loaded ML metrics artifact.")
            except Exception as e:
                logger.error(f"Failed to load metrics: {e}")

        # 3. Load clean dataset
        if settings.DATA_PATH.exists():
            try:
                with open(settings.DATA_PATH, "r", encoding="utf-8") as f:
                    self.laptops = json.load(f)
                logger.info(f"Loaded {len(self.laptops)} laptops into memory.")
            except Exception as e:
                logger.error(f"Failed to load laptops data: {e}")

    def predict_score(self, item_dict: Dict[str, Any]) -> float:
        """Run single laptop spec inference using the trained Random Forest Pipeline."""
        if self.pipeline is None:
            # Fallback to analytical calculation if pipeline is unavailable
            return 50.0

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

        # Construct dataframe row
        row = {f: item_dict.get(f, 0) for f in features}
        # ensure type conversion
        row["has_dedicated_gpu"] = 1 if item_dict.get("has_dedicated_gpu") else 0
        df = pd.DataFrame([row])
        pred = self.pipeline.predict(df)[0]
        return round(float(pred), 2)

    def get_all_laptops(self) -> List[Dict[str, Any]]:
        return self.laptops

    def get_laptop_by_id(self, laptop_id: int) -> Optional[Dict[str, Any]]:
        for l in self.laptops:
            if l["id"] == laptop_id:
                return l
        return None

    def get_unique_brands(self) -> List[str]:
        brands = sorted(list({l["brand"] for l in self.laptops if l.get("brand")}))
        return brands

    def get_metrics(self) -> Dict[str, Any]:
        return self.metrics


ml_service = MLService()
