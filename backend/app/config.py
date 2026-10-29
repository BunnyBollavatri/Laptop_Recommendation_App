from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Laptop Recommendation API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    ARTIFACTS_DIR: Path = BASE_DIR / "artifacts"
    PIPELINE_PATH: Path = BASE_DIR / "artifacts" / "rf_pipeline.joblib"
    METRICS_PATH: Path = BASE_DIR / "artifacts" / "metrics.json"
    DATA_PATH: Path = BASE_DIR / "data" / "laptops_clean.json"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
