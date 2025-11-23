// src/components/FloatingSearch.js
import React from 'react';

const FloatingSearch = ({ filterType, setFilterType }) => {
  return (
    <div className="sidebar-container">
      <div className="glass-search">
        <input type="text" className="glass-input" placeholder="지역, 아파트 검색..." />
        <button className="glass-btn">🔍</button>
      </div>
      <div className="filter-row">
        {['전체', '아파트', '오피스텔'].map((type) => (
          <button 
            key={type}
            className={`glass-chip ${filterType === type ? 'active' : ''}`}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FloatingSearch;