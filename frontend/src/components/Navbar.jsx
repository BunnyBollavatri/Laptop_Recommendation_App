import React, { useState, useEffect } from 'react';
import { Laptop, Sliders, BarChart3, Columns } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, compareCount, onOpenCompare }) {
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    checkBackendHealth().then(res => setApiHealth(res.online));
  }, []);
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: 1360,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo & Project Title */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => setActiveTab('recommendations')}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Laptop size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Laptop Recommendation System
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                Random Forest ML
              </span>
              {apiHealth !== null && (
                <span
                  className={apiHealth ? "badge badge-emerald" : "badge badge-neutral"}
                  style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  title={apiHealth ? "FastAPI Server Running on port 8000" : "FastAPI Server Offline (using client dataset)"}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: apiHealth ? '#10b981' : '#94a3b8' }} />
                  {apiHealth ? 'FastAPI Active' : 'FastAPI Offline'}
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Hardware specification scoring and personalized filtering
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-app)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                backgroundColor: activeTab === 'recommendations' ? '#ffffff' : 'transparent',
                color: activeTab === 'recommendations' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === 'recommendations' ? 'var(--shadow-sm)' : 'none',
                fontWeight: activeTab === 'recommendations' ? 600 : 500
              }}
            >
              <Sliders size={15} />
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('ml-insights')}
              className="btn"
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                backgroundColor: activeTab === 'ml-insights' ? '#ffffff' : 'transparent',
                color: activeTab === 'ml-insights' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                boxShadow: activeTab === 'ml-insights' ? 'var(--shadow-sm)' : 'none',
                fontWeight: activeTab === 'ml-insights' ? 600 : 500
              }}
            >
              <BarChart3 size={15} />
              ML Methodology
            </button>
          </div>

          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="btn btn-outline"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              <Columns size={15} />
              Compare ({compareCount})
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
