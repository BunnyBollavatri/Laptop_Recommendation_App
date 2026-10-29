import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';

const USAGE_PRESETS = [
  { id: 'all', label: 'All Laptops' },
  { id: 'Gaming', label: 'Gaming & High Performance' },
  { id: 'Coding & Dev', label: 'Coding & Software Development' },
  { id: 'Student & Office', label: 'Student & General Office' },
  { id: 'Content Creation', label: 'Content Creation & Design' }
];

export default function FilterSidebar({
  filters,
  setFilters,
  brandsList,
  onReset
}) {
  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

  const handleBrandToggle = (brand) => {
    if (filters.brands.includes(brand)) {
      setFilters(prev => ({
        ...prev,
        brands: prev.brands.filter(b => b !== brand)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        brands: [...prev.brands, brand]
      }));
    }
  };

  return (
    <aside className="card-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="var(--text-secondary)" />
          <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Filter Laptops</h3>
        </div>
        <button
          onClick={onReset}
          className="btn btn-secondary"
          style={{ padding: '4px 8px', fontSize: '11px' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Usage Profile */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.04em' }}>
          Intended Usage
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {USAGE_PRESETS.map((preset) => {
            const isSelected = filters.usage === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setFilters(prev => ({ ...prev, usage: preset.id }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isSelected ? '#bfdbfe' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isSelected ? 600 : 400
                }}
              >
                <span>{preset.label}</span>
                {isSelected && <Check size={14} color="var(--accent-primary)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Maximum Budget */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            Maximum Budget
          </label>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={20000}
          max={350000}
          step={5000}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          style={{
            width: '100%',
            accentColor: 'var(--accent-primary)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
          {[45000, 75000, 120000, 200000, 350000].map(val => (
            <button
              key={val}
              onClick={() => setFilters(prev => ({ ...prev, maxPrice: val }))}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: filters.maxPrice === val ? 'var(--accent-primary-light)' : '#ffffff',
                color: filters.maxPrice === val ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: filters.maxPrice === val ? 600 : 400
              }}
            >
              {val >= 100000 ? `₹${val/100000}L` : `₹${val/1000}k`}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum RAM */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Minimum RAM
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 8, 16, 32].map(ram => (
            <button
              key={ram}
              onClick={() => setFilters(prev => ({ ...prev, minRam: ram }))}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filters.minRam === ram ? 'var(--accent-primary)' : '#ffffff',
                color: filters.minRam === ram ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filters.minRam === ram ? 'var(--accent-primary)' : 'var(--border-color)',
                cursor: 'pointer',
                fontWeight: filters.minRam === ram ? 600 : 400
              }}
            >
              {ram === 0 ? 'Any' : `${ram}GB+`}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Storage */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Minimum Storage
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 256, 512, 1024].map(storage => (
            <button
              key={storage}
              onClick={() => setFilters(prev => ({ ...prev, minStorage: storage }))}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filters.minStorage === storage ? 'var(--accent-primary)' : '#ffffff',
                color: filters.minStorage === storage ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filters.minStorage === storage ? 'var(--accent-primary)' : 'var(--border-color)',
                cursor: 'pointer',
                fontWeight: filters.minStorage === storage ? 600 : 400
              }}
            >
              {storage === 0 ? 'Any' : storage >= 1024 ? '1TB+' : `${storage}GB`}
            </button>
          ))}
        </div>
      </div>

      {/* Hardware Toggles */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Hardware Requirements
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={filters.dedicatedGpuOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, dedicatedGpuOnly: e.target.checked }))}
              style={{ width: 15, height: 15, accentColor: 'var(--accent-primary)' }}
            />
            Dedicated GPU (NVIDIA / AMD)
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={filters.touchscreenOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, touchscreenOnly: e.target.checked }))}
              style={{ width: 15, height: 15, accentColor: 'var(--accent-primary)' }}
            />
            Touchscreen Display
          </label>
        </div>
      </div>

      {/* Processor Brand */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Processor Brand
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['all', 'Intel', 'Amd', 'Apple'].map(brand => (
            <button
              key={brand}
              onClick={() => setFilters(prev => ({ ...prev, processorBrand: brand }))}
              style={{
                flex: 1,
                padding: '6px 0',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: filters.processorBrand === brand ? 'var(--accent-primary)' : '#ffffff',
                color: filters.processorBrand === brand ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filters.processorBrand === brand ? 'var(--accent-primary)' : 'var(--border-color)',
                cursor: 'pointer',
                fontWeight: filters.processorBrand === brand ? 600 : 400
              }}
            >
              {brand === 'all' ? 'All' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Brands
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px',
          maxHeight: 160,
          overflowY: 'auto',
          paddingRight: '2px'
        }}>
          {brandsList.map(brand => {
            const isChecked = filters.brands.includes(brand);
            return (
              <button
                key={brand}
                onClick={() => handleBrandToggle(brand)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  backgroundColor: isChecked ? 'var(--accent-primary-light)' : '#ffffff',
                  color: isChecked ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isChecked ? '#bfdbfe' : 'var(--border-color)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isChecked ? 600 : 400
                }}
              >
                <span>{brand}</span>
                {isChecked && <Check size={12} color="var(--accent-primary)" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
