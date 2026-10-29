import React from 'react';
import { Cpu, HardDrive, Monitor, Zap, Plus, Check, Star } from 'lucide-react';

export default function LaptopCard({
  laptop,
  isCompared,
  onToggleCompare,
  onOpenDetails
}) {
  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div className="card-panel card-panel-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
      position: 'relative'
    }}>
      <div>
        {/* Top Header: Brand & Score Pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="badge badge-neutral" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {laptop.brand}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {laptop.rating && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                <Star size={12} fill="currentColor" />
                {laptop.rating}
              </span>
            )}
            <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {laptop.performance_score} / 100
            </span>
          </div>
        </div>

        {/* Model Title */}
        <h4 style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '1.45',
          marginBottom: '10px',
          color: 'var(--text-primary)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '40px'
        }} title={laptop.model}>
          {laptop.model}
        </h4>

        {/* Usage Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {laptop.tags.slice(0, 2).map(tag => (
            <span key={tag} className="badge badge-neutral" style={{ fontSize: '10px' }}>
              {tag}
            </span>
          ))}
          {laptop.has_dedicated_gpu && (
            <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
              {laptop.gpu_brand} Dedicated
            </span>
          )}
        </div>

        {/* Specification Box */}
        <div style={{
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '12px',
          marginBottom: '14px',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Cpu size={14} color="var(--accent-primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong>{laptop.processor_tier}</strong> ({laptop.num_cores} cores, {laptop.num_threads} threads)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Zap size={14} color="var(--accent-slate)" />
            <span>{laptop.ram_memory}GB RAM • {laptop.gpu_brand} {laptop.gpu_type} {laptop.gpu_vram ? `(${laptop.gpu_vram}GB)` : ''}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <HardDrive size={14} color="var(--accent-emerald)" />
            <span>{laptop.total_storage >= 1024 ? `${laptop.total_storage/1024}TB` : `${laptop.total_storage}GB`} {laptop.primary_storage_type}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Monitor size={14} color="var(--accent-amber)" />
            <span>{laptop.display_size}" Display ({laptop.resolution_width} × {laptop.resolution_height})</span>
          </div>
        </div>

        {/* Score Progress Meter */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>Hardware Score</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{laptop.performance_score} / 100</span>
          </div>
          <div style={{ height: 4, width: '100%', backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.max(10, laptop.performance_score))}%`,
              backgroundColor: laptop.performance_score >= 75 ? 'var(--accent-primary)' : laptop.performance_score >= 60 ? 'var(--accent-slate)' : 'var(--accent-amber)',
              borderRadius: 2
            }} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Price & Actions */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Price</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatPrice(laptop.price)}
            </span>
          </div>
          <span className="badge badge-amber" style={{ fontSize: '11px' }}>
            Value: {laptop.value_score}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onOpenDetails(laptop)}
            className="btn btn-secondary"
            style={{ flex: 1, fontSize: '12px', padding: '6px 10px' }}
          >
            Details
          </button>
          <button
            onClick={() => onToggleCompare(laptop)}
            className={isCompared ? "btn btn-primary" : "btn btn-outline"}
            style={{ fontSize: '12px', padding: '6px 10px' }}
          >
            {isCompared ? <Check size={14} /> : <Plus size={14} />}
            {isCompared ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}
