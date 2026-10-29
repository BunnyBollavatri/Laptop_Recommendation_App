/**
 * API service for communication between React frontend and FastAPI backend.
 * Gracefully falls back to local precomputed LAPTOPS_DATA when FastAPI backend is offline.
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { online: true, data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

export async function getRecommendationsFromAPI(params) {
  const payload = {
    budget: params.maxPrice ?? 350000,
    min_ram: params.minRam ?? 0,
    min_storage: params.minStorage ?? 0,
    dedicated_gpu_only: Boolean(params.dedicatedGpuOnly),
    touchscreen_only: Boolean(params.touchscreenOnly),
    processor_brand: params.processorBrand || 'all',
    brands: params.brands || [],
    usage: params.usage || 'all',
    sort_by: params.sortBy || 'performance',
    search_query: params.searchTerm || '',
    limit: null,
    offset: 0,
  };

  const res = await fetch(`${API_BASE}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return await res.json();
}

export async function predictHardwareScore(customSpecs) {
  const res = await fetch(`${API_BASE}/api/predict-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customSpecs),
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    throw new Error(`Predict error: ${res.status}`);
  }

  return await res.json();
}

export async function getMLInsightsFromAPI() {
  const res = await fetch(`${API_BASE}/api/ml-insights`, {
    method: 'GET',
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) {
    throw new Error(`Insights error: ${res.status}`);
  }

  return await res.json();
}
