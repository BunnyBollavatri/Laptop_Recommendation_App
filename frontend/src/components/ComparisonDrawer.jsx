import React from 'react';
import { X, Trash2 } from 'lucide-react';

export default function ComparisonDrawer({ laptops, onRemove, onClear, onClose }) {
  if (!laptops || laptops.length === 0) return null;

  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Laptop Comparison</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Comparing {laptops.length} selected model{laptops.length > 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClear} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 10px' }}>
              <Trash2 size={13} />
              Clear
            </button>
            <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
              Done
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px', color: 'var(--text-muted)', width: '160px' }}>Specification</th>
                {laptops.map(item => (
                  <th key={item.id} style={{ padding: '10px', verticalAlign: 'top', minWidth: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '10px', marginBottom: '4px' }}>{item.brand}</span>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {item.model}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Price</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px', fontFamily: 'var(--font-mono)' }}>
                    {formatPrice(item.price)}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>ML Score</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px' }}>
                    <span className="badge badge-blue" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {item.performance_score} / 100
                    </span>
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Value Index</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px' }}>
                    <span className="badge badge-yellow" style={{ fontSize: '11px' }}>
                      {item.value_score}
                    </span>
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Processor (CPU)</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.processor_brand} {item.processor_tier} ({item.num_cores}C / {item.num_threads}T)
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>RAM</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.ram_memory} GB
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Storage</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.total_storage} GB ({item.primary_storage_type})
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Graphics (GPU)</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.gpu_brand} {item.gpu_type} {item.gpu_vram ? `(${item.gpu_vram}GB)` : ''}
                  </td>
                ))}
              </tr>

              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>Display</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.display_size}" ({item.resolution_width} × {item.resolution_height}) {item.is_touch_screen ? '• Touch' : ''}
                  </td>
                ))}
              </tr>

              <tr>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>OS & Warranty</td>
                {laptops.map(item => (
                  <td key={item.id} style={{ padding: '10px', color: 'var(--text-primary)' }}>
                    {item.os} • {item.warranty} Year
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
