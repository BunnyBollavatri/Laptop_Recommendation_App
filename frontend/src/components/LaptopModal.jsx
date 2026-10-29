import React from 'react';
import { X, Cpu, HardDrive, Monitor, Zap, Award } from 'lucide-react';

export default function LaptopModal({ laptop, onClose }) {
  if (!laptop) return null;

  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px', paddingRight: '36px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <span className="badge badge-neutral">{laptop.brand}</span>
            <span className="badge badge-blue">Score: {laptop.performance_score} / 100</span>
            {laptop.has_dedicated_gpu && <span className="badge badge-green">Dedicated GPU</span>}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
            {laptop.model}
          </h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '10px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatPrice(laptop.price)}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Warranty: {laptop.warranty} {laptop.warranty === 1 ? 'Year' : 'Years'} • OS: {laptop.os}
            </span>
          </div>
        </div>

        {/* Scoring Rationale */}
        <div style={{
          backgroundColor: 'var(--bg-app)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--accent-info)', fontSize: '13px', fontWeight: 600 }}>
            <Award size={16} />
            Performance Score Estimation
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
            Score estimated at <strong>{laptop.performance_score} / 100</strong> by the Random Forest model using the following specifications:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', fontSize: '11px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>CPU (35%)</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{laptop.processor_tier}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>GPU (30%)</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{laptop.gpu_brand} {laptop.gpu_type}</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>RAM (15%)</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{laptop.ram_memory}GB</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>Storage (10%)</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{laptop.total_storage}GB</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ color: 'var(--text-muted)' }}>Display (10%)</div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{laptop.resolution_height}p</div>
            </div>
          </div>
        </div>

        {/* Detailed Spec Sheet */}
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>Technical Specifications</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-info)', marginBottom: '8px', fontWeight: 600 }}>
              <Cpu size={15} />
              Processor
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Brand: {laptop.processor_brand}</div>
              <div>Tier: {laptop.processor_tier}</div>
              <div>Cores: {laptop.num_cores} • Threads: {laptop.num_threads}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', marginBottom: '8px', fontWeight: 600 }}>
              <Zap size={15} />
              Graphics
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Brand: {laptop.gpu_brand}</div>
              <div>Type: {laptop.gpu_type}</div>
              <div>VRAM: {laptop.gpu_vram ? `${laptop.gpu_vram}GB Dedicated` : 'Integrated'}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-success-text)', marginBottom: '8px', fontWeight: 600 }}>
              <HardDrive size={15} />
              Memory & Storage
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>RAM: {laptop.ram_memory} GB</div>
              <div>Primary: {laptop.primary_storage_capacity} GB {laptop.primary_storage_type}</div>
              <div>Total Storage: {laptop.total_storage} GB</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-app)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-warning)', marginBottom: '8px', fontWeight: 600 }}>
              <Monitor size={15} />
              Display & OS
            </div>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Screen: {laptop.display_size} inches</div>
              <div>Resolution: {laptop.resolution_width} × {laptop.resolution_height}</div>
              <div>Touchscreen: {laptop.is_touch_screen ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 18px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
