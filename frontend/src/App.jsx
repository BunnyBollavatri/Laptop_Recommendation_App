import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Recommendations from './pages/Recommendations';
import MLInsights from './pages/MLInsights';
import LaptopModal from './components/LaptopModal';
import ComparisonDrawer from './components/ComparisonDrawer';
import { LAPTOPS_DATA } from './data/laptops';

export default function App() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [comparedLaptops, setComparedLaptops] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (laptop) => {
    setComparedLaptops(prev => {
      const exists = prev.some(l => l.id === laptop.id);
      if (exists) {
        return prev.filter(l => l.id !== laptop.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 laptops at a time.');
          return prev;
        }
        return [...prev, laptop];
      }
    });
  };

  const handleRemoveCompare = (id) => {
    setComparedLaptops(prev => prev.filter(l => l.id !== id));
  };

  const handleClearCompare = () => {
    setComparedLaptops([]);
    setIsCompareOpen(false);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        compareCount={comparedLaptops.length}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      {/* Main Container */}
      <main className="main-content">
        {activeTab === 'recommendations' ? (
          <Recommendations
            allLaptops={LAPTOPS_DATA}
            comparedLaptops={comparedLaptops}
            onToggleCompare={handleToggleCompare}
            onOpenDetails={(laptop) => setSelectedLaptop(laptop)}
          />
        ) : (
          <MLInsights />
        )}
      </main>

      {/* Laptop Details Modal */}
      {selectedLaptop && (
        <LaptopModal
          laptop={selectedLaptop}
          onClose={() => setSelectedLaptop(null)}
        />
      )}

      {/* Comparison Drawer / Modal */}
      {isCompareOpen && (
        <ComparisonDrawer
          laptops={comparedLaptops}
          onRemove={handleRemoveCompare}
          onClear={handleClearCompare}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px 20px',
        color: 'var(--text-muted)',
        fontSize: '12px',
        marginTop: '36px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          maxWidth: 1360,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            <strong>Laptop Recommendation System</strong> — Constraint-Based Filtering & Random Forest Ranking
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Dataset: 990+ Models • Random Forest Regression ($R^2 = 0.992$)
          </div>
        </div>
      </footer>
    </div>
  );
}
