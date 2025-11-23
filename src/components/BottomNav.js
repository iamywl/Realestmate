// src/components/BottomNav.js
import React from 'react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bottom-dock-container">
      <nav className="bottom-dock">
        <button className={`dock-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          <span className="dock-icon">🗺️</span>{activeTab === 'map' && <span className="dock-label">지도</span>}
        </button>
        <button className={`dock-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="dock-icon">🏠</span>{activeTab === 'home' && <span className="dock-label">홈</span>}
        </button>
        <button className={`dock-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>
          <span className="dock-icon">💰</span>{activeTab === 'finance' && <span className="dock-label">금융</span>}
        </button>
        <button className={`dock-item ${activeTab === 'mypage' ? 'active' : ''}`} onClick={() => setActiveTab('mypage')}>
          <span className="dock-icon">👤</span>{activeTab === 'mypage' && <span className="dock-label">MY</span>}
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;