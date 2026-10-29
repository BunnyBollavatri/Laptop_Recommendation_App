import React from 'react';
import { Database, Zap, TrendingUp, Filter } from 'lucide-react';

export default function StatsBanner({ totalLaptops, filteredCount, avgScore, avgPrice }) {
  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      marginBottom: '20px'
    }}>
      <div className="card-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--accent-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)'
        }}>
          <Filter size={18} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Matching Laptops
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {filteredCount} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>of {totalLaptops} total</span>
          </div>
        </div>
      </div>

      <div className="card-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-slate)'
        }}>
          <Zap size={18} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Avg. Hardware Score
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {avgScore || 0} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>/ 100</span>
          </div>
        </div>
      </div>

      <div className="card-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--accent-emerald-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-emerald)'
        }}>
          <TrendingUp size={18} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Average Price
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {avgPrice ? formatPrice(avgPrice) : '₹0'}
          </div>
        </div>
      </div>

      <div className="card-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Database size={18} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Scoring Model
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Random Forest <span className="badge badge-emerald" style={{ fontSize: '10px' }}>R² 0.99</span>
          </div>
        </div>
      </div>
    </div>
  );
}
