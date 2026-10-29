# 💻 Laptop Recommendation System Using Machine Learning

An intelligent, end-to-end Laptop Recommendation System combining a **Random Forest Regression ML model** with an interactive **modern React frontend** to provide personalized laptop suggestions based on user budget, usage requirements, and hardware preferences.

---

## 📁 Project Folder Structure

```text
laptop-recommendation/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── LaptopCard.jsx
│   │   │   ├── LaptopModal.jsx
│   │   │   ├── ComparisonDrawer.jsx
│   │   │   └── StatsBanner.jsx
│   │   ├── pages/
│   │   │   ├── Recommendations.jsx
│   │   │   └── MLInsights.jsx
│   │   ├── data/
│   │   │   └── laptops.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   ├── laptops.csv
│   ├── laptop_recommendation.py
│   └── Laptop_Recommendation_RandomForest_Organized.ipynb
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

### 1. Machine Learning Environment
Run the Python recommendation pipeline or Jupyter Notebook:
```bash
# Navigate to the ml directory
cd ml

# Run the recommendation script
python laptop_recommendation.py

# Or launch Jupyter Notebook
jupyter notebook Laptop_Recommendation_RandomForest_Organized.ipynb
```

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

---

## 📊 Dataset Specifications
The dataset `ml/laptops.csv` contains detailed specifications including:
- **Brand & Model**: Manufacturer, model name, and SKU details.
- **Processor**: Brand (Intel, AMD, Apple), Tier (i3, i5, i7, i9, Ryzen 3/5/7/9, M1/M2/M3), Cores, Threads.
- **Memory & Storage**: RAM capacity (GB), Primary/Secondary storage types (SSD/HDD) and capacities.
- **Graphics**: GPU brand (NVIDIA, AMD, Intel, Apple), GPU type (Dedicated/Integrated), VRAM.
- **Display**: Screen size (inches), Resolution (Width × Height), Touchscreen support.
- **OS & Warranty**: Operating System (Windows, macOS, DOS, ChromeOS) and manufacturer warranty period.
