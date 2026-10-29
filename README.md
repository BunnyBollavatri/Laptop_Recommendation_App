# 💻 Laptop Recommendation System Using Machine Learning

An intelligent, end-to-end Laptop Recommendation System combining a **Random Forest Regression ML model** with an interactive **modern React frontend** to provide personalized laptop suggestions based on user budget, usage requirements, and hardware preferences.

---

## 📁 Project Folder Structure

```text
laptop-recommendation/
│
├── backend/                              # FastAPI Machine Learning Service
│   ├── app/
│   │   ├── routes/
│   │   │   ├── recommend.py              # POST /api/recommend, POST /api/predict-score
│   │   │   ├── laptops.py                # GET /api/laptops, GET /api/laptops/{id}, GET /api/brands
│   │   │   └── insights.py               # GET /api/ml-insights, GET /api/health
│   │   ├── config.py                     # App settings & CORS configuration
│   │   ├── models.py                     # Pydantic schemas
│   │   ├── ml_service.py                 # Pipeline loading & real-time inference
│   │   ├── recommendation.py             # Multi-stage filtering & ranking logic
│   │   └── main.py                       # FastAPI entrypoint
│   ├── artifacts/
│   │   ├── rf_pipeline.joblib            # Serialized Random Forest Regressor Pipeline
│   │   └── metrics.json                  # R² (0.992), MAE (0.47), RMSE (1.12), feature importances
│   ├── data/
│   │   └── laptops_clean.json            # Cleaned, scored, and persona-tagged laptops dataset
│   ├── train_and_export.py               # Retrain and export ML artifacts
│   ├── run_server.py                     # Uvicorn launcher script
│   └── requirements.txt                  # Python backend dependencies
│
├── frontend/                             # React + Vite Interactive Application
│   ├── src/
│   │   ├── components/                   # Navbar, FilterSidebar, LaptopCard, Modal, Drawer, Stats
│   │   ├── pages/                        # Recommendations & MLInsights
│   │   ├── services/                     # api.js (FastAPI integration + offline fallback)
│   │   ├── data/                         # laptops.js (fallback offline dataset)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                           # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                    # Vite configuration with /api reverse proxy
│
├── ml/                                   # Offline ML Experimentation
│   ├── laptops.csv                       # Cleaned raw dataset
│   ├── laptop_recommendation.py          # Standalone training and scoring script
│   └── Laptop_Recommendation_RandomForest_Organized.ipynb # Jupyter Notebook
│
└── README.md
```

---

## 🚀 Key Features

- **Constraint-Based Filtering**: Hard constraints on budget, minimum RAM, storage type/capacity, processor brand/tier, and dedicated GPU requirements.
- **Machine Learning Performance Prediction**: Employs a **Random Forest Regressor** trained on hardware specifications (CPU cores/threads, RAM, GPU type/memory, display resolution, storage) to score laptop capabilities.
- **Multi-Persona Profiles**:
  - 🎮 **Gaming / Heavy Workloads**: Prioritizes dedicated GPUs, high VRAM, multi-core CPUs, and high refresh displays.
  - 💻 **Programming / Development**: Focuses on multi-threading, 16GB+ RAM, and fast SSD storage.
  - 🎓 **Student / Everyday Office**: Optimizes for battery life, portability, and value-for-money.
  - 🎨 **Content Creation**: Highlights high-resolution displays, high RAM, and GPU rendering speed.
- **Interactive UI & Live Comparison**:
  - Filter by budget, brand, CPU, GPU, RAM, OS, and usage profile.
  - Side-by-side spec comparisons for up to 3 models.
  - Transparent ML score breakdowns explaining why each laptop was recommended.

---

## 🧠 Machine Learning Pipeline

```text
User Requirements (Budget, Usage, Hardware Specs)
                     │
                     ▼
         Constraint-Based Filtering
                     │
                     ▼
          Eligible Laptop Pool
                     │
                     ▼
            Feature Engineering
(Total Storage, Resolution Pixels, GPU VRAM, Dedicated GPU flag)
                     │
                     ▼
      Random Forest Performance Scoring
                     │
                     ▼
           Multi-Criteria Ranking
(Performance Score, Value Score, User Preferences)
                     │
                     ▼
        Top-N Recommendations Delivered
```

### Engineered Features
1. `total_storage` = Primary Storage + Secondary Storage (GB)
2. `resolution_pixels` = Display Width × Display Height
3. `has_dedicated_gpu` = Dedicated vs. Integrated GPU indicator
4. `gpu_vram` = Extracted VRAM from model descriptions (e.g., 4GB, 6GB, 8GB)
5. `cpu_generation` = Extracted processor generation from model names

---

## 🛠️ Getting Started

### 1. Launch FastAPI Backend
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
python backend/run_server.py
```
* **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Frontend Web Application
Run the React + Vite web application:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Machine Learning Notebooks & Experimentation
```bash
# Navigate to the ml directory
cd ml

# Run the recommendation script
python laptop_recommendation.py

# Or launch Jupyter Notebook
jupyter notebook Laptop_Recommendation_RandomForest_Organized.ipynb
```

---

## 📊 Dataset Specifications
The dataset `ml/laptops.csv` contains detailed specifications including:
- **Brand & Model**: Manufacturer, model name, and SKU details.
- **Processor**: Brand (Intel, AMD, Apple), Tier (i3, i5, i7, i9, Ryzen 3/5/7/9, M1/M2/M3), Cores, Threads.
- **Memory & Storage**: RAM capacity (GB), Primary/Secondary storage types (SSD/HDD) and capacities.
- **Graphics**: GPU brand (NVIDIA, AMD, Intel, Apple), GPU type (Dedicated/Integrated), VRAM.
- **Display**: Screen size (inches), Resolution (Width × Height), Touchscreen support.
- **OS & Warranty**: Operating System (Windows, macOS, DOS, ChromeOS) and manufacturer warranty period.
