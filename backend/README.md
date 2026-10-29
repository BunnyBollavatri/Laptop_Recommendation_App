# 🚀 Laptop Recommendation FastAPI Backend

Production-ready FastAPI backend for the **Laptop Recommendation System**, powered by a trained **Random Forest Regression pipeline** and constraint-based filtering engine.

---

## 📁 Directory Layout

```text
backend/
├── app/
│   ├── routes/
│   │   ├── recommend.py      # POST /api/recommend, POST /api/predict-score
│   │   ├── laptops.py        # GET /api/laptops, GET /api/laptops/{id}, GET /api/brands
│   │   └── insights.py       # GET /api/ml-insights, GET /api/health
│   ├── config.py             # Settings and environment configuration
│   ├── models.py             # Pydantic schemas for request & response validation
│   ├── ml_service.py         # Model loading, artifact management, ML inference
│   ├── recommendation.py     # Hard constraint filtering and ranking algorithms
│   └── main.py               # FastAPI entrypoint, CORS middleware, routes
├── artifacts/
│   ├── rf_pipeline.joblib    # Serialized Scikit-Learn Random Forest Pipeline
│   └── metrics.json          # MAE, RMSE, R² and feature importance metadata
├── data/
│   └── laptops_clean.json    # Cleaned, scored, and persona-tagged laptops dataset
├── train_and_export.py       # Training and export pipeline script
├── run_server.py             # Server launcher script
└── requirements.txt          # Python package dependencies
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. (Optional) Retrain and Export ML Pipeline
To retrain the Random Forest model and refresh artifacts:
```bash
python backend/train_and_export.py
```

### 3. Launch the FastAPI Server
```bash
python backend/run_server.py
```
Or directly with Uvicorn:
```bash
uvicorn app.main:app --app-dir backend --reload --port 8000
```

---

## 📖 API Documentation & Endpoints

Once started, open your browser:
* **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and ML model loaded check |
| `POST` | `/api/recommend` | Ranked recommendations based on constraints and preferences |
| `POST` | `/api/predict-score` | Real-time ML hardware performance prediction for custom specs |
| `GET` | `/api/laptops` | Browse all laptops with pagination and brand filters |
| `GET` | `/api/laptops/{id}` | Get detailed specs for a specific laptop |
| `GET` | `/api/laptops/brands`| List of all distinct laptop brands |
| `GET` | `/api/ml-insights` | Training evaluation metrics (R², MAE, RMSE) and feature importance |

---

## 🧪 Example API Request

### `POST /api/recommend`
```json
{
  "budget": 75000,
  "min_ram": 16,
  "min_storage": 512,
  "usage": "Gaming",
  "sort_by": "balanced",
  "limit": 5
}
```
