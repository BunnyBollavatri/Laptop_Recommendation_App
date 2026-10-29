from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import LaptopItem
from app.ml_service import ml_service

router = APIRouter(prefix="/laptops", tags=["Laptops"])


@router.get("", response_model=List[LaptopItem])
def get_laptops(
    brand: Optional[str] = Query(None, description="Filter by brand name"),
    limit: int = Query(50, ge=1, le=500, description="Page limit"),
    offset: int = Query(0, ge=0, description="Offset"),
):
    """Browse all cleaned laptops with optional pagination and brand filtering."""
    all_laptops = ml_service.get_all_laptops()
    if brand:
        all_laptops = [l for l in all_laptops if l.get("brand", "").lower() == brand.lower()]
    
    paged = all_laptops[offset : offset + limit]
    return [LaptopItem(**item) for item in paged]


@router.get("/brands", response_model=List[str])
def get_brands():
    """Get list of all distinct laptop brands."""
    return ml_service.get_unique_brands()


@router.get("/{laptop_id}", response_model=LaptopItem)
def get_laptop_detail(laptop_id: int):
    """Retrieve full hardware and scoring details for a single laptop by ID."""
    laptop = ml_service.get_laptop_by_id(laptop_id)
    if not laptop:
        raise HTTPException(status_code=404, detail=f"Laptop with ID {laptop_id} not found.")
    return LaptopItem(**laptop)
