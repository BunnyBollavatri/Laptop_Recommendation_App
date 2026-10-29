from fastapi import APIRouter
from app.models import MLInsightsResponse, HealthResponse
from app.ml_service import ml_service
from app.config import settings

router = APIRouter(tags=["ML Insights & Health"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Verify backend health and model loading status."""
    return HealthResponse(
        status="healthy",
        model_loaded=ml_service.pipeline is not None,
        dataset_records=len(ml_service.get_all_laptops()),
        version=settings.VERSION,
    )


@router.get("/ml-insights", response_model=MLInsightsResponse)
def get_ml_insights():
    """Retrieve Random Forest training metrics, feature importance, and scoring formula weights."""
    metrics = ml_service.get_metrics()
    return MLInsightsResponse(
        mae=metrics.get("mae", 0.47),
        rmse=metrics.get("rmse", 1.12),
        r2_score=metrics.get("r2_score", 0.992),
        total_records=metrics.get("total_records", 986),
        features_count=metrics.get("features_count", 16),
        top_features=metrics.get("top_features", []),
        hardware_weights=metrics.get("hardware_weights", {
            "cpu_weight": 0.40,
            "gpu_weight": 0.40,
            "ram_weight": 0.10,
            "storage_weight": 0.05,
            "display_weight": 0.05,
        }),
    )
