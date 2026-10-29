from typing import List, Dict, Any, Tuple
from app.models import RecommendationRequest, LaptopItem
from app.ml_service import ml_service


def apply_recommendations(req: RecommendationRequest) -> Tuple[List[Dict[str, Any]], int, float, float]:
    """
    Executes the multi-stage recommendation workflow:
    1. Mandatory constraint filtering
    2. Search keyword filtering
    3. Performance/Value ranking
    4. Aggregation & pagination
    """
    all_laptops = ml_service.get_all_laptops()
    filtered: List[Dict[str, Any]] = []

    search_query = (req.search_query or "").strip().lower()

    for item in all_laptops:
        # 1. Price constraint
        if item["price"] > req.budget:
            continue

        # 2. RAM constraint
        if req.min_ram > 0 and item["ram_memory"] < req.min_ram:
            continue

        # 3. Storage constraint
        if req.min_storage > 0 and item["total_storage"] < req.min_storage:
            continue

        # 4. Dedicated GPU constraint
        if req.dedicated_gpu_only and not item["has_dedicated_gpu"]:
            continue

        # 5. Touchscreen constraint
        if req.touchscreen_only and not item["is_touch_screen"]:
            continue

        # 6. Processor Brand filter
        if req.processor_brand != "all" and item["processor_brand"].lower() != req.processor_brand.lower():
            continue

        # 7. Brand filter list
        if req.brands and item["brand"] not in req.brands:
            continue

        # 8. Usage Profile / Tags filter
        if req.usage != "all":
            tags = item.get("tags", [])
            # Map common variants
            target_tag = req.usage.lower()
            tag_matched = any(target_tag in t.lower() for t in tags)
            if not tag_matched:
                continue

        # 9. Search keyword filter
        if search_query:
            text = f"{item['brand']} {item['model']} {item['processor_brand']} {item['processor_tier']}".lower()
            if search_query not in text:
                continue

        filtered.append(dict(item))

    total_matching = len(filtered)
    if total_matching == 0:
        return [], 0, 0.0, 0.0

    # Calculate Summary Stats
    avg_score = round(sum(i["performance_score"] for i in filtered) / total_matching, 1)
    avg_price = round(sum(i["price"] for i in filtered) / total_matching)

    # Ranking logic
    sort_mode = req.sort_by.lower()

    if sort_mode == "balanced":
        max_perf = max((i["performance_score"] for i in filtered), default=1.0) or 1.0
        max_val = max((i["value_score"] for i in filtered), default=1.0) or 1.0
        for item in filtered:
            norm_perf = item["performance_score"] / max_perf
            norm_val = item["value_score"] / max_val
            item["final_score"] = round((0.70 * norm_perf + 0.30 * norm_val) * 100, 2)
        filtered.sort(key=lambda x: x.get("final_score", 0), reverse=True)

    elif sort_mode == "value":
        filtered.sort(key=lambda x: x["value_score"], reverse=True)

    elif sort_mode == "price-asc":
        filtered.sort(key=lambda x: x["price"])

    elif sort_mode == "price-desc":
        filtered.sort(key=lambda x: x["price"], reverse=True)

    elif sort_mode == "rating":
        filtered.sort(key=lambda x: x["rating"], reverse=True)

    else:
        # Default: performance ranking
        filtered.sort(key=lambda x: x["performance_score"], reverse=True)

    # Pagination / Slicing
    start = req.offset
    if req.limit is not None and req.limit > 0:
        paged = filtered[start : start + req.limit]
    else:
        paged = filtered[start:]

    return paged, total_matching, avg_score, float(avg_price)
