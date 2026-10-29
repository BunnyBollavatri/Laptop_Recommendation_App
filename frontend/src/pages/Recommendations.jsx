import React, { useState, useMemo, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import LaptopCard from '../components/LaptopCard';
import StatsBanner from '../components/StatsBanner';
import { Search, ArrowUpDown, Inbox, Sparkles } from 'lucide-react';
import { getRecommendationsFromAPI } from '../services/api';

export default function Recommendations({
  allLaptops,
  comparedLaptops,
  onToggleCompare,
  onOpenDetails
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('performance');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [filters, setFilters] = useState({
    usage: 'all',
    maxPrice: 350000,
    minRam: 0,
    minStorage: 0,
    dedicatedGpuOnly: false,
    touchscreenOnly: false,
    processorBrand: 'all',
    brands: []
  });

  const brandsList = useMemo(() => {
    const set = new Set();
    allLaptops.forEach(l => set.add(l.brand));
    return Array.from(set).sort();
  }, [allLaptops]);

  const handleResetFilters = () => {
    setFilters({
      usage: 'all',
      maxPrice: 350000,
      minRam: 0,
      minStorage: 0,
      dedicatedGpuOnly: false,
      touchscreenOnly: false,
      processorBrand: 'all',
      brands: []
    });
    setSearchTerm('');
    setSortBy('performance');
    setPage(1);
  };

  const filteredLaptops = useMemo(() => {
    let result = allLaptops.filter(laptop => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesModel = laptop.model.toLowerCase().includes(query);
        const matchesBrand = laptop.brand.toLowerCase().includes(query);
        const matchesProcessor = `${laptop.processor_brand} ${laptop.processor_tier}`.toLowerCase().includes(query);
        if (!matchesModel && !matchesBrand && !matchesProcessor) return false;
      }

      if (laptop.price > filters.maxPrice) return false;
      if (filters.minRam > 0 && laptop.ram_memory < filters.minRam) return false;
      if (filters.minStorage > 0 && laptop.total_storage < filters.minStorage) return false;
      if (filters.dedicatedGpuOnly && !laptop.has_dedicated_gpu) return false;
      if (filters.touchscreenOnly && !laptop.is_touch_screen) return false;

      if (filters.processorBrand !== 'all' && laptop.processor_brand.toLowerCase() !== filters.processorBrand.toLowerCase()) {
        return false;
      }

      if (filters.brands.length > 0 && !filters.brands.includes(laptop.brand)) {
        return false;
      }

      if (filters.usage !== 'all' && !laptop.tags.includes(filters.usage)) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'performance') return b.performance_score - a.performance_score;
      if (sortBy === 'value') return b.value_score - a.value_score;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [allLaptops, searchTerm, filters, sortBy]);

  const [isLiveApi, setIsLiveApi] = useState(false);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchApi = async () => {
      try {
        const data = await getRecommendationsFromAPI({
          ...filters,
          searchTerm,
          sortBy
        });
        if (isMounted) {
          setApiData(data);
          setIsLiveApi(true);
        }
      } catch (err) {
        if (isMounted) {
          setIsLiveApi(false);
          setApiData(null);
        }
      }
    };

    const timer = setTimeout(fetchApi, 150);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filters, searchTerm, sortBy]);

  const displayLaptops = isLiveApi && apiData ? apiData.laptops : filteredLaptops;
  const currentTotal = isLiveApi && apiData ? apiData.total_matching : filteredLaptops.length;

  const avgScore = useMemo(() => {
    if (isLiveApi && apiData) return apiData.avg_score;
    if (!filteredLaptops.length) return 0;
    const total = filteredLaptops.reduce((acc, curr) => acc + curr.performance_score, 0);
    return (total / filteredLaptops.length).toFixed(1);
  }, [filteredLaptops, isLiveApi, apiData]);

  const avgPrice = useMemo(() => {
    if (isLiveApi && apiData) return apiData.avg_price;
    if (!filteredLaptops.length) return 0;
    const total = filteredLaptops.reduce((acc, curr) => acc + curr.price, 0);
    return Math.round(total / filteredLaptops.length);
  }, [filteredLaptops, isLiveApi, apiData]);

  const paginatedLaptops = displayLaptops.slice(0, page * pageSize);
  const hasMore = paginatedLaptops.length < displayLaptops.length;

  return (
    <div>
      {/* Top Banner Stats */}
      <StatsBanner
        totalLaptops={allLaptops.length}
        filteredCount={currentTotal}
        avgScore={avgScore}
        avgPrice={avgPrice}
        isLiveApi={isLiveApi}
      />

      {/* Main Grid: Filters Sidebar + Results Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(270px, 300px) 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          brandsList={brandsList}
          onReset={handleResetFilters}
        />

        {/* Right Content Area */}
        <div>
          {/* Controls Bar: Search & Sort */}
          <div className="card-panel" style={{
            padding: '14px 18px',
            marginBottom: '18px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              flex: '1 1 260px'
            }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by model or processor (e.g. Core i7, Ryzen 7, M2)..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%',
                  fontFamily: 'var(--font-sans)'
                }}
              />
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} color="var(--text-secondary)" />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <option value="performance">ML Performance Score (High to Low)</option>
                <option value="balanced">Balanced (70% Perf + 30% Value)</option>
                <option value="value">Value Index (Score / Price)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Laptop Cards Grid */}
          {paginatedLaptops.length > 0 ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '18px'
              }}>
                {paginatedLaptops.map(laptop => (
                  <LaptopCard
                    key={laptop.id}
                    laptop={laptop}
                    isCompared={comparedLaptops.some(c => c.id === laptop.id)}
                    onToggleCompare={onToggleCompare}
                    onOpenDetails={onOpenDetails}
                  />
                ))}
              </div>

              {/* Pagination / Load More */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="btn btn-secondary"
                    style={{ padding: '10px 28px', fontSize: '13px' }}
                  >
                    Load More Laptops ({filteredLaptops.length - paginatedLaptops.length} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="card-panel" style={{ textAlign: 'center', padding: '56px 20px', marginTop: '16px' }}>
              <Inbox size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>No matching laptops found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: 380, margin: '0 auto 16px' }}>
                Try adjusting your budget or hardware specifications to see available models.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
