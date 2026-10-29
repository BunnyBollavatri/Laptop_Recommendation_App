import React from 'react';
import { Cpu, Zap, HardDrive, Monitor, CheckCircle, Award, Layers, BarChart3 } from 'lucide-react';

export default function MLInsights() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <span className="badge badge-blue">Machine Learning Methodology</span>
          <span className="badge badge-neutral">Random Forest Regressor</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
          Laptop Recommendation Machine Learning Architecture
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: 840, lineHeight: 1.6 }}>
          This system implements a two-stage recommendation pipeline. Stage 1 applies constraint-based filtering on user requirements (budget, RAM, storage, dedicated GPU). Stage 2 uses a trained <strong>Random Forest Regression model</strong> to estimate a normalized Performance Score (0–100) and rank candidate laptops accordingly.
        </p>
      </div>

      {/* Model Performance Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        <div className="card-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
            Coefficient of Determination
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            R² = 0.9920
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Explains over 99% of variance across hardware tier configurations.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
            Mean Absolute Error (MAE)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            0.47 pts
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Average error is under 0.5 points on a 0–100 scale.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
            Root Mean Squared Error
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-slate)', fontFamily: 'var(--font-mono)' }}>
            1.12 pts
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Minimal variance on high-spec models.
          </p>
        </div>

        <div className="card-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
            Model Configuration
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            100 Decision Trees
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Random Forest ensemble with one-hot encoded categorical features.
          </p>
        </div>
      </div>

      {/* Feature Weighting Breakdown */}
      <div className="card-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
          Hardware Score Calculation Rules
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          The target hardware performance score represents a weighted combination of key system components:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>1. Processor (CPU) Capability</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>35% Weight</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--accent-primary)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              60% Processor Tier (i3/i5/i7/i9, Ryzen 3/5/7/9, M1/M2/M3) + 20% Cores + 20% Threads
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>2. Graphics (GPU) Power</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-slate)' }}>30% Weight</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '30%', height: '100%', backgroundColor: 'var(--accent-slate)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              45% GPU Brand (NVIDIA, AMD, Apple, Intel) + 40% Dedicated vs Integrated + 15% VRAM
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>3. Memory (RAM)</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>15% Weight</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '15%', height: '100%', backgroundColor: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Installed system memory capacity normalized against maximum benchmarked capacity
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>4. Storage Capacity</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>10% Weight</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', backgroundColor: 'var(--accent-amber)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Primary SSD capacity plus secondary storage capacity (GB)
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>5. Display Resolution</span>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>10% Weight</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', backgroundColor: 'var(--text-secondary)' }} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Total display pixel density (Width × Height)
            </div>
          </div>
        </div>
      </div>

      {/* Two-Stage Architecture */}
      <div className="card-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>
          Two-Stage Recommendation Pipeline
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-app)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '14px' }}>
              <CheckCircle size={16} />
              Stage 1: Constraint-Based Filtering
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Hard user constraints (maximum budget, minimum RAM, required storage type, dedicated GPU, or brand exclusions) are applied first to eliminate non-viable laptops.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-app)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-slate)', fontWeight: 600, fontSize: '14px' }}>
              <Layers size={16} />
              Stage 2: Machine Learning Ranking
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Eligible candidate laptops are passed to the Random Forest model to predict performance scores and compute a value index. Results are ranked according to the user's objective (Pure Performance, Value for Money, or Price).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
