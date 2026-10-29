"""
Convenience launcher for the Laptop Recommendation FastAPI server.
Usage:
    python backend/run_server.py
"""

import sys
import uvicorn
from pathlib import Path

# Add backend directory to python path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    print("🚀 Starting Laptop Recommendation FastAPI Server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check:       http://localhost:8000/api/health")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
