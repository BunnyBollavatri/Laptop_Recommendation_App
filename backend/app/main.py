from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.config import settings
from app.routes import recommend, laptops, insights

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# 💻 Laptop Recommendation API

A high-performance machine learning backend serving personalized laptop recommendations using:
- **Constraint-Based Filtering** (budget, RAM, storage, dedicated GPU, brand, persona tags)
- **Random Forest Regression Pipeline** for predicted hardware performance scoring
- **Multi-Preference Ranking** (Balanced, Maximum Performance, Value for Money)
- **Real-Time Hardware Scoring** for custom laptop specifications
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(recommend.router, prefix=settings.API_V1_PREFIX)
app.include_router(laptops.router, prefix=settings.API_V1_PREFIX)
app.include_router(insights.router, prefix=settings.API_V1_PREFIX)


@app.get("/", include_in_schema=False)
def root():
    """Redirect root path to interactive Swagger API documentation."""
    return RedirectResponse(url="/docs")
