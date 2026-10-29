from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class LaptopItem(BaseModel):
    id: int
    brand: str
    model: str
    price: float
    rating: float
    processor_brand: str
    processor_tier: str
    num_cores: int
    num_threads: int
    ram_memory: int
    primary_storage_type: str
    primary_storage_capacity: int
    secondary_storage_type: str
    secondary_storage_capacity: int
    total_storage: int
    gpu_brand: str
    gpu_type: str
    gpu_vram: int
    has_dedicated_gpu: bool
    is_touch_screen: bool
    display_size: float
    resolution_width: int
    resolution_height: int
    os: str
    warranty: int
    performance_score: float
    value_score: float
    tags: List[str] = []
    final_score: Optional[float] = None


class RecommendationRequest(BaseModel):
    budget: float = Field(default=350000.0, description="Maximum budget in INR")
    min_ram: int = Field(default=0, description="Minimum RAM in GB")
    min_storage: int = Field(default=0, description="Minimum storage in GB")
    dedicated_gpu_only: bool = Field(default=False, description="Require dedicated GPU")
    touchscreen_only: bool = Field(default=False, description="Require touchscreen")
    processor_brand: str = Field(default="all", description="Processor brand: all, Intel, AMD, Apple")
    brands: List[str] = Field(default=[], description="List of preferred brands")
    usage: str = Field(default="all", description="Intended usage: all, Gaming, Coding & Dev, Student & Office, Content Creation")
    sort_by: str = Field(default="performance", description="Ranking mode: performance, value, price-asc, price-desc, rating, balanced")
    search_query: Optional[str] = Field(default="", description="Search keyword for model or brand")
    limit: Optional[int] = Field(default=None, description="Maximum number of items to return (null for all matching)")
    offset: int = Field(default=0, description="Pagination offset")


class RecommendationResponse(BaseModel):
    total_matching: int
    returned_count: int
    avg_score: float
    avg_price: float
    laptops: List[LaptopItem]


class PredictScoreRequest(BaseModel):
    Price: float = Field(default=65000.0, description="Price in INR")
    processor_brand: str = Field(default="Intel", description="Processor brand: Intel, AMD, Apple")
    processor_tier: str = Field(default="Core i5", description="e.g. Core i5, Core i7, Ryzen 5, Ryzen 7")
    num_cores: int = Field(default=6, description="Number of CPU cores")
    num_threads: int = Field(default=12, description="Number of CPU threads")
    ram_memory: int = Field(default=16, description="RAM memory in GB")
    primary_storage_type: str = Field(default="SSD", description="SSD or Hard Disk")
    primary_storage_capacity: int = Field(default=512, description="Primary storage in GB")
    gpu_brand: str = Field(default="Nvidia", description="Nvidia, AMD, Intel, Apple")
    gpu_type: str = Field(default="Dedicated", description="Dedicated or Integrated")
    gpu_vram: int = Field(default=4, description="GPU VRAM in GB")
    has_dedicated_gpu: bool = Field(default=True, description="Dedicated GPU flag")
    display_size: float = Field(default=15.6, description="Screen size in inches")
    resolution_width: int = Field(default=1920, description="Display width in pixels")
    resolution_height: int = Field(default=1080, description="Display height in pixels")
    OS: str = Field(default="Windows", description="Operating system: Windows, Mac, Chrome, etc.")


class PredictScoreResponse(BaseModel):
    predicted_performance_score: float
    predicted_value_score: float
    persona_tags: List[str]
    model_version: str = "RandomForest-v1.0"


class MLInsightsResponse(BaseModel):
    mae: float
    rmse: float
    r2_score: float
    total_records: int
    features_count: int
    top_features: List[Dict[str, Any]]
    hardware_weights: Dict[str, float]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    dataset_records: int
    version: str
