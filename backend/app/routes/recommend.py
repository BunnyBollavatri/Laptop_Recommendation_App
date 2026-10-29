from fastapi import APIRouter, HTTPException
from app.models import (
    RecommendationRequest,
    RecommendationResponse,
    PredictScoreRequest,
    PredictScoreResponse,
    LaptopItem,
)
from app.recommendation import apply_recommendations
from app.ml_service import ml_service

router = APIRouter(tags=["Recommendations"])


@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    """
    Get ranked laptop recommendations based on user constraints, intended usage, and ranking preferences.
    """
    paged_items, total_matching, avg_score, avg_price = apply_recommendations(req)
    
    return RecommendationResponse(
        total_matching=total_matching,
        returned_count=len(paged_items),
        avg_score=avg_score,
        avg_price=avg_price,
        laptops=[LaptopItem(**item) for item in paged_items],
    )


@router.post("/predict-score", response_model=PredictScoreResponse)
def predict_custom_spec_score(req: PredictScoreRequest):
    """
    Predict hardware performance score and value score in real time using the trained Random Forest model.
    """
    spec_data = req.model_dump()
    pred_score = ml_service.predict_score(spec_data)
    
    price = req.Price if req.Price > 0 else 1.0
    value_score = round((pred_score / price) * 100000, 2)
    
    # Infer tags
    tags = []
    if req.has_dedicated_gpu and req.ram_memory >= 8:
        tags.append("Gaming")
    if req.ram_memory >= 16 or (req.num_cores >= 6 and req.ram_memory >= 8):
        tags.append("Coding & Dev")
    if (req.has_dedicated_gpu and req.ram_memory >= 16) or (req.resolution_width * req.resolution_height >= 1920 * 1200 and req.ram_memory >= 16):
        tags.append("Content Creation")
    if req.Price <= 55000 or req.ram_memory <= 8:
        tags.append("Student & Office")
    if not tags:
        tags.append("Everyday Use")
        
    return PredictScoreResponse(
        predicted_performance_score=pred_score,
        predicted_value_score=value_score,
        persona_tags=tags,
    )
